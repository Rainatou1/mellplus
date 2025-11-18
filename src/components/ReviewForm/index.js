"use client"
import { useState } from 'react'
import { Star, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ReviewForm({ productId = null, serviceId = null, onClose = null, className = "" }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 0,
    title: '',
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.rating === 0) {
      toast.error('Veuillez sélectionner une note')
      return
    }

    if (formData.content.trim().length < 10) {
      toast.error('Votre avis doit contenir au moins 10 caractères')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        ...formData
      }

      // N'ajouter productId et serviceId que s'ils ne sont pas null
      if (productId) submitData.productId = productId
      if (serviceId) submitData.serviceId = serviceId

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          company: '',
          rating: 0,
          title: '',
          content: ''
        })
        if (onClose) onClose()
      } else {
        throw new Error(result.error || 'Erreur lors de la soumission')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = (rating) => {
    const texts = {
      1: 'Très insatisfait',
      2: 'Insatisfait',
      3: 'Neutre',
      4: 'Satisfait',
      5: 'Très satisfait'
    }
    return texts[rating] || ''
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Laisser un avis
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Votre nom complet"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise (optionnel)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Nom de votre entreprise"
          />
        </div>

        {/* Note avec étoiles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || formData.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {formData.rating > 0 && (
            <p className="text-sm text-gray-600">
              {getRatingText(formData.rating)}
            </p>
          )}
        </div>

        {/* Titre de l'avis */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre de l&apos;avis (optionnel)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Résumez votre expérience"
            maxLength={100}
          />
        </div>

        {/* Contenu de l'avis */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Votre avis <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
            placeholder="Partagez votre expérience avec nos produits/services..."
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 caractères ({formData.content.length}/10)
          </p>
        </div>

        {/* Note d'information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note :</span> Votre avis sera examiné par notre équipe avant publication.
            Nous nous réservons le droit de ne pas publier les avis contenant des propos inappropriés.
          </p>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || formData.rating === 0}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publier mon avis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}