'use client'
import Link from 'next/link'
import Image from "next/image";
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';


export default function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
     
      <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-2">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className=" text-white p-2 md:p-3 rounded-lg mr-2 md:mr-3">
                    <Image
                      width={100}
                      height={90}
                      src="/images/logo.png"
                      alt="logo" 
                      className="w-6 h-6 md:w-38 md:h-34" />
                </div>
            
              </div>
              <h4 className="text-lg md:text-xl font-bold">Mell Plus Niger</h4>
              <p className="text-gray-400 mb-4 text-sm md:text-base">
                Votre partenaire de confiance pour tous vos besoins en matériel informatique et électronique au Niger.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Informatique</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/informatique/pc-portable" className="hover:text-white">PC Portable</Link></li>
                <li><Link href="/products/category/informatique/pc-de-bureau" className="hover:text-white">PC de Bureau</Link></li>
                <li><Link href="/products/category/informatique/logiciels" className="hover:text-white">Logiciels</Link></li>
                <li><Link href="/products/category/informatique/stockage" className="hover:text-white">Stockage</Link></li>

              </ul>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Sécurité</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/securite/camera-de-surveillance" className="hover:text-white">Caméra de surveillance</Link></li>
                <li><Link href="/products/category/securite/controle-d-acces" className="hover:text-white">Controle d&lsquo;accès</Link></li>
                <li><Link href="/products/category/securite/detecteur" className="hover:text-white">Detecteur</Link></li>
                <li><Link href="/products/category/securite/systeme-d-alarme" className="hover:text-white">Système d&lsquo;alarme</Link></li>

              </ul>
              <Link href="/promotions"><h5 className="font-semibold mb-4 text-base md:text-base">Nos Promos</h5></Link>

            </div>
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Réseau & Serveur</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/reseaux-serveur/switch" className="hover:text-white">Switch</Link></li>
                <li><Link href="/products/category/reseaux-serveur/routeur" className="hover:text-white">Routeur</Link></li>
                <li><Link href="/products/category/reseaux-serveur/point-d-acces-wifi" className="hover:text-white">Point d&lsquo;accès WiFi</Link></li>
                <li><Link href="/products/category/reseaux-serveur/telephone-ip" className="hover:text-white">Telephone IP</Link></li>
                <li><Link href="/products/category/reseaux-serveur/serveur" className="hover:text-white">Serveur</Link></li>

              </ul>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Peripheriques</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/peripheriques/imprimantes" className="hover:text-white">Imprimante</Link></li>
                <li><Link href="/products/category/peripheriques/photocopieuse" className="hover:text-white">Photocopieuse</Link></li>
                <li><Link href="/products/category/peripheriques/composants" className="hover:text-white">Composants</Link></li>

              </ul>
              <Link href="/service"><h5 className="font-semibold mb-4 text-base md:text-base">Nos Services</h5></Link>

            </div>
            <div>
              <h5 className="font-semibold mb-3 text-base md:text-lg">Connectiques</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/connectiques/cables" className="hover:text-white">Cables</Link></li>
                <li><Link href="/products/category/connectiques/multiprise" className="hover:text-white">Multiprise</Link></li>
                <li><Link href="/products/category/connectiques/ondulateur" className="hover:text-white">Ondulateurs</Link></li>
                <li><Link href="/products/category/connectiques/adaptateurs" className="hover:text-white">Adaptateurs</Link></li>

              </ul>
              <h5 className="font-semibold mb-3 text-base md:text-lg">Accessoires</h5>
              <ul className="space-y-1 text-gray-400 text-sm md:text-sm">
                <li><Link href="/products/category/accessoires/video" className="hover:text-white">Video</Link></li>
                <li><Link href="/products/category/accessoires/son" className="hover:text-white">Son</Link></li>
                <li><Link href="/products/category/accessoires/equipement-pc" className="hover:text-white">Equipements PC</Link></li>
                <li><Link href="/products/category/accessoires/stockage" className="hover:text-white">Stockage</Link></li>
                <li><Link href="/products/category/accessoires/support" className="hover:text-white">Support</Link></li>

              </ul>

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
              <h5 className="font-semibold mb-4 text-base md:text-lg">Politiques</h5>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="/cgv" className="hover:text-white">CGV</a></li>
                <li><a href="/cgv" className="hover:text-white">Mentions Legales</a></li>
                <li><a href="#" className="hover:text-white">Politique de retour</a></li>
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
