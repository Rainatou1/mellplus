// app/admin/dashboard/page.js
'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Package,
  FileText,
  Users,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  ArrowRight,
  Briefcase,
  Activity,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import { useDashboardStats } from '../../../../hooks/useData'

export default function AdminDashboard() {
  // ✅ Move the hook call inside the component
  const { stats: hookStats, loading, error, refetch } = useDashboardStats()

  const [stats, setStats] = useState({
    revenue: { 
      total: 12500000, 
      change: 12.5, 
      period: 'ce mois',
      lastMonth: 11100000
    },
    orders: { 
      total: 45, 
      pending: 8, 
      change: 8.2,
      completed: 37
    },
    quotes: { 
      total: 23, 
      pending: 12, 
      change: -3.1,
      approved: 7
    },
    customers: { 
      total: 156, 
      new: 28, 
      change: 15.3,
      active: 89
    },
    products: { 
      total: 234, 
      lowStock: 15,
      outOfStock: 3
    },
    messages: { 
      unread: 5, 
      total: 43,
      urgent: 2
    }
  })

  // Update local state when hook data changes
  useEffect(() => {
    if (hookStats && !loading) {
      setStats(hookStats)
    }
  }, [hookStats, loading])

  const [recentActivities] = useState([
    {
      id: '1',
      type: 'quote',
      title: 'Nouveau devis #QT-2024-001',
      description: 'Entreprise ABC - Installation réseau',
      amount: '4,750,000 FCFA',
      time: 'Il y a 10 minutes',
      status: 'pending',
      user: 'Jean Dupont'
    },
    {
      id: '2',
      type: 'order',
      title: 'Nouvelle commande #CMD-2024-045',
      description: 'HP EliteBook 840 G7 x2',
      amount: '1,700,000 FCFA',
      time: 'Il y a 1 heure',
      status: 'confirmed',
      user: 'Marie Koné'
    },
    {
      id: '3',
      type: 'message',
      title: 'Message urgent',
      description: 'Demande d\'information sur les serveurs',
      time: 'Il y a 2 heures',
      status: 'unread',
      user: 'Ahmed Sidi'
    },
    {
      id: '4',
      type: 'product',
      title: 'Stock faible détecté',
      description: 'iPhone 15 Pro - 2 unités restantes',
      time: 'Il y a 3 heures',
      status: 'warning',
      user: 'Système'
    }
  ])

  // Données pour le graphique
  const [chartData] = useState([
    { day: 'Lun', ventes: 4, revenus: 3200000 },
    { day: 'Mar', ventes: 6, revenus: 4800000 },
    { day: 'Mer', ventes: 8, revenus: 6400000 },
    { day: 'Jeu', ventes: 5, revenus: 4000000 },
    { day: 'Ven', ventes: 9, revenus: 7200000 },
    { day: 'Sam', ventes: 7, revenus: 5600000 },
    { day: 'Dim', ventes: 3, revenus: 2400000 }
  ])

  // Produits populaires
  const [topProducts] = useState([
    { 
      name: 'HP EliteBook 840 G7', 
      sales: 12, 
      revenue: 10200000, 
      trend: 'up',
      image: '💻' 
    },
    { 
      name: 'iPhone 15 Pro', 
      sales: 8, 
      revenue: 7600000, 
      trend: 'up',
      image: '📱' 
    },
    { 
      name: 'Climatiseur Split 2CV', 
      sales: 6, 
      revenue: 2700000, 
      trend: 'down',
      image: '❄️' 
    },
    { 
      name: 'Imprimante HP LaserJet', 
      sales: 5, 
      revenue: 1400000, 
      trend: 'stable',
      image: '🖨️' 
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200'
      case 'unread': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'warning': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingCart className="w-5 h-5" />
      case 'quote': return <FileText className="w-5 h-5" />
      case 'message': return <MessageSquare className="w-5 h-5" />
      case 'product': return <Package className="w-5 h-5" />
      default: return <Activity className="w-5 h-5" />
    }
  }

  // Calculer le max pour le graphique
  const maxRevenue = Math.max(...chartData.map(d => d.revenus))

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bienvenue dans votre espace admin</h1>
            <p className="text-blue-100">Vue d&apos;ensemble de votre activité commerciale</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-200" />
                <span className="text-sm text-blue-100">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
         {/* <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg hover:bg-white/30 transition-all">
              Télécharger le rapport
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium">
              Nouvelle vente
            </button>
          </div>*/}
        </div>
      </div>

      {/* Cards de statistiques avec design moderne */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              (stats?.revenue?.change ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {(stats?.revenue?.change ?? 0) > 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stats?.revenue?.change ?? 0)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {(stats.revenue.total / 1000000).toFixed(1)}M FCFA
          </h3>
          <p className="text-sm text-gray-500">Revenus {stats.revenue.period}</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Mois dernier</span>
              <span className="font-medium text-gray-700">
                {(stats.revenue.lastMonth / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* Commandes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              stats?.orders?.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats?.orders?.change > 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stats?.orders?.change || 0)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats?.orders?.total || 0}</h3>
          <p className="text-sm text-gray-500">Commandes totales</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                {stats?.orders?.pending || 0} en attente
              </span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stats?.orders?.completed || 0} complétées
              </span>
            </div>
          </div>
        </div>

        {/* Devis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              stats.quotes.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.quotes.change > 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stats.quotes.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.quotes.total}</h3>
          <p className="text-sm text-gray-500">Devis créés</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                {stats.quotes.pending} en cours
              </span>
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                {stats.quotes.approved} approuvés
              </span>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className={`flex items-center text-sm font-medium ${
              stats.customers.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.customers.change > 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(stats.customers.change)}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.customers.total}</h3>
          <p className="text-sm text-gray-500">Clients totaux</p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                +{stats.customers.new} ce mois
              </span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stats.customers.active} actifs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerte Stock */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 mb-1">Alerte Stock</h4>
              <p className="text-sm text-orange-700 mb-3">
                {stats.products.lowStock} produits en stock faible
              </p>
              <Link 
                href="/admin/products?filter=low-stock" 
                className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800"
              >
                Voir les produits
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Messages non lus */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">Messages</h4>
              <p className="text-sm text-blue-700 mb-3">
                {stats.messages.unread} messages non lus ({stats.messages.urgent} urgents)
              </p>
              <Link 
                href="/admin/contacts" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Lire les messages
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Tâches en attente */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-purple-900 mb-1">Actions requises</h4>
              <p className="text-sm text-purple-700 mb-3">
                {stats.orders.pending + stats.quotes.pending} tâches en attente
              </p>
              <Link 
                href="/admin/tasks" 
                className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Voir les tâches
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique des ventes avec style moderne */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Aperçu des ventes</h3>
              <p className="text-sm text-gray-500 mt-1">Performance de la semaine</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Graphique en barres moderne */}
          <div className="h-64 relative">
            <div className="absolute inset-0 flex items-end justify-between gap-4">
              {chartData.map((item, index) => {
                const height = (item.revenus / maxRevenue) * 100
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center">
                      <span className="text-xs font-semibold text-gray-700 mb-2">
                        {item.ventes}
                      </span>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {(item.revenus / 1000000).toFixed(1)}M FCFA
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total semaine</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {chartData.reduce((sum, d) => sum + d.ventes, 0)} ventes
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Revenus moyens</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {(chartData.reduce((sum, d) => sum + d.revenus, 0) / chartData.length / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Meilleur jour</p>
              <p className="text-xl font-bold text-gray-900 mt-1">Vendredi</p>
            </div>
          </div>
        </div>

        {/* Activités récentes avec style moderne */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
            <Link href="/admin/activities" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Tout voir
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${getStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    {activity.amount && (
                      <span className="text-xs font-medium text-gray-700">{activity.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produits populaires avec design moderne */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Produits populaires</h3>
            <p className="text-sm text-gray-500 mt-1">Meilleures ventes du mois</p>
          </div>
          <Link href="/admin/products?sort=popular" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Voir tous les produits
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topProducts.map((product, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{product.image}</div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.trend === 'up' ? 'bg-green-100 text-green-700' :
                  product.trend === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {product.trend === 'up' ? '↑' : product.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1 text-sm">{product.name}</h4>
              <p className="text-xs text-gray-500 mb-2">{product.sales} ventes</p>
              <p className="text-lg font-bold text-gray-900">
                {(product.revenue / 1000000).toFixed(1)}M FCFA
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}