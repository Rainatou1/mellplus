'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Star,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Flag,
  CheckCircle,
  XCircle,
  Calendar,
  Building,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  Award,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewsAdminPage() {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    search: ''
  })

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (filters.status) params.append('status', filters.status)
      if (filters.rating) params.append('rating', filters.rating)
      if (filters.search) params.append('search', filters.search)

      const response = await fetch(`/api/admin/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(data.pagination.page)
        setStats(data.stats || {})
      } else {
        throw new Error(data.error || 'Erreur lors du chargement')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1)
  }, [filters])

  const handleModeration = async (reviewId, status, moderationNote = '') => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          status,
          moderationNote
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        fetchReviews(currentPage)
      } else {
        throw new Error(result.error || 'Erreur lors de la modération')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleToggleFeatured = async (reviewId, featured) => {
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          status: 'APPROVED',
          featured: !featured
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Avis ${!featured ? 'mis en avant' : 'retiré de la mise en avant'}`)
        fetchReviews(currentPage)
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        fetchReviews(currentPage)
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      FLAGGED: 'bg-orange-100 text-orange-800'
    }

    const labels = {
      PENDING: 'En attente',
      APPROVED: 'Approuvé',
      REJECTED: 'Rejeté',
      FLAGGED: 'Signalé'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des avis clients</h1>
          <p className="text-gray-600">Modérez et gérez les avis laissés par vos clients</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.PENDING || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.APPROVED || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.REJECTED || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <Flag className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Signalés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.FLAGGED || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, email, contenu..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvés</option>
              <option value="REJECTED">Rejetés</option>
              <option value="FLAGGED">Signalés</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des avis...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun avis trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium text-gray-900">{review.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-1" />
                        {review.email}
                      </div>
                      {review.company && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-1" />
                          {review.company}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(review.createdAt)}
                      </div>
                      {review.product && (
                        <span>Produit: {review.product.name}</span>
                      )}
                      {review.service && (
                        <span>Service: {review.service.title}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.featured && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        <Award className="w-3 h-3 inline mr-1" />
                        Vedette
                      </span>
                    )}
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700">{review.content}</p>
                </div>

                {review.moderationNote && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="w-4 h-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-700">Note de modération:</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.moderationNote}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  {review.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleModeration(review.id, 'APPROVED')}
                        className="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </button>
                      <button
                        onClick={() => {
                          const note = prompt('Raison du rejet (optionnel):')
                          if (note !== null) {
                            handleModeration(review.id, 'REJECTED', note)
                          }
                        }}
                        className="flex items-center px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </button>
                      <button
                        onClick={() => {
                          const note = prompt('Raison du signalement:')
                          if (note) {
                            handleModeration(review.id, 'FLAGGED', note)
                          }
                        }}
                        className="flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Signaler
                      </button>
                    </>
                  )}

                  {review.status === 'APPROVED' && (
                    <button
                      onClick={() => handleToggleFeatured(review.id, review.featured)}
                      className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        review.featured
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Award className="w-4 h-4 mr-1" />
                      {review.featured ? 'Retirer vedette' : 'Mettre en vedette'}
                    </button>
                  )}

                  {['SUPER_ADMIN', 'ADMIN'].includes(session?.user?.role) && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex items-center px-3 py-1.5 bg-gray-100 text-red-700 text-sm rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchReviews(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => fetchReviews(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}