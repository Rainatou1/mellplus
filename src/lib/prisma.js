// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
    datasourceUrl: process.env.DATABASE_URL,
  })
} else {
  // En développement, on évite de créer plusieurs instances
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty'
    })
  }
  prisma = globalForPrisma.prisma
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