// app/api/products/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer les produits
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    
    // Construire les filtres
    const where = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (featured === 'true') {
      where.featured = true
    }
    
    if (inStock === 'true') {
      where.inStock = true
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Récupérer les produits avec pagination et les catégories
    const [products, total, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where }),
      prisma.product.findMany({
        select: { category: true },
        distinct: ['category']
      })
    ])

    // Extraire les catégories uniques
    const uniqueCategories = categories.map(item => item.category)

    return NextResponse.json({
      products,
      categories: uniqueCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      meta: error.meta
    })
    return NextResponse.json(
      {
        error: 'Erreur lors de la récupération des produits',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau produit (Admin)
export async function POST(request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Utiliser le slug fourni ou créer à partir du nom
    const slug = body.slug || body.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Créer le produit
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        price: body.price || null,
        category: body.category,
        subcategory: body.subcategory || null,
        subSubcategory: body.subSubcategory || null,
        brand: body.brand || null,
        model: body.model || null,
        image: body.image || null,
        images: body.images || [],
        specifications: body.specifications || {},
        inStock: body.inStock !== undefined ? body.inStock : (body.quantity || 0) > 0,
        quantity: body.quantity || 0,
        lowStock: body.lowStock || 5,
        featured: body.featured || false,
        bestSeller: body.bestSeller || false,
        refurbished: body.refurbished || false,
        isNew: body.isNew !== undefined ? body.isNew : true,
        discount: body.discount || null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null
      }
    })
    
    return NextResponse.json(
      { 
        success: true,
        product 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un produit avec ce nom existe déjà' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

