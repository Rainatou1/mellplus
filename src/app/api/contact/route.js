// app/api/contact/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation avec Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
})

export async function POST(request) {
  try {
    // Parser le body de la requête
    const body = await request.json()
    
    // Valider les données
    const validatedData = contactSchema.parse(body)
    
    // Obtenir l'IP et le user agent pour le tracking
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Créer l'entrée dans la base de données
    const contact = await prisma.contact.create({
      data: {
        ...validatedData,
        source: request.headers.get('referer') || 'direct',
        ip,
        userAgent
      }
    })
    
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
    console.error('Erreur lors de la création du contact:', error)
    
    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: error.errors 
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
    // TODO: Vérifier l'authentification
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    // }
    
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
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
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    )
  }
}