// API Client für Dashboard-Integration
const API_BASE = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_BOT_API_URL || 'https://your-bot-api.herokuapp.com/api'
  : 'http://localhost:3001/api'

class DashboardAPI {
  constructor() {
    this.baseURL = API_BASE
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Authentication
  async authenticateWithDiscord(code, guildId) {
    return this.request('/auth/discord', {
      method: 'POST',
      body: JSON.stringify({ code, guildId }),
    })
  }

  // Dashboard Data
  async getServerStats(guildId) {
    return this.request(`/dashboard/${guildId}/stats`)
  }

  async getTicketStats(guildId) {
    return this.request(`/dashboard/${guildId}/tickets`)
  }

  async getFeedbackStats(guildId) {
    return this.request(`/dashboard/${guildId}/feedback`)
  }

  async getAutoResponses(guildId) {
    return this.request(`/dashboard/${guildId}/autoresponses`)
  }

  async getCategories(guildId) {
    return this.request(`/dashboard/${guildId}/categories`)
  }

  async getConfig(guildId) {
    return this.request(`/dashboard/${guildId}/config`)
  }

  // Live Data Connection
  connectToLiveData(guildId, onMessage) {
    const eventSource = new EventSource(
      `${this.baseURL}/dashboard/${guildId}/live?token=${this.token}`
    )
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('Error parsing live data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Live data connection error:', error)
    }

    return eventSource
  }

  // Health Check
  async healthCheck() {
    return this.request('/health')
  }
}

export const dashboardAPI = new DashboardAPI()
export default dashboardAPI