// app/api/carousel/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer les slides du carousel
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Construire les filtres
    const where = {}

    if (active === 'true') {
      where.active = true
    }

    // Récupérer les slides
    const slides = await prisma.carousel.findMany({
      where,
      take: limit,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      slides,
      total: slides.length
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des slides:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des slides' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle slide (Admin seulement)
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

    // Validation des données requises
    if (!body.title || !body.image) {
      return NextResponse.json(
        { error: 'Le titre et l\'image sont requis' },
        { status: 400 }
      )
    }

    // Si aucun ordre n'est spécifié, le mettre à la fin
    let order = body.order
    if (order === undefined || order === null) {
      const lastSlide = await prisma.carousel.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      })
      order = (lastSlide?.order || 0) + 1
    }

    // Créer la slide
    const slide = await prisma.carousel.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        image: body.image,
        ctaPrimary: body.ctaPrimary || null,
        ctaSecondary: body.ctaSecondary || null,
        linkPrimary: body.linkPrimary || null,
        linkSecondary: body.linkSecondary || null,
        bgGradient: body.bgGradient || 'from-blue-600 to-blue-800',
        textColor: body.textColor || 'text-white',
        active: body.active !== undefined ? body.active : true,
        order: order,
        featured: body.featured || false,
        createdBy: session.user.id
      }
    })

    return NextResponse.json(
      {
        success: true,
        slide
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de la création de la slide:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la slide' },
      { status: 500 }
    )
  }
}