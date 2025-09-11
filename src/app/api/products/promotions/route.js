import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer uniquement les produits en promotion
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minDiscount = searchParams.get('minDiscount')
    const sortBy = searchParams.get('sortBy') || 'discount-desc'
    
    // Construire les filtres de base (produits avec réduction uniquement)
    const where = {
      AND: [
        { discount: { not: null } },
        { discount: { gt: 0 } },
        { publishedAt: { not: null } }
      ]
    }
    
    if (category && category !== 'all') {
      where.AND.push({ category })
    }
    
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { brand: { contains: search, mode: 'insensitive' } }
        ]
      })
    }
    
    if (minDiscount) {
      where.AND.push({ discount: { gte: parseInt(minDiscount) } })
    }
    
    // Définir l'ordre de tri
    let orderBy = { createdAt: 'desc' }
    switch (sortBy) {
      case 'discount-desc':
        orderBy = { discount: 'desc' }
        break
      case 'discount-asc':
        orderBy = { discount: 'asc' }
        break
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
    }
    
    // Récupérer les produits avec pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy
      }),
      prisma.product.count({ where })
    ])
    
    // Récupérer les catégories des produits en promotion
    const promoCategories = await prisma.product.findMany({
      where: {
        AND: [
          { discount: { not: null } },
          { discount: { gt: 0 } },
          { publishedAt: { not: null } }
        ]
      },
      select: { category: true },
      distinct: ['category']
    })
    
    const categories = promoCategories.map(item => item.category)
    
    // Calculer les statistiques
    const stats = await prisma.product.aggregate({
      where: {
        AND: [
          { discount: { not: null } },
          { discount: { gt: 0 } },
          { publishedAt: { not: null } }
        ]
      },
      _max: { discount: true },
      _avg: { discount: true },
      _sum: { 
        price: true,
        quantity: true 
      }
    })
    
    return NextResponse.json({
      products,
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalPromos: total,
        maxDiscount: stats._max.discount || 0,
        avgDiscount: Math.round(stats._avg.discount || 0),
        totalValue: stats._sum.price || 0,
        totalQuantity: stats._sum.quantity || 0
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des produits en promotion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits en promotion' },
      { status: 500 }
    )
  }
}