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

  // Fonction pour fermer le menu mobile
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
    setActiveSubcategory(null);
  };

  // Helper functions to convert database categories to URL slugs
  const getCategorySlug = (dbCategory) => {
    const slugMap = {
      'INFORMATIQUE': 'informatique',
      'PERIPHERIQUES': 'peripheriques',
      'SECURITE': 'securite',
      'RESEAUX_SERVEUR': 'reseaux-serveur',
      'CONNECTIQUES': 'connectiques',
      'ACCESSOIRES': 'accessoires'
    }
    return slugMap[dbCategory] || dbCategory.toLowerCase()
  }

  const getSubcategorySlug = (subcategory) => {
    return subcategory.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
 const categoriy = [
    { name: 'Informatique', subcategories: ['PC Portable', 'PC de Bureau', 'Logiciels', 'Stockage'] },
    { name: 'Sécurité', subcategories: ['Caméra de surveillance', 'Controle d\'accès','Detecteur','Système d\'alarme'] },
    { name: 'Reseau&Serveur', subcategories: ['Switch','Routeur','Point d\'accès WiFi', 'Telephone IP','Serveur'] },
    { name: 'Peripheriques', subcategories: ['Imprimante', 'Photocopieuse', 'Moniteur'] },
    { name: 'Connectiques', subcategories: ['Câbles', 'Multiprise', 'Ondulateur','Adaptateurs'] },
    { name: 'Accessoires', subcategories: ['Video', 'Son','Equipement PC', 'Stockage','Support'] },
    { name: 'Services', subcategories: ['Developpement Web et mobile', 'Maintenance informatique', 'Conseils expert'] }
  ];  
  // Mapping des catégories de l'interface vers la base de données
  const categoryMapping = {
    'Informatique': 'INFORMATIQUE',
    'Sécurité': 'SECURITE',
    'Reseau&Serveur': 'RESEAUX_SERVEUR',
    'Peripheriques': 'PERIPHERIQUES',
    'Connectiques': 'CONNECTIQUES',
    'Accessoires': 'ACCESSOIRES'
  }

  const categories = [
  {
    name: 'Ordi/Serveur',
    dbCategory: 'INFORMATIQUE',
    subcategories: [
      { name: 'PC Portable', subcategory: 'PC Portable' },
      { name: 'PC de Bureau', subcategory: 'PC de Bureau' },
      { name: 'Logiciels', subcategory: 'Logiciels' },
      { name: 'Stockage', subcategory: 'Stockage' }
    ]
  },
  {
    name: 'Energie',
    dbCategory: 'SECURITE',
    subcategories: [
      { name: 'Caméra de surveillance', subcategory: 'Caméra de surveillance' },
      { name: 'Controle d\'accès', subcategory: 'Controle d\'accès' },
      { name: 'Detecteur', subcategory: 'Detecteur' },
      { name: 'Système d\'alarme', subcategory: 'Système d\'alarme' }
    ]
  },
  {
    name: 'Reseau/Sécurité',
    dbCategory: 'RESEAUX_SERVEUR',
    subcategories: [
      { name: 'Switch', subcategory: 'Switch' },
      { name: 'Routeur', subcategory: 'Routeur' },
      { name: 'Point d\'accès WiFi', subcategory: 'Point d\'accès WiFi' },
      { name: 'Telephone IP', subcategory: 'Telephone IP' },
      { name: 'Serveur', subcategory: 'Serveur' }
    ]
  },
  {
    name: 'Imprimante',
    dbCategory: 'PERIPHERIQUES',
    subcategories: [
      { name: 'Imprimantes', subcategory: 'Imprimantes' },
      { name: 'Photocopieuses', subcategory: 'Photocopieuses' },
      { name: 'Scanners', subcategory: 'Scanners' },
      { name: 'Composants', subcategory: 'Composants' }
    ]
  },
  {
    name: 'Connectiques',
    dbCategory: 'CONNECTIQUES',
    subcategories: [
      {
        name: 'Câbles',
        subcategory: 'Câbles',
        subSubcategories: [
          { name: 'Câbles réseau', subcategory: 'Câbles réseau' },
          { name: 'Câbles HDMI', subcategory: 'Câbles HDMI' },
          { name: 'Câbles USB', subcategory: 'Câbles USB' },
          { name: 'Câbles VGA', subcategory: 'Câbles VGA' }
        ]
      },
      { name: 'Multiprise', subcategory: 'Multiprise' },
      { name: 'Ondulateur', subcategory: 'Ondulateur' },
      {
        name: 'Adaptateurs',
        subcategory: 'Adaptateurs',
        subSubcategories: [
          { name: 'Adaptateurs USB', subcategory: 'Adaptateurs USB' },
          { name: 'Adaptateurs Video', subcategory: 'Adaptateurs Video' },
          { name: 'Hub USB', subcategory: 'Hub USB' },
          { name: 'Convertisseur', subcategory: 'Convertisseur' }
        ]
      }
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
          { name: 'Stabilisateur', subcategory: 'Stabilisateur' },
          { name: 'Webcam', subcategory: 'Webcam' },
          { name: 'Projecteur', subcategory: 'Projecteur' },
        ]
      },
      {
        name: 'Son',
        subcategory: 'Son',
        subSubcategories: [
          { name: 'Casque audio', subcategory: 'Casque audio' },
          { name: 'Micro', subcategory: 'micro' },
          { name: 'Haut-parleur', subcategory: 'Haut-parleur' }
        ]
      },
      {
        name: 'Equipement PC',
        subcategory: 'Equipement PC',
        subSubcategories: [
          { name: 'Souris', subcategory: 'Souris' },
          { name: 'Clavier', subcategory: 'Clavier' },
          { name: 'Chargeur', subcategory: 'Chargeur' },
          { name: 'Housse laptop', subcategory: 'Housse laptop' },
          { name: 'Protection d\'écran', subcategory: 'Protection d\'écran' },
          { name: 'Film protecteur', subcategory: 'Film protecteur' }
        ]
      },
      { name: 'Stockage', subcategory: 'Stockage' },
      { name: 'Support', subcategory: 'Support' }
    ]
  }
];

  return (
    <div>
            {/* Header Top - Hidden on mobile */}

    <div style={{ backgroundColor: '#016bb6' }} className="hidden lg:block bg-blue-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 xl:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span className="hidden xl:inline">+227 20 35 23 23/ +227 99 86 01 01</span>
              <span className="xl:hidden">+227 20 35 23 23 / +227 99 86 01 01</span>
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

    <header className="bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-2 md:py-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/#">
              <div className="text-white p-1 md:p-2 mr-2 md:mr-3">
                <Image
                width={900}
                height={900}
                src="/images/logo.png"
                alt="logo"
                className="w-24 h-22 md:w-30 md:h-22" />
              </div>
              </Link>
              <div>
                <h1 className="text-lg md:text-2xl font-bold" style={{ color: '#016bb6' }}>Mell Plus Niger</h1>
                <p className="text-xs md:text-sm hidden sm:block" style={{ color: '#016bb6' }}>Votre partenaire IT au Niger</p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-xl mx-4 lg:mx-8 bg-blue-100 rounded-full">
              <SearchBar />
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden p-2 text-white hover:text-blue-600"
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
                className="hidden md:flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 md:px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md"
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
              <Link href="/#" className="text-blue-600 hover:text-blue-500 py-2 whitespace-nowrap">Acceuil</Link>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center space-x-1 text-blue hover:text-gray-200 py-2 whitespace-nowrap">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border rounded-lg p-4 min-w-48 z-40 transform translate-y-1">
                      {/* Lien vers toute la catégorie */}
                      {/* <Link
                        href={`/products/category/${getCategorySlug(category.dbCategory)}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded transition-colors font-medium border-b mb-2"
                      >
                        Voir tous les {category.name}
                      </Link>*/}
                      {/* Liens vers les sous-catégories */}
                      {category.subcategories.map((sub, subIndex) => (
                        <div
                          key={subIndex}
                          className="relative"
                          onMouseEnter={() => setActiveSubcategory(subIndex)}
                          onMouseLeave={() => setActiveSubcategory(null)}
                        >
                          <Link
                            href={`/products/category/${getCategorySlug(category.dbCategory)}/${getSubcategorySlug(sub.subcategory)}`}
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
                                  href={`/products/category/${getCategorySlug(category.dbCategory)}/${getSubcategorySlug(sub.subcategory)}/${getSubcategorySlug(subSub.subcategory)}`}
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
              <a href="/service" className="text-blue hover:text-gray-200 py-2 whitespace-nowrap">Services</a>
              <Link href="/avis" className="text-blue hover:text-gray-200 py-2 whitespace-nowrap">Avis clients</Link>
              <Link href="/contact" className="text-blue hover:text-gray-200 py-2 whitespace-nowrap">Contact</Link>
              <a href="/about" className="text-blue hover:text-gray-200 py-2 whitespace-nowrap">A propos</a>
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
                        {/*<Link
                          href={`/products/category/${getCategorySlug(category.dbCategory)}`}
                          className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
                        >
                          Voir tous les {category.name}
                        </Link>*/}
                        {/* Liens vers les sous-catégories */}
                        {category.subcategories.map((sub, subIndex) => (
                          <div key={subIndex}>
                            <button
                              onClick={() => setActiveSubcategory(activeSubcategory === subIndex ? null : subIndex)}
                              className="flex items-center justify-between w-full text-left py-2 text-gray-600 hover:text-blue-600"
                            >
                              <Link
                                href={`/products/category/${getCategorySlug(category.dbCategory)}/${getSubcategorySlug(sub.subcategory)}`}
                                className="flex-1"
                                onClick={closeMobileMenu}
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
                                    href={`/products/category/${getCategorySlug(category.dbCategory)}/${getSubcategorySlug(sub.subcategory)}/${getSubcategorySlug(subSub.subcategory)}`}
                                    className="block py-1.5 text-sm text-gray-500 hover:text-blue-600"
                                    onClick={closeMobileMenu}
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
                {/*<Link href="/products" className="block text-gray-700 hover:text-blue-600 py-2">Produits</Link>
                */}<Link href="/promotions" className="block text-red-600 hover:text-red-700 py-2 font-semibold flex items-center gap-1" onClick={closeMobileMenu}>
                  🔥 Promotions
                </Link>
                <a href="/service" className="block text-gray-700 hover:text-blue-600 py-2" onClick={closeMobileMenu}>Services</a>
                <Link href="/avis" className="block text-gray-700 hover:text-blue-600 py-2" onClick={closeMobileMenu}>Avis clients</Link>
                <a href="/contact" className="block text-gray-700 hover:text-blue-600 py-2" onClick={closeMobileMenu}>Contact</a>
                <a href="/about" className="block text-gray-700 hover:text-gray-900 py-2" onClick={closeMobileMenu}>A propos</a>
                
                {/* Mobile Account Link */}
                {/*<a href="#" className="block text-gray-700 hover:text-blue-600 py-2 border-t pt-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Mon Compte</span>
                  </div>
                </a>*/}
              </div>
            </nav>
          )}
        </div>
      </header>
      </div>

  )
}
