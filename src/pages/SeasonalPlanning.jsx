import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Sun, Cloud, Leaf, Droplets, Thermometer, Clock, Wind, Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SeasonalPlanning = () => {
  const [currentSeason, setCurrentSeason] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [plantingCalendar, setPlantingCalendar] = useState([])
  const [seasonalTips, setSeasonalTips] = useState([])
  const [recommendedPlants, setRecommendedPlants] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [weatherSuggestions, setWeatherSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [userCoordinates, setUserCoordinates] = useState(null)
  const [forecastData, setForecastData] = useState(null)

  useEffect(() => {
    initializeSeasonalData()
  }, [])

  const initializeSeasonalData = async () => {
    try {
      // Get current season
      const month = new Date().getMonth()
      const season = getSeasonFromMonth(month)
      setCurrentSeason(season)

      // Get user location
      await getUserLocation()

      // Fetch seasonal data
      await fetchSeasonalData(season)
      setLoading(false)
    } catch (error) {
      console.error('Error initializing seasonal data:', error)
      setLoading(false)
    }
  }

  const getUserLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            setUserCoordinates({ lat: latitude, lng: longitude })
            
            // Get location name from coordinates
            const locationName = await getLocationName(latitude, longitude)
            setUserLocation(locationName)
            
            // Fetch weather data
            await fetchWeatherData(latitude, longitude)
          },
          (error) => {
            console.error('Geolocation error:', error)
            // Fallback to default location
            setUserLocation('New York, NY')
            setUserCoordinates({ lat: 40.7128, lng: -74.0060 })
            fetchWeatherData(40.7128, -74.0060)
          }
        )
      } else {
        // Fallback to default location
        setUserLocation('New York, NY')
        setUserCoordinates({ lat: 40.7128, lng: -74.0060 })
        fetchWeatherData(40.7128, -74.0060)
      }
    } catch (error) {
      console.error('Error getting location:', error)
      setUserLocation('New York, NY')
      setUserCoordinates({ lat: 40.7128, lng: -74.0060 })
      fetchWeatherData(40.7128, -74.0060)
    }
  }

  const getLocationName = async (lat, lng) => {
    try {
      // Using a free geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
      const data = await response.json()
      return `${data.city || data.locality}, ${data.principalSubdivision}`
    } catch (error) {
      console.error('Error getting location name:', error)
      return 'Unknown Location'
    }
  }

  const fetchWeatherData = async (lat, lng) => {
    try {
      // Mock weather data - in production, use a real weather API like OpenWeatherMap
      const mockWeatherData = {
        temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        forecast: [
          { day: 'Today', high: Math.floor(Math.random() * 30) + 50, low: Math.floor(Math.random() * 20) + 30, condition: 'Sunny' },
          { day: 'Tomorrow', high: Math.floor(Math.random() * 30) + 50, low: Math.floor(Math.random() * 20) + 30, condition: 'Partly Cloudy' },
          { day: 'Day 3', high: Math.floor(Math.random() * 30) + 50, low: Math.floor(Math.random() * 20) + 30, condition: 'Cloudy' }
        ],
        lastFrost: 'April 15',
        firstFrost: 'October 30',
        growingSeason: '195 days'
      }

      setWeatherData(mockWeatherData)
      setForecastData(mockWeatherData.forecast)
      
      // Generate weather-based suggestions
      generateWeatherSuggestions(mockWeatherData)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // Fallback weather data
      setWeatherData({
        temperature: '72°F',
        humidity: '65%',
        windSpeed: '8 mph',
        conditions: 'Partly Cloudy',
        forecast: [],
        lastFrost: 'April 15',
        firstFrost: 'October 30',
        growingSeason: '195 days'
      })
    }
  }

  const generateWeatherSuggestions = (weather) => {
    const suggestions = []
    
    // Temperature-based suggestions
    if (weather.temperature > 75) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Hot Weather Alert',
        message: 'Temperatures are high. Water plants early morning or evening to prevent evaporation.',
        action: 'Increase watering frequency and provide shade for sensitive plants.'
      })
    } else if (weather.temperature < 50) {
      suggestions.push({
        type: 'info',
        icon: Info,
        title: 'Cool Weather',
        message: 'Cool temperatures are ideal for cool-season crops and transplanting.',
        action: 'Perfect time to plant lettuce, spinach, and other cool-weather vegetables.'
      })
    }

    // Humidity-based suggestions
    if (weather.humidity > 70) {
      suggestions.push({
        type: 'warning',
        icon: Cloud,
        title: 'High Humidity',
        message: 'High humidity can promote fungal diseases.',
        action: 'Ensure good air circulation and avoid overhead watering.'
      })
    } else if (weather.humidity < 40) {
      suggestions.push({
        type: 'info',
        icon: Droplets,
        title: 'Low Humidity',
        message: 'Low humidity may require more frequent watering.',
        action: 'Check soil moisture regularly and consider mulching to retain moisture.'
      })
    }

    // Wind-based suggestions
    if (weather.windSpeed > 15) {
      suggestions.push({
        type: 'warning',
        icon: Wind,
        title: 'High Winds',
        message: 'Strong winds can damage young plants and increase water loss.',
        action: 'Stake tall plants and provide wind protection for seedlings.'
      })
    }

    // Seasonal planting suggestions
    const currentMonth = new Date().getMonth()
    if (currentMonth >= 2 && currentMonth <= 4) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Spring Planting Season',
        message: 'Perfect time for starting seeds and planting cool-season crops.',
        action: 'Start tomatoes, peppers, and herbs indoors. Plant peas, lettuce, and spinach outdoors.'
      })
    }

    setWeatherSuggestions(suggestions)
  }

  const getSeasonFromMonth = (month) => {
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  const fetchSeasonalData = async (season) => {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Enhanced planting calendar data with detailed plant information
      const mockPlantingCalendar = [
        {
          month: 'January',
          indoor: [
            { name: 'Herbs (Basil, Parsley)', timing: '6-8 weeks before last frost', difficulty: 'Easy' },
            { name: 'Microgreens', timing: 'Harvest in 7-14 days', difficulty: 'Easy' },
            { name: 'Lettuce', timing: '4-6 weeks before transplant', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Garlic', timing: 'Plant cloves 2-4 weeks before ground freezes', difficulty: 'Easy' },
            { name: 'Onions', timing: 'Plant sets in late winter', difficulty: 'Easy' }
          ],
          tips: 'Start seeds indoors for early spring planting. Use grow lights for 14-16 hours daily.',
          weather_considerations: 'Protect outdoor plants from frost. Monitor soil moisture.'
        },
        {
          month: 'February',
          indoor: [
            { name: 'Tomatoes', timing: '6-8 weeks before last frost', difficulty: 'Medium' },
            { name: 'Peppers', timing: '8-10 weeks before last frost', difficulty: 'Medium' },
            { name: 'Eggplant', timing: '8-10 weeks before last frost', difficulty: 'Medium' },
            { name: 'Herbs', timing: '4-6 weeks before transplant', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Peas', timing: 'As soon as soil can be worked', difficulty: 'Easy' },
            { name: 'Spinach', timing: '4-6 weeks before last frost', difficulty: 'Easy' },
            { name: 'Kale', timing: '4-6 weeks before last frost', difficulty: 'Easy' }
          ],
          tips: 'Prepare garden beds and test soil pH. Most vegetables prefer pH 6.0-7.0.',
          weather_considerations: 'Watch for late frosts. Use row covers for protection.'
        },
        {
          month: 'March',
          indoor: [
            { name: 'Cucumbers', timing: '3-4 weeks before last frost', difficulty: 'Easy' },
            { name: 'Squash', timing: '3-4 weeks before last frost', difficulty: 'Easy' },
            { name: 'Melons', timing: '3-4 weeks before last frost', difficulty: 'Medium' }
          ],
          outdoor: [
            { name: 'Carrots', timing: '2-4 weeks before last frost', difficulty: 'Easy' },
            { name: 'Beets', timing: '2-4 weeks before last frost', difficulty: 'Easy' },
            { name: 'Radishes', timing: '2-4 weeks before last frost', difficulty: 'Easy' },
            { name: 'Lettuce', timing: '4-6 weeks before last frost', difficulty: 'Easy' }
          ],
          tips: 'Begin hardening off indoor seedlings. Gradually expose to outdoor conditions.',
          weather_considerations: 'Monitor soil temperature. Most seeds need 50°F+ soil.'
        },
        {
          month: 'April',
          indoor: [
            { name: 'Late season tomatoes', timing: '4-6 weeks before last frost', difficulty: 'Medium' },
            { name: 'Herbs', timing: '2-4 weeks before transplant', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Tomatoes', timing: 'After last frost date', difficulty: 'Medium' },
            { name: 'Peppers', timing: 'After last frost date', difficulty: 'Medium' },
            { name: 'Corn', timing: 'After last frost date', difficulty: 'Easy' },
            { name: 'Beans', timing: 'After last frost date', difficulty: 'Easy' }
          ],
          tips: 'Plant after last frost date. Use mulch to retain moisture and prevent weeds.',
          weather_considerations: 'Check frost dates for your area. Protect tender plants.'
        },
        {
          month: 'May',
          indoor: [
            { name: 'Fall crops (Broccoli, Cauliflower)', timing: '12-14 weeks before first frost', difficulty: 'Medium' }
          ],
          outdoor: [
            { name: 'Squash', timing: 'After last frost date', difficulty: 'Easy' },
            { name: 'Cucumbers', timing: 'After last frost date', difficulty: 'Easy' },
            { name: 'Melons', timing: 'After last frost date', difficulty: 'Medium' },
            { name: 'Okra', timing: 'After last frost date', difficulty: 'Easy' }
          ],
          tips: 'Mulch to retain moisture and prevent weeds. Water deeply but less frequently.',
          weather_considerations: 'Watch for heat stress. Provide shade for sensitive plants.'
        },
        {
          month: 'June',
          indoor: [
            { name: 'Fall vegetables', timing: '10-12 weeks before first frost', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Bush beans', timing: 'Succession plant every 2-3 weeks', difficulty: 'Easy' },
            { name: 'Lettuce', timing: 'Succession plant in shade', difficulty: 'Easy' },
            { name: 'Radishes', timing: 'Succession plant every 2 weeks', difficulty: 'Easy' }
          ],
          tips: 'Water deeply and regularly. Harvest regularly to encourage production.',
          weather_considerations: 'Hot weather may cause bolting. Provide afternoon shade.'
        },
        {
          month: 'July',
          indoor: [
            { name: 'Fall crops', timing: '8-10 weeks before first frost', difficulty: 'Medium' }
          ],
          outdoor: [
            { name: 'Fall peas', timing: '8-10 weeks before first frost', difficulty: 'Easy' },
            { name: 'Lettuce', timing: 'Succession plant in shade', difficulty: 'Easy' },
            { name: 'Spinach', timing: '8-10 weeks before first frost', difficulty: 'Easy' }
          ],
          tips: 'Harvest regularly to encourage production. Start planning fall garden.',
          weather_considerations: 'Extreme heat may require extra watering and shade.'
        },
        {
          month: 'August',
          indoor: [
            { name: 'Winter herbs', timing: '6-8 weeks before first frost', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Fall vegetables', timing: '6-8 weeks before first frost', difficulty: 'Easy' },
            { name: 'Garlic', timing: 'Plant for next year', difficulty: 'Easy' },
            { name: 'Onions', timing: 'Plant for next year', difficulty: 'Easy' }
          ],
          tips: 'Start fall garden planning. Plant garlic and onions for next year.',
          weather_considerations: 'Cooler temperatures are ideal for fall planting.'
        },
        {
          month: 'September',
          indoor: [
            { name: 'Indoor herbs', timing: 'Year-round', difficulty: 'Easy' },
            { name: 'Microgreens', timing: 'Harvest in 7-14 days', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Garlic', timing: 'Plant cloves for next year', difficulty: 'Easy' },
            { name: 'Cover crops', timing: 'Plant to improve soil', difficulty: 'Easy' }
          ],
          tips: 'Plant garlic for next year. Consider cover crops to improve soil health.',
          weather_considerations: 'Cooler weather is perfect for root development.'
        },
        {
          month: 'October',
          indoor: [
            { name: 'Indoor vegetables', timing: 'Year-round', difficulty: 'Easy' },
            { name: 'Herbs', timing: 'Year-round', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Garlic', timing: 'Plant cloves for next year', difficulty: 'Easy' },
            { name: 'Cover crops', timing: 'Plant to improve soil', difficulty: 'Easy' }
          ],
          tips: 'Clean up garden and add compost. Plant garlic and cover crops.',
          weather_considerations: 'First frost dates approaching. Protect tender plants.'
        },
        {
          month: 'November',
          indoor: [
            { name: 'Indoor herbs', timing: 'Year-round', difficulty: 'Easy' },
            { name: 'Microgreens', timing: 'Harvest in 7-14 days', difficulty: 'Easy' }
          ],
          outdoor: [
            { name: 'Garlic', timing: 'Plant cloves for next year', difficulty: 'Easy' }
          ],
          tips: 'Protect perennial plants. Mulch around base to insulate roots.',
          weather_considerations: 'Frost protection needed. Monitor soil moisture.'
        },
        {
          month: 'December',
          indoor: [
            { name: 'Indoor herbs', timing: 'Year-round', difficulty: 'Easy' },
            { name: 'Microgreens', timing: 'Harvest in 7-14 days', difficulty: 'Easy' }
          ],
          outdoor: [],
          tips: 'Plan next year\'s garden. Order seeds and supplies for spring.',
          weather_considerations: 'Winter protection essential. Monitor for winter damage.'
        }
      ]

      // Mock seasonal tips
      const mockSeasonalTips = {
        spring: [
          {
            title: 'Soil Preparation',
            description: 'Test your soil pH and add necessary amendments. Most vegetables prefer a pH between 6.0-7.0.',
            icon: Leaf
          },
          {
            title: 'Frost Protection',
            description: 'Keep frost cloth handy for late spring frosts. Protect tender seedlings.',
            icon: Thermometer
          },
          {
            title: 'Watering Schedule',
            description: 'Water deeply but less frequently to encourage deep root growth.',
            icon: Droplets
          }
        ],
        summer: [
          {
            title: 'Mulching',
            description: 'Apply 2-3 inches of mulch to retain moisture and keep soil cool.',
            icon: Leaf
          },
          {
            title: 'Pest Management',
            description: 'Monitor for pests regularly. Use organic methods when possible.',
            icon: Cloud
          },
          {
            title: 'Harvest Timing',
            description: 'Harvest vegetables when they\'re at peak ripeness for best flavor.',
            icon: Clock
          }
        ],
        fall: [
          {
            title: 'Fall Planting',
            description: 'Plant cool-season crops like lettuce, spinach, and kale.',
            icon: Leaf
          },
          {
            title: 'Garden Cleanup',
            description: 'Remove spent plants and add to compost pile.',
            icon: Sun
          },
          {
            title: 'Soil Amendment',
            description: 'Add compost and organic matter to prepare for next season.',
            icon: Leaf
          }
        ],
        winter: [
          {
            title: 'Indoor Gardening',
            description: 'Grow herbs and microgreens indoors for fresh produce.',
            icon: Sun
          },
          {
            title: 'Garden Planning',
            description: 'Plan next year\'s garden layout and order seeds.',
            icon: Calendar
          },
          {
            title: 'Tool Maintenance',
            description: 'Clean and sharpen garden tools for next season.',
            icon: Leaf
          }
        ]
      }

      // Mock recommended plants
      const mockRecommendedPlants = {
        spring: [
          { name: 'Tomatoes', type: 'Vegetable', difficulty: 'Easy', harvest_time: '60-80 days' },
          { name: 'Basil', type: 'Herb', difficulty: 'Easy', harvest_time: '30-60 days' },
          { name: 'Lettuce', type: 'Vegetable', difficulty: 'Easy', harvest_time: '45-60 days' },
          { name: 'Peas', type: 'Vegetable', difficulty: 'Easy', harvest_time: '60-70 days' }
        ],
        summer: [
          { name: 'Cucumbers', type: 'Vegetable', difficulty: 'Easy', harvest_time: '50-70 days' },
          { name: 'Zucchini', type: 'Vegetable', difficulty: 'Easy', harvest_time: '45-55 days' },
          { name: 'Bell Peppers', type: 'Vegetable', difficulty: 'Medium', harvest_time: '60-90 days' },
          { name: 'Rosemary', type: 'Herb', difficulty: 'Easy', harvest_time: '90-120 days' }
        ],
        fall: [
          { name: 'Kale', type: 'Vegetable', difficulty: 'Easy', harvest_time: '50-65 days' },
          { name: 'Spinach', type: 'Vegetable', difficulty: 'Easy', harvest_time: '40-50 days' },
          { name: 'Garlic', type: 'Vegetable', difficulty: 'Easy', harvest_time: '240-270 days' },
          { name: 'Sage', type: 'Herb', difficulty: 'Easy', harvest_time: '75-80 days' }
        ],
        winter: [
          { name: 'Microgreens', type: 'Vegetable', difficulty: 'Easy', harvest_time: '7-14 days' },
          { name: 'Indoor Herbs', type: 'Herb', difficulty: 'Easy', harvest_time: '30-60 days' },
          { name: 'Sprouts', type: 'Vegetable', difficulty: 'Easy', harvest_time: '3-7 days' }
        ]
      }

      setPlantingCalendar(mockPlantingCalendar)
      setSeasonalTips(mockSeasonalTips[season] || [])
      setRecommendedPlants(mockRecommendedPlants[season] || [])

      // Mock weather data
      setWeatherData({
        temperature: '72°F',
        humidity: '65%',
        forecast: 'Partly cloudy with occasional showers',
        lastFrost: 'April 15',
        firstFrost: 'October 30',
        growingSeason: '195 days'
      })

    } catch (error) {
      console.error('Error fetching seasonal data:', error)
      toast.error('Error loading seasonal data')
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Seasonal Planning
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan your garden year-round with personalized planting calendars, 
            seasonal tips, and plant recommendations based on your location.
          </p>
        </div>

        {/* Current Season & Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Season</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{currentSeason}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-lg font-semibold text-gray-900">{userLocation}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Thermometer className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Growing Season</p>
                <p className="text-lg font-semibold text-gray-900">{weatherData?.growingSeason}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planting Calendar */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Planting Calendar
              </h2>
              
              {/* Month Selector */}
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(index)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      selectedMonth === index
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>

              {/* Selected Month Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {months[selectedMonth]} Planting Guide
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Indoor Planting
                      </h4>
                      <div className="space-y-3">
                        {plantingCalendar[selectedMonth]?.indoor.map((plant, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{plant.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                                {plant.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{plant.timing}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Leaf className="h-4 w-4 mr-2" />
                        Outdoor Planting
                      </h4>
                      <div className="space-y-3">
                        {plantingCalendar[selectedMonth]?.outdoor.map((plant, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{plant.name}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                                {plant.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{plant.timing}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Monthly Tip
                      </h4>
                      <p className="text-sm text-gray-700">
                        {plantingCalendar[selectedMonth]?.tips}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                        <Cloud className="h-4 w-4 mr-2" />
                        Weather Considerations
                      </h4>
                      <p className="text-sm text-gray-700">
                        {plantingCalendar[selectedMonth]?.weather_considerations}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seasonal Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Tips
              </h3>
              <div className="space-y-4">
                {seasonalTips.map((tip, index) => {
                  const IconComponent = tip.icon
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 rounded-lg flex-shrink-0">
                        <IconComponent className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{tip.title}</h4>
                        <p className="text-sm text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommended Plants */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Plants
              </h3>
              <div className="space-y-3">
                {recommendedPlants.map((plant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{plant.name}</h4>
                      <p className="text-sm text-gray-600">{plant.type}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                        {plant.difficulty}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{plant.harvest_time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather-Based Suggestions */}
            {weatherSuggestions.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Weather-Based Suggestions
                </h3>
                <div className="space-y-3">
                  {weatherSuggestions.map((suggestion, index) => {
                    const IconComponent = suggestion.icon
                    const bgColor = suggestion.type === 'warning' ? 'bg-red-50' : 
                                   suggestion.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
                    const iconColor = suggestion.type === 'warning' ? 'text-red-600' : 
                                    suggestion.type === 'info' ? 'text-blue-600' : 'text-green-600'
                    const borderColor = suggestion.type === 'warning' ? 'border-red-200' : 
                                      suggestion.type === 'info' ? 'border-blue-200' : 'border-green-200'
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded-full ${bgColor}`}>
                            <IconComponent className={`h-4 w-4 ${iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{suggestion.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{suggestion.message}</p>
                            <p className="text-xs text-gray-500 mt-2 font-medium">{suggestion.action}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Weather Info */}
            {weatherData && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Weather
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium">{weatherData.temperature}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{weatherData.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wind Speed:</span>
                    <span className="font-medium">{weatherData.windSpeed} mph</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conditions:</span>
                    <span className="font-medium">{weatherData.conditions}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Frost:</span>
                        <span className="font-medium">{weatherData.lastFrost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">First Frost:</span>
                        <span className="font-medium">{weatherData.firstFrost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growing Season:</span>
                        <span className="font-medium">{weatherData.growingSeason}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3-Day Forecast */}
            {forecastData && forecastData.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  3-Day Forecast
                </h3>
                <div className="space-y-3">
                  {forecastData.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{day.day}</h4>
                        <p className="text-sm text-gray-600">{day.condition}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{day.high}°</span>
                          <span className="text-gray-500">/</span>
                          <span className="text-gray-600">{day.low}°</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeasonalPlanning
