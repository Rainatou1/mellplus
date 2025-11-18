// Hiérarchie complète des catégories pour Mell Plus Niger
export const CATEGORY_HIERARCHY = {
  INFORMATIQUE: {
    name: 'Informatique',
    subcategories: {
      'ORDINATEURS_PORTABLES': {
        name: 'Ordinateurs Portables',
        subSubcategories: {
          'BUSINESS_LAPTOPS': { name: 'Laptops Business' },
          'GAMING_LAPTOPS': { name: 'Laptops Gaming' },
          'ULTRABOOKS': { name: 'Ultrabooks' },
          'WORKSTATIONS': { name: 'Workstations' }
        }
      },
      'ORDINATEURS_BUREAU': {
        name: 'Ordinateurs de Bureau',
        subSubcategories: {
          'PC_BUREAU_COMPLETS': { name: 'PC Bureau Complets' },
          'UNITES_CENTRALES': { name: 'Unités Centrales' },
          'ALL_IN_ONE': { name: 'Tout-en-Un' },
          'MINI_PC': { name: 'Mini PC' }
        }
      },
      'SERVEURS': {
        name: 'Serveurs',
        subSubcategories: {
          'SERVEURS_TOUR': { name: 'Serveurs Tour' },
          'SERVEURS_RACK': { name: 'Serveurs Rack' },
          'SERVEURS_LAME': { name: 'Serveurs Lame' },
          'NAS': { name: 'NAS/Stockage' }
        }
      },
      'STOCKAGE': {
        name: 'Stockage',
        subSubcategories: {
          'DISQUES_DURS': { name: 'Disques Durs' },
          'SSD': { name: 'SSD' },
          'DISQUES_EXTERNES': { name: 'Disques Externes' },
          'CLE_USB': { name: 'Clés USB' }
        }
      }
    }
  },

  PERIPHERIQUES: {
    name: 'Périphériques',
    subcategories: {
      'MONITEURS': {
        name: 'Moniteurs',
        subSubcategories: {
          'MONITEURS_LCD': { name: 'Moniteurs LCD' },
          'MONITEURS_LED': { name: 'Moniteurs LED' },
          'MONITEURS_4K': { name: 'Moniteurs 4K' },
          'MONITEURS_GAMING': { name: 'Moniteurs Gaming' }
        }
      },
      'IMPRIMANTES': {
        name: 'Imprimantes',
        subSubcategories: {
          'IMPRIMANTES_LASER': { name: 'Imprimantes Laser' },
          'IMPRIMANTES_JET_ENCRE': { name: 'Imprimantes Jet d\'Encre' },
          'MULTIFONCTIONS': { name: 'Multifonctions' },
          'PLOTTERS': { name: 'Plotters' }
        }
      },
      'SCANNERS': {
        name: 'Scanners',
        subSubcategories: {
          'SCANNERS_PLAT': { name: 'Scanners à Plat' },
          'SCANNERS_DOCUMENT': { name: 'Scanners de Documents' },
          'SCANNERS_PORTABLE': { name: 'Scanners Portables' }
        }
      },
      'PROJECTEURS': {
        name: 'Projecteurs',
        subSubcategories: {
          'PROJECTEURS_BUREAU': { name: 'Projecteurs Bureau' },
          'PROJECTEURS_PORTABLE': { name: 'Projecteurs Portables' },
          'VIDEOPROJECTEURS': { name: 'Vidéoprojecteurs' }
        }
      }
    }
  },

  SECURITE: {
    name: 'Sécurité',
    subcategories: {
      'VIDEOSURVEILLANCE': {
        name: 'Vidéosurveillance',
        subSubcategories: {
          'CAMERAS_IP': { name: 'Caméras IP' },
          'CAMERAS_ANALOGIQUES': { name: 'Caméras Analogiques' },
          'ENREGISTREURS_DVR': { name: 'Enregistreurs DVR' },
          'ENREGISTREURS_NVR': { name: 'Enregistreurs NVR' }
        }
      },
      'CONTROLE_ACCES': {
        name: 'Contrôle d\'Accès',
        subSubcategories: {
          'LECTEURS_BADGE': { name: 'Lecteurs de Badge' },
          'SERRURES_ELECTRONIQUES': { name: 'Serrures Électroniques' },
          'INTERPHONES': { name: 'Interphones' },
          'PORTIERS_VIDEO': { name: 'Portiers Vidéo' }
        }
      },
      'DETECTEURS': {
        name: 'Détecteurs',
        subSubcategories: {
          'DETECTEURS_MOUVEMENT': { name: 'Détecteurs de Mouvement' },
          'DETECTEURS_FUMEE': { name: 'Détecteurs de Fumée' },
          'SIRENES': { name: 'Sirènes' }
        }
      }
    }
  },

  'RESEAUX_SERVEUR': {
    name: 'Réseaux & Serveur',
    subcategories: {
      'EQUIPEMENTS_ACTIFS': {
        name: 'Équipements Actifs',
        subSubcategories: {
          'SWITCHES': { name: 'Switches' },
          'ROUTEURS': { name: 'Routeurs' },
          'POINTS_ACCES': { name: 'Points d\'Accès WiFi' },
          'FIREWALLS': { name: 'Firewalls' }
        }
      },
      'CABLES_CONNECTIQUE': {
        name: 'Câbles & Connectique',
        subSubcategories: {
          'CABLES_RESEAU': { name: 'Câbles Réseau' },
          'CABLES_FIBRE': { name: 'Câbles Fibre Optique' },
          'CONNECTEURS_RJ45': { name: 'Connecteurs RJ45' },
          'BAIES_BRASSAGE': { name: 'Baies de Brassage' }
        }
      },
      'WIFI': {
        name: 'WiFi',
        subSubcategories: {
          'BORNES_WIFI': { name: 'Bornes WiFi' },
          'CONTROLEURS_WIFI': { name: 'Contrôleurs WiFi' },
          'ANTENNES': { name: 'Antennes' }
        }
      }
    }
  },

  CONNECTIQUES: {
    name: 'Connectiques',
    subcategories: {
      'CABLES_DONNEES': {
        name: 'Câbles de Données',
        subSubcategories: {
          'CABLES_USB': { name: 'Câbles USB' },
          'CABLES_HDMI': { name: 'Câbles HDMI' },
          'CABLES_VGA': { name: 'Câbles VGA' },
          'CABLES_SATA': { name: 'Câbles SATA' }
        }
      },
      'ADAPTATEURS': {
        name: 'Adaptateurs',
        subSubcategories: {
          'ADAPTATEURS_USB': { name: 'Adaptateurs USB' },
          'ADAPTATEURS_VIDEO': { name: 'Adaptateurs Vidéo' },
          'HUBS_USB': { name: 'Hubs USB' }
        }
      },
      'MULTIPRISES': {
        name: 'Multiprises',
        subSubcategories: {
          'MULTIPRISES_STANDARD': { name: 'Multiprises Standard' },
          'ONDULEURS': { name: 'Onduleurs' },
          'PARASURTENSEURS': { name: 'Parasurtenseurs' }
        }
      }
    }
  },

  ACCESSOIRES: {
    name: 'Accessoires',
    subcategories: {
      'SOURIS_CLAVIERS': {
        name: 'Souris & Claviers',
        subSubcategories: {
          'SOURIS_FILAIRES': { name: 'Souris Filaires' },
          'SOURIS_SANS_FIL': { name: 'Souris Sans Fil' },
          'CLAVIERS_FILAIRES': { name: 'Claviers Filaires' },
          'CLAVIERS_SANS_FIL': { name: 'Claviers Sans Fil' }
        }
      },
      'AUDIO': {
        name: 'Audio',
        subSubcategories: {
          'CASQUES': { name: 'Casques' },
          'MICROPHONES': { name: 'Microphones' },
          'HAUT_PARLEURS': { name: 'Haut-Parleurs' },
          'WEBCAMS': { name: 'Webcams' }
        }
      },
      'PROTECTION': {
        name: 'Protection',
        subSubcategories: {
          'HOUSSES_LAPTOP': { name: 'Housses Laptop' },
          'PROTECTIONS_ECRAN': { name: 'Protections d\'Écran' },
          'SUPPORTS': { name: 'Supports' }
        }
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