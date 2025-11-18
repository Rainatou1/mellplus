// app/api/carousel/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer une slide par ID
export async function GET(request, { params }) {
  try {
    const slide = await prisma.carousel.findUnique({
      where: {
        id: params.id
      }
    })

    if (!slide) {
      return NextResponse.json(
        { error: 'Slide non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ slide })

  } catch (error) {
    console.error('Erreur lors de la récupération de la slide:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la slide' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une slide (Admin seulement)
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

    const body = await request.json()

    // Vérifier que la slide existe
    const existingSlide = await prisma.carousel.findUnique({
      where: { id: params.id }
    })

    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Slide non trouvée' },
        { status: 404 }
      )
    }

    // Mettre à jour la slide
    const slide = await prisma.carousel.update({
      where: { id: params.id },
      data: {
        title: body.title !== undefined ? body.title : existingSlide.title,
        subtitle: body.subtitle !== undefined ? body.subtitle : existingSlide.subtitle,
        description: body.description !== undefined ? body.description : existingSlide.description,
        image: body.image !== undefined ? body.image : existingSlide.image,
        ctaPrimary: body.ctaPrimary !== undefined ? body.ctaPrimary : existingSlide.ctaPrimary,
        ctaSecondary: body.ctaSecondary !== undefined ? body.ctaSecondary : existingSlide.ctaSecondary,
        linkPrimary: body.linkPrimary !== undefined ? body.linkPrimary : existingSlide.linkPrimary,
        linkSecondary: body.linkSecondary !== undefined ? body.linkSecondary : existingSlide.linkSecondary,
        bgGradient: body.bgGradient !== undefined ? body.bgGradient : existingSlide.bgGradient,
        textColor: body.textColor !== undefined ? body.textColor : existingSlide.textColor,
        active: body.active !== undefined ? body.active : existingSlide.active,
        order: body.order !== undefined ? body.order : existingSlide.order,
        featured: body.featured !== undefined ? body.featured : existingSlide.featured
      }
    })

    return NextResponse.json({
      success: true,
      slide
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la slide:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la slide' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une slide (Admin seulement)
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

    // Vérifier que la slide existe
    const existingSlide = await prisma.carousel.findUnique({
      where: { id: params.id }
    })

    if (!existingSlide) {
      return NextResponse.json(
        { error: 'Slide non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer la slide
    await prisma.carousel.delete({
      where: { id: params.id }
    })

    // Réorganiser les ordres (optionnel)
    await prisma.carousel.updateMany({
      where: {
        order: {
          gt: existingSlide.order
        }
      },
      data: {
        order: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Slide supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression de la slide:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la slide' },
      { status: 500 }
    )
  }
}