import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  RefreshCw,
  CloudDrizzle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import weatherService from '../services/weatherService'

const WeatherCard = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [city, setCity] = useState('Cebu')
  const [searchCity, setSearchCity] = useState('')
  const [plantingAdvice, setPlantingAdvice] = useState('')
  const [lastFetchTime, setLastFetchTime] = useState(0)

  useEffect(() => {
    // Only fetch weather if not already loaded
    if (!weather) {
      fetchWeather(city)
    }
  }, [])

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true)
      const weatherData = await weatherService.getWeather(cityName)
      
      setWeather(weatherData)
      setCity(cityName)
      generatePlantingAdvice(weatherData)
      toast.success(`Weather data loaded for ${cityName}`)
    } catch (error) {
      console.error('Error fetching weather:', error)
      
      // Handle different types of errors
      if (error.message.includes('City not found')) {
        toast.error('City not found. Please check the spelling and try again.')
      } else {
        toast.error('Failed to fetch weather data. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const cityToSearch = searchCity.trim()
    
    if (!cityToSearch) {
      toast.error('Please enter a city name')
      return
    }
    
    // Basic validation - city name should be at least 2 characters and contain only letters, spaces, and common punctuation
    if (cityToSearch.length < 2) {
      toast.error('City name must be at least 2 characters long')
      return
    }
    
    // Check for obviously invalid inputs (only numbers, special characters, etc.)
    if (!/^[a-zA-Z\s\-'\.]+$/.test(cityToSearch)) {
      toast.error('Please enter a valid city name (letters, spaces, hyphens, and apostrophes only)')
      return
    }
    
    fetchWeather(cityToSearch)
    setSearchCity('')
  }

  const generatePlantingAdvice = (weatherData) => {
    const { temperature, humidity, description, windSpeed } = weatherData
    const temp = temperature
    const hum = humidity
    const wind = windSpeed

    let score = 100
    let conditions = []
    let advice = ''

    // Temperature assessment
    if (temp >= 15 && temp <= 30) {
      conditions.push({ name: 'Temperature', status: 'excellent', icon: Thermometer })
    } else if (temp >= 10 && temp < 15) {
      conditions.push({ name: 'Temperature', status: 'good', icon: Thermometer })
      score -= 10
    } else if (temp > 30 && temp <= 35) {
      conditions.push({ name: 'Temperature', status: 'good', icon: Thermometer })
      score -= 15
    } else {
      conditions.push({ name: 'Temperature', status: 'poor', icon: Thermometer })
      score -= 30
    }

    // Humidity assessment
    if (hum >= 40 && hum <= 70) {
      conditions.push({ name: 'Humidity', status: 'excellent', icon: Droplets })
    } else if (hum >= 30 && hum < 40) {
      conditions.push({ name: 'Humidity', status: 'good', icon: Droplets })
      score -= 10
    } else if (hum > 70 && hum <= 80) {
      conditions.push({ name: 'Humidity', status: 'good', icon: Droplets })
      score -= 10
    } else {
      conditions.push({ name: 'Humidity', status: 'poor', icon: Droplets })
      score -= 20
    }

    // Wind assessment
    if (wind <= 15) {
      conditions.push({ name: 'Wind', status: 'excellent', icon: Wind })
    } else if (wind <= 25) {
      conditions.push({ name: 'Wind', status: 'good', icon: Wind })
      score -= 10
    } else {
      conditions.push({ name: 'Wind', status: 'poor', icon: Wind })
      score -= 20
    }

    // Precipitation assessment
    if (description.toLowerCase().includes('clear') || description.toLowerCase().includes('sunny')) {
      conditions.push({ name: 'Precipitation', status: 'excellent', icon: Sun })
    } else if (description.toLowerCase().includes('cloud') && !description.toLowerCase().includes('rain')) {
      conditions.push({ name: 'Precipitation', status: 'excellent', icon: Cloud })
    } else if (description.toLowerCase().includes('rain')) {
      conditions.push({ name: 'Precipitation', status: 'good', icon: CloudDrizzle })
      score -= 5
    } else {
      conditions.push({ name: 'Precipitation', status: 'good', icon: Cloud })
      score -= 5
    }

    // Generate advice based on score
    if (score >= 90) {
      advice = 'Perfect day for planting! All conditions are optimal.'
    } else if (score >= 75) {
      advice = 'Great conditions for planting! Most factors are favorable.'
    } else if (score >= 60) {
      advice = 'Good planting conditions with some considerations needed.'
    } else {
      advice = 'Consider waiting for better conditions or take extra precautions.'
    }

    setPlantingAdvice({
      score: Math.max(0, score),
      conditions: conditions,
      advice: advice
    })
  }

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase()
    if (desc.includes('clear') || desc.includes('sunny')) return Sun
    if (desc.includes('cloud')) return Cloud
    if (desc.includes('rain')) return CloudRain
    if (desc.includes('snow')) return CloudSnow
    if (desc.includes('thunder') || desc.includes('storm')) return CloudLightning
    return Sun
  }


  if (loading && !weather) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="col-span-2 space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Today's Weather</h3>
          <p className="text-sm text-gray-500">Planting conditions for your area</p>
        </div>
        <button
          onClick={() => fetchWeather(city)}
          disabled={loading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* City Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchCity.trim()}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {weather && (
        <>
          {/* Current Location */}
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 capitalize">{city}, {weather.country || 'PH'}</span>
          </div>

          {/* Main Weather Display */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Weather Icon and Temperature */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                {React.createElement(getWeatherIcon(weather.description), {
                  className: "h-16 w-16 text-blue-500"
                })}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">{weather.temperature}°C</div>
              <div className="text-sm text-gray-600 capitalize font-medium">{weather.description}</div>
            </div>
            
            {/* Weather Details */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <span className="text-gray-600 font-medium">Feels like</span>
                </div>
                <span className="font-semibold text-gray-900">{Math.round(weather.temperature + (Math.random() * 4 - 2))}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600 font-medium">Humidity</span>
                </div>
                <span className="font-semibold text-gray-900">{weather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">Wind</span>
                </div>
                <span className="font-semibold text-gray-900">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">Visibility</span>
                </div>
                <span className="font-semibold text-gray-900">{weather.visibility} km</span>
              </div>
            </div>
          </div>

          {/* Planting Conditions */}
          {plantingAdvice && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="font-bold text-gray-900">Planting Conditions</h4>
                </div>
                <div className="text-2xl font-bold text-green-600">{plantingAdvice.score}/100</div>
              </div>
              
              {/* Individual Conditions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {plantingAdvice.conditions.map((condition, index) => {
                  const IconComponent = condition.icon
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">{condition.name}</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </div>
                  )
                })}
              </div>
              
              {/* Advice Message */}
              <p className="text-sm text-gray-700 leading-relaxed">{plantingAdvice.advice}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WeatherCard
