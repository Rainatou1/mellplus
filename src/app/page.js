"use client";
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';

const MellPlusNiger = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides du carrousel
  const slides = [
    {
      id: 1,
      title: "Votre expert IT basé au Niger",
      subtitle: "Une offre évolutive avec plus de 15 000 références",
      description: "Équipements informatiques professionnels, support technique et solutions sur mesure pour votre entreprise",
      image: "/images/hp-removebg.png",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Nos services",
      bgGradient: "from-blue-600 to-blue-800"
    },
    {
      id: 2,
      title: "Dernières technologies HP",
      subtitle: "iPhone 15, MacBook Pro, HP Pavilion",
      description: "Découvrez la nouvelle gamme HP avec des offres exclusives et un service après-vente premium",
      image: "/images/carroussel.PNG",
      ctaPrimary: "Voir les produits",
      ctaSecondary: "En savoir plus",
      bgGradient: "from-gray-800 to-gray-900"
    },
    {
      id: 3,
      title: "Camera Surveillance",
      subtitle: "Arldo",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de climatisation",
      image: "/images/carroussel.PNG",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Voir catalogue",
      bgGradient: "from-green-600 to-teal-700"
    },
    {
      id: 4,
      title: "Promotions exceptionnelles",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/carroussel.PNG",
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
      title: "dernieres demarque",
      subtitle: "iPhone 15, MacBook Pro, HP Pavilion",
      description: "Découvrez la nouvelle gamme HP avec des offres exclusives et un service après-vente premium",
      image: "/images/carroussel.PNG",
      ctaPrimary: "Voir les produits",
      ctaSecondary: "En savoir plus",
      bgGradient: "from-gray-800 to-black-900"
    },
    {
      id: 7,
      title: "economisez 10%",
      subtitle: "Arldo",
      description: "Installation professionnelle, maintenance et garantie étendue pour tous vos besoins de climatisation",
      image: "/images/carroussel.PNG",
      ctaPrimary: "Demander un devis",
      ctaSecondary: "Voir catalogue",
      bgGradient: "from-blue-600 to-teal-700"
    },
    {
      id: 8,
      title: "solde d'été",
      subtitle: "Jusqu'à -30% sur une sélection",
      description: "Profitez de nos offres limitées sur les ordinateurs portables, smartphones et équipements bureautiques",
      image: "/images/carroussel.PNG",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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

  const featuredProducts = [
    {
      id: 1,
      name: "PC Portable HP ProBook 450",
      price: "450 000",
      originalPrice: "520 000",
      image: "/images/ordi.jpg",
      badge: "Promo"
    },
    {
      id: 2,
      name: "iPhone 15 Pro 128GB",
      price: "980 000",
      image: "/images/ordi.jpg",
      badge: "Nouveau"
    },
    {
      id: 3,
      name: "Climatiseur Samsung 12000 BTU",
      price: "380 000",
      image: "/images/ordi.jpg",
      badge: "Best Seller"
    },
    {
      id: 4,
      name: "Imprimante HP LaserJet Pro",
      price: "220 000",
      image: "/images/ordi.jpg",
      badge: ""
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">      
      {/* Hero Carousel */}
      <section className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden">
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
                <div className="max-w-7xl mx-auto px-4 h-full">
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center h-full py-8 md:py-16">
                    <div className="text-center lg:text-left order-2 lg:order-1">
                      <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl lg:text-2xl mb-4 font-medium text-blue-100">
                        {slide.subtitle}
                      </p>
                      <p className="text-base md:text-lg mb-6 md:mb-8 text-blue-50 leading-relaxed">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/contact">
                        <button className="bg-white text-gray-800 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                          {slide.ctaPrimary}
                        </button>
                        </Link>
                        <button className="border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors">
                          {slide.ctaSecondary}
                        </button>
                      </div>
                    </div>
                    <div className="text-center order-1 lg:order-2">
                      <Image 
                        width={600}
                        height={450}
                        src={slide.image}
                        alt={slide.title}
                        className="w-full max-w-md lg:max-w-full mx-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
                        priority={index === 0}
                      />
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
          className="absolute left-4 top-1/2 transform -translate-y-1/2 border-white border-1 hover:bg-white  hover:text-black text-white p-2 md:p-3 rounded-full transition-all z-20 backdrop-blur-sm"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 border-white border-1 hover:bg-white  hover:text-black text-white p-2 md:p-3 rounded-full transition-all z-20 backdrop-blur-sm"
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
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ 
              width: `${((currentSlide + 1) / slides.length) * 100}%` 
            }}
          />
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Les avantages Mell Plus Niger</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center p-4 md:p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3 md:mb-4">
                  {advantage.icon}
                </div>
                <h4 className="font-semibold text-base md:text-lg mb-2">{advantage.title}</h4>
                <p className="text-sm md:text-base text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-4 sm:mb-0">Produits en vedette</h3>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
              Voir tous les produits →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    width={500}
                    height={500} 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-40 md:h-48 object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h4 className="font-semibold mb-2 text-sm md:text-base overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{product.name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <span className="text-lg md:text-xl font-bold text-gray">{product.price} FCFA</span>
                      {product.originalPrice && (
                        <div className="text-xs md:text-sm text-gray-500 line-through">
                          {product.originalPrice} FCFA
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À Découvrir Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-2">DÉCOUVRIR</h3>
            <p className="text-gray-600 text-sm md:text-base">Conseils, inspirations, innovations</p>
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
                  <button className="bg-black bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all w-fit">
                    VOIR ›
                  </button>
                </div>
              </div>
            </div>

            {/* Gaming */}
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
                  <button className="bg-black bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all w-fit">
                    VOIR ›
                  </button>
                </div>
              </div>
            </div>

            {/* Nos créateurs */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-500 to-cyan-600 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/large1.jpg" 
                  alt="Nos créateurs - Solutions créatives"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Nos créateurs</h4>
                    <p className="text-sm opacity-90">Outils pour créatifs et designers</p>
                  </div>
                  <button className="bg-black bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all w-fit">
                    VOIR ›
                  </button>
                </div>
              </div>
            </div>

            {/* S'équiper IA - Large card bottom */}
            <div className="md:col-span-1 lg:col-span-2 relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-500 to-cyan-600 relative">
                <Image
                  width={900}
                  height={600} 
                  src="/images/large2.jpg" 
                  alt="S'équiper IA - Intelligence Artificielle"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold mb-2">S&apos;équiper IA</h4>
                    <p className="text-sm md:text-base opacity-90">Solutions d&apos;Intelligence Artificielle pour entreprises</p>
                  </div>
                  <button className="bg-black bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all w-fit">
                    VOIR ›
                  </button>
                </div>
              </div>
            </div>

            {/* Solutions Business */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-500 to-cyan-600 relative">
                <Image
                  width={600}
                  height={600} 
                  src="/images/sony.png" 
                  alt="Solutions Business - Entreprises"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/*<div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>*/}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold mb-2">Solutions Business</h4>
                    <p className="text-sm opacity-90">Équipements professionnels sur mesure</p>
                  </div>
                  <button className="bg-purple bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-all w-fit">
                    VOIR ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Partners Section */}
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
                  className="h-10 md:h-16 object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Besoin d&apos;un devis personnalisé ?</h3>
          <p className="text-lg md:text-xl mb-6 md:mb-8">
            Un conseiller Mell Plus Niger vous répond dans les 48h !
          </p>
          <Link href= "/devis">
          <button className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700">
            JE DEMANDE UN DEVIS
          </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MellPlusNiger;