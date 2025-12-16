import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schéma de validation pour la mise à jour d'un produit
const updateProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive('Le prix doit être positif').optional(),
  category: z.enum(['ORDI_SERVEUR', 'RESEAUX_SECURITE', 'IMPRIMANTE_COPIEUR', 'ACCESSOIRES']).optional(),
  subcategory: z.string().nullable().optional(),
  subSubcategory: z.string().nullable().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  inStock: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
  lowStock: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  bestSeller: z.boolean().optional(),
  refurbished: z.boolean().optional(),
  isNew: z.boolean().optional(),
  discount: z.number().int().min(0).max(100).nullable().optional(),
  publishedAt: z.string().nullable().optional(),
})

export async function GET(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }

    // Récupérer le produit par ID ou slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Récupérer des produits similaires (même catégorie, différent ID)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: {
          not: product.id
        },
        inStock: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformer les données pour correspondre au format attendu
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      longDescription: product.longDescription || product.description,
      price: product.price,
      discount: product.discount || null,
      category: product.category,
      brand: product.brand || null,
      image: product.image,
      images: product.images ? (Array.isArray(product.images) ? product.images : [product.image]) : [product.image].filter(Boolean),
      inStock: product.inStock,
      quantity: product.quantity || 0,
      lowStock: product.lowStock || 5,
      specifications: product.specifications || {},
      rating: product.rating || null,
      reviews: product.reviewCount || 0,
      slug: product.slug || product.id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

    const transformedRelatedProducts = relatedProducts.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      discount: p.discount || null,
      category: p.category,
      image: p.image,
      inStock: p.inStock,
      quantity: p.quantity || 0
    }))

    return NextResponse.json({
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts
    })

  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)

    // Gestion des erreurs Prisma
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la récupération du produit' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }

    // Parser le body de la requête
    const body = await request.json()

    // Valider les données
    const validatedData = updateProductSchema.parse(body)

    // Générer le slug si le nom a changé
    if (validatedData.name) {
      validatedData.slug = validatedData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
        .replace(/\s+/g, '-') // Remplacer espaces par tirets
        .replace(/-+/g, '-') // Éviter les tirets multiples
        .trim('-') // Supprimer tirets en début/fin
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Préparer les données de mise à jour
    const updateData = { ...validatedData }

    // Calculer automatiquement inStock basé sur la quantité
    if (validatedData.quantity !== undefined) {
      updateData.inStock = validatedData.quantity > 0
    }

    // Gérer la publication du produit
    if (validatedData.publishedAt !== undefined) {
      updateData.publishedAt = validatedData.publishedAt ? new Date(validatedData.publishedAt) : null
    }

    // Mise à jour du produit
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id },
      data: updateData
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Produit mis à jour avec succès',
        product: updatedProduct
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)

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
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un produit avec ce slug existe déjà' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit requis' },
        { status: 400 }
      )
    }

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: { id: existingProduct.id }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Produit supprimé avec succès'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    )
  }
}