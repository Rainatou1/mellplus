import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST - Upload d'image
export async function POST(request) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions)
    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file = data.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Taille maximum: 5MB' },
        { status: 400 }
      )
    }

    // Si Cloudinary est configuré, utiliser Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload vers Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'mellplus/products',
              transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(buffer)
        })

        return NextResponse.json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          filename: file.name,
          size: file.size,
          type: file.type
        })

      } catch (cloudinaryError) {
        console.error('Erreur Cloudinary:', cloudinaryError)
        // Fallback vers stockage local en cas d'erreur Cloudinary
      }
    }

    // Fallback: stockage local (seulement pour développement)
    if (process.env.NODE_ENV === 'development') {
      const { writeFile, mkdir } = await import('fs/promises')
      const { join } = await import('path')
      const { existsSync } = await import('fs')

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Générer un nom de fichier unique
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${random}.${extension}`

      // Créer le dossier d'upload s'il n'existe pas
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      // Sauvegarder le fichier
      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      // Retourner l'URL publique
      const publicUrl = `/uploads/products/${filename}`

      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type
      })
    }

    // En production sans Cloudinary configuré
    return NextResponse.json(
      { error: 'Service d\'upload non configuré. Veuillez configurer Cloudinary ou utiliser des URLs d\'images existantes.' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}