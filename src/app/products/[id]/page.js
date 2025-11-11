'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  Truck,
  Shield,
  Award,
  Zap,
  Info,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  Minus,
  Clock,
  MapPin,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getCategoryDisplayName } from '@/lib/categoryMapping'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [comments, setComments] = useState([])
  const [commentForm, setCommentForm] = useState({ name: '', content: '' })
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)

      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        setRelatedProducts(data.relatedProducts || [])
      } else if (response.status === 404) {
        router.push('/products')
        toast.error('Produit non trouvé')
      } else {
        throw new Error('Erreur lors du chargement du produit')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors du chargement du produit')
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    if (params.id) {
      fetchProductDetails()
    }
  }, [params.id, fetchProductDetails])

  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice
    return originalPrice * (1 - discount / 100)
  }

  const calculateSavings = (originalPrice, discount) => {
    if (!originalPrice || !discount) return 0
    return originalPrice * (discount / 100)
  }

  const getStockStatus = () => {
    if (!product) return { text: '', color: '' }

    if (product.quantity <= 0 || !product.inStock) {
      return { text: 'RUPTURE DE STOCK', color: 'text-red-600 bg-red-50' }
    } else if (product.quantity <= (product.lowStock || 5)) {
      return { text: 'STOCK LIMITÉ', color: 'text-orange-600 bg-orange-50' }
    } else {
      return { text: 'EN STOCK', color: 'text-green-600 bg-green-50' }
    }
  }

  const handleAddToCart = () => {
    if (!product.inStock || product.quantity <= 0) {
      toast.error('Produit non disponible')
      return
    }
    // Redirect to contact form with product info
    router.push(`/contact?product=${product.id}&quantity=${quantity}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Erreur lors du partage:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Lien copié dans le presse-papiers')
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${params.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id && product) {
      fetchComments()
    }
  }, [params.id, product, fetchComments])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!commentForm.content.trim()) {
      toast.error('Veuillez écrire un commentaire')
      return
    }

    if (commentForm.content.trim().length < 3) {
      toast.error('Le commentaire doit contenir au moins 3 caractères')
      return
    }

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`/api/products/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: commentForm.name.trim() || 'Anonyme',
          content: commentForm.content.trim()
        })
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Commentaire ajouté avec succès')
        setCommentForm({ name: '', content: '' })
        fetchComments()
      } else {
        throw new Error(result.error || 'Erreur lors de l\'ajout du commentaire')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error(error.message || 'Une erreur est survenue')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  // Process images with proper fallbacks
  const getProductImages = () => {
    const allImages = []

    // Add images from the images array if it exists and is valid
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      allImages.push(...product.images.filter(img => img && typeof img === 'string' && img.trim() !== ''))
    }

    // Add main image if it exists and isn't already in the array
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
      if (!allImages.includes(product.image)) {
        allImages.unshift(product.image) // Add to beginning
      }
    }

    // Debug: log the images we found
    console.log('Product images debug:', {
      productImage: product.image,
      productImages: product.images,
      allImages: allImages
    })

    // If no valid images, return a better placeholder URL
    if (allImages.length === 0) {
      return ['https://via.placeholder.com/600x600/f3f4f6/6b7280?text=Pas+d%27image']
    }

    return allImages
  }

  const images = getProductImages()
  const stockStatus = getStockStatus()
  const discountedPrice = product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price
  const savings = product.discount ? calculateSavings(product.price, product.discount) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/products" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft size={16} />
              Produits
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-blue-600"
            >
              {getCategoryDisplayName(product.category)}
            </Link>
            <span>/</span>
            <span className="font-medium text-blue-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={images[selectedImage] || 'https://via.placeholder.com/600x600/f3f4f6/6b7280?text=Pas+d%27image'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority={selectedImage === 0}
                  onError={(e) => {
                    console.log('Image error for:', images[selectedImage])
                    const placeholder = 'https://via.placeholder.com/600x600/f3f4f6/6b7280?text=Pas+d%27image'
                    if (e.target.src !== placeholder) {
                      e.target.src = placeholder
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', images[selectedImage])
                  }}
                />

                {/* Navigation des images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Badge de réduction */}
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{product.discount}%
                  </div>
                )}

                {/* Badge de stock */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${stockStatus.color}`}>
                  {stockStatus.text}
                </div>
              </div>
            </div>

            {/* Miniatures */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image || 'https://via.placeholder.com/80x80/f3f4f6/6b7280?text=Image'}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const placeholder = 'https://via.placeholder.com/80x80/f3f4f6/6b7280?text=Image'
                        if (e.target.src !== placeholder) {
                          e.target.src = placeholder
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide">
                  {getCategoryDisplayName(product.category)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full border transition-all ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              {/* Marque si disponible */}
              {product.brand && (
                <div className="text-gray-600 mb-2">
                  par <span className="font-medium">{product.brand}</span>
                </div>
              )}

              {/* Évaluation si disponible */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews || 0} avis)
                  </span>
                </div>
              )}
            </div>

            {/* Prix */}
            <div className="space-y-2">
              {product.discount ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(discountedPrice)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Vous économisez :</span>
                      <span className="font-bold text-green-600">{formatPrice(savings)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Prix TTC • Livraison non incluse
              </div>
            </div>

            {/* Description courte */}
            <div className="text-gray-700 leading-relaxed">
              {product.description}
            </div>

            {/* Sélecteur de quantité et boutons */}
            <div className="space-y-4">
              {(product.inStock && product.quantity > 0) && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantité :</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.quantity} disponible{product.quantity > 1 ? 's' : ''})
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || product.quantity <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {product.inStock && product.quantity > 0 ? (
                    <>
                      <ShoppingCart size={20} />
                      Demander un devis
                    </>
                  ) : (
                    <>
                      <X size={20} />
                      Non disponible
                    </>
                  )}
                </button>

               {/* <Link
                  href={`/contact?product=${product.id}`}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <MessageSquare size={20} />
                  Contact
                </Link>*/}
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Livraison disponible</div>
                  <div className="text-gray-600">Niamey et environs</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="text-green-600" size={20} />
                <div>
                  <div className="font-medium">Garantie produit</div>
                  <div className="text-gray-600">Selon fabricant</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium">Support technique</div>
                  <div className="text-gray-600">Assistance gratuite</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets de détails */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description', icon: Info },
                { id: 'specifications', label: 'Caractéristiques', icon: Package },
                { id: 'comments', label: 'Commentaires', icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Description détaillée</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.longDescription || product.description || 'Description détaillée non disponible.'}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Caractéristiques techniques</h3>
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">{key} :</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    Caractéristiques techniques non disponibles
                  </div>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                {/* Formulaire de commentaire */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Laisser un commentaire</h3>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom (optionnel)
                      </label>
                      <input
                        type="text"
                        id="comment-name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        placeholder="Votre nom ou laissez vide pour être anonyme"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Si vous ne renseignez pas votre nom, vous apparaîtrez comme "Anonyme"
                      </p>
                    </div>

                    <div>
                      <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-2">
                        Commentaire <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="comment-content"
                        value={commentForm.content}
                        onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                        placeholder="Partagez votre avis sur ce produit..."
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                        minLength={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 3 caractères ({commentForm.content.length}/3)
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingComment || commentForm.content.trim().length < 3}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSubmittingComment ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4" />
                            <span>Publier le commentaire</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Liste des commentaires */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">
                    Commentaires ({comments.length})
                  </h3>

                  {comments.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      Aucun commentaire pour le moment. Soyez le premier à laisser un commentaire !
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {(comment.name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {comment.name || 'Anonyme'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed pl-10">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Composant pour les produits similaires
function RelatedProductCard({ product }) {
  const formatPrice = (price) => {
    if (!price) return 'N/A'
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price))
  }

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice
    return originalPrice * (1 - discount / 100)
  }

  const discountedPrice = product.discount ? calculateDiscountedPrice(product.price, product.discount) : product.price

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.image || 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Produit'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            onError={(e) => {
              const placeholder = 'https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Produit'
              if (e.target.src !== placeholder) {
                e.target.src = placeholder
              }
            }}
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
            {getCategoryDisplayName(product.category)}
          </div>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}