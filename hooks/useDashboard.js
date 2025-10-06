import { useState, useEffect, useCallback } from 'react'
import dashboardAPI from '../lib/api'

export function useDashboard(guildId) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    stats: null,
    tickets: null,
    feedback: null,
    autoResponses: null,
    categories: null,
    config: null
  })

  const loadData = useCallback(async () => {
    if (!guildId) return

    try {
      setLoading(true)
      setError(null)

      // Lade alle Dashboard-Daten parallel
      const [stats, tickets, feedback, autoResponses, categories, config] = await Promise.all([
        dashboardAPI.getServerStats(guildId),
        dashboardAPI.getTicketStats(guildId),
        dashboardAPI.getFeedbackStats(guildId),
        dashboardAPI.getAutoResponses(guildId),
        dashboardAPI.getCategories(guildId),
        dashboardAPI.getConfig(guildId)
      ])

      setData({
        stats,
        tickets,
        feedback,
        autoResponses,
        categories,
        config
      })

    } catch (err) {
      console.error('Dashboard data loading error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [guildId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Live-Updates
  useEffect(() => {
    if (!guildId || !data.stats) return

    const liveConnection = dashboardAPI.connectToLiveData(guildId, (liveData) => {
      if (liveData.type === 'stats') {
        setData(prev => ({
          ...prev,
          stats: { ...prev.stats, ...liveData.data }
        }))
      }
    })

    return () => {
      liveConnection.close()
    }
  }, [guildId, data.stats])

  return {
    loading,
    error,
    data,
    refetch: loadData
  }
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check für gespeicherte Auth-Daten
    const token = localStorage.getItem('dashboard_token')
    const userData = localStorage.getItem('dashboard_user')

    if (token && userData) {
      dashboardAPI.setToken(token)
      setUser(JSON.parse(userData))
    }
    
    setLoading(false)
  }, [])

  const login = async (code, guildId) => {
    try {
      const response = await dashboardAPI.authenticateWithDiscord(code, guildId)
      
      if (response.success) {
        localStorage.setItem('dashboard_token', response.token)
        localStorage.setItem('dashboard_user', JSON.stringify(response.user))
        
        dashboardAPI.setToken(response.token)
        setUser(response.user)
        
        return response
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('dashboard_token')
    localStorage.removeItem('dashboard_user')
    dashboardAPI.setToken(null)
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }
}