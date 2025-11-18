'use client'

import { useState } from 'react'
import { Star, MessageSquare, Plus, X } from 'lucide-react'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'

export default function ReviewsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Avis de nos clients
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez ce que nos clients pensent de nos produits et services.
              Votre avis nous aide à nous améliorer et guide d&apos;autres clients dans leurs choix.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section principale - Liste des avis */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Tous les avis
                  </h2>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Laisser un avis</span>
                </button>
              </div>

              <ReviewsList limit={10} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avis vedettes */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Avis vedettes
                </h3>
              </div>
              <ReviewsList featuredOnly={true} limit={3} showPagination={false} />
            </div>

            {/* Call to action */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6">
              <div className="text-center">
                <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Partagez votre expérience
                </h3>
                <p className="text-gray-600 mb-4">
                  Votre avis compte ! Aidez d&apos;autres clients et améliorez nos services.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Écrire un avis
                </button>
              </div>
            </div>

            {/* Informations sur le processus */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comment ça marche ?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <p className="text-sm text-gray-600">
                    Rédigez votre avis en toute sincérité
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <p className="text-sm text-gray-600">
                    Notre équipe vérifie et modère votre avis
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <p className="text-sm text-gray-600">
                    Votre avis est publié et visible par tous
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}