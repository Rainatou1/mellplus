// app/api/products/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

function slugify(value) {
  return (value || 'product')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'product'
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function generateUniqueProductSlug(baseSlug) {
  const similarSlugs = await prisma.product.findMany({
    where: {
      OR: [
        { slug: baseSlug },
        { slug: { startsWith: `${baseSlug}-` } }
      ]
    },
    select: { slug: true }
  })

  if (similarSlugs.length === 0) return baseSlug

  const slugRegex = new RegExp(`^${escapeRegExp(baseSlug)}-(\\d+)$`)
  let maxSuffix = 1

  for (const { slug } of similarSlugs) {
    if (slug === baseSlug) continue
    const match = slug.match(slugRegex)
    if (!match) continue
    const suffix = Number(match[1])
    if (!Number.isNaN(suffix) && suffix > maxSuffix) {
      maxSuffix = suffix
    }
  }

  return `${baseSlug}-${maxSuffix + 1}`
}

// GET - Récupérer les produits
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = Boolean(session && ['ADMIN', 'SUPER_ADMIN'].includes(session.user?.role))

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    
    // Construire les filtres
    const where = {}

    // Les visiteurs ne doivent voir que les produits publiés
    if (!isAdmin) {
      where.publishedAt = { not: null }
    }
    
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
        where,
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
    
    // Autoriser les noms identiques en garantissant un slug unique
    const baseSlug = slugify(body.slug || body.name)
    const slug = await generateUniqueProductSlug(baseSlug)
    
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
        { error: 'Conflit d\'unicité lors de la création du produit' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

