// app/api/services/[id]/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET - Récupérer un service par ID
export async function GET(request, { params }) {
  try {
    const service = await prisma.service.findUnique({
      where: {
        id: params.id
      }
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(service)

  } catch (error) {
    console.error('Erreur lors de la récupération du service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du service' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un service (Admin)
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

    // Vérifier que le service existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    // Mettre à jour le slug si le titre change
    const slug = body.title && body.title !== existingService.title
      ? body.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '')
      : existingService.slug

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        title: body.title !== undefined ? body.title : existingService.title,
        slug,
        description: body.description !== undefined ? body.description : existingService.description,
        shortDesc: body.shortDesc !== undefined ? body.shortDesc : existingService.shortDesc,
        category: body.category !== undefined ? body.category : existingService.category,
        features: body.features !== undefined ? body.features : existingService.features,
        benefits: body.benefits !== undefined ? body.benefits : existingService.benefits,
        process: body.process !== undefined ? body.process : existingService.process,
        pricing: body.pricing !== undefined ? body.pricing : existingService.pricing,
        basePrice: body.basePrice !== undefined ? body.basePrice : existingService.basePrice,
        priceNote: body.priceNote !== undefined ? body.priceNote : existingService.priceNote,
        icon: body.icon !== undefined ? body.icon : existingService.icon,
        image: body.image !== undefined ? body.image : existingService.image,
        gallery: body.gallery !== undefined ? body.gallery : existingService.gallery,
        featured: body.featured !== undefined ? body.featured : existingService.featured,
        active: body.active !== undefined ? body.active : existingService.active,
        order: body.order !== undefined ? body.order : existingService.order
      }
    })

    return NextResponse.json({
      success: true,
      service
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error)

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un service avec ce titre existe déjà' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du service' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un service (Admin)
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

    // Vérifier que le service existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!existingService) {
      return NextResponse.json(
        { error: 'Service non trouvé' },
        { status: 404 }
      )
    }

    await prisma.service.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Service supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du service' },
      { status: 500 }
    )
  }
}