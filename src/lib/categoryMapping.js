// Utility functions for category and subcategory matching

// Keywords mapping for better subcategory matching
const subcategoryKeywords = {
  'Imprimantes': ['imprimante', 'printer', 'impression'],
  'Scanneur': ['scanner', 'scan', 'numéris'],
  'Copieur': ['copieur', 'photocopie', 'copie'],
  'PC Portable': ['portable', 'laptop', 'ordinateur portable'],
  'PC de Bureau': ['bureau', 'desktop', 'tour', 'pc'],
  'Serveur': ['serveur', 'server', 'dl380', 't40', 'ml30'],
  'All in one': ['all in one', 'tout-en-un', 'aio'],
  'Caméra de surveillance': ['caméra', 'surveillance', 'vidéo', 'camera'],
  'Gache': ['gache', 'gâche', 'serrure'],
  'Sécurité incendie': ['incendie', 'détecteur fumée', 'alarme incendie'],
  'Réseaux cuivre': ['cuivre', 'cat5', 'cat6', 'ethernet'],
  'Réseaux fibre': ['fibre', 'optique', 'fiber'],
  'Connectique': ['câble', 'cable', 'connecteur', 'multiprise'],
  'Stockage': ['disque', 'ssd', 'hdd', 'stockage'],
  'Multimedia': ['audio', 'vidéo', 'casque', 'webcam'],
  'Consommable': ['toner', 'cartouche', 'papier'],
  'Composants': ['composant', 'ram', 'processeur'],
  'Energie': ['onduleur', 'ups', 'batterie'],
  'Bureautique': ['bureau', 'fourniture', 'papeterie']
}

// Function to match subcategory based on product name/description
export function matchSubcategory(product, targetSubcategory) {
  // Direct subcategory match
  if (product.subcategory?.toLowerCase() === targetSubcategory.toLowerCase()) {
    return true
  }

  // Keyword matching
  const keywords = subcategoryKeywords[targetSubcategory] || []
  const productText = `${product.name} ${product.description}`.toLowerCase()

  return keywords.some(keyword =>
    productText.includes(keyword.toLowerCase())
  )
}

// Function to get display name for categories
export function getCategoryDisplayName(category) {
  const categoryNames = {
    'ORDI_SERVEUR': 'Ordi&Serveur',
    'RESEAUX_SECURITE': 'Reseaux&Sécurité',
    'IMPRIMANTE_COPIEUR': 'Imprimante/Copieur',
    'ACCESSOIRES': 'Accessoires'
  }

  return categoryNames[category] || category
}

// Enhanced filtering function
export function filterProductsBySubcategory(products, category, subcategory) {
  let filtered = products

  // Filter by main category first
  if (category && category !== 'all') {
    filtered = filtered.filter(product => product.category === category)
  }

  // Then filter by subcategory using smart matching
  if (subcategory) {
    filtered = filtered.filter(product =>
      matchSubcategory(product, subcategory)
    )
  }

  return filtered
}
