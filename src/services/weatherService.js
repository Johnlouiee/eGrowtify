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
      // Use cached data if it's less than 30 minutes old (extended TTL for rate limiting)
      if (now - timestamp < (30 * 60 * 1000)) {
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
      
      // If rate limited, try to use cached data even if expired
      if (data.rateLimited) {
        console.warn(`⚠️ Rate limit reached for ${city}, checking for cached data...`)
        if (this.cache.has(cacheKey)) {
          const { data: cachedData } = this.cache.get(cacheKey)
          console.log(`🌤️ Using expired cached data for ${city} due to rate limiting`)
          return cachedData
        }
        // Return rate limited flag so caller can use fallback
        return data
      }
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: now })
      console.log(`🌤️ Weather data cached for ${city}`)
      return data
    } catch (error) {
      // If error and we have cached data (even expired), use it
      if (this.cache.has(cacheKey)) {
        const { data: cachedData } = this.cache.get(cacheKey)
        console.log(`🌤️ Using cached data for ${city} due to API error`)
        return cachedData
      }
      throw error
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
      // Handle rate limiting (429) gracefully - don't throw, return special flag
      if (error.response && error.response.status === 429) {
        // Silently handle rate limiting - don't log as error
        // Return a special object that indicates rate limiting
        return {
          success: false,
          error: 'Rate limit exceeded',
          rateLimited: true
        }
      }
      
      // For other errors, only log if it's not a network error
      if (error.response && error.response.status !== 429) {
        // Only log unexpected errors, not common network issues
        if (error.response.status >= 500) {
          console.error('Weather API server error:', error.response.status)
        }
      }
      
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
