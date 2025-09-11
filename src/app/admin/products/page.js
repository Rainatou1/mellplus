'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Package,
  AlertCircle,
  Download,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Grid,
  List,
  ChevronDown,
  Star,
  TrendingUp,
  TrendingDown,
  Copy,
  CheckCircle,
  XCircle,
  BarChart3,
  DollarSign,
  Box
} from 'lucide-react'
import Image from 'next/image'
import { useDashboardStats } from '../../../../hooks/useData'



export default function AdminProductsPage() {
  
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'HP EliteBook 840 G7',
      slug: 'hp-elitebook-840-g7',
      category: 'Ordinateurs',
      brand: 'HP',
      price: 850000,
      comparePrice: 950000,
      cost: 700000,
      stock: 5,
      sold: 23,
      status: 'active',
      image: null,
      featured: true,
      rating: 4.5,
      views: 234,
      createdAt: '2024-01-15',
      sku: 'HP-EB840-G7',
      description: 'Ordinateur portable professionnel haute performance avec processeur Intel Core i7'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max 256GB',
      slug: 'iphone-15-pro-max',
      category: 'Téléphones',
      brand: 'Apple',
      price: 1200000,
      comparePrice: 1350000,
      cost: 1000000,
      stock: 3,
      sold: 15,
      status: 'active',
      image: null,
      featured: true,
      rating: 5.0,
      views: 456,
      createdAt: '2024-01-10',
      sku: 'APL-IP15PM-256',
      description: 'Le dernier smartphone Apple avec puce A17 Pro et caméra 48MP'
    },
    {
      id: '3',
      name: 'Climatiseur Split Gree 2CV',
      slug: 'climatiseur-gree-2cv',
      category: 'Climatisation',
      brand: 'Gree',
      price: 450000,
      comparePrice: null,
      cost: 380000,
      stock: 0,
      sold: 8,
      status: 'out_of_stock',
      image: null,
      featured: false,
      rating: 4.2,
      views: 123,
      createdAt: '2024-01-08',
      sku: 'GRE-SPLIT-2CV',
      description: 'Climatiseur split système inverter économique'
    }
  ])

  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
   // Formulaire pour nouveau produit
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    comparePrice: '',
    cost: '',
    stock: '',
    sku: '',
    description: '',
    featured: false,
    status: 'active'
  })

  const categories = [
    'Ordinateurs',
    'Téléphones', 
    'Climatisation',
    'Bureautique',
    'Réseau',
    'Gaming',
    'Accessoires'
  ]

  const brands = ['HP', 'Apple', 'Dell', 'Lenovo', 'Samsung', 'Gree', 'LG', 'Canon']

  // Statistiques
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 5).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0)
  }

  // Filtrage et tri
  const filteredProducts = products
    .filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchSearch && matchCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
        case 'price-high': return b.price - a.price
        case 'price-low': return a.price - b.price
        case 'stock-high': return b.stock - a.stock
        case 'stock-low': return a.stock - b.stock
        case 'popular': return b.sold - a.sold
        default: return 0
      }
    })

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Supprimer ${selectedProducts.length} produit(s) sélectionné(s) ?`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      // Mise à jour
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              ...formData, 
              price: Number(formData.price), 
              comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
              cost: Number(formData.cost),
              stock: Number(formData.stock),
              updatedAt: new Date().toISOString()
            }
          : p
      ))
    } else {
      // Création
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        cost: Number(formData.cost),
        stock: Number(formData.stock),
        sold: 0,
        views: 0,
        rating: 0,
        image: null,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProducts([newProduct, ...products])
    }
    
    // Réinitialiser
    setShowAddModal(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      comparePrice: '',
      cost: '',
      stock: '',
      sku: '',
      description: '',
      featured: false,
      status: 'active'
    })
  }

  const duplicateProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copie)`,
      sku: `${product.sku}-COPY`,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setProducts([newProduct, ...products])
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Rupture', color: 'bg-red-100 text-red-700 border-red-200' }
    if (stock < 5) return { text: 'Stock faible', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    return { text: 'En stock', color: 'bg-green-100 text-green-700 border-green-200' }
  }

  const getProfit = (price, cost) => {
    const profit = price - cost
    const margin = ((profit / price) * 100).toFixed(1)
    return { amount: profit, margin }
  }

  return (
    <div className="space-y-6">
              {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Produits</h1>
            <p className="text-purple-100">Gérez votre catalogue et votre inventaire</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="hidden md:inline">Importer</span>
            </button>
            <button className="px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              <span className="hidden md:inline">Exporter</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau produit</span>
            </button>
          </div>
        </div>
      </div>
       {/* Statistiques avec icônes modernes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total produits</p>
        </div>
        
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-700">{stats.active}</span>
          </div>
          <p className="text-sm text-green-600">Actifs</p>
        </div>
        
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-red-700">{stats.outOfStock}</span>
          </div>
          <p className="text-sm text-red-600">Rupture</p>
        </div>
        
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-700">{stats.lowStock}</span>
          </div>
          <p className="text-sm text-orange-600">Stock faible</p>
        </div>
        
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-blue-700">
              {(stats.totalValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm text-blue-600">Valeur stock</p>
        </div>
        
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-700">{stats.totalSold}</span>
          </div>
          <p className="text-sm text-purple-600">Vendus</p>
        </div>
      </div>
      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-3">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher un produit, SKU, marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Plus récents</option>
                <option value="oldest">Plus anciens</option>
                <option value="price-high">Prix décroissant</option>
                <option value="price-low">Prix croissant</option>
                <option value="stock-high">Stock décroissant</option>
                <option value="stock-low">Stock croissant</option>
                <option value="popular">Plus vendus</option>
              </select>
            </div>

            {/* Actions et vue */}
            <div className="flex items-center gap-3">
              {selectedProducts.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer ({selectedProducts.length})
                </button>
              )}
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filtres
              </button>

              {/* Toggle Vue */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
        {/* Filtres avancés */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Toutes les marques</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="out_of_stock">Rupture de stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix min</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix max</label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="999999" />
              </div>
            </div>
          </div>
        )}
         {/* Liste des produits */}
        {viewMode === 'grid' ? (
          // Vue Grille
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                const profit = getProfit(product.price, product.cost)
                
                return (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-xl transition-all overflow-hidden">
                    <div className="relative">
                      {/* Image placeholder */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.featured && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                            Vedette
                          </span>
                        )}
                        {product.comparePrice && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                          </span>
                        )}
                      </div>
                      
                      {/* Actions rapides */}
                      <div className="absolute top-2 right-2">
                        <button className="p-1.5 bg-white rounded-lg shadow-md hover:shadow-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Checkbox */}
                      <div className="absolute bottom-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id])
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                            }
                          }}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">{product.brand} • {product.sku}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">
                              {product.price.toLocaleString('fr-FR')} FCFA
                            </p>
                            {product.comparePrice && (
                              <p className="text-xs text-gray-500 line-through">
                                {product.comparePrice.toLocaleString('fr-FR')} FCFA
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full border ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                          <span className="text-gray-600">Stock: {product.stock}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Vendus: {product.sold}</span>
                          <span className="text-green-600">Marge: {profit.margin}%</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setFormData({
                              name: product.name,
                              category: product.category,
                              brand: product.brand,
                              price: product.price.toString(),
                              comparePrice: product.comparePrice?.toString() || '',
                              cost: product.cost.toString(),
                              stock: product.stock.toString(),
                              sku: product.sku,
                              description: product.description,
                              featured: product.featured,
                              status: product.status
                            })
                            setShowAddModal(true)
                          }}
                          className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => duplicateProduct(product)}
                          className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
            // Vue Liste
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts([...selectedProducts, product.id])
                            } else {
                              setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                            }
                          }}
                          className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{product.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{product.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.price.toLocaleString('fr-FR')} FCFA
                          </p>
                          {product.comparePrice && (
                            <p className="text-xs text-gray-500 line-through">
                              {product.comparePrice.toLocaleString('fr-FR')} FCFA
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 5 ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{product.sold}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setFormData({
                                name: product.name,
                                category: product.category,
                                brand: product.brand,
                                price: product.price.toString(),
                                comparePrice: product.comparePrice?.toString() || '',
                                cost: product.cost.toString(),
                                stock: product.stock.toString(),
                                sku: product.sku,
                                description: product.description,
                                featured: product.featured,
                                status: product.status
                              })
                              setShowAddModal(true)
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}





    </div>
  )
}