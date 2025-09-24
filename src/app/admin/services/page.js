// app/admin/services/page.js
'use client'

import { useState, useEffect } from 'react'
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Settings,
  Users,
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Package,
  Wrench,
  Monitor,
  Wifi,
  Shield,
  BookOpen,
  Headphones,
  Code,
  Save,
  X,
  ChevronDown,
  Tag,
  BarChart3,
  Target,
  Award
} from 'lucide-react'

export default function AdminServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    shortDesc: '',
    features: [''],
    pricing: 'CUSTOM',
    basePrice: '',
    priceNote: '',
    featured: false,
    active: true
  })

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/services?limit=100')
      const data = await response.json()

      if (response.ok) {
        setServices(data.services || [])
        setError(null)
      } else {
        setError(data.error || 'Erreur lors du chargement des services')
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error)
      setError('Erreur lors du chargement des services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const categories = [
    { value: 'VENTE_MATERIEL', label: 'Vente Matériel', icon: '📦' },
    { value: 'INSTALLATION', label: 'Installation', icon: '🔧' },
    { value: 'MAINTENANCE', label: 'Maintenance', icon: '🛠️' },
    { value: 'FORMATION', label: 'Formation', icon: '📚' },
    { value: 'CONSEIL', label: 'Conseil', icon: '💡' },
    { value: 'DEVELOPPEMENT', label: 'Développement', icon: '💻' },
    { value: 'RESEAU', label: 'Réseau', icon: '🌐' },
    { value: 'SECURITE', label: 'Sécurité', icon: '🔒' }
  ]

  const pricingTypes = [
    { value: 'FIXED', label: 'Prix fixe' },
    { value: 'HOURLY', label: 'Tarif horaire' },
    { value: 'CUSTOM', label: 'Sur devis' },
    { value: 'PACKAGE', label: 'Forfait' }
  ]

  // Statistiques - avec données mockées pour les métriques de performance
  const stats = {
    total: services.length,
    active: services.filter(s => s.active).length,
    featured: services.filter(s => s.featured).length,
    totalRequests: Math.round(services.length * 12.5), // Moyenne mockée
    totalCompleted: Math.round(services.length * 10.2), // Moyenne mockée
    totalRevenue: services.length * 5750000, // Moyenne mockée
    avgRating: services.length > 0 ? 4.7 : 0, // Note moyenne mockée
    completionRate: services.length > 0 ? 82 : 0 // Taux de réussite mocké
  }

  // Filtrage et tri
  const filteredServices = services
    .filter(service => {
      const matchSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (service.shortDesc && service.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchCategory = filterCategory === 'all' || service.category === filterCategory
      const matchStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && service.active) ||
                         (filterStatus === 'inactive' && !service.active)
      return matchSearch && matchCategory && matchStatus
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'popular': return (b.order || 0) - (a.order || 0) // Utiliser order pour popularité
        case 'rating': return b.title.localeCompare(a.title) // Tri alphabétique comme fallback
        case 'revenue': return b.title.localeCompare(a.title) // Tri alphabétique comme fallback
        case 'name': return a.title.localeCompare(b.title)
        default: return 0
      }
    })

  const getIconComponent = (icon) => {
    const icons = {
      wifi: <Wifi className="w-6 h-6" />,
      wrench: <Wrench className="w-6 h-6" />,
      book: <BookOpen className="w-6 h-6" />,
      code: <Code className="w-6 h-6" />,
      shield: <Shield className="w-6 h-6" />,
      monitor: <Monitor className="w-6 h-6" />,
      headphones: <Headphones className="w-6 h-6" />,
      settings: <Settings className="w-6 h-6" />
    }
    return icons[icon] || <Briefcase className="w-6 h-6" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const serviceData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        shortDesc: formData.shortDesc,
        features: formData.features.filter(f => f.trim()),
        pricing: formData.pricing,
        basePrice: formData.basePrice ? Number(formData.basePrice) : null,
        priceNote: formData.priceNote,
        featured: formData.featured,
        active: formData.active
      }

      let response
      if (editingService) {
        response = await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData)
        })
      } else {
        response = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData)
        })
      }

      const result = await response.json()

      if (response.ok) {
        await fetchServices() // Recharger la liste
        setShowAddModal(false)
        setEditingService(null)
        setFormData({
          title: '',
          category: '',
          description: '',
          shortDesc: '',
          features: [''],
          pricing: 'CUSTOM',
          basePrice: '',
          priceNote: '',
          featured: false,
          active: true
        })
      } else {
        setError(result.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      setError('Erreur lors de la sauvegarde du service')
    } finally {
      setLoading(false)
    }
  }

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] })
  }

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const removeFeature = (index) => {
    setFormData({ 
      ...formData, 
      features: formData.features.filter((_, i) => i !== index) 
    })
  }

  const deleteService = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      try {
        setLoading(true)
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE'
        })

        const result = await response.json()

        if (response.ok) {
          await fetchServices() // Recharger la liste
        } else {
          setError(result.error || 'Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        setError('Erreur lors de la suppression du service')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Services</h1>
            <p className="text-teal-100">
              Gérez votre catalogue de services et prestations
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-teal-50 transition-all font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau service
          </button>
        </div>
      </div>

      {/* Statistiques avec icônes */}
      {/*<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="w-8 h-8 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Services</p>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-700">{stats.active}</span>
          </div>
          <p className="text-sm text-green-600">Actifs</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-700">{stats.featured}</span>
          </div>
          <p className="text-sm text-yellow-600">En vedette</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-700">{stats.totalRequests}</span>
          </div>
          <p className="text-sm text-blue-600">Demandes</p>
        </div>

        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-700">{stats.totalCompleted}</span>
          </div>
          <p className="text-sm text-purple-600">Complétés</p>
        </div>

        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold text-indigo-700">
              {(stats.totalRevenue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm text-indigo-600">Revenus</p>
        </div>

        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-700">{stats.avgRating}</span>
          </div>
          <p className="text-sm text-orange-600">Note moy.</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-700">{stats.completionRate}%</span>
          </div>
          <p className="text-sm text-emerald-600">Taux réussite</p>
        </div>
      </div>*/}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 flex gap-3">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Catégorie */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>

            {/* Statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="popular">Plus demandés</option>
              <option value="rating">Mieux notés</option>
              <option value="revenue">Plus rentables</option>
              <option value="name">Alphabétique</option>
            </select>
          </div>
        </div>
      </div>

      {/* États de chargement et d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          <p className="font-semibold">Erreur:</p>
          <p>{error}</p>
          <button
            onClick={fetchServices}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-14 w-14 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Grille des services */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucun service trouvé</h3>
              <p>
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Aucun service ne correspond aux critères de recherche.'
                  : 'Aucun service n\'a été créé pour le moment.'
                }
              </p>
            </div>
          ) : (
            filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all overflow-hidden">
            {/* Header avec icône */}
            <div className={`p-6 bg-gradient-to-r ${
              service.featured 
                ? 'from-yellow-50 to-orange-50 border-b-2 border-orange-200' 
                : 'from-gray-50 to-white border-b'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  service.featured 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white' 
                    : 'bg-gradient-to-br from-teal-400 to-cyan-400 text-white'
                }`}>
                  {getIconComponent(service.icon)}
                </div>
                <div className="flex items-center gap-2">
                  {service.featured && (
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  )}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{service.shortDesc}</p>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-700">
                  {categories.find(c => c.value === service.category)?.label}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  service.active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {service.active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {/* Caractéristiques */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Inclus:</h4>
                <ul className="space-y-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-teal-600 font-medium ml-6">
                      +{service.features.length - 3} autres
                    </li>
                  )}
                </ul>
              </div>

              {/* Prix et information */}
              <div className="mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Tarification</p>
                  <p className="font-bold text-gray-900">
                    {service.priceNote || 'Sur devis'}
                  </p>
                </div>
                {service.basePrice && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Prix de base</p>
                    <p className="font-medium text-gray-700">
                      {new Intl.NumberFormat('fr-FR').format(service.basePrice)} FCFA
                    </p>
                  </div>
                )}
              </div>

              {/* Type de tarification */}
              <div className="mb-4 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="font-bold text-teal-700">
                    {pricingTypes.find(p => p.value === service.pricing)?.label || service.pricing}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingService(service)
                    setFormData({
                      title: service.title,
                      category: service.category,
                      description: service.description,
                      shortDesc: service.shortDesc || '',
                      features: service.features || [''],
                      pricing: service.pricing,
                      basePrice: service.basePrice?.toString() || '',
                      priceNote: service.priceNote || '',
                      featured: service.featured,
                      active: service.active
                    })
                    setShowAddModal(true)
                  }}
                  className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
            ))
          )}
        </div>
      )}

      {/* Modal Ajout/Édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingService ? 'Modifier le service' : 'Nouveau service'}
                  </h2>
                  <p className="text-teal-100 mt-1">
                    {editingService ? 'Modifiez les informations du service' : 'Ajoutez un nouveau service à votre catalogue'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingService(null)
                    setFormData({
                      title: '',
                      category: '',
                      description: '',
                      shortDesc: '',
                      features: [''],
                      pricing: 'CUSTOM',
                      basePrice: '',
                      priceNote: '',
                      featured: false,
                      active: true
                    })
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Section Informations de base */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-teal-600" />
                  Informations de base
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du service *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Ex: Installation Réseau"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description courte
                  </label>
                  <input
                    type="text"
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Description courte pour les cartes"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description complète *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Description détaillée du service..."
                  />
                </div>
              </div>

              {/* Section Caractéristiques */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-teal-600" />
                  Caractéristiques incluses
                </h3>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ex: Installation des équipements"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-3 px-4 py-2 border border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter une caractéristique
                </button>
              </div>

              {/* Section Tarification */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-teal-600" />
                  Tarification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de tarification *
                    </label>
                    <select
                      required
                      value={formData.pricing}
                      onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {pricingTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix de base (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="0"
                      disabled={formData.pricing === 'CUSTOM'}
                    />
                  </div>

                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note sur le prix
                  </label>
                  <input
                    type="text"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({...formData, priceNote: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Ex: À partir de 150 000 FCFA/mois"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-teal-600" />
                  Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Service en vedette</span>
                      <p className="text-xs text-gray-500">Ce service sera mis en avant sur le site</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Service actif</span>
                      <p className="text-xs text-gray-500">Les clients peuvent demander ce service</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingService(null)
                    setFormData({
                      title: '',
                      category: '',
                      description: '',
                      shortDesc: '',
                      features: [''],
                      pricing: 'CUSTOM',
                      basePrice: '',
                      priceNote: '',
                      featured: false,
                      active: true
                    })
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingService ? 'Mettre à jour' : 'Enregistrer le service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}