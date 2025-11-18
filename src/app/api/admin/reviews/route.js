// app/api/admin/reviews/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la modération
const moderationSchema = z.object({
  id: z.string(),
  status: z.enum(['APPROVED', 'REJECTED', 'FLAGGED']),
  moderationNote: z.string().optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional()
})

// Middleware d'authentification
async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return null
  }

  // Vérifier que l'utilisateur est au moins modérateur
  if (!['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(session.user.role)) {
    return null
  }

  return session
}

export async function GET(request) {
  try {
    // Vérifier l'authentification
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const rating = searchParams.get('rating')
    const productId = searchParams.get('productId')
    const serviceId = searchParams.get('serviceId')
    const search = searchParams.get('search')

    // Construire le filtre
    const where = {}
    if (status) where.status = status
    if (rating) where.rating = parseInt(rating)
    if (productId) where.productId = productId
    if (serviceId) where.serviceId = serviceId

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Récupérer les avis avec pagination
    const [reviews, total, stats] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: {
            select: { name: true, slug: true }
          },
          service: {
            select: { title: true, slug: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where }),
      // Statistiques pour le dashboard
      prisma.review.groupBy({
        by: ['status'],
        _count: { _all: true }
      })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, item) => {
        acc[item.status] = item._count._all
        return acc
      }, {})
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    // Vérifier l'authentification
    const session = await requireAuth()
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()

    // Valider les données
    const validatedData = moderationSchema.parse(body)

    const updateData = {
      status: validatedData.status,
      moderatedBy: session.user.id,
      moderatedAt: new Date()
    }

    if (validatedData.moderationNote) {
      updateData.moderationNote = validatedData.moderationNote
    }

    // Si approuvé, rendre visible par défaut
    if (validatedData.status === 'APPROVED') {
      updateData.visible = validatedData.visible !== undefined ? validatedData.visible : true
    } else {
      updateData.visible = false
    }

    if (validatedData.featured !== undefined) {
      updateData.featured = validatedData.featured
    }

    // Mettre à jour l'avis
    const updatedReview = await prisma.review.update({
      where: { id: validatedData.id },
      data: updateData,
      include: {
        product: {
          select: { name: true, slug: true }
        },
        service: {
          select: { title: true, slug: true }
        }
      }
    })

    // Enregistrer l'activité admin
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: `MODERATE_REVIEW_${validatedData.status}`,
        entity: 'review',
        entityId: validatedData.id,
        details: {
          reviewId: validatedData.id,
          newStatus: validatedData.status,
          moderationNote: validatedData.moderationNote
        },
        ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      review: updatedReview,
      message: `Avis ${validatedData.status === 'APPROVED' ? 'approuvé' :
                      validatedData.status === 'REJECTED' ? 'rejeté' : 'signalé'}`
    })

  } catch (error) {
    console.error('Erreur lors de la modération de l\'avis:', error)

    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: error.errors
        },
        { status: 400 }
      )
    }

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modération de l\'avis' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    // Vérifier l'authentification (seuls SUPER_ADMIN et ADMIN peuvent supprimer)
    const session = await requireAuth()
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'ID de l\'avis requis' },
        { status: 400 }
      )
    }

    // Récupérer l'avis avant suppression pour les logs
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, name: true, email: true, content: true }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer l'avis
    await prisma.review.delete({
      where: { id: reviewId }
    })

    // Enregistrer l'activité admin
    await prisma.adminActivity.create({
      data: {
        adminId: session.user.id,
        action: 'DELETE_REVIEW',
        entity: 'review',
        entityId: reviewId,
        details: {
          deletedReview: {
            name: review.name,
            email: review.email,
            content: review.content.substring(0, 100) + '...'
          }
        },
        ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Avis supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'avis:', error)

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Avis non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'avis' },
      { status: 500 }
    )
  }
}