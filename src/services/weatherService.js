import axios from 'axios'

class WeatherService {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.CACHE_TTL = 10 * 60 * 1000 // 10 minutes in milliseconds
  }

  async getWeather(city) {
    const cacheKey = city.toLowerCase()
    const now = Date.now()

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey)
      if (now - timestamp < this.CACHE_TTL) {
        console.log(`🌤️ Weather cache hit for ${city} (cached ${Math.floor((now - timestamp) / 1000)}s ago)`)
        return data
      } else {
        // Cache expired, remove it
        this.cache.delete(cacheKey)
      }
    }

    // Check if there's already a pending request for this city
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🌤️ Weather request already pending for ${city}, waiting...`)
      return this.pendingRequests.get(cacheKey)
    }

    // Create new request
    const requestPromise = this.fetchWeatherFromAPI(city)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const data = await requestPromise
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: now })
      console.log(`🌤️ Weather data cached for ${city}`)
      return data
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey)
    }
  }

  async fetchWeatherFromAPI(city) {
    try {
      console.log(`🌤️ Fetching fresh weather data for ${city}`)
      const response = await axios.get(`/api/weather?city=${encodeURIComponent(city)}`)
      
      if (response.data.success === false) {
        throw new Error(response.data.error || 'City not found')
      }
      
      return response.data
    } catch (error) {
      console.error('Weather API error:', error)
      throw error
    }
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    this.cache.clear()
    this.pendingRequests.clear()
    console.log('🌤️ Weather cache cleared')
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
export default new WeatherService()
