const { loadEnvConfig } = require('@next/env')
const { PrismaClient } = require('@prisma/client')
loadEnvConfig(process.cwd())
const prisma = new PrismaClient()
async function main() {
  const tables = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('Carousel', 'VisualBlock')`
  console.log({ tables })
  if (tables.some(t => t.tablename === 'Carousel')) console.log({ carouselCount: await prisma.carousel.count() })
}
main().catch(error => {
  const reason = ['Environment variable not found', "Can't reach database server", 'Authentication failed', 'Query engine', 'query engine', 'Server has closed the connection'].find(text => error.message.includes(text))
  console.error('Database check failed:', error.code || error.name, reason || '(details omitted to protect connection credentials)')
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
