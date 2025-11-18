// app/admin/contacts/page.js
'use client'

import { useState, useEffect } from 'react'
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  MoreVertical,
  Mail,
  Phone,
  User,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Paperclip,
  Send,
  X,
  Flag,
  Tag,
  ExternalLink,
  Globe,
  MessageCircle,
  Inbox,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [selectedMessages, setSelectedMessages] = useState([])

  // Fetch contacts from API
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match component structure
        const transformedMessages = data.contacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone || '',
          company: contact.company || '',
          subject: contact.subject,
          message: contact.message,
          status: contact.read ? 'read' : 'unread',
          priority: getPriorityFromSubject(contact.subject),
          category: getCategoryFromSubject(contact.subject),
          source: contact.source || 'website',
          createdAt: contact.createdAt,
          ip: contact.ip,
          starred: contact.starred || false,
          replied: contact.replied || false,
          archived: contact.archived || false
        }))
        setMessages(transformedMessages)
      } else {
        toast.error('Erreur lors du chargement des messages')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Helper functions to determine priority and category from subject
  const getPriorityFromSubject = (subject) => {
    const lowerSubject = subject.toLowerCase()
    if (lowerSubject.includes('urgent') || lowerSubject.includes('support technique')) return 'urgent'
    if (lowerSubject.includes('partenariat') || lowerSubject.includes('important')) return 'high'
    return 'normal'
  }

  const getCategoryFromSubject = (subject) => {
    const lowerSubject = subject.toLowerCase()
    if (lowerSubject.includes('devis')) return 'quote'
    if (lowerSubject.includes('support') || lowerSubject.includes('technique')) return 'support'
    if (lowerSubject.includes('réclamation') || lowerSubject.includes('problème')) return 'complaint'
    if (lowerSubject.includes('partenariat')) return 'partnership'
    return 'information'
  }

  useEffect(() => {
    fetchContacts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Statistiques
  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    starred: messages.filter(m => m.starred).length,
    urgent: messages.filter(m => m.priority === 'urgent').length,
    replied: messages.filter(m => m.replied).length,
    archived: messages.filter(m => m.archived).length
  }

  // Filtrage
  const filteredMessages = messages.filter(message => {
    const matchSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchStatus = filterStatus === 'all' || 
      (filterStatus === 'unread' && message.status === 'unread') ||
      (filterStatus === 'read' && message.status === 'read') ||
      (filterStatus === 'starred' && message.starred) ||
      (filterStatus === 'replied' && message.replied)
    
    const matchCategory = filterCategory === 'all' || message.category === filterCategory
    
    return matchSearch && matchStatus && matchCategory && !message.archived
  })

  const getCategoryConfig = (category) => {
    const configs = {
      information: { label: 'Information', color: 'bg-blue-100 text-blue-700', icon: '💡' },
      quote: { label: 'Devis', color: 'bg-purple-100 text-purple-700', icon: '📝' },
      support: { label: 'Support', color: 'bg-orange-100 text-orange-700', icon: '🔧' },
      complaint: { label: 'Réclamation', color: 'bg-red-100 text-red-700', icon: '⚠️' },
      partnership: { label: 'Partenariat', color: 'bg-green-100 text-green-700', icon: '🤝' },
      other: { label: 'Autre', color: 'bg-gray-100 text-gray-700', icon: '📧' }
    }
    return configs[category] || configs.other
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'normal': return 'text-blue-600'
      case 'low': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, read: true }),
      })

      if (response.ok) {
        setMessages(messages.map(m =>
          m.id === id ? { ...m, status: 'read' } : m
        ))
      } else {
        toast.error('Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    }
  }

  const toggleStar = async (id) => {
    const message = messages.find(m => m.id === id)
    const newStarredStatus = !message.starred

    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, starred: newStarredStatus }),
      })

      if (response.ok) {
        setMessages(messages.map(m =>
          m.id === id ? { ...m, starred: newStarredStatus } : m
        ))
      } else {
        toast.error('Erreur lors de la mise à jour du favori')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    }
  }

  const archiveMessage = async (id) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, archived: true }),
      })

      if (response.ok) {
        setMessages(messages.map(m =>
          m.id === id ? { ...m, archived: true } : m
        ))
        toast.success('Message archivé')
      } else {
        toast.error('Erreur lors de l\'archivage')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    }
  }

  const deleteMessage = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      setMessages(messages.filter(m => m.id !== id))
      setSelectedMessage(null)
    }
  }

  const handleReply = () => {
    if (selectedMessage && replyText) {
      setMessages(messages.map(m => 
        m.id === selectedMessage.id 
          ? { ...m, replied: true, response: replyText, status: 'read' }
          : m
      ))
      setShowReplyModal(false)
      setReplyText('')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    
    if (diffHours < 1) return "À l'instant"
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffHours < 48) return "Hier"
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getSourceIcon = (source) => {
    switch(source) {
      case 'website': return <Globe className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Centre de Messages</h1>
            <p className="text-blue-100">
              Gérez tous vos messages et demandes clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
              <span className="text-sm">Nouveaux messages</span>
              <span className="text-2xl font-bold ml-2">{stats.unread}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Inbox className="w-8 h-8 text-gray-400" />
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total</p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Circle className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-700">{stats.unread}</span>
          </div>
          <p className="text-sm text-blue-600">Non lus</p>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-700">{stats.starred}</span>
          </div>
          <p className="text-sm text-yellow-600">Favoris</p>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-2xl font-bold text-red-700">{stats.urgent}</span>
          </div>
          <p className="text-sm text-red-600">Urgents</p>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Reply className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-green-700">{stats.replied}</span>
          </div>
          <p className="text-sm text-green-600">Répondus</p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <Archive className="w-8 h-8 text-gray-500" />
            <span className="text-2xl font-bold text-gray-700">{stats.archived}</span>
          </div>
          <p className="text-sm text-gray-600">Archivés</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des messages */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b">
            {/* Recherche */}
            <div className="relative mb-3">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
                <option value="starred">Favoris</option>
                <option value="replied">Répondus</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes catégories</option>
                <option value="information">Information</option>
                <option value="quote">Devis</option>
                <option value="support">Support</option>
                <option value="complaint">Réclamation</option>
                <option value="partnership">Partenariat</option>
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucun message trouvé</p>
              </div>
            ) : (
              filteredMessages.map((message) => {
              const categoryConfig = getCategoryConfig(message.category)
              
              return (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${message.status === 'unread' ? 'bg-blue-50/50' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message)
                    markAsRead(message.id)
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {message.status === 'unread' ? (
                        <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
                      ) : (
                        <CheckCircle className="w-2 h-2 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${
                            message.status === 'unread' ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          }`}>
                            {message.name}
                          </span>
                          {message.priority === 'urgent' && (
                            <Flag className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(message.id)
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Star className={`w-4 h-4 ${
                            message.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                          }`} />
                        </button>
                      </div>
                      
                      <p className={`text-sm mb-1 ${
                        message.status === 'unread' ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {message.subject}
                      </p>
                      
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {message.message}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          {formatDate(message.createdAt)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${categoryConfig.color}`}>
                          <span>{categoryConfig.icon}</span>
                          {categoryConfig.label}
                        </span>
                        {message.replied && (
                          <Reply className="w-3 h-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            }))}
          </div>

          {/* Pagination */}
          <div className="p-3 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredMessages.length} message(s)
            </span>
            <div className="flex gap-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Détail du message */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              {/* Header du message */}
              <div className="p-4 border-b">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                        getCategoryConfig(selectedMessage.category).color
                      }`}>
                        <span>{getCategoryConfig(selectedMessage.category).icon}</span>
                        {getCategoryConfig(selectedMessage.category).label}
                      </span>
                      <span className={`font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority === 'urgent' && 'Urgent'}
                        {selectedMessage.priority === 'high' && 'Priorité haute'}
                        {selectedMessage.priority === 'normal' && 'Normal'}
                        {selectedMessage.priority === 'low' && 'Priorité basse'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Star className={`w-5 h-5 ${
                        selectedMessage.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                      }`} />
                    </button>
                    <button
                      onClick={() => archiveMessage(selectedMessage.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Archive className="w-5 h-5 text-gray-400" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expéditeur */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900">{selectedMessage.name}</h4>
                      {selectedMessage.company && (
                        <span className="text-sm text-gray-600">• {selectedMessage.company}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-1 hover:text-blue-600">
                        <Mail className="w-4 h-4" />
                        {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-1 hover:text-blue-600">
                          <Phone className="w-4 h-4" />
                          {selectedMessage.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                      </span>
                      <span className="flex items-center gap-1">
                        {getSourceIcon(selectedMessage.source)}
                        {selectedMessage.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu du message */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Réponse précédente si existe */}
                {selectedMessage.replied && selectedMessage.response && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Reply className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Réponse envoyée</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedMessage.response}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReplyModal(true)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Reply className="w-5 h-5" />
                    Répondre
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                    <Forward className="w-5 h-5" />
                    Transférer
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Créer un devis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aucun message sélectionné</h3>
              <p className="text-sm text-gray-500">
                Sélectionnez un message pour voir son contenu
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de réponse */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Répondre au message</h3>
                  <p className="text-blue-100 mt-1">À: {selectedMessage.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyText('')
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinataire
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{selectedMessage.email}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objet
                </label>
                <input
                  type="text"
                  defaultValue={`Re: ${selectedMessage.subject}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={10}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tapez votre réponse ici..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">Envoyer une copie à l&apos;équipe</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyText('')
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReply}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
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