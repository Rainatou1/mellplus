// Utility functions for category and subcategory matching

// Keywords mapping for better subcategory matching
const subcategoryKeywords = {
  'Imprimantes': ['imprimante', 'printer', 'impression'],
  'Scanners': ['scanner', 'scan', 'numéris'],
  'Ordinateurs Portables': ['portable', 'laptop', 'ordinateur portable'],
  'Ordinateurs de Bureau': ['bureau', 'desktop', 'tour', 'pc'],
  'Switch': ['switch', 'commutateur', 'réseau'],
  'Serveurs': ['serveur', 'server', 'dl380', 't40', 'ml30'],
  'Telephone IP': ['téléphone ip', 'voip', 'sip'],
  'Cables': ['cable', 'câble', 'cordon'],
  'Multiprise': ['multiprise', 'prise multiple'],
  'Videosurveillance': ['caméra', 'surveillance', 'vidéo'],
  'Accessoires': ['accessoire', 'périphérique'],
  'Logiciels': ['logiciel', 'software', 'licence'],
  'Audio Video': ['audio', 'vidéo', 'son', 'image'],
  'Stockage': ['disque', 'ssd', 'hdd', 'stockage']
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
    'INFORMATIQUE': 'Informatique',
    'TELEPHONIE': 'Téléphonie',
    'PERIPHERIQUES': 'Périphériques',
    'BUREAUTIQUE': 'Bureautique',
    'GAMING': 'Gaming',
    'RESEAU': 'Réseau & Serveur',
    'SECURITE': 'Sécurité',
    'ENERGIE': 'Énergie',
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