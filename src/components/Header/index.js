"use client";
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import SearchBar from '../SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
 const categoriy = [
    { name: 'Informatique', subcategories: ['Ordinateurs Portables', 'Ordinateurs de Bureau', 'Accéssoires', 'Logiciels'] },
    { name: 'Sécurité', subcategories: ['Videosurveillance', 'Incendie', 'Controle Accès'] },
    { name: 'Reseau&Serveur', subcategories: ['Switch', 'Telephone IP'] },
    { name: 'Peripheriques', subcategories: ['Imprimantes', 'Scanners', 'Composants'] },
    { name: 'Connectiques', subcategories: ['Cables', 'Multiprise', 'Fournitures'] },
    { name: 'Accessoires', subcategories: ['Image', 'Son', 'Fournitures'] },
    { name: 'Services', subcategories: ['Developpement Web et mobile', 'Maintenance informatique', 'Conseils expert'] }
  ];  
  // Mapping des catégories de l'interface vers la base de données
  const categoryMapping = {
    'Informatique': 'INFORMATIQUE',
    'Sécurité': 'SECURITE', 
    'Reseau&Serveur': 'RESEAU',
    'Peripheriques': 'BUREAUTIQUE',
    'Connectiques': 'ACCESSOIRES',
    'Accessoires': 'ACCESSOIRES'
  }

  const categories = [
  {
    name: 'Informatique',
    dbCategory: 'INFORMATIQUE',
    subcategories: [
      { name: 'Ordinateurs Portables', subcategory: 'Portables' },
      { name: 'Ordinateurs de Bureau', subcategory: 'Bureau' },
      { name: 'Accessoires', subcategory: 'Accessoires' },
      { name: 'Logiciels', subcategory: 'Logiciels' }
    ]
  },
  {
    name: 'Sécurité',
    dbCategory: 'SECURITE',
    subcategories: [
      { name: 'Videosurveillance', subcategory: 'Videosurveillance' },
      { name: 'Incendie', subcategory: 'Incendie' },
      { name: 'Controle d\'accès', subcategory: 'Controle d\'accès' }
    ]
  },
  {
    name: 'Reseau&Serveur',
    dbCategory: 'RESEAU',
    subcategories: [
      { name: 'Switch', subcategory: 'Switch' },
      { name: 'Telephone IP', subcategory: 'Telephone IP' },
      { name: 'Serveurs', subcategory: 'Serveurs' }
    ]
  },
  {
    name: 'Peripheriques',
    dbCategory: 'BUREAUTIQUE',
    subcategories: [
      { name: 'Imprimantes', subcategory: 'Imprimantes' },
      { name: 'Scanners', subcategory: 'Scanners' },
      { name: 'Composants', subcategory: 'Composants' }
    ]
  },
  {
    name: 'Connectiques',
    dbCategory: 'ACCESSOIRES',
    subcategories: [
      { name: 'Cables', subcategory: 'Cables' },
      { name: 'Multiprise', subcategory: 'Multiprise' },
      { name: 'Fournitures', subcategory: 'Fournitures' }
    ]
  },
  {
    name: 'Accessoires',
    dbCategory: 'ACCESSOIRES',
    subcategories: [
      {
        name: 'Video',
        subcategory: 'Video',
        subSubcategories: [
          { name: 'Appareil photo', subcategory: 'Appareil photo' },
          { name: 'Videomaker', subcategory: 'Videomaker' },
          { name: 'Webcam', subcategory: 'Webcam' }
        ]
      },
      {
        name: 'Son',
        subcategory: 'Son',
        subSubcategories: [
          { name: 'Casque audio', subcategory: 'Casque audio' },
          { name: 'micro', subcategory: 'micro' },
          { name: 'micro cravate', subcategory: 'micro cravate' }
        ]
      },
      { name: 'Audio', subcategory: 'Audio' },
      { name: 'Stockage', subcategory: 'Stockage' },
      { name: 'Divers', subcategory: 'Divers' }
    ]
  }
];

  return (
    <div>
            {/* Header Top - Hidden on mobile */}

    <div className="hidden lg:block bg-gray-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">+227 20 35 23 23</span>
              <span className="xl:hidden">+227 20 35 23 23</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">mellplus@mellplusniger.com</span>
              <span className="xl:hidden">mell@mell...</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Niamey, Niger</span>
            </div>
          </div>
          <div className="hidden xl:flex items-center space-x-4">
            <span>Lun-Ven: 8h-18h | Sam: 8h-16h</span>
          </div>
        </div>
      </div>
            {/* Main Header */}

    <header className="bg-blue-400 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 md:py-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/#">
              <div className="bg-blue-400 text-white p-1 md:p-2 rounded-lg mr-2 md:mr-3">
                <Image
                width={900}
                height={900}
                src="/images/logo.png"
                alt="logo" 
                className="w-12 h-12 md:w-28 md:h-19" />
              </div>
              </Link>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">Mell Plus Niger</h1>
                <p className="text-xs md:text-sm text-white hidden sm:block">Votre partenaire IT au Niger</p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8 bg-white rounded-lg">
              <SearchBar />
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account - Hidden on mobile */}{/* 
              <button className="hidden lg:flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                <User className="w-5 h-5 lg:w-6 lg:h-6" />
                <span className="hidden xl:inline">Mon Compte</span>
              </button>*/}

              {/* Promotions Button */}
              <Link 
                href="/promotions"
                className="flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 md:px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-semibold">PROMOS</span>
                <span className="hidden sm:inline text-yellow-200">🔥</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-3">
              <SearchBar isMobile={true} onClose={() => setIsMobileSearchOpen(false)} />
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-blue-100 relative">
            <div className="flex items-center space-x-4 lg:space-x-8 py-2 ">
              <Link href="/#" className="text-gray-600 hover:text-white py-2 whitespace-nowrap">Acceuil</Link>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center space-x-1 text-white hover:text-gray-200 py-2 whitespace-nowrap">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border rounded-lg p-4 min-w-48 z-40 transform translate-y-1">
                      {/* Lien vers toute la catégorie */}
                      <Link
                        href={`/products?category=${category.dbCategory}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-medium border-b mb-2"
                      >
                        Voir tous les {category.name}
                      </Link>
                      {/* Liens vers les sous-catégories */}
                      {category.subcategories.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="relative"
                          onMouseEnter={() => setActiveSubcategory(subIndex)}
                          onMouseLeave={() => setActiveSubcategory(null)}
                        >
                          <Link
                            href={`/products?category=${category.dbCategory}&subcategory=${sub.subcategory}`}
                            className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          >
                            {sub.name}
                            {sub.subSubcategories && <ChevronDown className="w-4 h-4 rotate-[-90deg]" />}
                          </Link>

                          {/* Sub-subcategories dropdown */}
                          {sub.subSubcategories && activeSubcategory === subIndex && (
                            <div className="absolute left-full top-0 ml-2 bg-white shadow-xl border rounded-lg p-3 min-w-44 z-50">
                              {sub.subSubcategories.map((subSub, subSubIndex) => (
                                <Link
                                  key={subSubIndex}
                                  href={`/products?category=${category.dbCategory}&subcategory=${subSub.subcategory}`}
                                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors text-sm"
                                >
                                  {subSub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {/*<Link href="/products" className="text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">Produits</Link>
              <Link href="/promotions" className="text-red-600 hover:text-red-700 py-2 font-semibold whitespace-nowrap flex items-center gap-1">
                🔥 Promotions
              </Link>*/}
              <a href="/service" className="text-white hover:text-gray-200 py-2 whitespace-nowrap">Services</a>
              <Link href="/contact" className="text-white hover:text-gray-200 py-2 whitespace-nowrap">Contact</Link>
              <a href="/about" className="text-white hover:text-gray-200 py-2 whitespace-nowrap">A propos</a>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden border-t border-blue-100 py-3">
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index}>
                    <button 
                      onClick={() => setActiveCategory(activeCategory === index ? null : index)}
                      className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 py-2"
                    >
                      <span>{category.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeCategory === index ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {activeCategory === index && (
                      <div className="pl-4 space-y-2 mt-2">
                        {/* Lien vers toute la catégorie */}
                        <Link
                          href={`/products?category=${category.dbCategory}`}
                          className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
                        >
                          Voir tous les {category.name}
                        </Link>
                        {/* Liens vers les sous-catégories */}
                        {category.subcategories.map((sub, subIndex) => (
                          <div key={subIndex}>
                            <button
                              onClick={() => setActiveSubcategory(activeSubcategory === subIndex ? null : subIndex)}
                              className="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-blue-600"
                            >
                              <Link
                                href={`/products?category=${category.dbCategory}&subcategory=${sub.subcategory}`}
                                className="flex-1"
                              >
                                {sub.name}
                              </Link>
                              {sub.subSubcategories && (
                                <ChevronDown className={`w-4 h-4 transition-transform ${activeSubcategory === subIndex ? 'rotate-180' : ''}`} />
                              )}
                            </button>

                            {/* Sub-subcategories for mobile */}
                            {sub.subSubcategories && activeSubcategory === subIndex && (
                              <div className="pl-4 space-y-1 mt-1">
                                {sub.subSubcategories.map((subSub, subSubIndex) => (
                                  <Link
                                    key={subSubIndex}
                                    href={`/products?category=${category.dbCategory}&subcategory=${subSub.subcategory}`}
                                    className="block py-1.5 text-sm text-gray-500 hover:text-blue-600"
                                  >
                                    {subSub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link href="/products" className="block text-gray-700 hover:text-blue-600 py-2">Produits</Link>
                <Link href="/promotions" className="block text-red-600 hover:text-red-700 py-2 font-semibold flex items-center gap-1">
                  🔥 Promotions
                </Link>
                <a href="/service" className="block text-gray-700 hover:text-blue-600 py-2">Services</a>
                <a href="/contact" className="block text-gray-700 hover:text-blue-600 py-2">Contact</a>
                <a href="/about" className="block text-gray-700 hover:text-gray-900 py-2">A propos</a>
                
                {/* Mobile Account Link */}
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2 border-t pt-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Mon Compte</span>
                  </div>
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>
      </div>

  )
}
