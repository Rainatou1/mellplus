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
    
    // Récupérer les produits avec pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])
    
    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
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
    
    // Créer le slug à partir du nom
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    
    // Créer le produit
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        price: body.price,
        category: body.category,
        brand: body.brand,
        model: body.model,
        sku: body.sku,
        image: body.image,
        images: body.images || [],
        specifications: body.specifications || {},
        inStock: body.quantity > 0,
        quantity: body.quantity || 0,
        featured: body.featured || false,
        isNew: body.isNew || true,
        discount: body.discount,
        publishedAt: body.published ? new Date() : null
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
        { error: 'Un produit avec ce nom ou SKU existe déjà' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un produit (Admin)
export async function PUT(request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    // Mettre à jour le produit
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.category && { category: body.category }),
        ...(body.quantity !== undefined && { 
          quantity: body.quantity,
          inStock: body.quantity > 0 
        }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.discount !== undefined && { discount: body.discount }),
        updatedAt: new Date()
      }
    })
    
    return NextResponse.json({
      success: true,
      product
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit (Admin)
export async function DELETE(request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }
    
    // Supprimer le produit
    await prisma.product.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Produit supprimé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}