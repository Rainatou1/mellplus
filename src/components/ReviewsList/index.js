"use client"
import { useState, useEffect, useCallback } from 'react'
import { Star, Calendar, Building, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ReviewsList({
  productId = null,
  serviceId = null,
  limit = 5,
  showPagination = true,
  featuredOnly = false,
  className = ""
}) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchReviews = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (productId) params.append('productId', productId)
      if (serviceId) params.append('serviceId', serviceId)
      if (featuredOnly) params.append('featured', 'true')

      const response = await fetch(`/api/reviews?${params}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(data.pagination.page)
      } else {
        throw new Error(data.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productId, serviceId, featuredOnly, limit])

  useEffect(() => {
    fetchReviews(1)
  }, [fetchReviews])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchReviews(page)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  const getAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / reviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating]++
    })
    return distribution
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-red-600">Erreur lors du chargement des avis: {error}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-600">Aucun avis pour le moment. Soyez le premier à laisser votre avis !</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Résumé des avis */}
      {reviews.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Avis clients ({reviews.length} avis)
            </h3>
            <div className="text-right">
              <div className="flex items-center justify-end mb-1">
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <p className="text-sm text-gray-600">
                Note moyenne: {getAverageRating()}/5
              </p>
            </div>
          </div>

          {/* Distribution des notes */}
          <div className="space-y-2">
            {Object.entries(getRatingDistribution())
              .reverse()
              .map(([rating, count]) => {
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[50px]">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 min-w-[60px] text-right">
                      {count} avis ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Liste des avis */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
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
              {review.featured && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Avis vedette
                </span>
              )}
            </div>

            <div className="mb-4">
              {renderStars(review.rating)}
            </div>

            {review.title && (
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
            )}

            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Précédent
          </button>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  )
}