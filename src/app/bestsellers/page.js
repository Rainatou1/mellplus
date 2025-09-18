'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Eye, Star, Heart, TrendingUp, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BestSellersPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'views-desc'
  })

  const PRODUCTS_PER_PAGE = 12

  useEffect(() => {
    fetchBestSellerProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBestSellerProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/bestsellers?limit=1000')

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
      } else {
        console.error('Erreur lors du chargement des produits best sellers')
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
        case 'views-desc':
          return (b.views || 0) - (a.views || 0)
        case 'views-asc':
          return (a.views || 0) - (b.views || 0)
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
    }).format(Number(price))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      sortBy: 'views-desc'
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
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award size={48} className="text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold">
                BEST SELLERS
              </h1>
              <TrendingUp size={48} className="text-yellow-300" />
            </div>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Les produits les plus populaires chez Mell Plus Niger
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-300" />
                <span>Produits les plus demandés</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-300" />
                <span>Qualité garantie</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher dans les best sellers..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
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
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              <option value="views-desc">Plus populaire</option>
              <option value="views-asc">Moins populaire</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="px-4 py-3 text-yellow-600 hover:text-yellow-800 font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Grille des produits best sellers */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredProducts.map((product) => (
              <BestSellerProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {products.length === 0 ? 'Aucun best seller pour le moment' : 'Aucun produit trouvé'}
            </h3>
            <p className="text-gray-600 mb-4">
              {products.length === 0
                ? 'Les produits populaires apparaîtront bientôt ici !'
                : 'Essayez de modifier vos critères de recherche'
              }
            </p>
            {products.length > 0 && (
              <button
                onClick={resetFilters}
                className="text-yellow-600 hover:text-yellow-800 font-medium"
              >
                Voir tous les best sellers
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
                    ? 'bg-yellow-600 text-white border-yellow-600'
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
  )
}

// Composant carte produit spécial best sellers
function BestSellerProductCard({ product }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-yellow-100 relative">
      {/* Badge Best Seller */}
      {/*<div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg flex items-center gap-1">
        <Award size={14} />
        BEST SELLER
      </div>*/}

      {/* Image du produit */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={product.image || '/images/ordi.jpg'}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/ordi.jpg'
          }}
        />

        {/* Badge de stock */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${stockStatus.color}`}>
          {stockStatus.text}
        </div>

        {/* Overlay gradient pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Boutons d'action en hover */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart size={16} className="text-gray-600" />
          </button>
          <Link
            href={`/products/${product.slug || product.id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="text-gray-600" />
          </Link>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
          {product.category}
        </div>

        {/* Nom du produit */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>

        {/* Description courte */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Statistiques de popularité */}
        {/*<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <TrendingUp size={14} />
              Vues :
            </span>
            <span className="font-bold text-yellow-600">{product.views || 0}</span>
          </div>
        </div>*/}

        {/* Prix */}
        <div className="mb-4">
          {product.discount ? (
            <div className="flex items-center gap-2">
              <div className="text-xl text-red-600">
                {formatPrice(product.price * (1 - product.discount / 100))}
              </div>
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            Prix TTC
          </div>
        </div>

        {/* Évaluation si disponible */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviews || 0})
            </span>
          </div>
        )}

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
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 shadow-md"
            >
              <ShoppingCart size={14} />
              Commander
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
            >
              Épuisé
            </button>
          )}
        </div>
      </div>
    </div>
  )
}