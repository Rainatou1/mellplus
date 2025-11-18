'use client'

import { useState } from 'react'
import { MapPin, ExternalLink, Navigation, Phone } from 'lucide-react'

export default function LocationMap() {
  const [isLoading, setIsLoading] = useState(true)

  // Mell Plus Niger location coordinates (Boulevard Mali Bero, Niamey, Niger)
  const location = {
    lat: 13.5137,
    lng: 2.1098,
    address: "Boulevard Mali Bero, Niamey, Niger",
    fullAddress: "MELL PLUS Informatique, Blvd Mali Bero, Niamey"
  }

  const handleGetDirections = () => {
    const address = encodeURIComponent("MELL PLUS Informatique, Blvd Mali Bero, Niamey, Niger")
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}`
    window.open(googleMapsUrl, '_blank')
  }

  const handleViewOnMaps = () => {
    const address = encodeURIComponent("MELL PLUS Informatique, Boulevard Mali Bero, Niamey, Niger")
    const googleMapsUrl = `https://www.google.com/maps/search/${address}`
    window.open(googleMapsUrl, '_blank')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Notre emplacement
            </h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span>{location.fullAddress}</span>
            </div>
          </div>
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={handleGetDirections}
              className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Navigation className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
              <span className="hidden xs:inline">Itinéraire</span>
              <span className="xs:hidden">GPS</span>
            </button>
            <button
              onClick={handleViewOnMaps}
              className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
              <span className="hidden xs:inline">Voir sur Maps</span>
              <span className="xs:hidden">Maps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3872.123456789!2d2.1098!3d13.5137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMELL%20PLUS%20Informatique%2C%20Boulevard%20Mali%20Bero%2C%20Niamey%2C%20Niger!5e0!3m2!1sfr!2sne!4v1634567890123!5m2!1sfr!2sne"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full"
        />
      </div>

      {/* Contact Info Footer */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Téléphone</p>
              <p className="text-sm text-gray-600">+227 20 35 23 23</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Horaires</p>
              <p className="text-sm text-gray-600">Lun-Ven: 8h-18h</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Navigation className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Parking</p>
              <p className="text-sm text-gray-600">Disponible</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Cliquez sur &ldquo;Itinéraire&rdquo; pour obtenir des directions depuis votre position actuelle
          </p>
        </div>
      </div>
    </div>
  )
}