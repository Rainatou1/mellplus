// lib/prisma.js
import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // En développement, on évite de créer plusieurs instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.prisma
}

export { prisma }

// Fonction utilitaire pour gérer les erreurs Prisma
export function handlePrismaError(error) {
  if (error.code === 'P2002') {
    return { error: 'Cet enregistrement existe déjà' }
  }
  if (error.code === 'P2025') {
    return { error: 'Enregistrement non trouvé' }
  }
  if (error.code === 'P2003') {
    return { error: 'Violation de contrainte de clé étrangère' }
  }
  return { error: 'Une erreur est survenue' }
}