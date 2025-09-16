// app/api/services/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer les services
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')

    // Construire les filtres
    const where = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    if (active !== null) {
      where.active = active === 'true'
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Récupérer les services avec pagination
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.service.count({ where })
    ])

    return NextResponse.json({
      services,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des services' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau service (Admin)
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

    // Utiliser le slug fourni ou créer à partir du titre
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Créer le service
    const service = await prisma.service.create({
      data: {
        title: body.title,
        slug,
        description: body.description,
        shortDesc: body.shortDesc || null,
        category: body.category,
        features: body.features || [],
        benefits: body.benefits || [],
        process: body.process || [],
        pricing: body.pricing || 'CUSTOM',
        basePrice: body.basePrice || null,
        priceNote: body.priceNote || null,
        icon: body.icon || null,
        image: body.image || null,
        gallery: body.gallery || [],
        featured: body.featured || false,
        active: body.active !== undefined ? body.active : true,
        order: body.order || 0
      }
    })

    return NextResponse.json(
      {
        success: true,
        service
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de la création du service:', error)

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un service avec ce titre existe déjà' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    )
  }
}