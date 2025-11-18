'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Percent, Clock, TrendingDown } from 'lucide-react'

export default function PromoBanner() {
  const [promoCount, setPromoCount] = useState(0)
  const [maxDiscount, setMaxDiscount] = useState(0)

  useEffect(() => {
    // Fetch promo stats
    const fetchPromoStats = async () => {
      try {
        const response = await fetch('/api/products/promotions?limit=1')
        if (response.ok) {
          const data = await response.json()
          setPromoCount(data.stats?.totalPromos || 0)
          setMaxDiscount(data.stats?.maxDiscount || 0)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats promotions:', error)
      }
    }

    fetchPromoStats()
  }, [])

  // Ne pas afficher la bannière s'il n'y a pas de promotions
  if (promoCount === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left side - Main message */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-yellow-300">
              <Percent size={32} className="animate-pulse" />
              <div className="text-2xl md:text-3xl font-bold">
                PROMOTIONS SPÉCIALES
              </div>
            </div>
          </div>

          {/* Center - Stats */}
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-2">
              <TrendingDown className="text-yellow-300" size={20} />
              <div>
                <div className="text-lg font-bold">Jusqu&apos;à {maxDiscount}%</div>
                <div className="text-xs opacity-90">de réduction</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-300" size={20} />
              <div>
                <div className="text-lg font-bold">{promoCount} produits</div>
                <div className="text-xs opacity-90">en promotion</div>
              </div>
            </div>
          </div>

          {/* Right side - CTA */}
          <Link
            href="/promotions"
            className="group bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-yellow-100 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>VOIR LES PROMOS</span>
            <ChevronRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform" 
            />
          </Link>
        </div>
      </div>

      {/* Bottom animated strip */}
      <div className="h-1 bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse"></div>
    </div>
  )
}