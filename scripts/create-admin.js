// Script to create a super admin user
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSuperAdmin() {
  try {
    console.log('🔧 Creating super admin account...')

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create the super admin
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@mellplusniger.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+227 20 35 23 23',
        role: 'SUPER_ADMIN',
        active: true,
        emailVerified: true,
        permissions: [
          'MANAGE_PRODUCTS',
          'MANAGE_SERVICES',
          'MANAGE_QUOTES',
          'MANAGE_CONTACTS',
          'MANAGE_ADMINS',
          'VIEW_ANALYTICS'
        ]
      }
    })

    console.log('✅ Super admin created successfully!')
    console.log('📧 Email: admin@mellplusniger.com')
    console.log('🔑 Password: admin123')
    console.log('')
    console.log('🚀 You can now login at: http://localhost:3000/admin/login')
    console.log('')
    console.log('⚠️  IMPORTANT: Change the password after first login!')

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Admin with this email already exists!')
      console.log('📧 Try logging in with: admin@mellplusniger.com')
      console.log('🔑 Password: admin123')
    } else {
      console.error('❌ Error creating admin:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createSuperAdmin()