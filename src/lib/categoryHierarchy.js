// Hiérarchie complète des catégories pour Mell Plus Niger
export const CATEGORY_HIERARCHY = {
  ORDI_SERVEUR: {
    name: 'Ordi&Serveur',
    subcategories: {
      'PC_PORTABLE': {
        name: 'PC Portable',
        subSubcategories: {}
      },
      'PC_DE_BUREAU': {
        name: 'PC de Bureau',
        subSubcategories: {}
      },
      'SERVEUR': {
        name: 'Serveur',
        subSubcategories: {}
      },
      'ALL_IN_ONE': {
        name: 'All in one',
        subSubcategories: {}
      }
    }
  },

  RESEAUX_SECURITE: {
    name: 'Reseaux&Sécurité',
    subcategories: {
      'CAMERA_SURVEILLANCE': {
        name: 'Caméra de surveillance',
        subSubcategories: {}
      },
      'GACHE': {
        name: 'Gache',
        subSubcategories: {}
      },
      'SECURITE_INCENDIE': {
        name: 'Sécurité incendie',
        subSubcategories: {}
      },
      'RESEAUX_CUIVRE': {
        name: 'Réseaux cuivre',
        subSubcategories: {}
      },
      'RESEAUX_FIBRE': {
        name: 'Réseaux fibre',
        subSubcategories: {}
      }
    }
  },

  IMPRIMANTE_COPIEUR: {
    name: 'Imprimante/Copieur',
    subcategories: {
      'IMPRIMANTES': {
        name: 'Imprimantes',
        subSubcategories: {}
      },
      'SCANNEUR': {
        name: 'Scanneur',
        subSubcategories: {}
      },
      'COPIEUR': {
        name: 'Copieur',
        subSubcategories: {}
      }
    }
  },

  ACCESSOIRES: {
    name: 'Accessoires',
    subcategories: {
      'CONNECTIQUES': {
        name: 'Connectique',
        subSubcategories: {}
      },
      'STOCKAGE': {
        name: 'Stockage',
        subSubcategories: {}
      },
      'MULTIMEDIA': {
        name: 'Multimedia',
        subSubcategories: {}
      },
      'CONSOMMABLE': {
        name: 'Consommable',
        subSubcategories: {}
      },
      'COMPOSANTS': {
        name: 'Composants',
        subSubcategories: {}
      },
      'ENERGIE': {
        name: 'Energie',
        subSubcategories: {}
      },
      'BUREAUTIQUE': {
        name: 'Bureautique',
        subSubcategories: {}
      }
    }
  }
}

// Fonction pour obtenir toutes les catégories principales
export function getMainCategories() {
  return Object.keys(CATEGORY_HIERARCHY).map(key => ({
    key,
    name: CATEGORY_HIERARCHY[key].name
  }))
}

// Fonction pour obtenir les sous-catégories d'une catégorie
export function getSubcategories(mainCategory) {
  if (!CATEGORY_HIERARCHY[mainCategory] || !CATEGORY_HIERARCHY[mainCategory].subcategories) {
    return []
  }

  return Object.keys(CATEGORY_HIERARCHY[mainCategory].subcategories).map(key => ({
    key,
    name: CATEGORY_HIERARCHY[mainCategory].subcategories[key].name
  }))
}

// Fonction pour obtenir les sous-sous-catégories
export function getSubSubcategories(mainCategory, subcategory) {
  if (!CATEGORY_HIERARCHY[mainCategory] ||
      !CATEGORY_HIERARCHY[mainCategory].subcategories ||
      !CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory] ||
      !CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory].subSubcategories) {
    return []
  }

  return Object.keys(CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory].subSubcategories).map(key => ({
    key,
    name: CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory].subSubcategories[key].name
  }))
}

// Fonction pour obtenir le nom d'affichage complet d'une catégorie
export function getCategoryDisplayPath(mainCategory, subcategory = null, subSubcategory = null) {
  let path = CATEGORY_HIERARCHY[mainCategory]?.name || mainCategory

  if (subcategory && CATEGORY_HIERARCHY[mainCategory]?.subcategories?.[subcategory]) {
    path += ' > ' + CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory].name

    if (subSubcategory && CATEGORY_HIERARCHY[mainCategory]?.subcategories?.[subcategory]?.subSubcategories?.[subSubcategory]) {
      path += ' > ' + CATEGORY_HIERARCHY[mainCategory].subcategories[subcategory].subSubcategories[subSubcategory].name
    }
  }

  return path
}

// Fonction pour valider une combinaison de catégories
export function validateCategoryPath(mainCategory, subcategory = null, subSubcategory = null) {
  if (!CATEGORY_HIERARCHY[mainCategory]) {
    return false
  }

  if (subcategory && !CATEGORY_HIERARCHY[mainCategory].subcategories?.[subcategory]) {
    return false
  }

  if (subSubcategory &&
      (!subcategory || !CATEGORY_HIERARCHY[mainCategory].subcategories?.[subcategory]?.subSubcategories?.[subSubcategory])) {
    return false
  }

  return true
}
