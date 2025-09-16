// app/api/admin/profile/route.js
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Récupérer le profil de l'admin connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        permissions: true,
        active: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
        lastIp: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!admin) {
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ profile: admin })

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le profil de l'admin
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, avatar, email } = body

    // Vérifier si l'email existe déjà (si changé)
    if (email) {
      const existingAdmin = await prisma.admin.findFirst({
        where: {
          email: email,
          id: { not: session.user.id }
        }
      })

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre admin' },
          { status: 409 }
        )
      }
    }

    // Mettre à jour le profil
    const updatedAdmin = await prisma.admin.update({
      where: { id: session.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar }),
        ...(email && { email })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        permissions: true,
        active: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
        lastIp: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      profile: updatedAdmin,
      message: 'Profil mis à jour avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du profil' },
      { status: 500 }
    )
  }
}