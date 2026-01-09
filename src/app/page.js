"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import FloatingButtons from '@/components/FloatingButtons';

const MellPlusNiger = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [promoProducts, setPromoProducts] = useState([]);
  const [promoLoading, setPromoLoading] = useState(true);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);

  // Slides du carrousel
  const slides = [
    {
      id: 1,
      title: "Votre expert IT basé au Niger",
      subtitle: "Une offre évolutive avec plus de 20ans d'experiences",
      description: "Équipements informatiques professionnels, support technique et solutions sur mesure pour votre entreprise",
      image: "/images/logo.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Nos services",
      bgGradient: "from-gray-300 to-gray-600"
    },
    {
      id: 2,
      title: "Dernières technologies HP",
      subtitle: "HP Pavilion",
      description: "Découvrez la nouvelle gamme HP avec des offres exclusives et un service après-vente premium",
      image: "/images/hp-removebg.png",
      ctaPrimary: "Voir les produits",
      ctaSecondary: "En savoir plus",
      bgGradient: "from-gray-800 to-gray-900"
    },
    {
      id: 3,
      title: "Camera Surveillance",
      subtitle: "Vision de nuit",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de climatisation",
      image: "/images/camera.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Catalogue",
      bgGradient: "from-green-600 to-teal-700"
    },
    {
      id: 4,
      title: "Promotions exceptionnelles",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/hp.png",
      ctaPrimary: "Voir les promos",
      ctaSecondary: "Tous les produits",
      bgGradient: "from-red-600 to-pink-700"
    },
    {
      id: 5,
      title: "Promotion PC portable",
      subtitle: "Une offre évolutive avec plus de 15 000 références",
      description: "Équipements informatiques professionnels, support technique et solutions sur mesure pour votre entreprise",
      image: "/images/hp-removebg.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Nos services",
      bgGradient: "from-pink-600 to-blue-800"
    },
    {
      id: 6,
      title: "Derniere démarque",
      subtitle: "Scanner, Imprimante sharp, HP Pavilion",
      description: "Découvrez la nouvelle gamme de periphériques avec des offres exclusives et un service après-vente premium",
      image: "/images/imprimante.png",
      ctaPrimary: "Voir les produits",
      ctaSecondary: "En savoir plus",
      bgGradient: "from-gray-800 to-black-900"
    },
    {
      id: 7,
      title: "Economisez 10%",
      subtitle: "Arldo",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de climatisation",
      image: "/images/camera.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Catalogue",
      bgGradient: "from-blue-400 to-teal-700"
    },
    {
      id: 8,
      title: "Solde d'été",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/hp-removebg.png",
      ctaPrimary: "Voir les promos",
      ctaSecondary: "Tous les produits",
      bgGradient: "from-purple-600 to-pink-700"
    }
  ];

  // Auto-rotation du carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch promotional products and best sellers
  useEffect(() => {
    fetchPromoProducts();
    fetchBestSellerProducts();
  }, []);

  const fetchPromoProducts = async () => {
    try {
      setPromoLoading(true);
      const response = await fetch('/api/products/promotions?limit=8&sortBy=createdAt');

      if (response.ok) {
        const data = await response.json();
        setPromoProducts(data.products || []);
      } else {
        console.error('Erreur lors du chargement des produits en promotion');
        setPromoProducts([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setPromoProducts([]);
    } finally {
      setPromoLoading(false);
    }
  };

  const fetchBestSellerProducts = async () => {
    try {
      setBestSellerLoading(true);
      const response = await fetch('/api/products/bestsellers?limit=4&sortBy=createdAt&sortOrder=desc');

      if (response.ok) {
        const data = await response.json();
        setBestSellerProducts(data.products || []);
      } else {
        console.error('Erreur lors du chargement des produits best sellers');
        setBestSellerProducts([]);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setBestSellerProducts([]);
    } finally {
      setBestSellerLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Helper functions for promotional products
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-NE', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(price));
  };

  const calculateDiscountedPrice = (originalPrice, discount) => {
    if (!originalPrice || !discount) return originalPrice;
    return originalPrice * (1 - discount / 100);
  };

  const calculateSavings = (originalPrice, discount) => {
    if (!originalPrice || !discount) return 0;
    return originalPrice * (discount / 100);
  };

 

  const partners = [
    { name: 'Microsoft', logo: '/images/logiciel.jpg' },
    { name: 'Samsung', logo: '/images/logiciel.jpg'  },
    { name: 'HP', logo: '/images/logiciel.jpg'  },
    { name: 'Intel', logo: '/images/logiciel.jpg'  },
    { name: 'Lenovo', logo: '/images/logiciel.jpg'  },
    { name: 'Apple', logo: '/images/logiciel.jpg'  }
  ];

  const advantages = [
    {
      icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />,
      title: "Équipe dédiée",
      description: "Conseillers experts pour les professionnels"
    },
    {
      icon: <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-600" />,
      title: "Disponibilité",
      description: "Plus de 15 000 références en ligne"
    },
    {
      icon: <Truck className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />,
      title: "Livraison rapide",
      description: "24h/48h sur Niamey et environs"
    },
    {
      icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />,
      title: "Garantie",
      description: "Service après-vente professionnel"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/*<div className="max-w-7xl mx-auto px-4 bg-blue-300">
        
      </div>*/}
      {/*<div className="pt-2 md:pt-6 "></div>*/}

      {/* Hero Carousel avec bandes latérales */}
      <section className="relative flex flex-col lg:flex-row gap-4 md:gap-6 py-4 md:py-6">
        {/* Bande gauche */}
        <div className="w-full lg:w-1/5 h-32 md:h-40 lg:h-[540px] bg-white rounded-lg border-1 shadow gap-3 flex-shrink-0 relative overflow-hidden">
          <Image
            src="/images/large1.jpg"
            alt="Offres spéciales"
            width={300}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3 md:p-4">
            <Link href="/promotions"><h3 className="text-white font-bold text-sm md:text-base mb-1">Offres Spéciales</h3>
            <p className="text-white/90 text-xs md:text-sm">Jusqu&apos;à -50%</p></Link>
          </div>
        </div>

        {/* Carrousel principal */}
        <div className="w-full lg:flex-1 h-[500px] md:h-[520px] lg:h-[540px] relative overflow-hidden rounded-lg">
          {/* Slides */}
          <div className="relative h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide ? 'translate-x-0' :
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className={`h-full bg-gradient-to-r ${slide.bgGradient} text-white`}>
                <div className="px-4 h-full">
                  <div className="grid lg:grid-cols-2 gap-1 md:gap-4 items-center h-full py-8 md:py-16">
                    <div className="text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center lg:pr-4">
                      <h2 className="text-lg md:text-2xl lg:text-4xl xl:text-5xl font-bold mb-0 md:mb-4 leading-tight h-[3.5rem] md:h-[5.5rem] lg:h-[7rem] overflow-hidden flex items-center justify-center lg:justify-start">
                        <span className="line-clamp-1">{slide.title}</span>
                      </h2>
                      <p className="text-base md:text-xl lg:text-2xl mb-0 md:mb-4 font-medium text-blue-100 h-[3rem] md:h-[4rem] overflow-hidden flex items-center justify-center lg:justify-start">
                        <span className="line-clamp-1">{slide.subtitle}</span>
                      </p>
                      <p className="text-sm md:text-lg mb-3 md:mb-8 text-blue-50 leading-relaxed h-[3rem] md:h-[4.5rem] lg:h-[5rem] overflow-hidden">
                        <span className="line-clamp-2 md:line-clamp-3">{slide.description}</span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center lg:justify-start">
                        <Link href="/contact" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-md md:rounded-lg text-sm md:text-base font-semibold hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap">
                          {slide.ctaPrimary}
                        </button>
                        </Link>
                        <button className="w-full sm:w-auto border-2 border-white text-white px-4 md:px-6 py-2 md:py-3 rounded-md md:rounded-lg text-sm md:text-base font-semibold hover:bg-white hover:text-gray-800 transition-colors whitespace-nowrap">
                          {slide.ctaSecondary}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center order-1 lg:order-2">
                      <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 lg:w-68 lg:h-68">
                        <Image
                          width={256}
                          height={256}
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-contain rounded-lg transform hover:scale-105 transition-transform duration-300"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 border-white border-1 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full transition-all z-20"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 border-white border-1 hover:bg-white hover:text-black text-white p-2 md:p-3 rounded-full transition-all z-20"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue bg-opacity-20">
            <div
              className="h-full bg-blue transition-all duration-100 ease-linear"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Bande droite */}
        <div className="w-full lg:w-1/5 h-32 md:h-40 lg:h-[540px] rounded-lg border-1 flex-shrink-0 relative overflow-hidden">
          <Image
            src="/images/accessories.jpg"
            alt="Nouveautés"
            width={300}
            height={500}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent flex flex-col justify-end p-3 md:p-4">
            <Link href="/seconde-vie"><h3 className="text-white font-bold text-sm md:text-base mb-1">Nouveautés</h3>
            <p className="text-white/90 text-xs md:text-sm">Découvrez-les</p></Link>
          </div>
        </div>
      {/*<div className="pt-2 md:pt-5"></div>*/}
      </section>
      {/*<section>      <div className="pt-2 md:pt-6"></div>
</section>*/}

      
     

      <div className="max-w-7xl mx-auto px-4">

        {/* Advantages Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6 md:mb-8">Les avantages Mell Plus Niger</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center p-4 md:p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3 md:mb-4">
                  {advantage.icon}
                </div>
                <h4 className="font-semibold text-gray-800 text-base md:text-lg mb-2">{advantage.title}</h4>
                <p className="text-sm md:text-base text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
          </div>
        </section>

        {/* Featured Products with Banners */}
        <div className="py-8 md:py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:px-4">
            {/* Left Banners - Hidden on small screens */}
            <div className="hidden lg:block lg:w-1/4 space-y-4">
              {/* Services Banner */}
              {/*<div className="bg-gradient-to-br from-red-600 to-red-800 p-4 text-white text-center ">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="text-lg font-bold mb-2">Nos Services</h3>
                <p className="text-xs opacity-90 mb-3">Installation & Maintenance</p>
                <div className="space-y-2 text-xs">
                  <div>✓ Installation réseau</div>
                  <div>✓ Developpement logiciel</div>
                  <div>✓ Support technique</div>
                </div>
                <Link href="/services" className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                  Découvrir
                </Link>
              </div>*/}
              {/* Seconde Vie Info Banner */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-200 p-4 text-gray text-center rounded-lg shadow-lg">
              <div className="text-3xl mb-2">♻️</div>
              <h3 className="text-lg font-bold mb-2">Seconde Vie</h3>
              <p className="text-xs opacity-90 mb-3">Produits reconditionnés durables</p>
              <div className="space-y-2 text-xs">
                <div>✓ Garantie qualité</div>
                <div>✓ Prix avantageux</div>
                <div>✓ Contrôle technique complet</div>
              </div>
              <div className="mt-3 bg-white text-blue-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block cursor-pointer">
                Découvrir maintenant
              </div>
            </div>

              {/* Offre speciale Banner */}
              <div className=" p-4 text-blue border-2 border-gray-300 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="text-lg font-bold mb-2">Offres Spéciales</h3>
                <p className="text-xs opacity-90 mb-3">Entreprises & Particuliers</p>
                <div className="space-y-2 text-xs">
                  <div>✓ Remises en volume</div>
                  <div>✓ Devis gratuit</div>
                  <div>✓ Garantie étendue</div>
                </div>
                <Link href="/contact" className="mt-3 bg-white text-blue-600 border-blue-500 border-1 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-colors inline-block">
                  Demander
                </Link>
              </div>
            </div>
            

            {/* Featured Products Section */}
            <section className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 px-4 lg:px-0">
                <div>
                  <h3 className="text-xl text-gray-800 md:text-2xl font-bold mb-2">🏆 Produits en vedette</h3>
                  <p className="text-gray-600 text-sm md:text-base">Nos produits les plus populaires</p>
                </div>
                <Link href="/bestsellers" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Voir plus →
                </Link>
              </div>
          {bestSellerLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 lg:px-0">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                  <div className="h-40 md:h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : bestSellerProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 px-4 lg:px-0">
              {bestSellerProducts.map((product) => (
                <div key={product.id} className="bg-white border-1 border-gray-300 shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative">
                    <Image
                      src={product.image || '/images/ordi.jpg'}
                      alt={product.name}
                      width={300}
                      height={200}
                      unoptimized
                      className="w-full h-40 md:h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/ordi.jpg'
                      }}
                    />
                    {/* Best Seller Badge */}
                    <span className="absolute top-2 left-2 text-white px-2 py-1 rounded text-xs md:text-sm font-bold">
                      🏆
                    </span>
                    {/* Stock Status */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      product.quantity <= 0 || !product.inStock
                        ? 'text-red-600 bg-red-50'
                        : product.quantity <= (product.lowStock || 5)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-green-600 bg-green-50'
                    }`}>
                      {product.quantity <= 0 || !product.inStock
                        ? 'RUPTURE'
                        : product.quantity <= (product.lowStock || 5)
                        ? 'LIMITÉ'
                        : 'EN STOCK'
                      }
                    </div>
                  </div>
                  <div className="p-3 md:p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold mb-2 text-gray-900 text-sm md:text-base h-8 md:h-12 overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>{product.name}</h3>

                    {/* Category */}
                    {/*<div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
                      {product.category}
                    </div>*/}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        {product.discount ? (
                          <>
                            <span className="text-lg md:text-lg font-bold text-red-600">
                              {formatPrice(product.price * (1 - product.discount / 100))}
                            </span>
                            <div className="text-xs md:text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </div>
                          </>
                        ) : (
                          <span className="text-lg md:text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Détails
                      </Link>
                      {(product.quantity > 0 && product.inStock) ? (
                        <Link
                          href="/devis"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          {/*<ShoppingCart className="w-4 h-4" />*/}
                          Devis
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          Épuisé
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center mx-4 lg:mx-0">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit vedette pour le moment</h3>
              <p className="text-gray-600">Les produits best sellers apparaîtront bientôt ici !</p>
            </div>
          )}
            </section>
          </div>
          </div>
        </div>

      {/* Promotions Section with Banner */}
      <div className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:px-4">
            {/* Left Banner - Hidden on small screens */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-gradient-to-br from-blue-200 to-blue-800 rounded-lg p-6 text-white h-full min-h-[500px] flex flex-col justify-center items-center text-center shadow-lg">
                <div className="mb-4">
                  <div className="text-4xl mb-2">🏪</div>
                  <h3 className="text-xl font-bold mb-2">Mell Plus Niger</h3>
                  <p className="text-sm opacity-90 mb-4">Votre partenaire IT de confiance</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Plus de 20 ans sur le marché</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Support technique expert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Reponse sous 12h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Garantie</span>
                  </div>
                </div>
                <Link href="/contact" className="mt-6 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Nous contacter
                </Link>
              </div>
            </div>

            {/* Promotions Section */}
            <section className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 px-4 lg:px-0">
                <div>
                  <h3 className="text-xl md:text-2xl text-gray-800 font-bold mb-2">🔥 Promotions</h3>
                  <p className="text-gray-600 text-sm md:text-base">Ne ratez pas nos offres exceptionnelles</p>
                </div>
                <Link
                  href="/promotions"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  Voir plus →
                </Link>
              </div>
              {promoLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 lg:px-0">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : promoProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-4 px-4 lg:px-0">
              {promoProducts.map((product) => (
                <div key={product.id} className="bg-white shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group border-1 border-gray-300 relative flex flex-col">
                  {/* Badge de réduction */}
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Image du produit */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={product.image || '/images/ordi.jpg'}
                      alt={product.name}
                      width={300}
                      height={200}
                      unoptimized
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Badge de stock */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                      product.quantity <= 0 || !product.inStock
                        ? 'text-red-600 bg-red-50'
                        : product.quantity <= (product.lowStock || 5)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-green-600 bg-green-50'
                    }`}>
                      {product.quantity <= 0 || !product.inStock
                        ? 'RUPTURE'
                        : product.quantity <= (product.lowStock || 5)
                        ? 'LIMITÉ'
                        : 'EN STOCK'
                      }
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Catégorie */}
                    {/*<div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
                      {product.category}
                    </div>*/}

                    {/* Nom du produit */}
                    <h3 className="font-bold text-gray-900 mb-2 h-8 overflow-hidden group-hover:text-red-600 transition-colors" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </h3>

                    {/* Économies réalisées */}
                    <div className="min-h-[2.5rem]">
                    {product.discount && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-1 mb-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Économie :</span>
                          <span className="font-bold text-green-600">{formatPrice(calculateSavings(product.price, product.discount))}</span>
                        </div>
                      </div>
                    )}
                    </div>

                    {/* Prix */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1">
                        {product.discount ? (
                          <>
                            <div className="text-lg font-bold text-red-600">
                              {formatPrice(calculateDiscountedPrice(product.price, product.discount))}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </div>
                          </>
                        ) : (
                          <div className="text-xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                      >
                        Détails
                      </Link>
                      {(product.quantity > 0 && product.inStock) ? (
                        <Link
                          href={`/contact?product=${product.id}`}
                          className="bg-gradient-to-r hover:from-red-600 hover:to-pink-600 hover:text-white text-blue-500 border-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 shadow-md"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Profiter
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                        >
                          Épuisé
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center mx-4 lg:mx-0">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune promotion en cours</h3>
                  <p className="text-gray-600">Revenez bientôt pour découvrir nos prochaines offres !</p>
                </div>
              )}
            </section>
          </div>
          </div>
        </div>

      {/* À Découvrir Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl text-gray-800 font-bold mb-2">DÉCOUVRIR</h3>
            <p className="text-gray-600 text-sm md:text-base">Offres exceptionnelles, qualité</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Seconde vie */}
            <div className="md:col-span-1 lg:col-span-1 relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-gray-400 to-gray-600 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/large1.jpg" 
                  alt="Seconde vie - Reconditionnement"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Seconde vie</h4>
                    <p className="text-sm opacity-90">Produits reconditionnés et durables</p>
                  </div>
                  <Link href="/seconde-vie">
                    <button className="border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-300 transition-all w-fit">
                      VOIR ›
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* best sellers */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-500 to-cyan-600 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/ordi.jpg" 
                  alt="Gaming - Équipements gaming"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Best sellers</h4>
                    <p className="text-sm opacity-90">PC et accessoires</p>
                  </div>
                  <Link href="/bestsellers">
                  <button className="border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-300 transition-all w-fit">
                    VOIR ›
                  </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Nos accessoires */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-500 to-cyan-600 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/accessories.jpg" 
                  alt="Nos créateurs - Solutions créatives"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Accessoires</h4>
                    <p className="text-sm opacity-90">Offrez vous ce qu&apos;il y a de meilleur</p>
                  </div>
                  <Link href="/products/category/accessoires">
                    <button className="border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-300 transition-all w-fit">
                      VOIR ›
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="md:col-span-1 lg:col-span-2 relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-blue-300 relative">
                <Image
                  width={900}
                  height={600} 
                  src="/images/services.jpg" 
                  alt="Services - services"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold mb-2">Nos services</h4>
                    <p className="text-sm md:text-base opacity-90">Solutions sur mesures pour vos entreprises</p>
                  </div>
                  <Link href="/service">
                  <button className=" bg-opacity-20 border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-300 transition-all w-fit">
                    VOIR ›
                  </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Soldes */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3  bg-cyan-400 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/bags.png" 
                  alt="Solutions Business - Entreprises"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Nos soldes</h4>
                    <p className="text-sm opacity-90">Équipements professionnels pour vous</p>
                  </div>
                  <Link href="/promotions"> 
                  <button className="border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-300 transition-all w-fit">
                    VOIR ›
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Partners Section */}{/*
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Nos partenaires</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="flex justify-center">
                <Image 
                  width={500}
                  height={600}
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-10 md:h-16 object-contain hover:grayscale transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-slate-900 text-white rounded-lg">
        <div className="max-w-7xl mx-auto px-4 text-center ">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Besoin d&apos;un devis personnalisé ?</h3>
          <p className="text-lg md:text-xl mb-6 md:mb-8">
            Un conseiller Mell Plus Niger vous répond dans les 12h !
          </p>
          <Link href= "/devis">
          <button className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700">
            JE DEMANDE UN DEVIS
          </button>
          </Link>
        </div>
      </section>
        <div className="py-4 md:py-4"></div>
      </div>

      {/* Floating Buttons */}
      <FloatingButtons />
    </div>
  );
};

export default MellPlusNiger;