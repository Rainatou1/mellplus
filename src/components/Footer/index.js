'use client'
import Link from 'next/link'
import Image from "next/image";
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';


export default function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
     
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-3">
            {/* Logo et description - Prend toute la largeur sur mobile */}
            <div className="lg:col-span-1 col-span-1 md:col-span-3 lg:col-span-1">
              <div className="flex items-start gap-2 mb-4 md:flex-col md:items-start md:gap-5">
                <div className="flex-shrink-0">
                  <Image
                    width={80}
                    height={70}
                    src="/images/logo.png"
                    alt="logo"
                    className="w-20 h-18 md:w-28 md:h-24" />
                </div>
                <div className="flex-1 md:flex-none md:w-full">
                  <h4 className="text-base md:text-xl font-bold mb-1 md:mb-2">Mell Plus Niger</h4>
                  <p className="text-gray-400 text-xs md:text-base leading-tight">
                    Votre partenaire de confiance pour tous vos besoins en matériel informatique et électronique au Niger.
                  </p>
                </div>
              </div>
            </div>

            {/* Grille 2 colonnes sur mobile pour les catégories */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
              <div>
                <h5 className="font-semibold mb-2 md:mb-4 text-sm md:text-lg">Ordi&Serveur</h5>
                <ul className="space-y-1 text-gray-400 text-xs md:text-sm">
                  <li><Link href="/products/category/ordi-serveur/pc-portable" className="hover:text-white">PC Portable</Link></li>
                  <li><Link href="/products/category/ordi-serveur/pc-de-bureau" className="hover:text-white">PC de Bureau</Link></li>
                  <li><Link href="/products/category/ordi-serveur/serveur" className="hover:text-white">Serveur</Link></li>
                  <li><Link href="/products/category/ordi-serveur/all-in-one" className="hover:text-white">All in one</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold mb-2 md:mb-4 text-sm md:text-lg">Réseaux&Sécurité</h5>
                <ul className="space-y-1 text-gray-400 text-xs md:text-sm">
                  <li><Link href="/products/category/reseaux-securite/camera-de-surveillance" className="hover:text-white">Caméra</Link></li>
                  <li><Link href="/products/category/reseaux-securite/gache" className="hover:text-white">Gache</Link></li>
                  <li><Link href="/products/category/reseaux-securite/securite-incendie" className="hover:text-white">Sécurité incendie</Link></li>
                  <li><Link href="/products/category/reseaux-securite/reseaux-cuivre" className="hover:text-white">Réseaux cuivre</Link></li>
                  <li><Link href="/products/category/reseaux-securite/reseaux-fibre" className="hover:text-white">Réseaux fibre</Link></li>
                </ul>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-0">
              <div>
                <h5 className="font-semibold mb-2 md:mb-4 text-sm md:text-lg">Imprimante&Copieur</h5>
                <ul className="space-y-1 text-gray-400 text-xs md:text-sm">
                  <li><Link href="/products/category/imprimante-copieur/imprimantes" className="hover:text-white">Imprimante</Link></li>
                  <li><Link href="/products/category/imprimante-copieur/scanneur" className="hover:text-white">Scanner</Link></li>
                  <li><Link href="/products/category/imprimante-copieur/copieur" className="hover:text-white">Copieur</Link></li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold mb-2 md:mb-3 text-sm md:text-lg">Accessoires</h5>
                <ul className="space-y-1 text-gray-400 text-xs md:text-sm">
                  <li><Link href="/products/category/accessoires/connectiques" className="hover:text-white">Connectique</Link></li>
                  <li><Link href="/products/category/accessoires/stockage" className="hover:text-white">Stockage</Link></li>
                  <li><Link href="/products/category/accessoires/multimedia" className="hover:text-white">Multimédia</Link></li>
                  <li><Link href="/products/category/accessoires/consommable" className="hover:text-white">Consommable</Link></li>
                  <li><Link href="/products/category/accessoires/composants" className="hover:text-white">Composants</Link></li>
                  <li><Link href="/products/category/accessoires/energie" className="hover:text-white">Energie</Link></li>
                  <li><Link href="/products/category/accessoires/bureautique" className="hover:text-white">Bureautique</Link></li>
                </ul>
              </div>
            </div>
            
             
              
              
             {/*
              <Link href="/service"><h5 className="font-semibold mb-4 text-base md:text-lg">Nos Services</h5></Link>
              <Link href="/promotions"><h5 className="font-semibold mb-4 text-base md:text-lg">Nos Promos</h5></Link>*/}
              {/*<ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="/promotions" className="hover:text-white">Nos promos</a></li>*/}
                {/*<li><a href="#" className="hover:text-white">Blog</a></li>*/}
                {/*<li><a href="#" className="hover:text-white">Maintenance</a></li>
                <li><a href="#" className="hover:text-white">Conseil expert</a></li>
              </ul>*/}
            
            <div>
              <Link href="/service"><h5 className="font-semibold mb-4 text-base md:text-base">Nos Services</h5></Link>
              <Link href="/promotions"><h5 className="font-semibold mb-4 text-base md:text-base">Nos Promos</h5></Link>
      
              <h5 className="font-semibold mb-4 text-base md:text-lg">Nos politiques</h5>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="/cgv" className="hover:text-white">Mentions Legales</a></li>
                <li><a href="/about" className="hover:text-white">Qui sommes nous?</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Contact</h5>
              <div className="space-y-2 text-gray-400 text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+227 20 35 23 23</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">mellplus@mellplusniger.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Boulevard Mali Béro Ex Kalao Porte N°2770</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2025 Mell Plus Niger. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
  )
}
