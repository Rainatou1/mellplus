import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'updatedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Calculer l'offset pour la pagination
    const skip = (page - 1) * limit

    // Construire les filtres
    const where = {
      refurbished: true,
      publishedAt: {
        not: null // Seulement les produits publiés
      }
    }

    // Filtrage par catégorie
    if (category && category !== 'all') {
      where.category = category
    }

    // Filtrage par recherche
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Construire l'ordre de tri
    let orderBy = {}
    switch (sortBy) {
      case 'name':
        orderBy = { name: sortOrder }
        break
      case 'price':
        orderBy = { price: sortOrder }
        break
      case 'createdAt':
        orderBy = { createdAt: sortOrder }
        break
      case 'views':
        orderBy = { views: sortOrder }
        break
      default:
        orderBy = { updatedAt: sortOrder }
    }

    // Récupérer les produits reconditionnés
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          price: true,
          category: true,
          subcategory: true,
          brand: true,
          image: true,
          images: true,
          inStock: true,
          quantity: true,
          lowStock: true,
          featured: true,
          bestSeller: true,
          refurbished: true,
          isNew: true,
          discount: true,
          views: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.product.count({ where })
    ])

    // Calculer les statistiques de pagination
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Récupérer les catégories disponibles pour les filtres
    const categories = await prisma.product.findMany({
      where: { refurbished: true },
      select: { category: true },
      distinct: ['category']
    })

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      },
      categories: categories.map(c => c.category),
      filters: {
        category,
        search,
        sortBy,
        sortOrder
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des produits reconditionnés:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des produits reconditionnés',
      details: error.message
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}