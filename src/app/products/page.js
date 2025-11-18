// app/products/page.js
'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search, Filter, ShoppingCart, Eye, Star, Heart, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { matchSubcategory, getCategoryDisplayName } from '@/lib/categoryMapping'

function ProductsContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    subcategory: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  })

  const PRODUCTS_PER_PAGE = 12

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    const searchParam = searchParams.get('search')
    
    if (categoryParam || subcategoryParam || searchParam) {
      setFilters(prev => ({
        ...prev,
        category: categoryParam || 'all',
        subcategory: subcategoryParam || '',
        search: searchParam || ''
      }))
    }
    
    fetchProducts()
  }, [searchParams])

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
        setCategories(data.categories || [])
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

    // Filtrage par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    // Filtrage par catégorie
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Filtrage par sous-catégorie avec smart matching
    if (filters.subcategory) {
      filtered = filtered.filter(product => 
        matchSubcategory(product, filters.subcategory)
      )
    }

    // Filtrage par prix
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    // Tri
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
      category: 'all',
      subcategory: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'name'
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
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {filters.subcategory 
                  ? `${filters.subcategory} - Produits` 
                  : filters.category !== 'all' 
                    ? `${getCategoryDisplayName(filters.category)} - Produits`
                    : 'Nos Produits'
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length > 0 
                  ? `${filteredProducts.length} produits trouvés`
                  : `Plus de ${products.length} produits disponibles`
                }
                {filters.subcategory && ` dans la catégorie ${filters.subcategory}`}
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        {(filters.category !== 'all' || filters.subcategory) && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/products" className="hover:text-blue-600">Tous les produits</Link>
              {filters.category !== 'all' && (
                <>
                  <span>/</span>
                  <Link 
                    href={`/products?category=${filters.category}`} 
                    className="hover:text-blue-600"
                  >
                    {getCategoryDisplayName(filters.category)}
                  </Link>
                </>
              )}
              {filters.subcategory && (
                <>
                  <span>/</span>
                  <span className="font-medium text-blue-600">{filters.subcategory}</span>
                </>
              )}
            </nav>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Catégorie */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Prix minimum */}
            <input
              type="number"
              placeholder="Prix min"
              value={filters.minPrice}
              onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
            />

            {/* Prix maximum */}
            <input
              type="number"
              placeholder="Prix max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-32"
            />

            {/* Tri */}
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
              className="px-4 py-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              title="Réinitialiser les filtres"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Grille des produits */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-600 mb-4">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tous les produits
            </button>
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
  )
}

// Composant carte produit (similaire à votre image)
function ProductCard({ product }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'RUPTURE DE STOCK', color: 'text-red-600 bg-red-50' }
    } else if (product.stock <= 5) {
      return { text: 'STOCK LIMITÉ', color: 'text-orange-600 bg-orange-50' }
    } else {
      return { text: 'EN STOCK', color: 'text-green-600 bg-green-50' }
    }
  }

  const stockStatus = getStockStatus()

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
      {/* Image du produit */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={product.image || '/api/placeholder/300/200'}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200'
          }}
        />

        {/* Badge de stock */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${stockStatus.color}`}>
          {stockStatus.text}
        </div>

        {/* Boutons d'action en hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart size={16} className="text-gray-600" />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="text-gray-600" />
          </Link>
        </div>

        {/* Badge prix en promotion si applicable */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            PROMO
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Catégorie */}
        {/*<div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
          {product.category}
        </div>*/}

        {/* Nom du produit */}
        <h3 className="font-bold text-gray-900 mb-2 h-12 overflow-hidden group-hover:text-blue-600 transition-colors" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.name}
        </h3>

        {/* Description courte */}
        <p className="text-gray-600 text-sm mb-3 h-10 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>

        {/* Prix */}
        <div className="mb-4">
          {product.originalPrice && product.originalPrice > product.price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
          )}
        </div>

        {/* Évaluation si disponible */}
        <div className="min-h-[1.5rem] mb-3">
        {product.rating && (
          <div className="flex items-center gap-1">
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
        </div>

        {/* Bouton d'action */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
          >
            Voir détails
          </Link>
          {product.stock > 0 ? (
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
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
    }>
      <ProductsContent />
    </Suspense>
  )
}