import axios from 'axios'

class AuthService {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.CACHE_TTL = 5 * 1000 // 5 seconds in milliseconds
  }

  async getAuthStatus() {
    const cacheKey = 'auth_status'
    const now = Date.now()

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey)
      if (now - timestamp < this.CACHE_TTL) {
        console.log(`🔐 Auth status cache hit (cached ${Math.floor((now - timestamp) / 1000)}s ago)`)
        return data
      } else {
        // Cache expired, remove it
        this.cache.delete(cacheKey)
      }
    }

    // Check if there's already a pending request
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔐 Auth status request already pending, waiting...`)
      return this.pendingRequests.get(cacheKey)
    }

    // Create new request
    const requestPromise = this.fetchAuthStatusFromAPI()
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const data = await requestPromise
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: now })
      console.log(`🔐 Auth status cached`)
      return data
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey)
    }
  }

  async fetchAuthStatusFromAPI() {
    try {
      console.log(`🔐 Fetching fresh auth status`)
      const response = await axios.get('/auth/status')
      return response.data
    } catch (error) {
      console.error('Auth status API error:', error)
      throw error
    }
  }

  // Clear cache (useful for logout or manual refresh)
  clearCache() {
    this.cache.clear()
    this.pendingRequests.clear()
    console.log('🔐 Auth status cache cleared')
  }

  // Get cache stats
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheKeys: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export default new AuthService()
