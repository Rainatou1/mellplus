// Contenu historique conservé pour la transition et l'import explicite.
export const DEFAULT_SLIDES = [
    {
      id: 1,
      title: "Votre expert IT basé au Niger",
      subtitle: "Une offre évolutive avec plus de 20ans d'experiences",
      description: "Équipements informatiques professionnels, support technique et solutions sur mesure pour votre entreprise",
      image: "/images/logo.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Nos produits",
      bgGradient: "from-gray-300 to-gray-600"
    },
    {
      id: 2,
      title: "Dernières technologies HP",
      subtitle: "HP Pavilion",
      description: "Découvrez la nouvelle gamme HP avec des offres exclusives et un service après-vente premium",
      image: "/images/hp-removebg.png",
      ctaPrimary: "En savoir plus",
      ctaSecondary: "Voir les produits",
      bgGradient: "from-gray-800 to-gray-900"
    },
    {
      id: 3,
      title: "Camera Surveillance",
      subtitle: "Vision de nuit",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de climatisation",
      image: "/images/camera.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Catalogue",
      bgGradient: "from-green-600 to-teal-700"
    },
    {
      id: 4,
      title: "Promotions exceptionnelles",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/hp.png",
      ctaPrimary: "En savoir plus",
      ctaSecondary: "Tous les promos",
      bgGradient: "from-red-600 to-pink-700"
    },
    {
      id: 5,
      title: "Promotion PC portable",
      subtitle: "Une offre évolutive avec plus de 15 000 références",
      description: "Équipements informatiques professionnels, support technique et solutions sur mesure pour votre entreprise",
      image: "/images/hp-removebg.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Tous les produits",
      bgGradient: "from-pink-600 to-blue-800"
    },
    {
      id: 6,
      title: "Derniere démarque",
      subtitle: "Scanner, Imprimante sharp, HP Pavilion",
      description: "Découvrez la nouvelle gamme de periphériques avec des offres exclusives et un service après-vente premium",
      image: "/images/imprimante.png",
      ctaPrimary: "En savoir plus",
      ctaSecondary: "Voir les produits",
      bgGradient: "from-gray-800 to-black-900"
    },
    {
      id: 7,
      title: "Economisez 10%",
      subtitle: "Maintenance",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de Multimedia",
      image: "/images/camera.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Catalogue",
      bgGradient: "from-blue-400 to-teal-700"
    },
    {
      id: 8,
      title: "Solde d'été",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/hp-removebg.png",
      ctaPrimary: "En savoir plus",
      ctaSecondary: "Tous les produits",
      bgGradient: "from-purple-600 to-pink-700"
    }
  ].map((slide, index) => ({
  ...slide, id: 'default-' + slide.id, order: index, active: true, featured: false,
  textColor: 'text-white', linkPrimary: '/contact', linkSecondary: '/products'
}))

export const DEFAULT_BLOCKS = {
  left: { key: 'home.hero.left', image: '/images/large1.jpg', title: 'Offres Spéciales', subtitle: "Jusqu'à -50%", alt: 'Offres spéciales', link: '/promotions', active: true },
  right: { key: 'home.hero.right', image: '/images/accessories.jpg', title: 'Nouveautés', subtitle: 'Découvrez-les', alt: 'Nouveautés', link: '/products', active: true }
}

// Un contenu neutre si toutes les slides enregistrées sont volontairement désactivées.
export const EMPTY_SLIDE = { id: 'empty', title: 'Mellplus', subtitle: '', description: '', image: '/images/logo.png', bgGradient: 'from-gray-300 to-gray-600', textColor: 'text-white', ctaPrimary: '', ctaSecondary: '' }
