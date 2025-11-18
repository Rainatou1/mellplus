// app/admin/carousel/page.js
'use client'

import { useState, useEffect } from 'react'
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Star,
  Link,
  Palette,
  MonitorPlay,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  GripVertical
} from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaPrimary: '',
    ctaSecondary: '',
    linkPrimary: '',
    linkSecondary: '',
    bgGradient: 'from-blue-600 to-blue-800',
    textColor: 'text-white',
    active: true,
    featured: false,
    order: 0
  })

  // Options pour les gradients
  const gradientOptions = [
    { value: 'from-blue-600 to-blue-800', label: 'Bleu', preview: 'bg-gradient-to-r from-blue-600 to-blue-800' },
    { value: 'from-purple-600 to-pink-600', label: 'Violet-Rose', preview: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { value: 'from-green-600 to-teal-600', label: 'Vert-Turquoise', preview: 'bg-gradient-to-r from-green-600 to-teal-600' },
    { value: 'from-red-600 to-pink-600', label: 'Rouge-Rose', preview: 'bg-gradient-to-r from-red-600 to-pink-600' },
    { value: 'from-gray-800 to-gray-900', label: 'Gris Foncé', preview: 'bg-gradient-to-r from-gray-800 to-gray-900' },
    { value: 'from-indigo-600 to-purple-600', label: 'Indigo-Violet', preview: 'bg-gradient-to-r from-indigo-600 to-purple-600' },
    { value: 'from-orange-600 to-red-600', label: 'Orange-Rouge', preview: 'bg-gradient-to-r from-orange-600 to-red-600' },
    { value: 'from-yellow-400 to-orange-500', label: 'Jaune-Orange', preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' }
  ]

  // Charger les slides
  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/carousel?limit=50')
      const data = await response.json()

      if (response.ok) {
        setSlides(data.slides || [])
      } else {
        toast.error(data.error || 'Erreur lors du chargement des slides')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement des slides')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const slideData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        image: formData.image,
        ctaPrimary: formData.ctaPrimary,
        ctaSecondary: formData.ctaSecondary,
        linkPrimary: formData.linkPrimary,
        linkSecondary: formData.linkSecondary,
        bgGradient: formData.bgGradient,
        textColor: formData.textColor,
        active: formData.active,
        featured: formData.featured,
        order: formData.order
      }

      let response
      if (editingSlide) {
        response = await fetch(`/api/carousel/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideData)
        })
      } else {
        response = await fetch('/api/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slideData)
        })
      }

      const result = await response.json()

      if (response.ok) {
        toast.success(editingSlide ? 'Slide mise à jour' : 'Slide créée')
        await fetchSlides()
        handleCloseModal()
      } else {
        toast.error(result.error || 'Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  // Supprimer une slide
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette slide ?')) {
      return
    }

    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Slide supprimée')
        await fetchSlides()
      } else {
        toast.error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  // Basculer le statut actif
  const toggleActive = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/carousel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(`Slide ${!currentStatus ? 'activée' : 'désactivée'}`)
        await fetchSlides()
      } else {
        toast.error(result.error || 'Erreur lors de la modification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la modification')
    }
  }

  // Changer l'ordre
  const handleReorder = async (id, direction) => {
    const slide = slides.find(s => s.id === id)
    if (!slide) return

    const sortedSlides = [...slides].sort((a, b) => a.order - b.order)
    const currentIndex = sortedSlides.findIndex(s => s.id === id)

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedSlides.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const otherSlide = sortedSlides[newIndex]

    try {
      await fetch('/api/carousel/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideOrders: [
            { id: slide.id, order: otherSlide.order },
            { id: otherSlide.id, order: slide.order }
          ]
        })
      })

      toast.success('Ordre modifié')
      await fetchSlides()
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la modification de l\'ordre')
    }
  }

  // Ouvrir le modal d'édition
  const handleEdit = (slide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image,
      ctaPrimary: slide.ctaPrimary || '',
      ctaSecondary: slide.ctaSecondary || '',
      linkPrimary: slide.linkPrimary || '',
      linkSecondary: slide.linkSecondary || '',
      bgGradient: slide.bgGradient,
      textColor: slide.textColor,
      active: slide.active,
      featured: slide.featured,
      order: slide.order
    })
    setShowAddModal(true)
  }

  // Fermer le modal
  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingSlide(null)
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      ctaPrimary: '',
      ctaSecondary: '',
      linkPrimary: '',
      linkSecondary: '',
      bgGradient: 'from-blue-600 to-blue-800',
      textColor: 'text-white',
      active: true,
      featured: false,
      order: 0
    })
  }

  // Statistiques
  const stats = {
    total: slides.length,
    active: slides.filter(s => s.active).length,
    inactive: slides.filter(s => !s.active).length,
    featured: slides.filter(s => s.featured).length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse w-64"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded animate-pulse w-80"></div>
            </div>
            <div className="w-32 h-10 bg-white bg-opacity-20 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-12 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                <div className="flex space-x-2">
                  {[1,2,3].map(j => (
                    <div key={j} className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gestion du Carousel</h1>
            <p className="text-purple-100">
              Gérez les slides du carousel de la page d&apos;accueil
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle slide
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <MonitorPlay className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
              <p className="text-sm text-green-600">Actives</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-700">{stats.inactive}</p>
              <p className="text-sm text-red-600">Inactives</p>
            </div>
            <EyeOff className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-700">{stats.featured}</p>
              <p className="text-sm text-yellow-600">En vedette</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Liste des slides */}
      {slides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MonitorPlay className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune slide</h3>
          <p className="text-gray-600 mb-6">Créez votre première slide pour commencer</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Créer ma première slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.sort((a, b) => a.order - b.order).map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
              {/* Preview de la slide */}
              <div className={`relative h-48 bg-gradient-to-r ${slide.bgGradient}`}>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                  <div>
                    <h3 className={`text-lg font-bold ${slide.textColor} mb-1 line-clamp-2`}>
                      {slide.title}
                    </h3>
                    {slide.subtitle && (
                      <p className={`text-sm ${slide.textColor} opacity-90 line-clamp-1`}>
                        {slide.subtitle}
                      </p>
                    )}
                  </div>

                  {slide.image && (
                    <div className="absolute top-2 right-2 w-12 h-12 rounded-lg overflow-hidden bg-white bg-opacity-20 backdrop-blur-sm">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {slide.featured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">
                      ⭐ Vedette
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    slide.active
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {slide.active ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>
              </div>

              {/* Informations et actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      Ordre: {slide.order}
                    </span>
                    {slide.ctaPrimary && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        CTA
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReorder(slide.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Monter"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(slide.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Descendre"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {slide.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {slide.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(slide)}
                    className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>

                  <button
                    onClick={() => toggleActive(slide.id, slide.active)}
                    className={`p-2 rounded-lg transition-colors ${
                      slide.active
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title={slide.active ? 'Désactiver' : 'Activer'}
                  >
                    {slide.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header du modal */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingSlide ? 'Modifier la slide' : 'Nouvelle slide'}
                  </h2>
                  <p className="text-purple-100 mt-1">
                    {editingSlide ? 'Modifiez les informations de la slide' : 'Créez une nouvelle slide pour le carousel'}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
              {/* Contenu principal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonne gauche - Contenu */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MonitorPlay className="w-5 h-5 text-purple-600" />
                    Contenu de la slide
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Titre principal de la slide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Sous-titre (optionnel)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Description détaillée (optionnel)"
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="Image de la slide *"
                      value={formData.image}
                      onChange={(url) => setFormData({...formData, image: url})}
                    />
                  </div>
                </div>

                {/* Colonne droite - Apparence et actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    Apparence et actions
                  </h3>

                  {/* Gradient de fond */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradient de fond
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {gradientOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({...formData, bgGradient: option.value})}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.bgGradient === option.value
                              ? 'border-purple-500 ring-2 ring-purple-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`h-6 w-full rounded mb-1 ${option.preview}`}></div>
                          <span className="text-xs text-gray-600">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Boutons CTA */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bouton principal
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.ctaPrimary}
                          onChange={(e) => setFormData({...formData, ctaPrimary: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Texte du bouton"
                        />
                        <input
                          type="url"
                          value={formData.linkPrimary}
                          onChange={(e) => setFormData({...formData, linkPrimary: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Lien du bouton (optionnel)"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bouton secondaire
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={formData.ctaSecondary}
                          onChange={(e) => setFormData({...formData, ctaSecondary: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Texte du bouton"
                        />
                        <input
                          type="url"
                          value={formData.linkSecondary}
                          onChange={(e) => setFormData({...formData, linkSecondary: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Lien du bouton (optionnel)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Slide active</span>
                        <p className="text-xs text-gray-500">Cette slide sera visible sur le site</p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">En vedette</span>
                        <p className="text-xs text-gray-500">Mettre cette slide en avant</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Aperçu */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Aperçu
                </h3>
                <div className={`relative h-32 rounded-lg overflow-hidden bg-gradient-to-r ${formData.bgGradient}`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 p-4 h-full flex flex-col justify-center">
                    {formData.title && (
                      <h4 className={`text-lg font-bold ${formData.textColor} mb-1`}>
                        {formData.title}
                      </h4>
                    )}
                    {formData.subtitle && (
                      <p className={`text-sm ${formData.textColor} opacity-90`}>
                        {formData.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Enregistrement...' : (editingSlide ? 'Mettre à jour' : 'Créer la slide')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}