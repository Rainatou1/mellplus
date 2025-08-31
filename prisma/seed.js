import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Catégorie principale
  const informatique = await prisma.category.create({
    data: { name: "Informatique" }
  })

  // Sous-catégories
  await prisma.category.createMany({
    data: [
      { name: "PC Portables", parentId: informatique.id },
      { name: "PC de Bureau", parentId: informatique.id },
      { name: "Logiciels", parentId: informatique.id },
      { name: "Accessoires", parentId: informatique.id },
    ]
  })

  const securite = await prisma.category.create({
    data: { name: "Sécurité" }
  })

  await prisma.category.createMany({
    data: [
      { name: "Vidéosurveillance", parentId: securite.id },
      { name: "Contrôle d’accès", parentId: securite.id },
      { name: "Incendie", parentId: securite.id },
    ]
  })

  // Exemple de sous-sous-catégorie
  const accessoires = await prisma.category.create({
    data: { name: "Accessoires" }
  })

  const image = await prisma.category.create({
    data: { name: "Image", parentId: accessoires.id }
  })

  await prisma.category.createMany({
    data: [
      { name: "Caméra", parentId: image.id },
      { name: "Lumière", parentId: image.id },
    ]
  })
}

main()
  .then(() => console.log("Seeding terminé ✅"))
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
