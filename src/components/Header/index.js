"use client";
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);
 const categoriy = [
    { name: 'Informatique', subcategories: ['Ordinateurs Portables', 'Ordinateurs de Bureau', 'Accéssoires', 'Logiciels'] },
    { name: 'Image & Son', subcategories: ['Cameras', 'Casques', 'Tablettes'] },
    { name: 'Reseau&Serveur', subcategories: ['Switch', 'Telephone IP', 'Videosurveillance'] },
    { name: 'Peripheriques', subcategories: ['Imprimantes', 'Scanners', 'Composants'] },
    { name: 'Connectiques', subcategories: ['Cables', 'Multiprise', 'Fournitures'] },
    { name: 'Services', subcategories: ['Developpement Web et mobile', 'Maintenance informatique', 'Conseils expert'] }
  ];  
  const categories = [
  {
    name: 'Informatique',
    subcategories: [
      { name: 'Ordinateurs Portables', link: '/produit' },
      { name: 'Ordinateurs de Bureau', link: '/produit' },
      { name: 'Accéssoires', link: '/produit' },
      { name: 'Logiciels', link: '/produit' }
    ]
  },
  {
    name: 'Image & Son',
    subcategories: [
      { name: 'Cameras', link: '/produit' },
      { name: 'Casques', link: '/produit' },
      { name: 'Tablettes', link: '/produit' }
    ]
  },
  {
    name: 'Reseau&Serveur',
    subcategories: [
      { name: 'Switch', link: '/produit' },
      { name: 'Telephone IP', link: '/produit' },
      { name: 'Videosurveillance', link: '/produit' }
    ]
  },
  {
    name: 'Peripheriques',
    subcategories: [
      { name: 'Imprimantes', link: '/produit' },
      { name: 'Scanners', link: '/produit' },
      { name: 'Composants', link: '/produit' }
    ]
  },
  {
    name: 'Connectiques',
    subcategories: [
      { name: 'Cables', link: '/category' },
      { name: 'Multiprise', link: '/produit' },
      { name: 'Fournitures', link: '/produit' }
    ]
  },
  {
    name: 'Services',
    subcategories: [
      { name: 'Développement Web et mobile', link: '/produit' },
      { name: 'Maintenance informatique', link: '/produit' },
      { name: 'Conseils expert', link: '/produit' }
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
              <span className="hidden xl:inline">+227 96 12 34 56</span>
              <span className="xl:hidden">96 12 34 56</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span className="hidden xl:inline">contact@mellplusniger.com</span>
              <span className="xl:hidden">contact@mell...</span>
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

    <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="bg-white text-white p-2 md:p-3 rounded-lg mr-2 md:mr-3">
                <Image
                width={50}
                height={50}
                src="/images/R.png"
                alt="logo" 
                className="w-6 h-6 md:w-16 md:h-12" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800">Mell Plus Niger</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Votre partenaire IT au Niger</p>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2 lg:top-3 w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
              </div>
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

              {/* Cart */}{/* 
              <button className="flex items-center space-x-1 md:space-x-2 bg-blue-600 text-white px-2 md:px-4 py-2 rounded-lg hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Panier</span>
                <span className="hidden sm:inline">(0)</span>
              </button>*/}

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
            <div className="md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-gray-200 relative">
            <div className="flex items-center space-x-4 lg:space-x-8 py-3 ">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setActiveCategory(index)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">
                    <span>{category.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown */}
                  {activeCategory === index && (
                    <div className="absolute top-full left-0 bg-white shadow-xl border rounded-lg p-4 min-w-48 z-40 transform translate-y-1">
                      {category.subcategories.map((sub, subIndex) => (
                        <a
                          key={subIndex}
                          href={sub.link}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                        >
                          {sub.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 py-2 whitespace-nowrap">Contact</Link>
              <a href="/about" className="text-red-600 hover:text-red-700 py-2 font-semibold whitespace-nowrap">A propos</a>
            </div>
          </nav>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
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
                        {category.subcategories.map((sub, subIndex) => (
                          <a
                            key={subIndex}
                            href={sub.link}
                            className="block py-2 text-gray-600 hover:text-blue-600"
                          >
                            {sub.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2">Contact</a>
                <a href="#" className="block text-red-600 hover:text-red-700 py-2 font-semibold">Promotions</a>
                
                {/* Mobile Account Link */}
                <a href="#" className="block text-gray-700 hover:text-blue-600 py-2 border-t pt-4">
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
