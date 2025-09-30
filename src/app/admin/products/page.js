'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, X, Upload, Save } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/admin/ImageUpload'
import { getCategoryDisplayName } from '@/lib/categoryMapping'

const PRODUCT_CATEGORIES = [
  { value: 'INFORMATIQUE', label: 'Informatique' },
  { value: 'PERIPHERIQUES', label: 'Périphériques' },
  { value: 'RESEAUX_SERVEUR', label: 'Réseaux & Serveur' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'CONNECTIQUES', label: 'Connectiques' },
  { value: 'ACCESSOIRES', label: 'Accessoires' }
]

const SUBCATEGORIES_BY_CATEGORY = {
  'INFORMATIQUE': [
    { value: 'PC portable', label: 'PC portable' },
    { value: 'PC de bureau', label: 'PC de bureau' },
    { value: 'Moniteur', label: 'Moniteur' },
    { value: 'Logiciels', label: 'Logiciels' },
    { value: 'Stockage', label: 'Stockage' }
  ],
  'PERIPHERIQUES': [
    { value: 'Imprimante', label: 'Imprimante' },
    { value: 'Photocopieuse', label: 'Photocopieuse' },
    //{ value: 'Projecteur', label: 'Projecteur' }
  ],
  'RESEAUX_SERVEUR': [
    { value: 'Switch', label: 'Switch' },
    { value: 'Routeur', label: 'Routeur' },
    { value: 'Point d\'accès WiFi', label: 'Point d\'accès WiFi' },
    { value: 'Téléphone IP', label: 'Téléphone IP' },
    { value: 'Serveur', label: 'Serveur' }
  ],
  'SECURITE': [
    { value: 'Caméra de surveillance', label: 'Caméra de surveillance' },
    { value: 'Contrôle d\'accès', label: 'Contrôle d\'accès' },
    { value: 'Détecteur', label: 'Détecteur' },
    { value: 'Système d\'alarme', label: 'Système d\'alarme' }
  ],
  'CONNECTIQUES': [
    { value: 'Câbles', label: 'Câbles' },
    { value: 'Multiprise', label: 'Multiprise' },
    { value: 'Onduleur', label: 'Onduleur' },
    { value: 'Adaptateurs', label: 'Adaptateurs' }
  ],
  'ACCESSOIRES': [
    { value: 'Vidéo', label: 'Vidéo' },
    { value: 'Son', label: 'Son' },
    { value: 'Equipement PC', label: 'Souris' },
    { value: 'Stockage', label: 'Stockage' },
    { value: 'Support', label: 'Support' }
  ]
}

const SUB_SUBCATEGORIES_BY_SUBCATEGORY = {
  // INFORMATIQUE
 /* 'PC portable': [
    { value: 'Laptop Business', label: 'Laptop Business' },
    { value: 'Laptop Gaming', label: 'Laptop Gaming' },
    { value: 'Ultrabook', label: 'Ultrabook' },
  ],*/
  'PC de bureau': [
    { value: 'PC complet', label: 'PC complet' },
    { value: 'Unité centrale', label: 'Unité centrale' },
    { value: 'All-in-One', label: 'All-in-One' }
  ],
  'Moniteur': [
    { value: 'Moniteur LCD', label: 'Moniteur LCD' },
    { value: 'Moniteur LED', label: 'Moniteur LED' },
    { value: 'Moniteur 4K', label: 'Moniteur 4K' },
    { value: 'Moniteur Gaming', label: 'Moniteur Gaming' }
  ],

  'Logiciels': [
    { value: 'Système d\'exploitation', label: 'Système d\'exploitation' },
    { value: 'Suite bureautique', label: 'Suite bureautique' },
    { value: 'Antivirus', label: 'Antivirus' },
    { value: 'Logiciel métier', label: 'Logiciel métier' }
  ],
  /*'Stockage': [
    { value: 'Disque dur HDD', label: 'Disque dur HDD' },
    { value: 'SSD', label: 'SSD' },
    { value: 'Disque externe', label: 'Disque externe' },
    { value: 'Clé USB', label: 'Clé USB' }
  ],*/

  // PERIPHERIQUES
 /* 'Imprimante': [
    { value: 'Imprimante laser', label: 'Imprimante laser' },
    { value: 'Imprimante jet d\'encre', label: 'Imprimante jet d\'encre' },
    { value: 'Multifonction', label: 'Multifonction' },
    { value: 'Plotter', label: 'Plotter' }
  ],*/
  
  /*'Projecteur': [
    { value: 'Projecteur bureau', label: 'Projecteur bureau' },
    { value: 'Projecteur portable', label: 'Projecteur portable' },
    { value: 'Vidéoprojecteur', label: 'Vidéoprojecteur' }
  ],*/

  // RESEAUX_SERVEUR

  'Routeur': [
    { value: 'Routeur WiFi', label: 'Routeur WiFi' },
    { value: 'Routeur professionnel', label: 'Routeur professionnel' },
    { value: 'Routeur 4G/5G', label: 'Routeur 4G/5G' }
  ],
  'Point d\'accès WiFi': [
    { value: 'Point d\'accès intérieur', label: 'Point d\'accès intérieur' },
    { value: 'Point d\'accès extérieur', label: 'Point d\'accès extérieur' },
    { value: 'Contrôleur WiFi', label: 'Contrôleur WiFi' }
  ],

  // SECURITE
  /*'Caméra de surveillance': [
    { value: 'Caméra IP', label: 'Caméra IP' },
    { value: 'Caméra analogique', label: 'Caméra analogique' },
    { value: 'Caméra PTZ', label: 'Caméra PTZ' },
    { value: 'Enregistreur DVR/NVR', label: 'Enregistreur DVR/NVR' }
  ],*/
  /*'Contrôle d\'accès': [
    { value: 'Lecteur de badge', label: 'Lecteur de badge' },
    { value: 'Serrure électronique', label: 'Serrure électronique' },
    { value: 'Interphone', label: 'Interphone' },
    { value: 'Portier vidéo', label: 'Portier vidéo' }
  ],*/
  'Détecteur': [
    { value: 'Détecteur de mouvement', label: 'Détecteur de mouvement' },
    { value: 'Détecteur de fumée', label: 'Détecteur de fumée' },
    { value: 'Sirène', label: 'Sirène' }
  ],

  // CONNECTIQUES
  'Câbles': [
    { value: 'Câble réseau', label: 'Câble réseau' },
    { value: 'Câble HDMI', label: 'Câble HDMI' },
    { value: 'Câble USB', label: 'Câble USB' },
    { value: 'Câble VGA', label: 'Câble VGA' }
  ],
  'Adaptateurs': [
    { value: 'Adaptateur USB', label: 'Adaptateur USB' },
    { value: 'Adaptateur vidéo', label: 'Adaptateur vidéo' },
    { value: 'Hub USB', label: 'Hub USB' },
    { value: 'Convertisseur', label: 'Convertisseur' }
  ],

  // ACCESSOIRES
  'Vidéo': [
    { value: 'Appareil photo', label: 'Appareil photo' },
    { value: 'Webcam', label: 'Webcam' },
    { value: 'Projecteur', label: 'Projecteur' },
    { value: 'Stabilisateur', label: 'Stabilisateur' }
  ],
  'Son': [
    { value: 'Casque audio', label: 'Casque audio' },
    { value: 'Micro', label: 'Micro' },
    { value: 'Haut-parleur', label: 'Haut-parleur' }
  ],
  'Equipement PC': [
    { value: 'Souris', label: 'Souris' },
    { value: 'Clavier', label: 'Clavier' },
    { value: 'Chargeur', label: 'Chargeur' },
    { value: 'Housse laptop', label: 'Housse laptop' },
    { value: 'Protection d\'écran', label: 'Protection d\'écran' },
    { value: 'Film protecteur', label: 'Film protecteur' }
  ],
  'Stockage': [
    { value: 'Disque dur HDD', label: 'Disque dur HDD' },
    { value: 'SSD', label: 'SSD' },
    { value: 'Disque externe', label: 'Disque externe' },
    { value: 'Clé USB', label: 'Clé USB' }
  ]
 /* 'Support': [
    { value: 'Support laptop', label: 'Support laptop' },
    { value: 'Support moniteur', label: 'Support moniteur' },
    { value: 'Support tablette', label: 'Support tablette' },
    { value: 'Bras articulé', label: 'Bras articulé' }
  ]*/
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, selectedCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?limit=1000')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        toast.error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des produits')
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        toast.success('Produit supprimé avec succès')
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error('Erreur lors de la suppression du produit')
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const getStockStatus = (product) => {
    if (product.quantity <= 0 || !product.inStock) {
      return { text: 'Rupture de stock', color: 'bg-red-100 text-red-800' }
    } else if (product.quantity <= product.lowStock) {
      return { text: `Stock bas (${product.quantity})`, color: 'bg-yellow-100 text-yellow-800' }
    } else {
      return { text: `En stock (${product.quantity})`, color: 'bg-green-100 text-green-800' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Produits
              </h1>
              <p className="text-gray-600 mt-1">
                {products.length} produits au total • {products.filter(p => p.inStock).length} en stock
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null)
                setIsModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit (nom, description, marque)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtre par catégorie */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={48}
                                height={48}
                                unoptimized
                                className="object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/api/placeholder/48/48'
                                }}
                              />
                            ) : (
                              <div className="text-gray-400 text-xs">Aucune image</div>
                            )}
                          </div>
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {product.brand && product.brand}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {getCategoryDisplayName(product.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(product.price)}
                        {product.discount && (
                          <span className="ml-2 text-xs text-green-600">
                            -{product.discount}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {product.featured && (
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                              Vedette
                            </span>
                          )}
                          {product.bestSeller && (
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                              Best Seller
                            </span>
                          )}
                          {product.refurbished && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Seconde Vie
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              Nouveau
                            </span>
                          )}
                          {product.publishedAt ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Publié
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              Brouillon
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir le produit"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingProduct(product)
                              setIsModalOpen(true)
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez de modifier vos critères de recherche ou ajoutez un nouveau produit
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour ajouter/modifier un produit */}
      {isModalOpen && (
        <ProductModal 
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProduct(null)
          }}
          onSave={(product) => {
            if (editingProduct) {
              // Refetch the products to ensure we have the latest data
              fetchProducts()
              toast.success('Produit modifié avec succès')
            } else {
              setProducts([product, ...products])
              toast.success('Produit créé avec succès')
            }
            setIsModalOpen(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    subSubcategory: product?.subSubcategory || '',
    brand: product?.brand || '',
    model: product?.model || '',
    image: product?.image || '',
    images: product?.images || [],
    specifications: product?.specifications || {},
    quantity: product?.quantity || 0,
    lowStock: product?.lowStock || 5,
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    refurbished: product?.refurbished || false,
    isNew: product?.isNew !== undefined ? product.isNew : true,
    discount: product?.discount || '',
    publishedAt: product?.publishedAt ? true : false
  })

  
  const [loading, setLoading] = useState(false)
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')

  // Générer le slug automatiquement à partir du nom
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        quantity: parseInt(formData.quantity) || 0,
        lowStock: parseInt(formData.lowStock) || 5,
        discount: formData.discount ? parseInt(formData.discount) : null,
        publishedAt: formData.publishedAt ? new Date().toISOString() : null,
        inStock: (parseInt(formData.quantity) || 0) > 0,
        subcategory: formData.subcategory || null,
        subSubcategory: formData.subSubcategory || null
      }

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const result = await response.json()
        onSave(result.product)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey]: newSpecValue
        }
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key) => {
    const newSpecs = { ...formData.specifications }
    delete newSpecs[key]
    setFormData(prev => ({ ...prev, specifications: newSpecs }))
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Informations de base */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Informations de base</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL du produit: /products/{formData.slug}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Réduction (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie du produit *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value, subcategory: '', subSubcategory: ''}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category && SUBCATEGORIES_BY_CATEGORY[formData.category] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sous-catégorie
                    </label>
                    <select
                      value={formData.subcategory || ''}
                      onChange={(e) => setFormData(prev => ({...prev, subcategory: e.target.value, subSubcategory: ''}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner une sous-catégorie</option>
                      {SUBCATEGORIES_BY_CATEGORY[formData.category].map(subcategory => (
                        <option key={subcategory.value} value={subcategory.value}>
                          {subcategory.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.subcategory && SUB_SUBCATEGORIES_BY_SUBCATEGORY[formData.subcategory] && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de produit
                    </label>
                    <select
                      value={formData.subSubcategory || ''}
                      onChange={(e) => setFormData(prev => ({...prev, subSubcategory: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sélectionner un type de produit</option>
                      {SUB_SUBCATEGORIES_BY_SUBCATEGORY[formData.subcategory].map(subSubcategory => (
                        <option key={subSubcategory.value} value={subSubcategory.value}>
                          {subSubcategory.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Détails produit */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Détails du produit</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modèle
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({...prev, model: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité en stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({...prev, quantity: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seuil stock bas
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStock}
                      onChange={(e) => setFormData(prev => ({...prev, lowStock: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Options</h4>
                  <div className="space-y-2">
                    {/*<label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({...prev, featured: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Produit vedette</span>
                    </label>*/}

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.bestSeller}
                        onChange={(e) => setFormData(prev => ({...prev, bestSeller: e.target.checked}))}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Best seller</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.refurbished}
                        onChange={(e) => setFormData(prev => ({...prev, refurbished: e.target.checked}))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Seconde vie (reconditionné)</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData(prev => ({...prev, isNew: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Nouveau produit</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.publishedAt}
                        onChange={(e) => setFormData(prev => ({...prev, publishedAt: e.target.checked}))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Publier le produit</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({...prev, image: url}))}
                label="Image principale"
                multiple={false}
              />

              <ImageUpload
                value={formData.images}
                onChange={(urls) => setFormData(prev => ({...prev, images: urls}))}
                label="Galerie d'images"
                multiple={true}
              />
            </div>
          </div>

          {/* Spécifications techniques */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Spécifications techniques</h3>
            
            <div className="space-y-2 mb-4">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specifications: {
                        ...prev.specifications,
                        [key]: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nom de la spécification"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Valeur"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {product ? 'Modifier' : 'Créer'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}