/**
 * Script pour ajouter un nouvel administrateur
 * Usage: node scripts/add-admin.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const readline = require('readline')

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n=== 🔐 Ajout d\'un nouvel administrateur ===\n')

  try {
    // Collecter les informations
    const email = await question('Email: ')
    const password = await question('Mot de passe: ')
    const firstName = await question('Prénom: ')
    const lastName = await question('Nom: ')
    const phone = await question('Téléphone (optionnel): ')

    console.log('\nRôles disponibles:')
    console.log('1. SUPER_ADMIN - Accès complet')
    console.log('2. ADMIN - Gestion complète')
    console.log('3. MODERATOR - Gestion limitée')

    const roleChoice = await question('\nChoisissez le rôle (1-3): ')

    const roleMap = {
      '1': 'SUPER_ADMIN',
      '2': 'ADMIN',
      '3': 'MODERATOR'
    }

    const role = roleMap[roleChoice] || 'MODERATOR'

    // Vérifier si l'email existe déjà
    const existing = await prisma.admin.findUnique({
      where: { email }
    })

    if (existing) {
      console.error('\n❌ Erreur: Un admin avec cet email existe déjà!')
      rl.close()
      return
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role,
        active: true,
        emailVerified: true,
        permissions: role === 'SUPER_ADMIN'
          ? ['*']
          : role === 'ADMIN'
          ? ['products', 'services', 'quotes', 'contacts', 'settings']
          : ['products', 'quotes', 'contacts']
      }
    })

    console.log('\n✅ Administrateur créé avec succès!')
    console.log('\nDétails:')
    console.log(`- ID: ${admin.id}`)
    console.log(`- Email: ${admin.email}`)
    console.log(`- Nom: ${admin.firstName} ${admin.lastName}`)
    console.log(`- Rôle: ${admin.role}`)
    console.log(`- Actif: ${admin.active ? 'Oui' : 'Non'}`)

  } catch (error) {
    console.error('\n❌ Erreur lors de la création:', error.message)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

main()
