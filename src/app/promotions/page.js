'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Eye, Star, Heart, Percent, Clock, TrendingDown, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PromotionsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minDiscount: '',
    maxPrice: '',
    sortBy: 'discount-desc'
  })

  const PRODUCTS_PER_PAGE = 12

  useEffect(() => {
    fetchPromoProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPromoProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products/promotions?limit=1000')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
      } else {
        console.error('Erreur lors du chargement des produits en promotion')
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

    // Filtrage par pourcentage de réduction minimum
    if (filters.minDiscount) {
      filtered = filtered.filter(product => 
        product.discount >= parseInt(filters.minDiscount)
      )
    }

    // Filtrage par prix maximum (après réduction)
    if (filters.maxPrice) {
      filtered = filtered.filter(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
        return discountedPrice <= parseFloat(filters.maxPrice)
      })
    }

    // Tri
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'discount-desc':
          return (b.discount || 0) - (a.discount || 0)
        case 'discount-asc':
          return (a.discount || 0) - (b.discount || 0)
        case 'price-asc':
          const priceA = calculateDiscountedPrice(a.price, a.discount)
          const priceB = calculateDiscountedPrice(b.price, b.discount)
          return priceA - priceB
        case 'price-desc':
          const priceA2 = calculateDiscountedPrice(a.price, a.discount)
          const priceB2 = calculateDiscountedPrice(b.price, b.discount)
          return priceB2 - priceA2
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

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice
    return originalPrice * (1 - discount / 100)
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const calculateSavings = (originalPrice, discount) => {
    if (!originalPrice || !discount) return 0
    return originalPrice * (discount / 100)
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minDiscount: '',
      maxPrice: '',
      sortBy: 'discount-desc'
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
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Percent size={48} className="text-yellow-300" />
              <h1 className="text-4xl md:text-6xl font-bold">
                PROMOTIONS
              </h1>
              <Percent size={48} className="text-yellow-300" />
            </div>
            <p className="text-xl md:text-2xl mb-6 opacity-90">
              Découvrez nos offres exceptionnelles
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="text-yellow-300" />
                <span>Jusqu&apos;à 50% de réduction</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-300" />
                <span>Offres limitées</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des promotions */}
      {/*<div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-red-600">{products.length}</div>
              <div className="text-gray-600">Produits en promo</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {products.length > 0 ? Math.max(...products.map(p => p.discount || 0)) : 0}%
              </div>
              <div className="text-gray-600">Réduction maximale</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-red-600">{categories.length}</div>
              <div className="text-gray-600">Catégories en promo</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {formatPrice(products.reduce((total, product) => 
                  total + calculateSavings(product.price, product.discount), 0
                ))}
              </div>
              <div className="text-gray-600">Économies totales</div>
            </div>
          </div>
        </div>
      </div>*/}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Banner - Hidden on small screens */}
          <div className="hidden lg:block lg:w-1/4 space-y-4">
           

            {/* Services Banner */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 text-white text-center ">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="text-lg font-bold mb-2">Nos Services</h3>
                <p className="text-xs opacity-90 mb-3">Installation & Maintenance</p>
                <div className="space-y-2 text-xs">
                  <div>✓ Installation réseau</div>
                  <div>✓ Developpement logiciel</div>
                  <div>✓ Support technique</div>
                </div>
                <Link href="/services" className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                  Découvrir
                </Link>
              </div>
              {/* Best Sellers Info Banner */}
            <div className="bg-gradient-to-br from-blue-300 to-blue-600 p-4 text-white text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-lg font-bold mb-2">Best Sellers</h3>
              <p className="text-xs opacity-90 mb-3">Les produits les plus populaires</p>
              <div className="space-y-2 text-xs">
                <div>✓ Produits les plus demandés</div>
                <div>✓ Qualité garantie</div>
                <div>✓ Stock disponible</div>
              </div>
              <div className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block cursor-pointer">
                Découvrir maintenant
              </div>
            </div>

            {/* Flash Sales Banner */}
            <div className="bg-white p-4 text-gray text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-bold mb-2">Ventes Flash</h3>
              <p className="text-xs opacity-90 mb-3">Offres éclair quotidiennes</p>
              <div className="space-y-2 text-xs">
                <div>✓ Nouveaux produits chaque jour</div>
                <div>✓ Réductions exceptionnelles</div>
                <div>✓ Durée limitée</div>
              </div>
              <div className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block cursor-pointer">
                Voir les offres
              </div>
            </div>

             {/* Contact Banner */}
                      <div className="bg-white p-4 text-gray text-center">
                          <div className="text-3xl mb-2">💬</div>
                          <h3 className="text-lg font-bold mb-2">Besoin d&apos;aide ?</h3>
                          <p className="text-xs opacity-90 mb-3">Nos experts vous conseillent</p>
                          <div className="space-y-2 text-xs">
                            <div>✓ Conseil personnalisé</div>
                            <div>✓ Devis gratuit</div>
                            <div>✓ Support technique</div>
                          </div>
                          <Link href="/contact" className="mt-3 bg-blue text-white px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
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
                placeholder="Rechercher dans les promotions..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  {category}
                </option>
              ))}
            </select>

            {/* Réduction minimum */}
            {/*<select
              value={filters.minDiscount}
              onChange={(e) => setFilters({...filters, minDiscount: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">Toutes les réductions</option>
              <option value="10">10% et plus</option>
              <option value="20">20% et plus</option>
              <option value="30">30% et plus</option>
              <option value="40">40% et plus</option>
              <option value="50">50% et plus</option>
            </select>*/}

            {/* Prix maximum */}
            <input
              type="number"
              placeholder="Prix max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 w-32"
            />

            {/* Tri */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="discount-desc">Meilleure promo</option>
              <option value="discount-asc">Promo croissante</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="px-4 py-3 text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
              title="Réinitialiser les filtres"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

            {/* Grille des produits en promotion */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 mb-8">
                {filteredProducts.map((product) => (
                  <PromoProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {products.length === 0 ? 'Aucune promotion en cours' : 'Aucun produit trouvé'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {products.length === 0
                    ? 'Revenez bientôt pour découvrir nos prochaines offres !'
                    : 'Essayez de modifier vos critères de recherche'
                  }
                </p>
                {products.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Voir toutes les promotions
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
                        ? 'bg-red-600 text-white border-red-600'
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

// Composant carte produit spécial promotions
function PromoProductCard({ product }) {
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
      {/* Badge de réduction */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
        -{product.discount}%
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
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>

        {/* Prix */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-base font-bold text-red-600">
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

        {/* Boutons d&apos;action */}
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-red-600 hover:to-pink-600 text-white px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-1"
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