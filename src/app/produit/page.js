"use client";
import Link from 'next/link'
import Image from "next/image";

import React, { useState } from 'react';
import { Search, Filter, Star, ShoppingCart, Eye, Heart, ChevronDown } from 'lucide-react';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    { id: 'all', name: 'Tous les produits', count: 24 },
    { id: 'electronics', name: 'Électronique', count: 8 },
    { id: 'fashion', name: 'Mode', count: 6 },
    { id: 'home', name: 'Maison', count: 5 },
    { id: 'sports', name: 'Sport', count: 5 }
  ];

  const products = [
    {
      id: 1,
      name: 'Smartphone Pro Max',
      category: 'electronics',
      price: 899,
      originalPrice: 999,
      rating: 4.8,
      reviews: 245,
      Image: "/images/carroussel.PNG",
      badge: 'Bestseller',
      inStock: true
    },
    {
      id: 2,
      name: 'Casque Audio Premium',
      category: 'electronics',
      price: 299,
      rating: 4.6,
      reviews: 189,
      Image: "/images/carroussel.PNG",
      badge: 'Nouveau',
      inStock: true
    },
    {
      id: 3,
      name: 'Veste en Cuir Élégante',
      category: 'fashion',
      price: 249,
      originalPrice: 349,
      rating: 4.7,
      reviews: 156,
      Image: "/images/carroussel.PNG",
      badge: 'Promo',
      inStock: true
    },
    {
      id: 4,
      name: 'Montre Connectée Sport',
      category: 'sports',
      price: 199,
      rating: 4.5,
      reviews: 302,
      Image: "/images/carroussel.PNG",
      inStock: true
    },
    {
      id: 5,
      name: 'Lampe Design Moderne',
      category: 'home',
      price: 159,
      rating: 4.9,
      reviews: 87,
      Image: "/images/carroussel.PNG",
      badge: 'Top Rated',
      inStock: false
    },
    {
      id: 6,
      name: 'Sneakers Premium',
      category: 'fashion',
      price: 179,
      rating: 4.4,
      reviews: 234,
      Image: "/images/carroussel.PNG",
      inStock: true
    },
    {
      id: 7,
      name: 'Tablette Graphique Pro',
      category: 'electronics',
      price: 399,
      rating: 4.7,
      reviews: 123,
      Image: "/images/carroussel.PNG",
      badge: 'Pro',
      inStock: true
    },
    {
      id: 8,
      name: 'Chaise Ergonomique',
      category: 'home',
      price: 329,
      originalPrice: 399,
      rating: 4.6,
      reviews: 167,
      Image: "/images/carroussel.PNG",
      inStock: true
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'under200' && product.price < 200) ||
      (priceRange === '200to400' && product.price >= 200 && product.price <= 400) ||
      (priceRange === 'over400' && product.price > 400);
    
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      default: return a.name.localeCompare(b.name);
    }
  });

  const getBadgeColor = (badge) => {
    switch(badge) {
      case 'Bestseller': return 'bg-yellow-500';
      case 'Nouveau': return 'bg-green-500';
      case 'Promo': return 'bg-red-500';
      case 'Top Rated': return 'bg-purple-500';
      case 'Pro': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Produits</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre sélection premium de produits soigneusement choisis pour leur qualité exceptionnelle
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-slate-800">
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Price Filter */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">Tous les prix</option>
                <option value="under200" className="bg-slate-800">Moins de 200€</option>
                <option value="200to400" className="bg-slate-800">200€ - 400€</option>
                <option value="over400" className="bg-slate-800">Plus de 400€</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                <option value="name" className="bg-slate-800">Trier par nom</option>
                <option value="price-low" className="bg-slate-800">Prix croissant</option>
                <option value="price-high" className="bg-slate-800">Prix décroissant</option>
                <option value="rating" className="bg-slate-800">Meilleures notes</option>
                <option value="reviews" className="bg-slate-800">Plus d&apos;avis</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-8">
          <p className="text-gray-300 text-center">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group relative bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  width={600}
                  height={600}
                  src={product.Image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${getBadgeColor(product.badge)}`}>
                    {product.badge}
                  </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-white font-semibold bg-red-500 px-4 py-2 rounded-lg">
                      Rupture de stock
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                  <Link href="/detailProduit">
                        <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <Eye className="w-5 h-5" />
                        </button>
                  </Link>
                  <Link href="/detailProduit">
                  <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300 ml-2">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-white">
                      {product.price}€
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {product.originalPrice}€
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.inStock
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.inStock ? 'Ajouter au panier' : 'Indisponible'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Restez informé de nos nouveautés
          </h3>
          <p className="text-gray-300 mb-8">
            Inscrivez-vous à notre newsletter pour être le premier à découvrir nos nouveaux produits
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              S&apos;inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;