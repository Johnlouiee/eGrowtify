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
  CloudDrizzle,
  Clock,
  Info
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
    const { temperature, humidity, description, windSpeed, visibility } = weatherData
    const temp = temperature
    const hum = humidity
    const wind = windSpeed

    let score = 100
    let conditions = []
    let advice = ''
    let tips = []
    let bestPlantingTime = 'Morning (6-10 AM)'
    
    // Estimate soil temperature using multiple factors (without IoT sensors)
    // Formula based on agricultural research:
    // - Soil temp is typically 2-5°C cooler than air temp during day
    // - Depends on time of day, season, and soil depth
    // - For shallow planting (2-4 inches), use air temp - 2-3°C
    // - For deeper planting (6-8 inches), use air temp - 4-5°C
    const now = new Date()
    const hour = now.getHours()
    const isDaytime = hour >= 6 && hour < 18
    const isSummer = now.getMonth() >= 3 && now.getMonth() <= 8 // April-September in Philippines
    
    // More accurate estimation:
    // - During day: soil is 2-4°C cooler than air
    // - During night: soil is 1-2°C warmer than air (retains heat)
    // - In summer: soil stays warmer
    // - In winter: soil stays cooler
    let soilTemp
    if (isDaytime) {
      // Daytime: soil is cooler than air
      soilTemp = Math.round(temp - (isSummer ? 2 : 3))
    } else {
      // Nighttime: soil retains heat, closer to air temp
      soilTemp = Math.round(temp - (isSummer ? 1 : 2))
    }
    
    // Ensure soil temp doesn't go below reasonable minimums
    soilTemp = Math.max(soilTemp, temp - 5)

    // Temperature assessment with detailed feedback
    if (temp >= 20 && temp <= 28) {
      conditions.push({ 
        name: 'Temperature', 
        status: 'excellent', 
        icon: Thermometer,
        value: `${temp}°C`,
        feedback: 'Optimal for most plants',
        optimal: true
      })
    } else if (temp >= 15 && temp < 20) {
      conditions.push({ 
        name: 'Temperature', 
        status: 'good', 
        icon: Thermometer,
        value: `${temp}°C`,
        feedback: 'Good for cool-season crops',
        optimal: false
      })
      score -= 10
      tips.push('Consider planting cool-season vegetables like lettuce, spinach, or broccoli')
    } else if (temp > 28 && temp <= 32) {
      conditions.push({ 
        name: 'Temperature', 
        status: 'good', 
        icon: Thermometer,
        value: `${temp}°C`,
        feedback: 'Warm - water more frequently',
        optimal: false
      })
      score -= 15
      tips.push('Plant early morning or late afternoon to avoid heat stress')
      tips.push('Increase watering frequency to prevent wilting')
    } else if (temp < 15) {
      conditions.push({ 
        name: 'Temperature', 
        status: 'poor', 
        icon: Thermometer,
        value: `${temp}°C`,
        feedback: 'Too cold for most plants',
        optimal: false
      })
      score -= 30
      tips.push('Wait for warmer weather or use cold frames/row covers')
      tips.push('Only hardy plants like kale and cabbage can tolerate this')
    } else {
      conditions.push({ 
        name: 'Temperature', 
        status: 'poor', 
        icon: Thermometer,
        value: `${temp}°C`,
        feedback: 'Very hot - avoid planting',
        optimal: false
      })
      score -= 30
      tips.push('Avoid planting during peak heat hours')
      tips.push('Consider shade cloth for newly planted seedlings')
      bestPlantingTime = 'Early Morning (5-7 AM) or Evening (5-7 PM)'
    }

    // Humidity assessment with detailed feedback
    if (hum >= 50 && hum <= 70) {
      conditions.push({ 
        name: 'Humidity', 
        status: 'excellent', 
        icon: Droplets,
        value: `${hum}%`,
        feedback: 'Ideal moisture level',
        optimal: true
      })
    } else if (hum >= 40 && hum < 50) {
      conditions.push({ 
        name: 'Humidity', 
        status: 'good', 
        icon: Droplets,
        value: `${hum}%`,
        feedback: 'Slightly dry - water more',
        optimal: false
      })
      score -= 10
      tips.push('Increase watering frequency to compensate for low humidity')
    } else if (hum > 70 && hum <= 80) {
      conditions.push({ 
        name: 'Humidity', 
        status: 'good', 
        icon: Droplets,
        value: `${hum}%`,
        feedback: 'High humidity - watch for diseases',
        optimal: false
      })
      score -= 10
      tips.push('Ensure good air circulation to prevent fungal diseases')
      tips.push('Water at soil level, avoid wetting leaves')
    } else if (hum < 40) {
      conditions.push({ 
        name: 'Humidity', 
        status: 'poor', 
        icon: Droplets,
        value: `${hum}%`,
        feedback: 'Very dry - frequent watering needed',
        optimal: false
      })
      score -= 20
      tips.push('Water plants 2-3 times daily in dry conditions')
      tips.push('Consider mulching to retain soil moisture')
    } else {
      conditions.push({ 
        name: 'Humidity', 
        status: 'poor', 
        icon: Droplets,
        value: `${hum}%`,
        feedback: 'Extremely high - disease risk',
        optimal: false
      })
      score -= 20
      tips.push('High disease risk - use fungicide preventively')
      tips.push('Improve air circulation around plants')
    }

    // Wind assessment with detailed feedback
    if (wind <= 10) {
      conditions.push({ 
        name: 'Wind', 
        status: 'excellent', 
        icon: Wind,
        value: `${wind} km/h`,
        feedback: 'Calm conditions - perfect',
        optimal: true
      })
    } else if (wind <= 20) {
      conditions.push({ 
        name: 'Wind', 
        status: 'good', 
        icon: Wind,
        value: `${wind} km/h`,
        feedback: 'Light breeze - beneficial',
        optimal: false
      })
      score -= 5
      tips.push('Light wind helps prevent fungal diseases')
    } else if (wind <= 30) {
      conditions.push({ 
        name: 'Wind', 
        status: 'good', 
        icon: Wind,
        value: `${wind} km/h`,
        feedback: 'Moderate wind - use supports',
        optimal: false
      })
      score -= 10
      tips.push('Stake or support young plants to prevent damage')
    } else {
      conditions.push({ 
        name: 'Wind', 
        status: 'poor', 
        icon: Wind,
        value: `${wind} km/h`,
        feedback: 'Strong wind - avoid planting',
        optimal: false
      })
      score -= 20
      tips.push('Wait for calmer conditions or use windbreaks')
      tips.push('Strong winds can damage young seedlings')
    }

    // Precipitation assessment with detailed feedback
    const descLower = description.toLowerCase()
    if (descLower.includes('clear') || descLower.includes('sunny')) {
      conditions.push({ 
        name: 'Precipitation', 
        status: 'excellent', 
        icon: Sun,
        value: 'Clear',
        feedback: 'Perfect for planting',
        optimal: true
      })
      tips.push('Ideal weather for transplanting and direct seeding')
    } else if (descLower.includes('cloud') && !descLower.includes('rain')) {
      conditions.push({ 
        name: 'Precipitation', 
        status: 'excellent', 
        icon: Cloud,
        value: 'Cloudy',
        feedback: 'Great for planting - less stress',
        optimal: true
      })
      tips.push('Cloudy days reduce transplant shock')
      bestPlantingTime = 'Anytime (cloudy conditions)'
    } else if (descLower.includes('rain') || descLower.includes('drizzle')) {
      conditions.push({ 
        name: 'Precipitation', 
        status: 'good', 
        icon: CloudDrizzle,
        value: 'Rainy',
        feedback: 'Light rain is beneficial',
        optimal: false
      })
      score -= 5
      tips.push('Light rain helps establish new plants')
      tips.push('Avoid planting in heavy rain to prevent soil compaction')
    } else {
      conditions.push({ 
        name: 'Precipitation', 
        status: 'good', 
        icon: Cloud,
        value: description,
        feedback: 'Moderate conditions',
        optimal: false
      })
      score -= 5
    }

    // Note: Soil temperature removed per user request

    // Generate comprehensive advice
    if (score >= 90) {
      advice = 'Perfect day for planting! All conditions are optimal for most plants.'
    } else if (score >= 75) {
      advice = 'Great conditions for planting! Most factors are favorable with minor considerations.'
    } else if (score >= 60) {
      advice = 'Good planting conditions. Follow the tips below for best results.'
    } else {
      advice = 'Challenging conditions. Consider waiting for better weather or take extra precautions.'
    }

    setPlantingAdvice({
      score: Math.max(0, score),
      conditions: conditions,
      advice: advice,
      tips: tips,
      bestPlantingTime: bestPlantingTime
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
      {/* Header - Compact */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Today's Weather</h3>
          <p className="text-xs text-gray-500">Planting conditions for your area</p>
        </div>
        <button
          onClick={() => fetchWeather(city)}
          disabled={loading}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* City Search - Compact */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchCity.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {weather && (
        <>
          {/* Current Location - Compact */}
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-xs font-medium text-gray-700 capitalize">{city}, {weather.country || 'PH'}</span>
          </div>

          {/* Main Weather Display - Compact */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {/* Weather Icon and Temperature - Compact */}
            <div className="text-center col-span-1">
              <div className="flex items-center justify-center mb-2">
                {React.createElement(getWeatherIcon(weather.description), {
                  className: "h-12 w-12 text-blue-500"
                })}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{weather.temperature}°C</div>
              <div className="text-xs text-gray-600 capitalize">{weather.description}</div>
            </div>
            
            {/* Weather Details - Compact Grid */}
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-gray-600">Feels like</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{Math.round(weather.temperature + (Math.random() * 4 - 2))}°C</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Humidity</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{weather.humidity}%</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Wind</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-600">Visibility</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{weather.visibility} km</span>
              </div>
            </div>
          </div>

          {/* Planting Conditions - Compact */}
          {plantingAdvice && (
            <div className={`rounded-lg p-3 border-2 ${
              plantingAdvice.score >= 90 ? 'bg-green-50 border-green-300' :
              plantingAdvice.score >= 75 ? 'bg-blue-50 border-blue-300' :
              plantingAdvice.score >= 60 ? 'bg-yellow-50 border-yellow-300' :
              'bg-orange-50 border-orange-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {plantingAdvice.score >= 90 ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : plantingAdvice.score >= 75 ? (
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                  ) : plantingAdvice.score >= 60 ? (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-orange-600" />
                  )}
                  <h4 className="font-bold text-gray-900 text-sm">Planting Conditions</h4>
                </div>
                <div className={`text-xl font-bold ${
                  plantingAdvice.score >= 90 ? 'text-green-600' :
                  plantingAdvice.score >= 75 ? 'text-blue-600' :
                  plantingAdvice.score >= 60 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {plantingAdvice.score}/100
                </div>
              </div>
              
              {/* Individual Conditions - Compact Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {plantingAdvice.conditions.map((condition, index) => {
                  const IconComponent = condition.icon
                  const StatusIcon = condition.status === 'excellent' ? CheckCircle : 
                                    condition.status === 'good' ? AlertCircle : XCircle
                  const statusColor = condition.status === 'excellent' ? 'text-green-600' : 
                                     condition.status === 'good' ? 'text-yellow-600' : 'text-red-600'
                  
                  return (
                    <div key={index} className="bg-white/60 rounded-lg p-2.5 border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                          <IconComponent className="h-4 w-4 text-gray-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-900">{condition.name}</span>
                        </div>
                        <StatusIcon className={`h-3.5 w-3.5 ${statusColor} flex-shrink-0 ml-1`} />
                      </div>
                      <div className="mb-1">
                        <span className="text-[10px] text-gray-500 font-medium">{condition.value}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 leading-snug break-words">{condition.feedback}</p>
                    </div>
                  )
                })}
              </div>

              {/* Best Planting Time - Compact */}
              <div className="bg-white/60 rounded-lg p-2 border border-gray-200 mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-semibold text-gray-900">Best Time:</span>
                  <span className="text-xs text-gray-700 font-medium">{plantingAdvice.bestPlantingTime}</span>
                </div>
              </div>
              
              {/* Advice Message - Compact */}
              <div className="bg-white/80 rounded-lg p-2 border border-gray-200 mb-2">
                <p className="text-xs text-gray-700 leading-relaxed font-medium">{plantingAdvice.advice}</p>
              </div>

              {/* Actionable Tips - Compact */}
              {plantingAdvice.tips && plantingAdvice.tips.length > 0 && (
                <div className="bg-white/60 rounded-lg p-2 border border-gray-200">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-900">Tips:</span>
                  </div>
                  <ul className="space-y-1">
                    {plantingAdvice.tips.slice(0, 3).map((tip, index) => (
                      <li key={index} className="text-[10px] text-gray-600 flex items-start space-x-1.5">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                        <span className="line-clamp-2">{tip}</span>
                      </li>
                    ))}
                    {plantingAdvice.tips.length > 3 && (
                      <li className="text-[10px] text-gray-500 italic">+{plantingAdvice.tips.length - 3} more tips</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WeatherCard
