// Script to create a super admin user
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSuperAdmin() {
  try {
    console.log('🔧 Création de votre compte super administrateur...')

    // Hash the password
    const hashedPassword = await bcrypt.hash('Mplusr*68y', 12)

    // Create the super admin
    const admin = await prisma.admin.create({
      data: {
        email: 'rainatouboubacars@gmail.com',
        password: hashedPassword,
        firstName: 'Rainatou',
        lastName: 'Boubacar',
        phone: '+227 82 04 12 27',
        role: 'SUPER_ADMIN',
        active: true,
        emailVerified: true,
        permissions: ['*']
      }
    })

    console.log('\n✅ Super admin créé avec succès!')
    console.log('─'.repeat(60))
    console.log(`📧 Email:      rainatouboubacars@gmail.com`)
    console.log(`🔑 Password:   Mplusr*68y`)
    console.log(`👤 Nom:        Rainatou Boubacar`)
    console.log(`📞 Téléphone:  +227 82 04 12 27`)
    console.log(`🎖️  Rôle:       SUPER_ADMIN`)
    console.log('─'.repeat(60))
    console.log('\n🚀 Vous pouvez maintenant vous connecter sur:')
    console.log('   • Local:  http://localhost:3000/admin/login')
    console.log('   • Vercel: https://mellplus.vercel.app/admin/login')
    console.log('\n📬 Vous recevrez un email d\'alerte à chaque connexion!')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Un admin avec cet email existe déjà!')
      console.log('📧 Essayez de vous connecter avec: rainatouboubacars@gmail.com')
    } else {
      console.error('❌ Erreur lors de la création:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createSuperAdmin()