import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer des produits d'exemple pour Mell Plus Niger
  const products = [
    {
      name: "MacBook Air M2 13\"",
      slug: "macbook-air-m2-13",
      description: "Ordinateur portable Apple avec processeur M2, parfait pour les professionnels et étudiants.",
      price: 1250000, // 1,250,000 XOF
      category: "INFORMATIQUE",
      subcategory: "Ordinateurs Portables",
      brand: "Apple",
      model: "MacBook Air M2",
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"
      ],
      specifications: {
        "Processeur": "Apple M2",
        "RAM": "8GB",
        "Stockage": "256GB SSD",
        "Écran": "13.6 pouces Liquid Retina",
        "Poids": "1.24 kg"
      },
      inStock: true,
      quantity: 15,
      featured: true,
      bestSeller: true
    },
    {
      name: "Dell XPS 15 Intel i7",
      slug: "dell-xps-15-i7",
      description: "PC portable professionnel Dell XPS 15 avec processeur Intel i7 de dernière génération.",
      price: 980000, // 980,000 XOF
      category: "INFORMATIQUE",
      subcategory: "Ordinateurs Portables",
      brand: "Dell",
      model: "XPS 15",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
      ],
      specifications: {
        "Processeur": "Intel Core i7-11800H",
        "RAM": "16GB DDR4",
        "Stockage": "512GB SSD",
        "Écran": "15.6 pouces 4K OLED",
        "Carte graphique": "NVIDIA GTX 1650 Ti"
      },
      inStock: true,
      quantity: 8,
      featured: true
    },
    {
      name: "Caméra IP Hikvision 4MP",
      slug: "camera-ip-hikvision-4mp",
      description: "Caméra de surveillance IP haute définition pour sécuriser vos locaux.",
      price: 85000, // 85,000 XOF
      category: "SECURITE",
      subcategory: "Vidéosurveillance",
      subSubcategory: "Caméras IP",
      brand: "Hikvision",
      model: "DS-2CD2043G0-I",
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400",
      specifications: {
        "Résolution": "4MP (2688x1520)",
        "Vision nocturne": "30m IR",
        "Angle de vue": "83° horizontal",
        "Étanchéité": "IP67",
        "Alimentation": "PoE+"
      },
      inStock: true,
      quantity: 25,
      featured: false
    },
    {
      name: "Switch TP-Link 24 ports",
      slug: "switch-tplink-24-ports",
      description: "Switch réseau géré 24 ports Gigabit pour infrastructure réseau professionnelle.",
      price: 125000, // 125,000 XOF
      category: "RESEAUX_SERVEUR",
      subcategory: "Switches",
      brand: "TP-Link",
      model: "TL-SG1024D",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
      specifications: {
        "Ports": "24x 10/100/1000 Mbps",
        "Type": "Switch non managé",
        "Capacité": "48 Gbps",
        "Table MAC": "8K entrées",
        "Dimensions": "440 × 285 × 44 mm"
      },
      inStock: true,
      quantity: 12
    },
    {
      name: "Clavier mécanique Logitech MX",
      slug: "clavier-mecanique-logitech-mx",
      description: "Clavier mécanique professionnel sans fil avec rétroéclairage intelligent.",
      price: 45000, // 45,000 XOF
      category: "PERIPHERIQUES",
      subcategory: "Claviers",
      brand: "Logitech",
      model: "MX Mechanical",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
      specifications: {
        "Type": "Mécanique",
        "Connectivité": "Bluetooth, USB-C",
        "Rétroéclairage": "LED blanc",
        "Autonomie": "15 jours avec rétroéclairage",
        "Compatible": "Windows, Mac, Linux"
      },
      inStock: true,
      quantity: 30,
      discount: 15 // 15% de réduction
    },
    {
      name: "Onduleur APC 1000VA",
      slug: "onduleur-apc-1000va",
      description: "Onduleur ligne interactive APC pour protection électrique des équipements informatiques.",
      price: 95000, // 95,000 XOF
      category: "ACCESSOIRES",
      subcategory: "Onduleurs",
      brand: "APC",
      model: "Smart-UPS SMT1000I",
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=400",
      specifications: {
        "Puissance": "1000VA / 700W",
        "Autonomie": "15-20 minutes",
        "Prises": "8 prises IEC",
        "Interface": "USB, Série",
        "Écran": "LCD multilignes"
      },
      inStock: true,
      quantity: 20
    }
  ]

  // Créer les produits
  for (const product of products) {
    await prisma.product.create({
      data: product
    })
    console.log(`✅ Produit créé: ${product.name}`)
  }

  // Créer des services d'exemple
  const services = [
    {
      title: "Installation système informatique",
      slug: "installation-systeme-informatique",
      description: "Installation complète de votre infrastructure informatique : serveurs, postes de travail, réseau et sécurité. Notre équipe d'experts s'occupe de tout pour que vous puissiez vous concentrer sur votre activité.",
      shortDesc: "Installation complète d'infrastructure IT",
      category: "INSTALLATION",
      features: [
        "Audit des besoins",
        "Installation serveurs",
        "Configuration réseau",
        "Formation utilisateurs",
        "Support post-installation"
      ],
      benefits: [
        "Infrastructure optimisée",
        "Sécurité renforcée",
        "Productivité améliorée",
        "Support technique inclus"
      ],
      process: [
        "Analyse des besoins",
        "Proposition technique",
        "Planification",
        "Installation",
        "Tests et formation",
        "Mise en service"
      ],
      pricing: "CUSTOM",
      priceNote: "À partir de 500,000 XOF",
      featured: true,
      active: true,
      order: 1
    },
    {
      title: "Maintenance informatique",
      slug: "maintenance-informatique",
      description: "Service de maintenance préventive et curative pour votre parc informatique. Contrats de maintenance sur mesure avec intervention rapide.",
      shortDesc: "Maintenance préventive et curative",
      category: "MAINTENANCE",
      features: [
        "Maintenance préventive",
        "Intervention d'urgence",
        "Mise à jour logiciels",
        "Sauvegarde données",
        "Monitoring 24/7"
      ],
      benefits: [
        "Réduction des pannes",
        "Intervention rapide",
        "Données sécurisées",
        "Coûts maîtrisés"
      ],
      process: [
        "Audit initial",
        "Contrat de maintenance",
        "Planification interventions",
        "Suivi régulier"
      ],
      pricing: "PACKAGE",
      basePrice: 25000,
      priceNote: "25,000 XOF/mois par poste",
      featured: true,
      active: true,
      order: 2
    }
  ]

  // Créer les services
  for (const service of services) {
    await prisma.service.create({
      data: service
    })
    console.log(`✅ Service créé: ${service.title}`)
  }

  // Créer un admin par défaut
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.admin.create({
    data: {
      email: 'admin@mellplus.ne',
      password: hashedPassword,
      firstName: 'Administrateur',
      lastName: 'Mell Plus',
      role: 'SUPER_ADMIN',
      active: true,
      emailVerified: true
    }
  })
  console.log('✅ Admin créé: admin@mellplus.ne / admin123')

  console.log('🎉 Seeding terminé avec succès!')
}

main()
  .then(() => {
    console.log('✅ Base de données initialisée')
  })
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })