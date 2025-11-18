// app/admin/layout.js
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import useIdleTimer from '@/hooks/useIdleTimer'
import {
  LayoutDashboard,
  Package,
  Settings,
  FileText,
  MessageSquare,
  Users,
  BarChart3,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ShoppingCart,
  Briefcase,
  Mail,
  TrendingUp,
  MonitorPlay,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'

const getMenuItems = (unreadMessagesCount) => [
  {
    href: '/admin/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    badge: null
  },
  {
    href: '/admin/products',
    label: 'Produits',
    icon: Package,
    badge: null
  },
  {
    href: '/admin/services',
    label: 'Services',
    icon: Briefcase,
    badge: null
  },
  {
    href: '/admin/carousel',
    label: 'Carousel',
    icon: MonitorPlay,
    badge: null
  },
  {
    href: '/admin/quotes',
    label: 'Devis',
    icon: FileText,
    badge: '3' // Nombre de nouveaux devis
  },
  {
    href: '/admin/contacts',
    label: 'Messages',
    icon: MessageSquare,
    badge: unreadMessagesCount > 0 ? unreadMessagesCount.toString() : null
  },
  {
    href: '/admin/reviews',
    label: 'Avis clients',
    icon: Star,
    badge: null
  },
  {
    href: '/#',
    label: 'Acceuil',
    icon: Package,
    badge: null
  },
  /*{
    href: '/admin/orders',
    label: 'Commandes',
    icon: ShoppingCart,
    badge: null
  },
  {
    href: '/admin/customers',
    label: 'Clients',
    icon: Users,
    badge: null
  },
  {
    href: '/admin/analytics',
    label: 'Statistiques',
    icon: BarChart3,
    badge: null
  },
  {
    href: '/admin/settings',
    label: 'Paramètres',
    icon: Settings,
    badge: null
  },*/
]

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(8)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [warningCountdown, setWarningCountdown] = useState(0)

  // Gestion de la déconnexion automatique après inactivité
  const handleIdleLogout = async () => {
    if (session) {
      setShowWarning(false)
      await signOut({ redirect: true, callbackUrl: '/admin/login' })
    }
  }

  // Avertissement 2 minutes avant la déconnexion
  const handleIdleWarning = () => {
    if (session) {
      setShowWarning(true)
      setWarningCountdown(120) // 2 minutes

      // Décompte
      const countdownInterval = setInterval(() => {
        setWarningCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            handleIdleLogout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  // Hook pour détecter l'inactivité (13 minutes pour l'avertissement, puis 2 minutes de plus)
  const { restart: restartIdleTimer } = useIdleTimer(handleIdleWarning, 13 * 60 * 1000)

  // Fonction pour prolonger la session
  const extendSession = () => {
    setShowWarning(false)
    setWarningCountdown(0)
    restartIdleTimer()
  }

  // Fetch unread messages count
  const fetchUnreadMessagesCount = async () => {
    try {
      const response = await fetch('/api/contact?read=false')
      if (response.ok) {
        const data = await response.json()
        setUnreadMessagesCount(data.contacts.length)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de messages non lus:', error)
    }
  }

  // Redirection si non authentifié
  useEffect(() => {
    if (status === 'loading') return
    if (!session && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [session, status, router, pathname])

  // Fetch unread messages count on mount and periodically
  useEffect(() => {
    if (session) {
      fetchUnreadMessagesCount()
      // Refresh count every 30 seconds
      const interval = setInterval(fetchUnreadMessagesCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  // Ne pas afficher le layout sur la page de login
  if (pathname === '/admin/login' || status === 'loading') {
    return <>{children}</>
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-xl font-bold">Mell Plus</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {getMenuItems(unreadMessagesCount).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {session.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{session.user?.name}</p>
              <p className="text-xs text-gray-400">{session.user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-transparent flex-1 outline-none text-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      href="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mon profil
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Paramètres
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

        <Toaster position="top-right" />
      </div>

      {/* Modal d'avertissement de déconnexion */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Session sur le point d&apos;expirer
              </h3>
              <p className="text-gray-600 mb-4">
                Votre session va expirer dans <span className="font-bold text-red-600">{Math.floor(warningCountdown / 60)}:{(warningCountdown % 60).toString().padStart(2, '0')}</span> en raison d&apos;inactivité.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Cliquez sur &quot;Rester connecté&quot; pour prolonger votre session.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleIdleLogout}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Se déconnecter
                </button>
                <button
                  onClick={extendSession}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Rester connecté
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}