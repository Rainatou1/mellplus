// app/admin/quotes/page.js
'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Plus,
  XCircle,
  Clock,
  Send,
  Download,
  Calendar,
  User,
  Building,
  Mail,
  Phone,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  DollarSign,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Printer,
  Edit,
  Trash2,
  RefreshCw,
  FileDown,
  Star,
  MapPin,
  ArrowRight,
  Package,
  Briefcase
} from 'lucide-react'

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedQuote, setSelectedQuote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [dateRange, setDateRange] = useState('all')

  // Charger les devis depuis l'API
  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/quotes')

      if (response.ok) {
        const data = await response.json()
        // Transformer les données pour correspondre au format attendu
        const transformedQuotes = data.quotes.map(quote => ({
          id: quote.id,
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          company: quote.company,
          address: quote.address,
          city: quote.city,
          type: quote.type.toLowerCase(),
          items: quote.items.map(item => ({
            name: item.customItem || item.product?.name || 'Article personnalisé',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            type: item.productId ? 'product' : 'service',
            description: item.description
          })),
          total: quote.items.reduce((sum, item) => sum + item.totalPrice, 0),
          status: quote.status.toLowerCase(),
          priority: 'normal', // Valeur par défaut
          createdAt: quote.createdAt,
          message: quote.message,
          budget: quote.budget,
          assignedTo: quote.assignedTo,
          source: quote.source || 'website',
          validUntil: quote.validUntil,
          subject: quote.subject
        }))
        setQuotes(transformedQuotes)
      } else {
        console.error('Erreur lors du chargement des devis')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Statistiques
  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    reviewing: quotes.filter(q => q.status === 'reviewing').length,
    quoted: quotes.filter(q => q.status === 'quoted').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
    avgValue: quotes.reduce((sum, q) => sum + q.total, 0) / quotes.length,
    conversionRate: (quotes.filter(q => q.status === 'accepted').length / quotes.length * 100).toFixed(1)
  }

  // Filtrage
  const filteredQuotes = quotes.filter(quote => {
    const matchSearch = 
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = filterStatus === 'all' || quote.status === filterStatus
    const matchPriority = filterPriority === 'all' || quote.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        label: 'En attente', 
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: <Clock className="w-4 h-4" />
      },
      reviewing: { 
        label: 'En examen', 
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <Eye className="w-4 h-4" />
      },
      quoted: { 
        label: 'Devis envoyé', 
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: <Send className="w-4 h-4" />
      },
      accepted: { 
        label: 'Accepté', 
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />
      },
      rejected: { 
        label: 'Rejeté', 
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: <XCircle className="w-4 h-4" />
      }
    }
    return configs[status] || configs.pending
  }

  const getPriorityConfig = (priority) => {
    const configs = {
      urgent: { label: 'Urgent', color: 'bg-red-500 text-white' },
      high: { label: 'Haute', color: 'bg-orange-500 text-white' },
      normal: { label: 'Normale', color: 'bg-blue-500 text-white' },
      low: { label: 'Basse', color: 'bg-gray-500 text-white' }
    }
    return configs[priority] || configs.normal
  }

  const getSourceIcon = (source) => {
    switch(source) {
      case 'website': return '🌐'
      case 'phone': return '📞'
      case 'email': return '✉️'
      case 'direct': return '🤝'
      default: return '📝'
    }
  }

  const handleStatusChange = (quoteId, newStatus) => {
    setQuotes(quotes.map(q => 
      q.id === quoteId ? { ...q, status: newStatus } : q
    ))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion des Devis</h1>
            <p className="text-indigo-100">
              Suivez et gérez toutes vos demandes de devis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              <span className="hidden md:inline">Exporter</span>
            </button>
            <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Nouveau devis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques avec design moderne */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-700">{stats.pending}</span>
          </div>
          <p className="text-sm text-yellow-600">En attente</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-700">{stats.reviewing}</span>
          </div>
          <p className="text-sm text-blue-600">En examen</p>
        </div>

        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-purple-700">{stats.quoted}</span>
          </div>
          <p className="text-sm text-purple-600">Envoyés</p>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-700">{stats.accepted}</span>
          </div>
          <p className="text-sm text-green-600">Acceptés</p>
        </div>

        <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold text-indigo-700">
              {(stats.totalValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm text-indigo-600">Total FCFA</p>
        </div>

        <div className="bg-pink-50 rounded-xl border border-pink-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-pink-500" />
            <span className="text-xl font-bold text-pink-700">
              {(stats.avgValue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-sm text-pink-600">Moyenne</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-700">{stats.conversionRate}%</span>
          </div>
          <p className="text-sm text-emerald-600">Conversion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des devis */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 flex gap-3">
                {/* Recherche */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un devis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Filtre Statut */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="reviewing">En examen</option>
                  <option value="quoted">Devis envoyé</option>
                  <option value="accepted">Accepté</option>
                  <option value="rejected">Rejeté</option>
                </select>

                {/* Filtre Priorité */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Toutes priorités</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">Haute</option>
                  <option value="normal">Normale</option>
                  <option value="low">Basse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des devis...</p>
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun devis trouvé</h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                    ? 'Aucun devis ne correspond à vos critères de recherche.'
                    : 'Les demandes de devis apparaîtront ici.'}
                </p>
              </div>
            ) : filteredQuotes.map((quote) => {
              const statusConfig = getStatusConfig(quote.status)
              const priorityConfig = getPriorityConfig(quote.priority)
              
              return (
                <div
                  key={quote.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                    selectedQuote?.id === quote.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                  }`}
                  onClick={() => setSelectedQuote(quote)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-gray-900">{quote.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                        <span className="text-2xl">{getSourceIcon(quote.source)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{quote.name}</span>
                        {quote.company && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{quote.company}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(quote.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {quote.items.length} article(s)
                        </span>
                        {quote.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {quote.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {(quote.total / 1000000).toFixed(2)}M FCFA
                      </p>
                      <p className="text-xs text-gray-500">
                        {quote.type === 'product' && 'Produits'}
                        {quote.type === 'service' && 'Services'}
                        {quote.type === 'mixed' && 'Mixte'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Détails du devis sélectionné */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedQuote ? (
            <div className="h-full flex flex-col">
              {/* Header avec gradient */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-t-xl text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{selectedQuote.id}</h3>
                  <button className="p-1 hover:bg-white/20 rounded">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusConfig(selectedQuote.status).icon}
                  <span className="text-sm">{getStatusConfig(selectedQuote.status).label}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Informations client */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Informations client
                  </h4>
                  
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{selectedQuote.name}</p>
                        {selectedQuote.company && (
                          <p className="text-sm text-gray-600">{selectedQuote.company}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedQuote.email}`} className="text-sm text-indigo-600 hover:underline">
                        {selectedQuote.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${selectedQuote.phone}`} className="text-sm text-indigo-600 hover:underline">
                        {selectedQuote.phone}
                      </a>
                    </div>
                    
                    {selectedQuote.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <p className="text-sm text-gray-600">{selectedQuote.address}</p>
                      </div>
                    )}
                    
                    {selectedQuote.budget && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">Budget: {selectedQuote.budget} FCFA</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Articles demandés */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Articles demandés
                  </h4>
                  
                  <div className="space-y-2">
                    {selectedQuote.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {item.type === 'product' ? 
                                <Package className="w-4 h-4 text-blue-500" /> : 
                                <Briefcase className="w-4 h-4 text-purple-500" />
                              }
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.quantity} x {item.unitPrice.toLocaleString('fr-FR')} FCFA
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {item.totalPrice.toLocaleString('fr-FR')} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-indigo-600">
                          {selectedQuote.total.toLocaleString('fr-FR')} FCFA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message du client */}
                {selectedQuote.message && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                      Message du client
                    </h4>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-gray-700 italic">&quot;{selectedQuote.message}&quot;</p>
                    </div>
                  </div>
                )}

                {/* Validité */}
                {selectedQuote.validUntil && (
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <p className="text-sm text-orange-700">
                        Valide jusqu&apos;au {new Date(selectedQuote.validUntil).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t p-4 space-y-3">
                <select
                  value={selectedQuote.status}
                  onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">En attente</option>
                  <option value="reviewing">En examen</option>
                  <option value="quoted">Devis envoyé</option>
                  <option value="accepted">Accepté</option>
                  <option value="rejected">Rejeté</option>
                </select>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowResponseModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Envoyer</span>
                  </button>
                  
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                </div>
                
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Télécharger PDF</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aucun devis sélectionné</h3>
              <p className="text-sm text-gray-500">
                Cliquez sur un devis pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de réponse */}
      {showResponseModal && selectedQuote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl text-white">
              <h3 className="text-xl font-bold">Répondre au devis {selectedQuote.id}</h3>
              <p className="text-indigo-100 mt-1">Envoyez votre réponse à {selectedQuote.name}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objet de la réponse
                </label>
                <input
                  type="text"
                  defaultValue={`Re: Devis ${selectedQuote.id} - ${selectedQuote.company || selectedQuote.name}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={8}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Bonjour,

Suite à votre demande de devis, nous avons le plaisir de vous proposer...

Cordialement,
L'équipe Mell Plus Niger"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pièces jointes
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Cliquez pour ajouter le devis PDF
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false)
                    setResponseText('')
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedQuote.id, 'quoted')
                    setShowResponseModal(false)
                    setResponseText('')
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer la réponse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}