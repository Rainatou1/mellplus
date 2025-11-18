"use client";
import Image from "next/image";

import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  RotateCcw, 
  ChevronLeft,
  ChevronRight,
  Check,
  ThumbsUp,
  ThumbsDown,
  User
} from 'lucide-react';

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('noir');
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = {
    id: 1,
    name: 'Smartphone Pro Max 256Go',
    brand: 'TechBrand',
    price: 899,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 245,
    inStock: true,
    stockCount: 12,
    badge: 'Bestseller',
    images: [
      '/images/ordi.jpg',
      '/images/ordi.jpg',
      '/images/ordi.jpg',
      '/images/ordi.jpg'
    ],
    colors: [
      { name: 'noir', value: '#000000' },
      { name: 'blanc', value: '#ffffff' },
      { name: 'bleu', value: '#3B82F6' },
      { name: 'rouge', value: '#EF4444' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      'Écran OLED 6.7 pouces',
      'Processeur A15 Bionic',
      'Triple caméra 48MP',
      'Batterie longue durée',
      '5G ultra-rapide',
      'Résistant à l\'eau IP68'
    ],
    description: `Ce smartphone révolutionnaire combine performance exceptionnelle et design élégant. 
    Doté du processeur A15 Bionic ultra-puissant, il offre une fluidité incomparable pour toutes vos applications. 
    L'écran OLED de 6.7 pouces offre des couleurs éclatantes et une netteté parfaite.`,
    specifications: {
      'Écran': '6.7" OLED Super Retina XDR',
      'Processeur': 'A15 Bionic avec Neural Engine',
      'Stockage': '256Go',
      'RAM': '6Go',
      'Caméra': 'Triple 48MP + 12MP + 12MP',
      'Batterie': '4352 mAh',
      'OS': 'iOS 17',
      'Connectivité': '5G, Wi-Fi 6, Bluetooth 5.3'
    }
  };

  const reviews = [
    {
      id: 1,
      author: 'Marie L.',
      rating: 5,
      date: '15 Janvier 2024',
      title: 'Excellent smartphone !',
      content: 'Très satisfaite de cet achat. La qualité photo est exceptionnelle et la batterie tient toute la journée.',
      helpful: 23,
      verified: true
    },
    {
      id: 2,
      author: 'Pierre M.',
      rating: 4,
      date: '8 Janvier 2024',
      title: 'Bon produit',
      content: 'Smartphone performant, livraison rapide. Seul bémol : le prix un peu élevé mais la qualité est au rendez-vous.',
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      author: 'Sophie D.',
      rating: 5,
      date: '2 Janvier 2024',
      title: 'Je recommande vivement',
      content: 'Interface fluide, appareil photo de qualité professionnelle. Parfait pour mes besoins quotidiens.',
      helpful: 31,
      verified: true
    }
  ];

  const relatedProducts = [
    {
      id: 2,
      name: 'Coque Protection Premium',
      price: 2900,
      image: '/images/ordi.jpg',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Chargeur Sans Fil Rapide',
      price: 4000,
      image: '/images/ordi.jpg',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Écouteurs Bluetooth Pro',
      price: 1500,
      image: '/images/ordi.jpg',
      rating: 4.8
    }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const calculateSavings = () => {
    return product.originalPrice - product.price;
  };

  const calculateDiscountPercentage = () => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="text-sm text-gray-400">
          <span>Accueil</span> / <span>Produits</span> / <span>Électronique</span> / 
          <span className="text-black"> {product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
              <Image
                width={600}
                height={600}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </div>
              )}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{calculateDiscountPercentage()}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-purple-500' : 'border-white/20'
                  }`}
                >
                  <Image
                    width={600}
                    height={600}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-blue-400 font-semibold">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray font-semibold">{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount} avis)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray">{product.price}€</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">{product.originalPrice}€</span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-green-400 font-semibold">
                  Vous économisez {calculateSavings()}F !
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    En stock ({product.stockCount} disponibles)
                  </span>
                </>
              ) : (
                <span className="text-red-400 font-semibold">Rupture de stock</span>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-gray font-semibold mb-3">Couleur : {selectedColor}</h3>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-4 transition-colors ${
                      selectedColor === color.name 
                        ? 'border-purple-500' 
                        : 'border-white/20'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-gray font-semibold mb-3">Taille : {selectedSize}</h3>
              <div className="flex space-x-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedSize === size
                        ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                        : 'border-white/20 bg-white/10 text-gray hover:border-purple-500/50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-gray font-semibold mb-3">Quantité</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 text-gray hover:text-purple-400 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 text-gray font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 text-gray hover:text-purple-400 transition-colors"
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-gray-400">
                  Total: <span className="text-gray font-bold">{product.price * quantity}€</span>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-gradient-to-r from-blue-800 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Ajouter au panier</span>
              </button>
              
              {/*<button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  isWishlisted
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-white/20 bg-white/10 text-gray hover:border-red-500/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>*/}
              
              <button className="p-4 rounded-lg border border-white/20 bg-white/10 text-gray hover:border-purple-500/50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-gray font-semibold mb-4">Caractéristiques principales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <Truck className="w-8 h-8 text-purple-400" />
                <div>
                  <p className="text-gray font-semibold text-sm">Livraison gratuite</p>
                  <p className="text-gray-600 text-xs">Dès 50€ d&apos;achat</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-gray font-semibold text-sm">Garantie 2 ans</p>
                  <p className="text-gray-600 text-xs">Incluse</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
                <RotateCcw className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-gray font-semibold text-sm">Retour 30 jours</p>
                  <p className="text-gray-600 text-xs">Gratuit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-white/20">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-blue-400 bg-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                >
                  {tab === 'description' && 'Description'}
                  {tab === 'specifications' && 'Spécifications'}
                  {tab === 'reviews' && `Avis (${product.reviewCount})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {product.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-gray font-semibold mb-4">Points forts</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-gray font-semibold mb-4">Dans la boîte</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Smartphone {product.name}</li>
                        <li>• Câble USB-C vers Lightning</li>
                        <li>• Documentation</li>
                        <li>• Outil d&apos;éjection SIM</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-700 font-medium">{key}</span>
                      <span className="text-gray font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-8">
                  {/* Reviews Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{product.reviewCount} avis</p>
                    </div>
                    <div className="md:col-span-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-4 mb-2">
                          <span className="text-gray-400 w-8">{stars}★</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-8">
                            {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray font-semibold">{review.author}</span>
                                {review.verified && (
                                  <span className="text-xs bg-green-500 text-gray px-2 py-1 rounded">
                                    Achat vérifié
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-400'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-400 text-sm">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h4 className="text-gray font-semibold mb-2">{review.title}</h4>
                        <p className="text-gray-300 mb-4">{review.content}</p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-gray-400 hover:text-gray transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">Utile ({review.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-400 hover:text-gray transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm">Pas utile</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray mb-8 text-center">
            Produits <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-pink-600">Complémentaires</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <Image
                  width={600}
                  height={600}
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 bg-white">
                  <h3 className="text-gray font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray">{relatedProduct.price}F</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300 ml-1">{relatedProduct.rating}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-800 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;