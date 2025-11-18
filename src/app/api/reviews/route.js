// app/api/reviews/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation avec Zod
const reviewSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  company: z.string().optional(),
  rating: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  title: z.string().optional(),
  content: z.string().min(10, 'L\'avis doit contenir au moins 10 caractères'),
  productId: z.string().optional(),
  serviceId: z.string().optional()
})

export async function POST(request) {
  try {
    // Parser le body de la requête
    const body = await request.json()

    // Valider les données
    const validatedData = reviewSchema.parse(body)

    // Obtenir l'IP et le user agent pour le tracking
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Vérifier si le produit ou service existe (si spécifié)
    if (validatedData.productId) {
      const product = await prisma.product.findUnique({
        where: { id: validatedData.productId }
      })
      if (!product) {
        return NextResponse.json(
          { error: 'Produit non trouvé' },
          { status: 404 }
        )
      }
    }

    if (validatedData.serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: validatedData.serviceId }
      })
      if (!service) {
        return NextResponse.json(
          { error: 'Service non trouvé' },
          { status: 404 }
        )
      }
    }

    // Créer l'avis dans la base de données
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        source: request.headers.get('referer') || 'direct',
        ip,
        userAgent,
        status: 'PENDING', // En attente de modération
        visible: false // Pas visible par défaut
      }
    })

    // Retourner une réponse de succès
    return NextResponse.json(
      {
        success: true,
        message: 'Avis soumis avec succès. Il sera publié après modération.',
        id: review.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de la création de l\'avis:', error)

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

    // Gestion des erreurs Prisma
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un avis similaire a déjà été soumis' },
        { status: 409 }
      )
    }

    // Erreur de connexion à la base de données
    if (error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données. Veuillez réessayer plus tard.' },
        { status: 503 }
      )
    }

    // Erreur générique
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la soumission de l\'avis' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const productId = searchParams.get('productId')
    const serviceId = searchParams.get('serviceId')
    const featured = searchParams.get('featured')

    // Construire le filtre pour les avis publics (approuvés et visibles)
    const where = {
      status: 'APPROVED',
      visible: true
    }

    if (productId) where.productId = productId
    if (serviceId) where.serviceId = serviceId
    if (featured === 'true') where.featured = true

    // Récupérer les avis avec pagination
    const [reviews, total] = await Promise.all([
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
        orderBy: [
          { featured: 'desc' }, // Avis mis en avant en premier
          { createdAt: 'desc' }
        ]
      }),
      prisma.review.count({ where })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error)

    // Erreur de connexion à la base de données
    if (error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Impossible de se connecter à la base de données' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}