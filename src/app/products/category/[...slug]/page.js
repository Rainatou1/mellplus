'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, ShoppingCart, Eye, Star, Heart, ArrowLeft, Zap, Award, TrendingUp, Monitor, Printer, Router as RouterIcon, Shield, Cable, Headphones } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { matchSubcategory, getCategoryDisplayName } from '@/lib/categoryMapping'
import { CATEGORY_HIERARCHY, getCategoryDisplayPath, validateCategoryPath } from '@/lib/categoryHierarchy'

export default function CategoryPage({ params }) {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  })

  const PRODUCTS_PER_PAGE = 12

  // Parse URL slug to extract category and subcategory
  const { category, subcategory, subSubcategory } = parseSlug(params.slug)

  // Configuration des couleurs et icônes par catégorie
  const categoryConfig = {
    'INFORMATIQUE': {
      name: 'Informatique',
      color: 'from-blue-600 to-indigo-600',
      icon: Monitor,
      description: 'Ordinateurs, composants et matériel informatique',
      bannerText: 'Solutions informatiques complètes'
    },
    'PERIPHERIQUES': {
      name: 'Périphériques',
      color: 'from-purple-600 to-pink-600',
      icon: Printer,
      description: 'Imprimantes, scanners et accessoires',
      bannerText: 'Équipements périphériques de qualité'
    },
    'RESEAUX_SERVEUR': {
      name: 'Réseaux & Serveur',
      color: 'from-green-600 to-teal-600',
      icon: RouterIcon,
      description: 'Équipements réseau et serveurs',
      bannerText: 'Infrastructure réseau professionnelle'
    },
    'SECURITE': {
      name: 'Sécurité',
      color: 'from-red-600 to-orange-600',
      icon: Shield,
      description: 'Vidéosurveillance et contrôle d\'accès',
      bannerText: 'Solutions de sécurité avancées'
    },
    'CONNECTIQUES': {
      name: 'Connectiques',
      color: 'from-gray-600 to-gray-800',
      icon: Cable,
      description: 'Câbles et connectiques',
      bannerText: 'Connectivité et accessoires'
    },
    'ACCESSOIRES': {
      name: 'Accessoires',
      color: 'from-yellow-600 to-orange-600',
      icon: Headphones,
      description: 'Audio, vidéo et accessoires',
      bannerText: 'Accessoires et périphériques'
    }
  }

  useEffect(() => {
    // Validate the category path
    if (!validateCategoryPath(category, subcategory, subSubcategory)) {
      router.push('/products')
      return
    }

    fetchProducts()
  }, [category, subcategory, subSubcategory, router])

  useEffect(() => {
    applyFilters()
  }, [products, filters, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by main category
    if (category) {
      filtered = filtered.filter(product => product.category === category)
    }

    // Filter by subcategory using smart matching
    if (subcategory) {
      const subcategoryName = CATEGORY_HIERARCHY[category]?.subcategories?.[subcategory]?.name || subcategory
      filtered = filtered.filter(product =>
        matchSubcategory(product, subcategoryName)
      )
    }

    // Filter by sub-subcategory if applicable
    if (subSubcategory) {
      const subSubcategoryName = CATEGORY_HIERARCHY[category]?.subcategories?.[subcategory]?.subSubcategories?.[subSubcategory]?.name || subSubcategory
      filtered = filtered.filter(product =>
        matchSubcategory(product, subSubcategoryName)
      )
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    // Pagination
    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE)
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const paginatedProducts = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

    setFilteredProducts(paginatedProducts)
    setTotalPages(totalPages)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price)
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
    })
    setCurrentPage(1)
  }

  // Get category display name and path
  const categoryDisplayPath = getCategoryDisplayPath(category, subcategory, subSubcategory)
  const currentCategoryName = subSubcategory
    ? CATEGORY_HIERARCHY[category]?.subcategories?.[subcategory]?.subSubcategories?.[subSubcategory]?.name
    : subcategory
      ? CATEGORY_HIERARCHY[category]?.subcategories?.[subcategory]?.name
      : CATEGORY_HIERARCHY[category]?.name

  const config = categoryConfig[category] || categoryConfig['INFORMATIQUE']
  const IconComponent = config.icon

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${config.color} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <IconComponent size={48} className="text-white opacity-90" />
              <h1 className="text-4xl md:text-6xl font-bold">
                {currentCategoryName}
              </h1>
              <IconComponent size={48} className="text-white opacity-90" />
            </div>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              {config.bannerText}
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Zap className="text-white opacity-90" />
                <span>Produits de qualité</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-white opacity-90" />
                <span>Service professionnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/products" className="hover:text-blue-600">Tous les produits</Link>
            <span>/</span>
            <Link
              href={`/products?category=${category}`}
              className="hover:text-blue-600"
            >
              {config.name}
            </Link>
            {subcategory && (
              <>
                <span>/</span>
                <span className="font-medium text-blue-600">{currentCategoryName}</span>
              </>
            )}
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Banner - Hidden on small screens */}
          <div className="hidden lg:block lg:w-1/4 space-y-4">
            {/* Promotions Info Banner */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-lg font-bold mb-2">Super Promotions</h3>
              <p className="text-xs opacity-90 mb-3">Offres limitées dans le temps</p>
              <div className="space-y-2 text-xs">
                <div>✓ Jusqu&apos;à 50% de réduction</div>
                <div>✓ Produits de qualité</div>
                <div>✓ Stocks limités</div>
              </div>
              <Link href="/promotions" className="mt-3 bg-white text-red-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                Profitez maintenant
              </Link>
            </div>

            {/* Best Sellers Info Banner */}
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-lg font-bold mb-2">Best Sellers</h3>
              <p className="text-xs opacity-90 mb-3">Les produits les plus populaires</p>
              <div className="space-y-2 text-xs">
                <div>✓ Produits les plus demandés</div>
                <div>✓ Qualité garantie</div>
                <div>✓ Stock disponible</div>
              </div>
              <Link href="/bestsellers" className="mt-3 bg-white text-yellow-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                Découvrir maintenant
              </Link>
            </div>

            {/* Services Banner */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-lg font-bold mb-2">Nos Services</h3>
              <p className="text-xs opacity-90 mb-3">Installation & Maintenance</p>
              <div className="space-y-2 text-xs">
                <div>✓ Installation réseau</div>
                <div>✓ Développement logiciel</div>
                <div>✓ Support technique</div>
              </div>
              <Link href="/services" className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                Découvrir
              </Link>
            </div>

            {/* Contact Banner */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="text-lg font-bold mb-2">Besoin d&apos;aide ?</h3>
              <p className="text-xs opacity-90 mb-3">Nos experts vous conseillent</p>
              <div className="space-y-2 text-xs">
                <div>✓ Conseil personnalisé</div>
                <div>✓ Devis gratuit</div>
                <div>✓ Support technique</div>
              </div>
              <Link href="/contact" className="mt-3 bg-white text-green-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* En-tête avec compteur */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentCategoryName}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length > 0
                    ? `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} trouvé${filteredProducts.length > 1 ? 's' : ''}`
                    : `Plus de ${products.length} produits disponibles`
                  }
                </p>
              </div>
            </div>

            {/* Search and filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Rechercher dans ${config.name.toLowerCase()}...`}
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price filters */}
                <input
                  type="number"
                  placeholder="Prix min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
                />

                <input
                  type="number"
                  placeholder="Prix max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
                />

                {/* Sorting */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Nom A-Z</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 mb-8">
                {filteredProducts.map((product) => (
                  <CategoryProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos critères de recherche ou contactez-nous pour plus d&apos;informations
                </p>
                <div className="space-x-4">
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Réinitialiser les filtres
                  </button>
                  <Link
                    href="/contact"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to parse URL slug
function parseSlug(slug) {
  if (!slug || slug.length === 0) {
    return { category: null, subcategory: null, subSubcategory: null }
  }

  const [categorySlug, subcategorySlug, subSubcategorySlug] = slug

  // Map URL slugs to database categories
  const categoryMap = {
    'informatique': 'INFORMATIQUE',
    'peripheriques': 'PERIPHERIQUES',
    'securite': 'SECURITE',
    'reseaux-serveur': 'RESEAUX_SERVEUR',
    'connectiques': 'CONNECTIQUES',
    'accessoires': 'ACCESSOIRES'
  }

  // Map URL slugs to subcategory keys
  const subcategoryMap = {
    'ordinateurs-portables': 'ORDINATEURS_PORTABLES',
    'ordinateurs-bureau': 'ORDINATEURS_BUREAU',
    'serveurs': 'SERVEURS',
    'stockage': 'STOCKAGE',
    'moniteurs': 'MONITEURS',
    'imprimantes': 'IMPRIMANTES',
    'scanners': 'SCANNERS',
    'projecteurs': 'PROJECTEURS',
    'videosurveillance': 'VIDEOSURVEILLANCE',
    'controle-acces': 'CONTROLE_ACCES',
    'detecteurs': 'DETECTEURS',
    'equipements-actifs': 'EQUIPEMENTS_ACTIFS',
    'cables-connectique': 'CABLES_CONNECTIQUE',
    'wifi': 'WIFI',
    'cables-donnees': 'CABLES_DONNEES',
    'adaptateurs': 'ADAPTATEURS',
    'multiprises': 'MULTIPRISES',
    'souris-claviers': 'SOURIS_CLAVIERS',
    'audio': 'AUDIO',
    'protection': 'PROTECTION'
  }

  return {
    category: categoryMap[categorySlug] || null,
    subcategory: subcategoryMap[subcategorySlug] || null,
    subSubcategory: subSubcategorySlug || null
  }
}

// Composant carte produit pour les catégories
function CategoryProductCard({ product }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice
    return originalPrice * (1 - discount / 100)
  }

  const calculateSavings = (originalPrice, discount) => {
    if (!originalPrice || !discount) return 0
    return originalPrice * (discount / 100)
  }

  const getStockStatus = () => {
    if (product.quantity <= 0 || !product.inStock) {
      return { text: 'RUPTURE DE STOCK', color: 'text-red-600 bg-red-50' }
    } else if (product.quantity <= (product.lowStock || 5)) {
      return { text: 'STOCK LIMITÉ', color: 'text-orange-600 bg-orange-50' }
    } else {
      return { text: 'EN STOCK', color: 'text-green-600 bg-green-50' }
    }
  }

  const stockStatus = getStockStatus()
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
  const savings = calculateSavings(product.price, product.discount)

  return (
    <div className="bg-white shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-300 relative">
      {/* Image du produit */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={product.image || '/images/ordi.jpg'}
          alt={product.name}
          width={300}
          height={200}
          unoptimized
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/ordi.jpg'
          }}
        />

        {/* Badge de stock */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${stockStatus.color}`}>
          {product.quantity <= 0 || !product.inStock
            ? 'RUPTURE'
            : product.quantity <= (product.lowStock || 5)
            ? 'LIMITÉ'
            : 'EN STOCK'
          }
        </div>

        {/* Badge de réduction si applicable */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
          {product.category}
        </div>

        {/* Nom du produit */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Description courte */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Prix */}
        <div className="mb-4">
          {product.discount ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-lg font-bold text-red-600">
                  {formatPrice(discountedPrice)}
                </div>
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">
                Économies: {formatPrice(savings)}
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
          >
            Voir détails
          </Link>
          {(product.quantity > 0 && product.inStock) ? (
            <Link
              href={`/contact?product=${product.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >
              <ShoppingCart size={14} />
              Devis
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Indisponible
            </button>
          )}
        </div>
      </div>
    </div>
  )
}