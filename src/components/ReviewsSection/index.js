"use client"
import { useState } from 'react'
import { Star, MessageSquare, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import ReviewForm from '@/components/ReviewForm'
import ReviewsList from '@/components/ReviewsList'

export default function ReviewsSection() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">
              Ce que disent nos clients
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages authentiques de nos clients satisfaits.
            Leur confiance est notre plus belle récompense.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avis vedettes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Avis récents
                </h3>
                <Link
                  href="/avis"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir tous les avis
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <ReviewsList
                limit={3}
                showPagination={false}
                className="space-y-4"
              />
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-6">
            {/* Formulaire rapide */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Partagez votre expérience
                </h3>
                <p className="text-gray-600 mb-6">
                  Votre avis nous aide à améliorer nos services et guide d&apos;autres clients.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Laisser un avis</span>
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Notre engagement qualité</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Satisfaction client</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold">4.8/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Clients recommandent</span>
                  <span className="font-semibold">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Avis positifs</span>
                  <span className="font-semibold">98%</span>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pourquoi nos clients nous choisissent
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Expertise technique reconnue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Service client réactif</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Produits de qualité</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Garantie et SAV</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action bottom */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rejoignez nos clients satisfaits
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Découvrez pourquoi plus de 1000 entreprises au Niger nous font confiance
              pour leurs besoins informatiques et technologiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nous contacter
              </Link>
              <Link
                href="/avis"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Lire tous les avis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </section>
  )
}