// create-admin.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@mellplus.ne',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Mell Plus',
        role: 'SUPER_ADMIN',
        active: true,
        emailVerified: true
      }
    });
    
    console.log('✅ Admin créé avec succès!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe: Admin123!');
    console.log('');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  L\'admin existe déjà');
    } else {
      console.error('❌ Erreur:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();