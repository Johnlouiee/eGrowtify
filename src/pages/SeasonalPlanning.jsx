import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Sun, Cloud, Leaf, Droplets, Thermometer, Clock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SeasonalPlanning = () => {
  const [currentSeason, setCurrentSeason] = useState('')
  const [userLocation, setUserLocation] = useState('')
  const [plantingCalendar, setPlantingCalendar] = useState([])
  const [seasonalTips, setSeasonalTips] = useState([])
  const [recommendedPlants, setRecommendedPlants] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  useEffect(() => {
    initializeSeasonalData()
  }, [])

  const initializeSeasonalData = async () => {
    try {
      // Get current season
      const month = new Date().getMonth()
      const season = getSeasonFromMonth(month)
      setCurrentSeason(season)

      // Simulate location detection (replace with actual geolocation)
      setUserLocation('New York, NY')

      // Fetch seasonal data
      await fetchSeasonalData(season)
      setLoading(false)
    } catch (error) {
      console.error('Error initializing seasonal data:', error)
      setLoading(false)
    }
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

      // Mock planting calendar data
      const mockPlantingCalendar = [
        {
          month: 'January',
          indoor: ['Herbs (Basil, Parsley)', 'Microgreens', 'Lettuce'],
          outdoor: ['Garlic', 'Onions'],
          tips: 'Start seeds indoors for early spring planting'
        },
        {
          month: 'February',
          indoor: ['Tomatoes', 'Peppers', 'Eggplant', 'Herbs'],
          outdoor: ['Peas', 'Spinach', 'Kale'],
          tips: 'Prepare garden beds and test soil pH'
        },
        {
          month: 'March',
          indoor: ['Cucumbers', 'Squash', 'Melons'],
          outdoor: ['Carrots', 'Beets', 'Radishes', 'Lettuce'],
          tips: 'Begin hardening off indoor seedlings'
        },
        {
          month: 'April',
          indoor: ['Late season tomatoes', 'Herbs'],
          outdoor: ['Tomatoes', 'Peppers', 'Corn', 'Beans'],
          tips: 'Plant after last frost date'
        },
        {
          month: 'May',
          indoor: ['Fall crops (Broccoli, Cauliflower)'],
          outdoor: ['Squash', 'Cucumbers', 'Melons', 'Okra'],
          tips: 'Mulch to retain moisture and prevent weeds'
        },
        {
          month: 'June',
          indoor: ['Fall vegetables'],
          outdoor: ['Bush beans', 'Lettuce', 'Radishes'],
          tips: 'Water deeply and regularly'
        },
        {
          month: 'July',
          indoor: ['Fall crops'],
          outdoor: ['Fall peas', 'Lettuce', 'Spinach'],
          tips: 'Harvest regularly to encourage production'
        },
        {
          month: 'August',
          indoor: ['Winter herbs'],
          outdoor: ['Fall vegetables', 'Garlic', 'Onions'],
          tips: 'Start fall garden planning'
        },
        {
          month: 'September',
          indoor: ['Indoor herbs', 'Microgreens'],
          outdoor: ['Garlic', 'Cover crops'],
          tips: 'Plant garlic for next year'
        },
        {
          month: 'October',
          indoor: ['Indoor vegetables', 'Herbs'],
          outdoor: ['Garlic', 'Cover crops'],
          tips: 'Clean up garden and add compost'
        },
        {
          month: 'November',
          indoor: ['Indoor herbs', 'Microgreens'],
          outdoor: ['Garlic'],
          tips: 'Protect perennial plants'
        },
        {
          month: 'December',
          indoor: ['Indoor herbs', 'Microgreens'],
          outdoor: [],
          tips: 'Plan next year\'s garden'
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        Indoor Planting
                      </h4>
                      <ul className="space-y-1">
                        {plantingCalendar[selectedMonth]?.indoor.map((plant, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            {plant}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Leaf className="h-4 w-4 mr-2" />
                        Outdoor Planting
                      </h4>
                      <ul className="space-y-1">
                        {plantingCalendar[selectedMonth]?.outdoor.map((plant, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            {plant}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Monthly Tip
                    </h4>
                    <p className="text-sm text-gray-700">
                      {plantingCalendar[selectedMonth]?.tips}
                    </p>
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

            {/* Weather Info */}
            {weatherData && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Weather & Growing Info
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium">{weatherData.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Humidity:</span>
                    <span className="font-medium">{weatherData.humidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Frost:</span>
                    <span className="font-medium">{weatherData.lastFrost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Frost:</span>
                    <span className="font-medium">{weatherData.firstFrost}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{weatherData.forecast}</p>
                  </div>
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
