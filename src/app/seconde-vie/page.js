'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Eye, Star, Heart, Recycle, Leaf, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function SecondeViePage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'updatedAt-desc'
  })

  const PRODUCTS_PER_PAGE = 12

  useEffect(() => {
    fetchRefurbishedProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRefurbishedProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/refurbished?limit=1000')

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
      } else {
        console.error('Erreur lors du chargement des produits reconditionnés')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filtrage par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      )
    }

    // Filtrage par catégorie
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'updatedAt-desc':
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        case 'updatedAt-asc':
          return new Date(a.updatedAt) - new Date(b.updatedAt)
        case 'price-asc':
          return (a.price || 0) - (b.price || 0)
        case 'price-desc':
          return (b.price || 0) - (a.price || 0)
        case 'name':
        default:
          return a.name?.localeCompare(b.name || '') || 0
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
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price)).replace('F CFA', 'F')
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      sortBy: 'updatedAt-desc'
    })
    setCurrentPage(1)
  }

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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Recycle size={48} className="text-green-300" />
              <h1 className="text-4xl md:text-6xl font-bold">
                SECONDE VIE
              </h1>
              <Recycle size={48} className="text-green-300" />
            </div>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Produits reconditionnés durables 
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Award className="text-green-300" />
                <span>Garantie qualité</span>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Banner - Hidden on small screens */}
          <div className="hidden lg:block lg:w-1/4 space-y-4">
            

            {/* Eco Friendly Banner */}
            {/*<div className="bg-white p-4 text-gray text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="text-lg font-bold mb-2">Éco-responsable</h3>
              <p className="text-xs opacity-90 mb-3">Préservez l'environnement</p>
              <div className="space-y-2 text-xs">
                <div>✓ Réduction des déchets</div>
                <div>✓ Économies d'énergie</div>
                <div>✓ Impact carbone réduit</div>
              </div>
              <div className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block cursor-pointer">
                En savoir plus
              </div>
            </div>*/}

            {/* Quality Guarantee Banner */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-800 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-lg font-bold mb-2">Garantie Qualité</h3>
              <p className="text-xs opacity-90 mb-3">Tests et contrôles rigoureux</p>
              <div className="space-y-2 text-xs">
                <div>✓ Contrôle technique complet</div>
                <div>✓ Garantie constructeur</div>
                <div>✓ Support technique</div>
              </div>
              <Link href="/contact" className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                Nous contacter
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Recherche */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher dans les produits reconditionnés..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Catégorie */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Tri */}
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="updatedAt-desc">Plus récent</option>
                  <option value="updatedAt-asc">Plus ancien</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom A-Z</option>
                </select>

                {/* Reset */}
                <button
                  onClick={resetFilters}
                  className="px-4 py-3 text-green-600 hover:text-green-800 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Grille des produits reconditionnés */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 mb-8">
                {filteredProducts.map((product) => (
                  <RefurbishedProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">♻️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {products.length === 0 ? 'Aucun produit reconditionné pour le moment' : 'Aucun produit trouvé'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {products.length === 0
                    ? 'Les produits reconditionnés apparaîtront bientôt ici !'
                    : 'Essayez de modifier vos critères de recherche'
                  }
                </p>
                {products.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Voir tous les produits reconditionnés
                  </button>
                )}
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
                        ? 'bg-green-600 text-white border-green-600'
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

// Composant carte produit spécial produits reconditionnés
function RefurbishedProductCard({ product }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price)).replace('F CFA', 'F')
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
      {/* Badge Reconditionné */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
        <Recycle size={14} className="inline mr-1" />
      </div>

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
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
          product.quantity <= 0 || !product.inStock
            ? 'text-red-600 bg-red-50'
            : product.quantity <= (product.lowStock || 5)
            ? 'text-orange-600 bg-orange-50'
            : 'text-green-600 bg-green-50'
        }`}>
          {product.quantity <= 0 || !product.inStock
            ? 'RUPTURE'
            : product.quantity <= (product.lowStock || 5)
            ? 'LIMITÉ'
            : 'EN STOCK'
          }
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom du produit */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        {/* Avantages écologiques */}
        {/*<div className="bg-green-50 border border-green-200 rounded-lg p-1 mb-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Choix éco-responsable</span>
            <Leaf size={14} className="text-green-600" />
          </div>
        </div>*/}

        {/* Prix */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-base font-bold text-green-600">
              {formatPrice(discountedPrice)}
            </div>
            {product.discount && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>
          {product.discount && (
            <div className="text-xs text-green-600 font-medium">
              Économies: {formatPrice(savings)}
            </div>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug || product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors text-center"
          >
            Voir
          </Link>
          {(product.quantity > 0 && product.inStock) ? (
            <Link
              href={`/contact?product=${product.id}`}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-1"
            >
              <ShoppingCart size={14} />
              Acheter
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-3 py-2 rounded text-sm font-medium cursor-not-allowed"
            >
              Épuisé
            </button>
          )}
        </div>
      </div>
    </div>
  )
}