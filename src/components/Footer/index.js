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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className=" text-white p-2 md:p-3 rounded-lg mr-2 md:mr-3">
                    <Image
                      width={100}
                      height={90}
                      src="/images/logo.png"
                      alt="logo" 
                      className="w-6 h-6 md:w-18 md:h-14" />
                </div>
                <h4 className="text-lg md:text-xl font-bold">Mell Plus Niger</h4>
              </div>
              <p className="text-gray-400 mb-4 text-sm md:text-base">
                Votre partenaire de confiance pour tous vos besoins en matériel informatique et électronique au Niger.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Produits</h5>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white">Informatique</a></li>
                <li><a href="#" className="hover:text-white">Sécurité</a></li>
                <li><a href="#" className="hover:text-white">Réseau & Serveur</a></li>
                <li><a href="#" className="hover:text-white">Peripheriques</a></li>
                <li><a href="#" className="hover:text-white">Connectiques</a></li>
                <li><a href="#" className="hover:text-white">Accessoires</a></li>

              </ul>
            </div>
            <div>
              <Link href="/service"><h5 className="font-semibold mb-4 text-base md:text-lg">Nos Services</h5></Link>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="/produit" className="hover:text-white">Nos promos</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                {/*<li><a href="#" className="hover:text-white">Maintenance</a></li>
                <li><a href="#" className="hover:text-white">Conseil expert</a></li>*/}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Politiques</h5>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="cgv" className="hover:text-white">CGV</a></li>
                <li><a href="cgv" className="hover:text-white">Mentions Legales</a></li>
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
