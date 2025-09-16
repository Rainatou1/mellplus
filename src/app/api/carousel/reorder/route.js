// app/api/carousel/reorder/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// PUT - Réorganiser l'ordre des slides
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

    const body = await request.json()
    const { slideOrders } = body // Array de { id, order }

    if (!Array.isArray(slideOrders)) {
      return NextResponse.json(
        { error: 'Format de données invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour l'ordre de chaque slide
    const updatePromises = slideOrders.map(({ id, order }) =>
      prisma.carousel.update({
        where: { id },
        data: { order }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Ordre des slides mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la réorganisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réorganisation des slides' },
      { status: 500 }
    )
  }
}