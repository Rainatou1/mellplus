import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // uniquement les catégories principales
    include: {
      children: {
        include: {
          children: true // inclut les sous-sous-catégories
        }
      }
    }
  })

  return Response.json(categories)
}
