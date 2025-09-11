// hooks/useData.js
import { useState, useEffect } from 'react'

// Hook pour récupérer les données avec gestion du loading et des erreurs
export function useData(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        })
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  const refetch = async () => {
    setLoading(true)
    try {
      const response = await fetch(url, options)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Hook pour les produits
export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [filters.category, filters.search, filters.page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/products?${params}`)
      
      if (!response.ok) throw new Error('Erreur lors du chargement des produits')
      
      const data = await response.json()
      setProducts(data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) throw new Error('Erreur lors de la création')
      
      const newProduct = await response.json()
      setProducts([newProduct.product, ...products])
      return { success: true, product: newProduct.product }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      
      const updatedProduct = await response.json()
      setProducts(products.map(p => 
        p.id === id ? updatedProduct.product : p
      ))
      return { success: true, product: updatedProduct.product }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      setProducts(products.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts
  }
}

// Hook pour les devis
export function useQuotes(filters = {}) {
  const [quotes, setQuotes] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchQuotes()
  }, [filters.status, filters.search, filters.page])

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/quotes?${params}`)
      
      if (!response.ok) throw new Error('Erreur lors du chargement des devis')
      
      const data = await response.json()
      setQuotes(data.quotes)
      setStats(data.stats || {})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateQuoteStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/quotes?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      
      const updatedQuote = await response.json()
      setQuotes(quotes.map(q => 
        q.id === id ? updatedQuote.quote : q
      ))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    quotes,
    stats,
    loading,
    error,
    updateQuoteStatus,
    refetch: fetchQuotes
  }
}

// Hook pour les messages/contacts
export function useContacts(filters = {}) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [filters.read, filters.starred, filters.page])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/contact?${params}`)
      
      if (!response.ok) throw new Error('Erreur lors du chargement des messages')
      
      const data = await response.json()
      setMessages(data.contacts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH'
      })
      
      if (!response.ok) throw new Error('Erreur')
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, read: true } : m
      ))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const toggleStar = async (id) => {
    const message = messages.find(m => m.id === id)
    if (!message) return

    try {
      const response = await fetch(`/api/contact/${id}/star`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: !message.starred })
      })
      
      if (!response.ok) throw new Error('Erreur')
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, starred: !m.starred } : m
      ))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      setMessages(messages.filter(m => m.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    messages,
    loading,
    error,
    markAsRead,
    toggleStar,
    deleteMessage,
    refetch: fetchMessages
  }
}

// Hook pour les services
export function useServices(filters = {}) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [filters.category, filters.active])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams(filters)
      const response = await fetch(`/api/services?${params}`)
      
      if (!response.ok) throw new Error('Erreur lors du chargement des services')
      
      const data = await response.json()
      setServices(data.services)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })
      
      if (!response.ok) throw new Error('Erreur lors de la création')
      
      const newService = await response.json()
      setServices([newService.service, ...services])
      return { success: true, service: newService.service }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const updateService = async (id, serviceData) => {
    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      })
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour')
      
      const updatedService = await response.json()
      setServices(services.map(s => 
        s.id === id ? updatedService.service : s
      ))
      return { success: true, service: updatedService.service }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const deleteService = async (id) => {
    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Erreur lors de la suppression')
      
      setServices(services.filter(s => s.id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  return {
    services,
    loading,
    error,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  }
}

// Hook pour les statistiques du dashboard
export function useDashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques')
      
      const data = await response.json()
      setStats(data.stats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}