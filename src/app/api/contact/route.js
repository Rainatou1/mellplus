// app/api/contact/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendContactNotification, sendContactConfirmation, isEmailConfigured } from '@/lib/email'
export const runtime = "nodejs";


import { contactSchema } from '@/lib/submissionSchemas'
import { readSubmission, verifySubmission, storeSubmission, rejection, sourceIP, limitAttempts } from '@/lib/antispam'

// All existing back-office roles can triage messages. No deletion or content editing.
const contactRoles = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT']
async function contactAccessDenied() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }
  // Read current privileges: a stale JWT must not retain revoked access.
  const admin = await prisma.admin.findUnique({
    where: { id: session.user.id },
    select: { active: true, role: true }
  })
  if (!admin?.active || !contactRoles.includes(admin.role)) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
  }
  return null
}

const contactPatchSchema = z.object({
  id: z.string().min(1).max(100),
  read: z.boolean().optional(),
  starred: z.boolean().optional(),
  archived: z.boolean().optional()
}).strict().refine(({ read, starred, archived }) =>
  read !== undefined || starred !== undefined || archived !== undefined)

export async function POST(request) {
  try {
    // Parser le body de la requête
    await limitAttempts(prisma, request)
    const body = await readSubmission(request)
    
    // Valider les données
    const validatedData = contactSchema.parse(body)
    await verifySubmission(body, 'contact')
    
    // Obtenir l'IP et le user agent pour le tracking
    const ip = sourceIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Créer l'entrée dans la base de données
    const contact = await storeSubmission(prisma, request, validatedData, 'contact', tx => tx.contact.create({
      data: {
        ...validatedData,
        source: request.headers.get('referer') || 'direct',
        ip,
        userAgent
      }
    }))

    // Attendre les envois ; conserver le contact en base même si SMTP échoue.
    try {
      // Vérifier si les credentials email sont configurés
      if (isEmailConfigured()) {
        // Email de notification à l'admin
        const notification = await sendContactNotification(contact)

        // Email de confirmation au visiteur
        const confirmation = await sendContactConfirmation(contact)

        if (notification.success && confirmation.success) {
          console.log('Emails acceptés par le serveur SMTP pour:', contact.id)
        } else {
          console.error('Envoi email incomplet pour:', contact.id, {
            notification: notification.success, confirmation: confirmation.success
          })
        }
      } else {
        console.log('Configuration email manquante - emails non envoyés pour le contact:', contact.id)
      }
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError)
      // On continue même si l'email échoue - le message est sauvegardé
    }

    // Retourner une réponse de succès
    return NextResponse.json(
      {
        success: true,
        message: 'Message envoyé avec succès',
        id: contact.id
      },
      { status: 201 }
    )
    
  } catch (error) {
    const refused = rejection(error)
    if (refused) return NextResponse.json(refused.body, { status: refused.status, headers: refused.headers })
    console.error('contact_submission_failed')
    
    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: error.issues.map(({ path, message }) => ({ path, message }))
        },
        { status: 400 }
      )
    }
    
    // Gestion des erreurs Prisma
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un message similaire a déjà été envoyé' },
        { status: 409 }
      )
    }
    
    // Erreur générique
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const denied = await contactAccessDenied()
    if (denied) return denied

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100 || !Number.isSafeInteger((page - 1) * limit)) {
      return NextResponse.json({ error: 'Pagination invalide' }, { status: 400 })
    }
    const read = searchParams.get('read')
    const starred = searchParams.get('starred')

    // Construire le filtre
    const where = {}
    if (read !== null) where.read = read === 'true'
    if (starred !== null) where.starred = starred === 'true'

    // Récupérer les contacts avec pagination
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contact.count({ where })
    ])

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }, { headers: { 'Cache-Control': 'private, no-store' } })

  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const denied = await contactAccessDenied()
    if (denied) return denied
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return NextResponse.json({ error: 'JSON requis' }, { status: 415 })
    }

    const body = contactPatchSchema.parse(await request.json())
    const { id, read, starred, archived } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID du message requis' },
        { status: 400 }
      )
    }

    const updateData = {}
    if (typeof read === 'boolean') updateData.read = read
    if (typeof starred === 'boolean') updateData.starred = starred
    if (typeof archived === 'boolean') updateData.archived = archived

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      contact: updatedContact
    })

  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('Erreur lors de la mise à jour du contact:', error)

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du message' },
      { status: 500 }
    )
  }
}
