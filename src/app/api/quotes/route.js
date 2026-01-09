// app/api/quotes/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendQuoteNotification, sendQuoteConfirmation } from '@/lib/email'
export const runtime = "nodejs";

// Schéma de validation pour un item de devis
const quoteItemSchema = z.object({
  type: z.enum(['product', 'service', 'custom']),
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive()
})

// Schéma de validation pour la demande de devis
const quoteRequestSchema = z.object({
  // Informations client
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  
  // Détails de la demande
  type: z.enum(['product', 'service', 'mixed']),
  subject: z.string().optional(),
  message: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  
  // Items du devis
  items: z.array(quoteItemSchema).min(1, 'Au moins un article est requis')
})

// POST - Créer une nouvelle demande de devis
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Valider les données
    const validatedData = quoteRequestSchema.parse(body)
    
    // Calculer le total
    const total = validatedData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    
    // Générer un sujet automatique si non fourni
    const subject = validatedData.subject || 
      `Devis ${validatedData.type === 'product' ? 'Produits' : 
              validatedData.type === 'service' ? 'Services' : 
              'Projet'} - ${validatedData.items.length} article(s)`
    
    // Créer la demande de devis avec les items
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        // Informations client
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        address: validatedData.address,
        city: validatedData.city || 'Niamey',

        // Détails de la demande
        type: validatedData.type.toUpperCase(),
        subject,
        message: validatedData.message || '',
        budget: validatedData.budget,
        deadline: validatedData.deadline ? new Date(validatedData.deadline) : null,

        // Source et tracking
        source: request.headers.get('referer') || 'direct',

        // Créer les items associés
        items: {
          create: validatedData.items.map(item => ({
            productId: item.type === 'product' ? item.id : null,
            customItem: item.type === 'custom' ? item.name : null,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }))
        }
      },
      include: {
        items: true
      }
    })

    // Envoyer les emails en arrière-plan (ne pas bloquer la réponse)
    try {
      // Vérifier si les credentials email sont configurés
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD &&
          process.env.EMAIL_PASSWORD !== 'your-app-password-here') {
        // Email de notification à l'admin
        await sendQuoteNotification(quoteRequest)

        // Email de confirmation au client
        await sendQuoteConfirmation(quoteRequest)

        console.log('Emails de devis envoyés avec succès pour:', quoteRequest.id)
      } else {
        console.log('Configuration email manquante - emails non envoyés pour le devis:', quoteRequest.id)
      }
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails de devis:', emailError)
      // On continue même si l'email échoue - le devis est sauvegardé
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Demande de devis envoyée avec succès',
        quoteId: quoteRequest.id,
        total
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'envoi du devis' },
      { status: 500 }
    )
  }
}

// GET - Récupérer les demandes de devis (Admin)
export async function GET(request) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    
    // Construire les filtres
    const where = {}
    
    if (status) {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Récupérer les devis avec pagination
    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          service: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.quoteRequest.count({ where })
    ])
    
    // Calculer les statistiques
    const stats = await prisma.quoteRequest.groupBy({
      by: ['status'],
      _count: true
    })
    
    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: stats.reduce((acc, stat) => ({
        ...acc,
        [stat.status.toLowerCase()]: stat._count
      }), {})
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    )
  }
}

// PATCH - Mettre à jour le statut d'un devis (Admin)
export async function PATCH(request) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const quoteId = searchParams.get('id')
    
    if (!quoteId) {
      return NextResponse.json(
        { error: 'ID du devis requis' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const { status, response, quotePdf, validUntil, assignedTo } = body
    
    // Mettre à jour le devis
    const updatedQuote = await prisma.quoteRequest.update({
      where: { id: quoteId },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(response && { 
          response,
          responseAt: new Date()
        }),
        ...(quotePdf && { quotePdf }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(assignedTo && { assignedTo })
      },
      include: {
        items: true
      }
    })
    
    return NextResponse.json({
      success: true,
      quote: updatedQuote
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error)
    
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du devis' },
      { status: 500 }
    )
  }
}