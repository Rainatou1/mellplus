import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les commentaires d'un produit
export async function GET(request, { params }) {
  try {
    const { id } = params

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer tous les commentaires du produit, triés par date (du plus récent au plus ancien)
    const comments = await prisma.comment.findMany({
      where: {
        productId: id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      comments
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des commentaires' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau commentaire
export async function POST(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, content } = body

    // Validation du contenu (requis)
    if (!content || typeof content !== 'string' || content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Le commentaire doit contenir au moins 3 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si le produit existe
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Créer le commentaire
    // Si name est vide ou null, il sera stocké comme null dans la DB
    // et sera affiché comme "Anonyme" côté client
    const comment = await prisma.comment.create({
      data: {
        productId: id,
        name: name && name.trim() ? name.trim() : null,
        content: content.trim()
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      comment
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du commentaire' },
      { status: 500 }
    )
  }
}
