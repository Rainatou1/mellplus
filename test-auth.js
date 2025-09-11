// test-auth.js - Script pour tester la connexion
const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'Admin123!';
  
  // Hash du mot de passe (comme celui stocké en base)
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('🔐 Hash généré:', hashedPassword);
  
  // Test de vérification
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('✅ Vérification du mot de passe:', isValid ? 'VALIDE' : 'INVALIDE');
  
  // Test avec un mauvais mot de passe
  const wrongPassword = 'WrongPassword';
  const isInvalid = await bcrypt.compare(wrongPassword, hashedPassword);
  console.log('❌ Test mauvais mot de passe:', isInvalid ? 'VALIDE' : 'INVALIDE (attendu)');
}

testPassword();