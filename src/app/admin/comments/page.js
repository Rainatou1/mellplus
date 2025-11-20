'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  MessageSquare,
  Search,
  Trash2,
  Calendar,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CommentsAdminPage() {
  const { data: session } = useSession()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({
    search: '',
    productId: ''
  })

  const fetchComments = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.productId) params.append('productId', filters.productId)

      const response = await fetch(`/api/admin/comments?${params}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments)
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
  }, [filters])

  useEffect(() => {
    fetchComments(1)
  }, [fetchComments])

  const handleDelete = async (commentId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/comments?id=${commentId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        fetchComments(currentPage)
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error(error.message)
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des commentaires</h1>
          <p className="text-gray-600">Gérez les commentaires laissés sur vos produits</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total des commentaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Nom, contenu..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des commentaires */}
      <div className="bg-white rounded-lg shadow border">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des commentaires...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun commentaire trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium text-gray-900">
                          {comment.name || 'Anonyme'}
                        </span>
                      </div>
                      {comment.product && (
                        <Link
                          href={`/products/${comment.product.id}`}
                          target="_blank"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Package className="w-4 h-4 mr-1" />
                          {comment.product.name}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {comment.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
                  {['SUPER_ADMIN', 'ADMIN'].includes(session?.user?.role) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex items-center px-3 py-1.5 bg-gray-100 text-red-700 text-sm rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  )}

                  <Link
                    href={`/products/${comment.product.id}`}
                    target="_blank"
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Voir le produit
                  </Link>
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
                onClick={() => fetchComments(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>
              <button
                onClick={() => fetchComments(currentPage + 1)}
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
