import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer un produit spécifique par ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un produit (Admin)
export async function PUT(request, { params }) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { id } = params
    const body = await request.json()
    
    // Créer le slug à partir du nom s'il n'est pas fourni
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    // Mettre à jour le produit
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.slug && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.category && { category: body.category }),
        ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.model !== undefined && { model: body.model }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.specifications !== undefined && { specifications: body.specifications }),
        ...(body.quantity !== undefined && { 
          quantity: body.quantity,
          inStock: body.quantity > 0 
        }),
        ...(body.lowStock !== undefined && { lowStock: body.lowStock }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.isNew !== undefined && { isNew: body.isNew }),
        ...(body.discount !== undefined && { discount: body.discount }),
        ...(body.publishedAt !== undefined && { publishedAt: body.publishedAt }),
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

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un produit avec ce slug existe déjà' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un produit (Admin)
export async function DELETE(request, { params }) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }
    
    const { id } = params
    
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