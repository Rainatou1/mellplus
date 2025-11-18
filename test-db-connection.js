// test-db-connection.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔄 Test de connexion à la base de données...')
    
    // Tester la connexion
    await prisma.$connect()
    console.log('✅ Connexion réussie!')
    
    // Tester une requête simple
    const adminCount = await prisma.admin.count()
    console.log(`📊 Nombre d'admins dans la base: ${adminCount}`)
    
    // Afficher les tables
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `
    console.log('📋 Tables disponibles:', tables.map(t => t.tablename))
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
    console.log('Vérifiez votre DATABASE_URL dans .env.local')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()