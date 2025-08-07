import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Phone, Mail, MapPin, Search, ShoppingCart, User, Menu, X, Star, Truck, Shield, Users, Clock, Award, ChevronLeft, ChevronRight } from 'lucide-react';


export default function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white p-2 rounded mr-3">
                  <Award className="w-5 h-5 md:w-6 md:h-6" />
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
                <li><a href="#" className="hover:text-white">Téléphonie</a></li>
                <li><a href="#" className="hover:text-white">Électroménager</a></li>
                <li><a href="#" className="hover:text-white">Bureautique</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Services</h5>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><a href="#" className="hover:text-white">Support technique</a></li>
                <li><a href="#" className="hover:text-white">Develeoppement web & mobile</a></li>
                <li><a href="#" className="hover:text-white">Maintenance</a></li>
                <li><a href="#" className="hover:text-white">Formation</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4 text-base md:text-lg">Contact</h5>
              <div className="space-y-2 text-gray-400 text-sm md:text-base">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+227 96 12 34 56</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">contact@mellplusniger.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Niamey, Niger</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm md:text-base">
            <p>&copy; 2024 Mell Plus Niger. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
  )
}
