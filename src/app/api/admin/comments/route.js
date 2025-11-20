import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les commentaires (avec filtres et pagination)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const productId = searchParams.get('productId') || ''

    // Construire les conditions de recherche
    const where = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (productId) {
      where.productId = productId
    }

    // Récupérer le nombre total de commentaires
    const total = await prisma.comment.count({ where })

    // Récupérer les commentaires avec pagination
    const comments = await prisma.comment.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    // Calculer les statistiques
    const stats = {
      total: await prisma.comment.count()
    }

    return NextResponse.json({
      success: true,
      comments,
      stats,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un commentaire
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier les permissions (seuls SUPER_ADMIN et ADMIN peuvent supprimer)
    if (!['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID du commentaire requis' },
        { status: 400 }
      )
    }

    // Vérifier si le commentaire existe
    const comment = await prisma.comment.findUnique({
      where: { id }
    })

    if (!comment) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le commentaire
    await prisma.comment.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
