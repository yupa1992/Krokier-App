// API Service für Backend-Kommunikation

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken')
  }

  // Helper für Requests
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config = {
      ...options,
      headers,
      credentials: 'include'
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Netzwerkfehler' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // ============ ADMIN AUTH ============

  async login(username, password) {
    const data = await this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    
    if (data.token) {
      this.token = data.token
      localStorage.setItem('adminToken', data.token)
    }
    
    return data
  }

  async logout() {
    await this.request('/admin/logout', { method: 'POST' })
    this.token = null
    localStorage.removeItem('adminToken')
  }

  async checkStatus() {
    return await this.request('/admin/status')
  }

  async changePassword(currentPassword, newPassword) {
    return await this.request('/admin/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    })
  }

  // ============ SYMBOLS ============

  async getSymbols() {
    return await this.request('/symbols')
  }

  async updateSymbol(id, data) {
    return await this.request(`/symbols/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteSymbol(id) {
    return await this.request(`/symbols/${id}`, { method: 'DELETE' })
  }

  async addSymbol(formData) {
    // FormData für File-Upload
    return await fetch(`${API_URL}/symbols`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      credentials: 'include',
      body: formData
    }).then(res => res.json())
  }

  async bulkUpdateSymbols(symbols) {
    return await this.request('/symbols', {
      method: 'PUT',
      body: JSON.stringify({ symbols })
    })
  }

  // ============ SETTINGS ============

  async getSettings() {
    return await this.request('/settings')
  }

  async updateSettings(settings) {
    return await this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  }

  async uploadLogo(file) {
    const formData = new FormData()
    formData.append('logo', file)

    return await fetch(`${API_URL}/settings/logo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      credentials: 'include',
      body: formData
    }).then(res => res.json())
  }

  // ============ MAPS ============

  async getMaps() {
    return await this.request('/maps')
  }

  async getMap(id) {
    return await this.request(`/maps/${id}`)
  }

  async saveMap(mapData) {
    return await this.request('/maps/save', {
      method: 'POST',
      body: JSON.stringify(mapData)
    })
  }

  async deleteMap(id) {
    return await this.request(`/maps/${id}`, { method: 'DELETE' })
  }
}

export default new ApiService()
