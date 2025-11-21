import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Sun, Cloud, Leaf, Droplets, Thermometer, Clock, Wind, Eye, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import weatherService from '../services/weatherService'

const SeasonalPlanning = () => {
  const [currentSeason, setCurrentSeason] = useState('')
  const [userLocation, setUserLocation] = useState('Cebu, Philippines')
  const [plantingCalendar, setPlantingCalendar] = useState([])
  const [seasonalTips, setSeasonalTips] = useState([])
  const [recommendedPlants, setRecommendedPlants] = useState([])
  const [weatherData, setWeatherData] = useState({
    temperature: 28,
    humidity: 75,
    windSpeed: 8,
    conditions: 'Partly Cloudy'
  })
  const [weatherSuggestions, setWeatherSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [userCoordinates, setUserCoordinates] = useState({ lat: 10.3157, lng: 123.8854 }) // Cebu coordinates
  const [forecastData, setForecastData] = useState(null)
  const [sevenDayForecast, setSevenDayForecast] = useState([])
  const [showForecast, setShowForecast] = useState(false)
  const [soilTemperature, setSoilTemperature] = useState(null)
  const [plantWeatherTolerance, setPlantWeatherTolerance] = useState(null)
  const [selectedPlant, setSelectedPlant] = useState('')
  const [activeTab, setActiveTab] = useState('weather')
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [modalPlant, setModalPlant] = useState(null)
  const [showRecommendedModal, setShowRecommendedModal] = useState(false)
  const [modalPlants, setModalPlants] = useState([])
  const [modalCategory, setModalCategory] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [currentCity, setCurrentCity] = useState('Cebu')
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [lastWeatherFetch, setLastWeatherFetch] = useState(0)

  // Philippines Plant Database - Common plants organized by categories
  const philippinesPlantDatabase = {
    fruits: {
      'Cherry': {
        name: 'Cherry Tomato',
        category: 'Fruit',
        scientificName: 'Solanum lycopersicum var. cerasiforme',
        description: 'Small, sweet tomatoes perfect for snacking and salads. Very popular in the Philippines.',
        growingTips: 'Plant in well-draining soil, provide support, water consistently. Harvest when fully colored.',
        harvestTime: '60-80 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening in small spaces. Popular in Filipino cuisine.',
        image: '🍅'
      },
      'Watermelon': {
        name: 'Watermelon',
        category: 'Fruit',
        scientificName: 'Citrullus lanatus',
        description: 'Large, sweet melon perfect for hot weather. Very refreshing in tropical climate.',
        growingTips: 'Plant in warm soil, provide plenty of space, water deeply but infrequently.',
        harvestTime: '80-100 days',
        difficulty: 'Medium',
        philippinesSpecific: 'Perfect for dry season. Popular street food in the Philippines.',
        image: '🍉'
      },
      'Cantaloupe': {
        name: 'Cantaloupe',
        category: 'Fruit',
        scientificName: 'Cucumis melo',
        description: 'Sweet, aromatic melon with orange flesh. Great for desserts and snacks.',
        growingTips: 'Plant in warm soil, provide support for vines, harvest when stem separates easily.',
        harvestTime: '80-100 days',
        difficulty: 'Medium',
        philippinesSpecific: 'Thrives in dry season. Popular in Filipino fruit salads.',
        image: '🍈'
      }
    },
    vegetables: {
      'Roma': {
        name: 'Roma Tomato',
        category: 'Vegetable',
        scientificName: 'Solanum lycopersicum',
        description: 'Oblong, meaty tomatoes perfect for cooking and making sauces.',
        growingTips: 'Plant in well-draining soil, provide support, water consistently. Great for cooking.',
        harvestTime: '60-80 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Perfect for Filipino dishes like sinigang and adobo. Great for canning.',
        image: '🍅'
      },
      'Beefsteak': {
        name: 'Beefsteak Tomato',
        category: 'Vegetable',
        scientificName: 'Solanum lycopersicum',
        description: 'Large, juicy tomatoes perfect for sandwiches and salads.',
        growingTips: 'Plant in rich soil, provide strong support, water consistently. Harvest when fully ripe.',
        harvestTime: '60-80 days',
        difficulty: 'Medium',
        philippinesSpecific: 'Great for Filipino sandwiches and salads. Popular in home gardens.',
        image: '🍅'
      },
      'Bell': {
        name: 'Bell Pepper',
        category: 'Vegetable',
        scientificName: 'Capsicum annuum',
        description: 'Sweet, crunchy peppers perfect for cooking and eating raw.',
        growingTips: 'Plant in warm soil, provide support, water consistently. Harvest when fully colored.',
        harvestTime: '70-90 days',
        difficulty: 'Medium',
        philippinesSpecific: 'Essential in Filipino cooking. Great for stir-fries and salads.',
        image: '🫑'
      },
      'Jalapeño': {
        name: 'Jalapeño Pepper',
        category: 'Vegetable',
        scientificName: 'Capsicum annuum',
        description: 'Medium-hot peppers perfect for adding spice to dishes.',
        growingTips: 'Plant in warm soil, provide support, water consistently. Harvest when green or red.',
        harvestTime: '70-90 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Popular for adding heat to Filipino dishes. Great for pickling.',
        image: '🌶️'
      },
      'Habanero': {
        name: 'Habanero Pepper',
        category: 'Vegetable',
        scientificName: 'Capsicum chinense',
        description: 'Very hot peppers perfect for making hot sauces and adding extreme heat.',
        growingTips: 'Plant in warm soil, provide support, water consistently. Handle with care!',
        harvestTime: '70-90 days',
        difficulty: 'Medium',
        philippinesSpecific: 'Use sparingly in Filipino dishes. Great for making hot sauces.',
        image: '🌶️'
      },
      'Lettuce': {
        name: 'Lettuce',
        category: 'Vegetable',
        scientificName: 'Lactuca sativa',
        description: 'Crisp, leafy green perfect for salads and sandwiches.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest outer leaves.',
        harvestTime: '45-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads and sandwiches.',
        image: '🥬'
      },
      'Spinach': {
        name: 'Spinach',
        category: 'Vegetable',
        scientificName: 'Spinacia oleracea',
        description: 'Nutrient-dense leafy green perfect for salads and cooking.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest young leaves.',
        harvestTime: '40-50 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino vegetable dishes.',
        image: '🥬'
      },
      'Kale': {
        name: 'Kale',
        category: 'Vegetable',
        scientificName: 'Brassica oleracea',
        description: 'Superfood leafy green packed with nutrients. Great for salads and smoothies.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest outer leaves.',
        harvestTime: '50-65 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in healthy Filipino dishes.',
        image: '🥬'
      },
      'Romaine': {
        name: 'Romaine Lettuce',
        category: 'Vegetable',
        scientificName: 'Lactuca sativa var. longifolia',
        description: 'Crisp, elongated lettuce perfect for Caesar salads.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest outer leaves.',
        harvestTime: '45-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads.',
        image: '🥬'
      },
      'Butterhead': {
        name: 'Butterhead Lettuce',
        category: 'Vegetable',
        scientificName: 'Lactuca sativa var. capitata',
        description: 'Soft, buttery lettuce perfect for sandwiches.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest when heads form.',
        harvestTime: '45-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino sandwiches.',
        image: '🥬'
      },
      'Iceberg': {
        name: 'Iceberg Lettuce',
        category: 'Vegetable',
        scientificName: 'Lactuca sativa var. capitata',
        description: 'Crisp, crunchy lettuce perfect for salads and burgers.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest when heads are firm.',
        harvestTime: '45-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads.',
        image: '🥬'
      },
      'Baby Spinach': {
        name: 'Baby Spinach',
        category: 'Vegetable',
        scientificName: 'Spinacia oleracea',
        description: 'Tender, young spinach leaves perfect for salads.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest young leaves.',
        harvestTime: '30-40 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads.',
        image: '🥬'
      },
      'Savoy': {
        name: 'Savoy Spinach',
        category: 'Vegetable',
        scientificName: 'Spinacia oleracea',
        description: 'Curly-leaf spinach with rich flavor.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest young leaves.',
        harvestTime: '40-50 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino vegetable dishes.',
        image: '🥬'
      },
      'Cherry Belle': {
        name: 'Cherry Belle Radish',
        category: 'Vegetable',
        scientificName: 'Raphanus sativus',
        description: 'Small, round radish perfect for salads and snacking.',
        growingTips: 'Plant in loose soil, provide consistent moisture, harvest when 2-3cm diameter.',
        harvestTime: '25-30 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads.',
        image: '🥕'
      },
      'French Breakfast': {
        name: 'French Breakfast Radish',
        category: 'Vegetable',
        scientificName: 'Raphanus sativus',
        description: 'Elongated radish with white tip, perfect for salads.',
        growingTips: 'Plant in loose soil, provide consistent moisture, harvest when 3-4cm long.',
        harvestTime: '25-30 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino salads.',
        image: '🥕'
      }
    },
    herbs: {
      'Sweet Basil': {
        name: 'Sweet Basil',
        category: 'Herb',
        scientificName: 'Ocimum basilicum',
        description: 'Aromatic herb perfect for Italian and Mediterranean dishes.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, pinch flowers to encourage growth.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino pesto and salads.',
        image: '🌿'
      },
      'Thai Basil': {
        name: 'Thai Basil',
        category: 'Herb',
        scientificName: 'Ocimum basilicum var. thyrsiflora',
        description: 'Aromatic herb with purple stems, perfect for Asian cuisine.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, pinch flowers to encourage growth.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Perfect for Filipino dishes. Great for container gardening.',
        image: '🌿'
      },
      'Basil': {
        name: 'Basil',
        category: 'Herb',
        scientificName: 'Ocimum basilicum',
        description: 'Aromatic herb perfect for Italian and Mediterranean dishes.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, pinch flowers to encourage growth.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino pesto and salads.',
        image: '🌿'
      },
      'Oregano': {
        name: 'Oregano',
        category: 'Herb',
        scientificName: 'Origanum vulgare',
        description: 'Aromatic herb perfect for Italian and Mediterranean dishes.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, drought tolerant.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino marinades.',
        image: '🌿'
      },
      'Mint': {
        name: 'Mint',
        category: 'Herb',
        scientificName: 'Mentha spicata',
        description: 'Refreshing herb perfect for teas, drinks, and desserts.',
        growingTips: 'Plant in moist soil, provide partial shade, can be invasive so contain roots.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for Filipino drinks and desserts. Perfect for container gardening.',
        image: '🌿'
      },
      'Spearmint': {
        name: 'Spearmint',
        category: 'Herb',
        scientificName: 'Mentha spicata',
        description: 'Refreshing herb perfect for teas, drinks, and desserts.',
        growingTips: 'Plant in moist soil, provide partial shade, can be invasive so contain roots.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for Filipino drinks and desserts. Perfect for container gardening.',
        image: '🌿'
      },
      'Peppermint': {
        name: 'Peppermint',
        category: 'Herb',
        scientificName: 'Mentha piperita',
        description: 'Refreshing herb perfect for teas, drinks, and desserts.',
        growingTips: 'Plant in moist soil, provide partial shade, can be invasive so contain roots.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for Filipino drinks and desserts. Perfect for container gardening.',
        image: '🌿'
      },
      'Parsley': {
        name: 'Parsley',
        category: 'Herb',
        scientificName: 'Petroselinum crispum',
        description: 'Mild herb perfect for garnishing and adding flavor to dishes.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, water consistently.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino garnishes.',
        image: '🌿'
      },
      'Italian Parsley': {
        name: 'Italian Parsley',
        category: 'Herb',
        scientificName: 'Petroselinum crispum var. neapolitanum',
        description: 'Mild herb perfect for garnishing and adding flavor to dishes.',
        growingTips: 'Plant in well-draining soil, provide 6-8 hours of sunlight, water consistently.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino garnishes.',
        image: '🌿'
      },
      'Cilantro': {
        name: 'Cilantro',
        category: 'Herb',
        scientificName: 'Coriandrum sativum',
        description: 'Aromatic herb perfect for Asian and Latin American cuisine.',
        growingTips: 'Plant in cool weather, provide partial shade, water consistently. Harvest before flowering.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for dry season. Popular in Filipino Asian-inspired dishes.',
        image: '🌿'
      },
      'Dill': {
        name: 'Dill',
        category: 'Herb',
        scientificName: 'Anethum graveolens',
        description: 'Aromatic herb perfect for pickling and fish dishes.',
        growingTips: 'Plant in well-draining soil, provide full sun, water consistently.',
        harvestTime: '30-60 days',
        difficulty: 'Easy',
        philippinesSpecific: 'Great for container gardening. Popular in Filipino pickled dishes.',
        image: '🌿'
      }
    },
    trees: {
      'Mango': {
        name: 'Mango',
        category: 'Tree',
        scientificName: 'Mangifera indica',
        description: 'National fruit of the Philippines. Sweet, tropical fruit perfect for desserts.',
        growingTips: 'Plant in well-draining soil, provide full sun, water deeply but infrequently. Prune regularly.',
        harvestTime: '3-5 years',
        difficulty: 'Medium',
        philippinesSpecific: 'National fruit of the Philippines. Perfect for tropical climate.',
        image: '🥭'
      },
      'Coconut': {
        name: 'Coconut',
        category: 'Tree',
        scientificName: 'Cocos nucifera',
        description: 'Tree of life in the Philippines. Provides fruit, water, and building materials.',
        growingTips: 'Plant in sandy soil, provide full sun, water regularly when young. Very drought tolerant when mature.',
        harvestTime: '5-7 years',
        difficulty: 'Easy',
        philippinesSpecific: 'Tree of life in the Philippines. Essential for Filipino cuisine and culture.',
        image: '🥥'
      },
      'Banana': {
        name: 'Banana',
        category: 'Tree',
        scientificName: 'Musa acuminata',
        description: 'Tropical fruit tree perfect for the Philippines. Provides fruit year-round.',
        growingTips: 'Plant in rich soil, provide full sun, water regularly. Remove old leaves and suckers.',
        harvestTime: '1-2 years',
        difficulty: 'Easy',
        philippinesSpecific: 'Perfect for Philippines climate. Popular in Filipino cuisine and desserts.',
        image: '🍌'
      },
      'Papaya': {
        name: 'Papaya',
        category: 'Tree',
        scientificName: 'Carica papaya',
        description: 'Fast-growing tropical fruit tree. Sweet fruit perfect for breakfast and desserts.',
        growingTips: 'Plant in well-draining soil, provide full sun, water regularly. Harvest when skin turns yellow.',
        harvestTime: '6-12 months',
        difficulty: 'Easy',
        philippinesSpecific: 'Fast-growing and perfect for Philippines. Popular in Filipino breakfast and desserts.',
        image: '🥭'
      }
    }
  }

  useEffect(() => {
    initializeSeasonalData()
  }, [])

  // Separate useEffect for weather data to ensure it loads properly
  useEffect(() => {
    initializeWeatherData()
  }, [currentCity])

  // Function to handle plant variety clicks
  const handlePlantVarietyClick = (varietyName) => {
    console.log('Clicked variety:', varietyName) // Debug log
    console.log('Current modal state:', showPlantModal) // Debug log
    
    // Search through all categories to find the plant
    let foundPlant = null
    
    // First try exact match
    for (const category in philippinesPlantDatabase) {
      if (philippinesPlantDatabase[category][varietyName]) {
        foundPlant = philippinesPlantDatabase[category][varietyName]
        console.log('Found exact match:', foundPlant) // Debug log
        break
      }
    }
    
    // If no exact match, try partial match
    if (!foundPlant) {
      for (const category in philippinesPlantDatabase) {
        for (const key in philippinesPlantDatabase[category]) {
          if (key.toLowerCase().includes(varietyName.toLowerCase()) || 
              varietyName.toLowerCase().includes(key.toLowerCase())) {
            foundPlant = philippinesPlantDatabase[category][key]
            break
          }
        }
        if (foundPlant) break
      }
    }
    
    // If still no match, create a generic plant entry
    if (!foundPlant) {
      foundPlant = {
        name: varietyName,
        category: 'Plant',
        scientificName: 'Information not available',
        description: `Learn more about growing ${varietyName} in the Philippines.`,
        growingTips: 'Check local gardening resources for specific growing tips.',
        harvestTime: 'Varies',
        difficulty: 'Unknown',
        philippinesSpecific: 'This plant can be grown in the Philippines with proper care.',
        image: '🌱'
      }
    }
    
    setModalPlant(foundPlant)
    setShowPlantModal(true)
  }

  // Function to categorize plants by type
  const categorizePlants = (plants) => {
    const categories = {
      trees: [],
      fruits: [],
      vegetables: [],
      herbs: []
    }

    plants.forEach(plant => {
      const plantName = plant.name.toLowerCase()
      
      // Categorize based on plant name and characteristics
      if (plantName.includes('mango') || plantName.includes('coconut') || plantName.includes('banana') || plantName.includes('papaya') || plantName.includes('ube') || plantName.includes('gabi') || plantName.includes('kamote') || plantName.includes('cassava') || plantName.includes('ginger') || plantName.includes('luya') || plantName.includes('citrus') || plantName.includes('avocado') || plantName.includes('jackfruit') || plantName.includes('rambutan') || plantName.includes('durian') || plantName.includes('lansones') || plantName.includes('chico') || plantName.includes('pomelo') || plantName.includes('calamansi') || plantName.includes('atis') || plantName.includes('soursop') || plantName.includes('tree')) {
        categories.trees.push(plant)
      } else if (plantName.includes('tomato') || plantName.includes('pepper') || plantName.includes('eggplant') || plantName.includes('okra') || plantName.includes('squash') || plantName.includes('cucumber') || plantName.includes('corn') || plantName.includes('bean') || plantName.includes('lettuce') || plantName.includes('spinach') || plantName.includes('kale') || plantName.includes('cabbage') || plantName.includes('carrot') || plantName.includes('radish') || plantName.includes('onion') || plantName.includes('garlic') || plantName.includes('bawang') || plantName.includes('sibuyas') || plantName.includes('taro') || plantName.includes('sweet potato') || plantName.includes('rice') || plantName.includes('cover crop')) {
        categories.vegetables.push(plant)
      } else if (plantName.includes('watermelon') || plantName.includes('cantaloupe') || plantName.includes('honeydew') || plantName.includes('melon') || plantName.includes('pumpkin') || plantName.includes('strawberr') || plantName.includes('blueberr') || plantName.includes('grape') || plantName.includes('pineapple') || plantName.includes('guava') || plantName.includes('dragon fruit') || plantName.includes('star fruit')) {
        categories.fruits.push(plant)
      } else if (plantName.includes('basil') || plantName.includes('mint') || plantName.includes('oregano') || plantName.includes('parsley') || plantName.includes('cilantro') || plantName.includes('dill') || plantName.includes('herb') || plantName.includes('microgreen')) {
        categories.herbs.push(plant)
      } else {
        // Default to vegetables for unknown plants
        categories.vegetables.push(plant)
      }
    })

    return categories
  }

  // Function to handle opening recommended plants modal
  const handleViewRecommendedPlants = (plants, category) => {
    const categorizedPlants = categorizePlants(plants)
    setModalPlants(categorizedPlants)
    setModalCategory(category)
    setShowRecommendedModal(true)
  }





  // Function to initialize weather data for current city
  const initializeWeatherData = async () => {
    const defaultCity = currentCity || 'Cebu'
    console.log('Initializing weather data for city:', defaultCity)
    
    // Set fallback data first to ensure UI always has data
    const fallbackWeatherData = {
      temperature: 28, // Typical Cebu temperature
      humidity: 75,
      windSpeed: 8,
      conditions: 'Partly Cloudy',
      forecast: [
        { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy' },
        { day: 'Tomorrow', high: 31, low: 25, condition: 'Sunny' },
        { day: 'Day 3', high: 29, low: 23, condition: 'Cloudy' }
      ],
      lastFrost: 'N/A',
      firstFrost: 'N/A',
      growingSeason: '365 days'
    }
    
    // Set fallback data immediately
    setWeatherData(fallbackWeatherData)
    setForecastData(fallbackWeatherData.forecast)
    generateWeatherSuggestions(fallbackWeatherData)
    
    // Then try to fetch real weather data
    try {
      await fetchWeatherDataForCity(defaultCity)
      console.log('Weather data loaded successfully for:', defaultCity)
    } catch (error) {
      console.error('Error loading weather data:', error)
      console.log('Keeping fallback weather data')
    }
    
    // Then try geolocation for more accurate location
    if (navigator.geolocation) {
      console.log('Attempting geolocation for more accurate location...')
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Geolocation successful:', position.coords)
          const { latitude, longitude } = position.coords
          setUserCoordinates({ lat: latitude, lng: longitude })
          // Update weather data with more accurate location
          try {
            await fetchWeatherData(latitude, longitude)
          } catch (error) {
            console.log('Error fetching weather with geolocation, keeping city data')
          }
        },
        (error) => {
          console.log('Geolocation error:', error)
          // Keep the city-based weather data we already loaded
        }
      )
    }
  }

  // Function to search for cities and get location suggestions
  const searchCities = async (query) => {
    if (query.length < 2) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      // Mock city suggestions for demonstration
      // In a real app, you'd call a geocoding API
      const citySuggestions = [
        { name: 'Manila, Philippines', country: 'Philippines', lat: 14.5995, lng: 120.9842 },
        { name: 'Cebu City, Philippines', country: 'Philippines', lat: 10.3157, lng: 123.8854 },
        { name: 'Davao City, Philippines', country: 'Philippines', lat: 7.1907, lng: 125.4553 },
        { name: 'Quezon City, Philippines', country: 'Philippines', lat: 14.6760, lng: 121.0437 },
        { name: 'Makati, Philippines', country: 'Philippines', lat: 14.5547, lng: 121.0244 },
        { name: 'Baguio, Philippines', country: 'Philippines', lat: 16.4023, lng: 120.5960 },
        { name: 'Iloilo City, Philippines', country: 'Philippines', lat: 10.7202, lng: 122.5621 },
        { name: 'Cagayan de Oro, Philippines', country: 'Philippines', lat: 8.4803, lng: 124.6479 },
        { name: 'Bacolod, Philippines', country: 'Philippines', lat: 10.6407, lng: 122.9689 },
        { name: 'Zamboanga City, Philippines', country: 'Philippines', lat: 6.9214, lng: 122.0790 }
      ]

      const filteredResults = citySuggestions.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(filteredResults)
      setShowSearchResults(true)
    } catch (error) {
      console.error('Error searching cities:', error)
      setSearchResults([])
    }
  }

  // Function to select a city from search results
  const selectCity = (city) => {
    setCurrentCity(city.name)
    setSearchCity(city.name)
    setSelectedLocation(city)
    setShowSearchResults(false)
    setSearchResults([])
    
    // Fetch weather for the selected city
    fetchWeatherDataForCity(city.name)
    
    // Show success message
    toast.success(`Weather updated for ${city.name}`)
  }

  // Handle search key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        selectCity(searchResults[0])
      } else if (searchCity.trim()) {
        // Try to search for the entered city
        const cityData = {
          name: `${searchCity.trim()}, Philippines`,
          country: 'Philippines',
          lat: 0,
          lng: 0
        }
        selectCity(cityData)
      }
    }
  }

  // Handle city search button click
  const handleCitySearch = () => {
    if (searchCity.trim()) {
      const cityData = {
        name: `${searchCity.trim()}, Philippines`,
        country: 'Philippines',
        lat: 0,
        lng: 0
      }
      selectCity(cityData)
    }
  }

  // Reset to Cebu
  const resetToCebu = () => {
    const cebuData = {
      name: 'Cebu City, Philippines',
      country: 'Philippines',
      lat: 10.3157,
      lng: 123.8854
    }
    selectCity(cebuData)
  }

  // Test weather API
  const testWeatherAPI = async () => {
    try {
      console.log('🧪 Testing weather API...')
      const response = await axios.get('/api/weather?city=Manila')
      console.log('🧪 API Test Response:', response.data)
      toast.success('API test completed - check console for details')
    } catch (error) {
      console.error('🧪 API Test Error:', error)
      toast.error('API test failed - check console for details')
    }
  }

  // Function to fetch weather data for a specific city
  const fetchWeatherDataForCity = async (city) => {
    console.log('Fetching weather for city:', city)
    setWeatherLoading(true)
    try {
      const weatherData = await weatherService.getWeather(city)
      console.log('Weather API response:', weatherData)
      
      if (weatherData.success !== false) {
        console.log('Raw weather data:', weatherData)
        console.log('Is mock data:', weatherData.mock)
        console.log('API success:', weatherData.success)
        
        console.log('Processing weather data:', weatherData)
        
        // Parse temperature - handle both number and string formats
        let tempValue = weatherData.temperature
        console.log('Original temperature:', tempValue, 'Type:', typeof tempValue)
        
        if (typeof tempValue === 'string') {
          // Extract number from string like "72°F" or "28°C"
          const match = tempValue.match(/(\d+(?:\.\d+)?)/)
          tempValue = match ? parseFloat(match[1]) : 0
        }
        console.log('Parsed temperature value:', tempValue)
        
        // Convert Fahrenheit to Celsius if needed
        let tempCelsius = tempValue
        if (weatherData.temperature && weatherData.temperature.includes('°F')) {
          tempCelsius = Math.round((tempValue - 32) * 5/9)
        }
        console.log('Temperature in Celsius:', tempCelsius)
        
        // Parse humidity - handle both number and string formats
        let humidityValue = weatherData.humidity
        console.log('Original humidity:', humidityValue, 'Type:', typeof humidityValue)
        
        if (typeof humidityValue === 'string') {
          // Extract number from string like "65%"
          const match = humidityValue.match(/(\d+(?:\.\d+)?)/)
          humidityValue = match ? parseFloat(match[1]) : 0
        }
        console.log('Parsed humidity value:', humidityValue)
        
        // Parse wind speed - handle both number and string formats
        let windValue = weatherData.windSpeed
        console.log('Original wind speed:', windValue, 'Type:', typeof windValue)
        
        if (typeof windValue === 'string') {
          // Extract number from string
          const match = windValue.match(/(\d+(?:\.\d+)?)/)
          windValue = match ? parseFloat(match[1]) : 0
        }
        
        let windKmh = windValue
        if (weatherData.windSpeed && weatherData.windSpeed.includes('mph')) {
          windKmh = Math.round(windValue * 1.60934)
        }
        console.log('Wind speed in km/h:', windKmh)
        
        // Get conditions - prioritize description over forecast
        const conditions = weatherData.description || weatherData.forecast || 'Unknown'
        console.log('Conditions:', conditions)
        
        // Ensure we have valid numbers
        const finalTemp = isNaN(tempCelsius) ? 28 : tempCelsius
        const finalHumidity = isNaN(humidityValue) ? 75 : humidityValue
        const finalWind = isNaN(windKmh) ? 8 : windKmh
        const finalConditions = conditions || 'Partly Cloudy'
        
        console.log('Final processed values:', {
          temperature: finalTemp,
          humidity: finalHumidity,
          windSpeed: finalWind,
          conditions: finalConditions
        })
        
        const processedWeatherData = {
          temperature: finalTemp,
          humidity: finalHumidity,
          windSpeed: finalWind,
          conditions: finalConditions,
          forecast: [
            { day: 'Today', high: finalTemp, low: finalTemp - 5, condition: finalConditions },
            { day: 'Tomorrow', high: finalTemp + 1, low: finalTemp - 4, condition: 'Partly Cloudy' },
            { day: 'Day 3', high: finalTemp - 1, low: finalTemp - 6, condition: 'Cloudy' }
          ],
          lastFrost: 'N/A',
          firstFrost: 'N/A',
          growingSeason: '365 days'
        }

        console.log('Processed weather data:', processedWeatherData)
        console.log('Setting weather data with:', {
          temperature: processedWeatherData.temperature,
          humidity: processedWeatherData.humidity,
          windSpeed: processedWeatherData.windSpeed,
          conditions: processedWeatherData.conditions
        })
        setWeatherData(processedWeatherData)
        setForecastData(processedWeatherData.forecast)
        generateWeatherSuggestions(processedWeatherData)
      } else {
        console.log('API returned success: false, using fallback data')
        throw new Error('API returned success: false')
      }
    } catch (error) {
      console.error('Error fetching weather for city:', error)
      // Use fallback data
      const mockWeatherData = {
        temperature: 28,
        humidity: 75,
        windSpeed: 8,
        conditions: 'Partly Cloudy',
        forecast: [
          { day: 'Today', high: 30, low: 24, condition: 'Partly Cloudy' },
          { day: 'Tomorrow', high: 31, low: 25, condition: 'Sunny' },
          { day: 'Day 3', high: 29, low: 23, condition: 'Cloudy' }
        ],
        lastFrost: 'N/A',
        firstFrost: 'N/A',
        growingSeason: '365 days'
      }
      console.log('Using fallback weather data:', mockWeatherData)
      setWeatherData(mockWeatherData)
      setForecastData(mockWeatherData.forecast)
      generateWeatherSuggestions(mockWeatherData)
    } finally {
      setWeatherLoading(false)
    }
  }

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
            // Fallback to Cebu, Philippines
            setUserLocation('Cebu, Philippines')
            setUserCoordinates({ lat: 10.3157, lng: 123.8854 })
            fetchWeatherData(10.3157, 123.8854)
          }
        )
      } else {
        // Fallback to Cebu, Philippines
        setUserLocation('Cebu, Philippines')
        setUserCoordinates({ lat: 10.3157, lng: 123.8854 })
        fetchWeatherData(10.3157, 123.8854)
      }
    } catch (error) {
      console.error('Error getting location:', error)
      setUserLocation('Cebu, Philippines')
      setUserCoordinates({ lat: 10.3157, lng: 123.8854 })
      fetchWeatherData(10.3157, 123.8854)
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
      // Get location name for weather API
      const locationName = await getLocationName(lat, lng)
      
      // Fetch real weather data from our API
      const weatherData = await weatherService.getWeather(locationName.split(',')[0])
      
      if (weatherData.success !== false) {
        
        // Parse temperature from string like "72°F" to number
        const tempValue = typeof weatherData.temperature === 'string' 
          ? parseFloat(weatherData.temperature.replace(/[^\d.-]/g, ''))
          : weatherData.temperature
        
        // Convert Fahrenheit to Celsius if needed
        const tempC = weatherData.temperature && weatherData.temperature.includes('°F')
          ? Math.round((tempValue - 32) * 5/9)
          : tempValue
        
        // Parse humidity from string like "65%" to number
        const humidityValue = typeof weatherData.humidity === 'string'
          ? parseFloat(weatherData.humidity.replace(/[^\d.-]/g, ''))
          : weatherData.humidity
        
        // Parse wind speed and convert to km/h if needed
        const windValue = typeof weatherData.windSpeed === 'string'
          ? parseFloat(weatherData.windSpeed.replace(/[^\d.-]/g, ''))
          : weatherData.windSpeed
        
        const windKmh = weatherData.windSpeed && weatherData.windSpeed.includes('mph')
          ? Math.round(windValue * 1.60934)
          : windValue
        
        // Get conditions from forecast field if description is not available
        const conditions = weatherData.description || weatherData.forecast || 'Unknown'
        
        const processedWeatherData = {
          temperature: tempC,
          humidity: humidityValue,
          windSpeed: windKmh,
          conditions: conditions,
          forecast: [
            { day: 'Today', high: tempC, low: tempC - 5, condition: conditions },
            { day: 'Tomorrow', high: tempC + 1, low: tempC - 4, condition: 'Partly Cloudy' },
            { day: 'Day 3', high: tempC - 1, low: tempC - 6, condition: 'Cloudy' }
          ],
          lastFrost: 'N/A',
          firstFrost: 'N/A',
          growingSeason: '365 days'
        }

        setWeatherData(processedWeatherData)
        setForecastData(processedWeatherData.forecast)
        
        // Generate weather-based suggestions
        generateWeatherSuggestions(processedWeatherData)
        
        // Fetch 7-day forecast for better planting timing
        await fetchSevenDayForecast(currentCity)
        
        // Fetch soil temperature data
        await fetchSoilTemperature(currentCity)
        
        // Fetch plant weather tolerance data
        await fetchPlantWeatherTolerance(currentCity)
      } else {
        // Fallback to mock data if API fails
        throw new Error('Weather API failed')
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      // Fallback weather data (Philippines climate)
      const mockWeatherData = {
        temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C (Philippines range)
        humidity: Math.floor(Math.random() * 30) + 60, // 60-90% (tropical humidity)
        windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        forecast: [
          { day: 'Today', high: Math.floor(Math.random() * 10) + 25, low: Math.floor(Math.random() * 5) + 20, condition: 'Sunny' },
          { day: 'Tomorrow', high: Math.floor(Math.random() * 10) + 25, low: Math.floor(Math.random() * 5) + 20, condition: 'Partly Cloudy' },
          { day: 'Day 3', high: Math.floor(Math.random() * 10) + 25, low: Math.floor(Math.random() * 5) + 20, condition: 'Cloudy' }
        ],
        lastFrost: 'N/A',
        firstFrost: 'N/A',
        growingSeason: '365 days'
      }

      setWeatherData(mockWeatherData)
      setForecastData(mockWeatherData.forecast)
      
      // Generate weather-based suggestions
      generateWeatherSuggestions(mockWeatherData)
    }
  }

  const fetchSevenDayForecast = async (city = currentCity) => {
    try {
      const response = await axios.get(`/api/weather-forecast?city=${encodeURIComponent(city)}`)
      
      if (response.data.success) {
        setSevenDayForecast(response.data.forecast)
      } else {
        console.error('Failed to fetch 7-day forecast:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching 7-day forecast:', error)
    }
  }

  const fetchSoilTemperature = async (city = currentCity) => {
    try {
      const response = await axios.get(`/api/soil-temperature?city=${encodeURIComponent(city)}`)
      
      if (response.data.success) {
        setSoilTemperature(response.data)
      } else {
        console.error('Failed to fetch soil temperature:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching soil temperature:', error)
    }
  }

  const fetchPlantWeatherTolerance = async (city = currentCity, plant = '') => {
    try {
      const url = `/api/plant-weather-tolerance?city=${encodeURIComponent(city)}${plant ? `&plant=${encodeURIComponent(plant)}` : ''}`
      const response = await axios.get(url)
      
      if (response.data.success) {
        setPlantWeatherTolerance(response.data)
      } else {
        console.error('Failed to fetch plant weather tolerance:', response.data.error)
      }
    } catch (error) {
      console.error('Error fetching plant weather tolerance:', error)
    }
  }

  const generateWeatherSuggestions = (weather) => {
    const suggestions = []
    const currentMonth = new Date().getMonth()
    const currentSeason = getSeasonFromMonth(currentMonth)
    
    // Temperature-based suggestions
    if (weather.temperature > 85) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Extreme Heat Alert',
        message: 'Very high temperatures detected. Plants may experience heat stress.',
        action: 'Water deeply in early morning, provide shade cloth, and avoid fertilizing during heat waves.'
      })
    } else if (weather.temperature > 75) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Hot Weather Alert',
        message: 'Temperatures are high. Water plants early morning or evening to prevent evaporation.',
        action: 'Increase watering frequency and provide shade for sensitive plants.'
      })
    } else if (weather.temperature < 45) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Cold Weather Alert',
        message: 'Temperatures are below optimal for most warm-season crops.',
        action: 'Protect tender plants with row covers.'
      })
    } else if (weather.temperature < 60) {
      suggestions.push({
        type: 'info',
        icon: Info,
        title: 'Cool Weather',
        message: 'Cool temperatures are ideal for cool-season crops and transplanting.',
        action: 'Perfect time to plant lettuce, spinach, and other cool-weather vegetables.'
      })
    }

    // Humidity-based suggestions
    if (weather.humidity > 80) {
      suggestions.push({
        type: 'warning',
        icon: Cloud,
        title: 'Very High Humidity',
        message: 'Extremely high humidity creates ideal conditions for fungal diseases.',
        action: 'Improve air circulation, avoid overhead watering, and consider fungicide treatment.'
      })
    } else if (weather.humidity > 70) {
      suggestions.push({
        type: 'warning',
        icon: Cloud,
        title: 'High Humidity',
        message: 'High humidity can promote fungal diseases.',
        action: 'Ensure good air circulation and avoid overhead watering.'
      })
    } else if (weather.humidity < 30) {
      suggestions.push({
        type: 'warning',
        icon: Droplets,
        title: 'Very Low Humidity',
        message: 'Extremely low humidity will cause rapid water loss from plants.',
        action: 'Water more frequently, use mulch, and consider misting for humidity-loving plants.'
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
    if (weather.windSpeed > 25) {
      suggestions.push({
        type: 'warning',
        icon: Wind,
        title: 'Strong Winds',
        message: 'Very strong winds can cause significant plant damage.',
        action: 'Secure all plants, use windbreaks, and avoid planting or transplanting today.'
      })
    } else if (weather.windSpeed > 15) {
      suggestions.push({
        type: 'warning',
        icon: Wind,
        title: 'High Winds',
        message: 'Strong winds can damage young plants and increase water loss.',
        action: 'Stake tall plants and provide wind protection for seedlings.'
      })
    }

    // Weather condition-based suggestions
    if (weather.conditions.toLowerCase().includes('rain')) {
      suggestions.push({
        type: 'info',
        icon: Droplets,
        title: 'Rainy Conditions',
        message: 'Rain provides natural watering but may cause soil compaction.',
        action: 'Avoid working in wet soil. Check for standing water and improve drainage if needed.'
      })
    } else if (weather.conditions.toLowerCase().includes('storm')) {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Storm Conditions',
        message: 'Severe weather may damage plants and garden structures.',
        action: 'Secure loose items, protect tender plants, and check for damage after the storm.'
      })
    }

    // Seasonal planting suggestions based on current season and weather
    if (currentSeason === 'spring' && weather.temperature >= 50 && weather.temperature <= 75) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Perfect Spring Planting Weather',
        message: 'Ideal conditions for spring planting and seed starting.',
        action: 'Start tomatoes, peppers, and herbs. Plant peas, lettuce, and spinach outdoors.'
      })
    } else if (currentSeason === 'summer' && weather.temperature > 80) {
      suggestions.push({
        type: 'info',
        icon: Sun,
        title: 'Summer Heat Management',
        message: 'Hot summer weather requires special care for plants.',
        action: 'Water deeply in early morning, mulch heavily, and provide afternoon shade.'
      })
    } else if (currentSeason === 'fall' && weather.temperature >= 45 && weather.temperature <= 70) {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Fall Planting Season',
        message: 'Excellent conditions for fall crops and bulb planting.',
        action: 'Plant garlic, onions, and cool-season vegetables. Plant spring bulbs.'
      })
    } else if (currentSeason === 'winter' && weather.temperature < 50) {
      suggestions.push({
        type: 'info',
        icon: Thermometer,
        title: 'Winter Garden Care',
        message: 'Cold weather requires winter protection strategies.',
        action: 'Mulch around perennials, protect tender plants, and plan for next season.'
      })
    }

    // Location-specific suggestions based on growing season
    if (weather.growingSeason === '365 days') {
      suggestions.push({
        type: 'success',
        icon: CheckCircle,
        title: 'Year-Round Growing',
        message: 'Your location allows for year-round gardening.',
        action: 'Take advantage of continuous growing seasons with succession planting.'
      })
    } else if (weather.growingSeason === '120 days') {
      suggestions.push({
        type: 'info',
        icon: Clock,
        title: 'Short Growing Season',
        message: 'Limited growing season requires careful planning.',
        action: 'Start seeds early, use season extenders, and choose quick-maturing varieties.'
      })
    }

    setWeatherSuggestions(suggestions)
  }

  const getSeasonFromMonth = (month) => {
    // Philippines has only 2 seasons: Wet (June-October) and Dry (November-May)
    if (month >= 5 && month <= 9) return 'wet' // June-October
    return 'dry' // November-May
  }

  const getFrostDate = (latitude, type) => {
    // Simplified frost date calculation based on latitude
    // In a real application, this would use more sophisticated climate data
    const lat = Math.abs(latitude)
    
    if (lat < 25) {
      // Tropical/subtropical - rarely freezes
      return type === 'last' ? 'January 1' : 'December 31'
    } else if (lat < 35) {
      // Warm temperate
      return type === 'last' ? 'March 15' : 'November 15'
    } else if (lat < 45) {
      // Cool temperate
      return type === 'last' ? 'April 15' : 'October 30'
    } else {
      // Cold temperate
      return type === 'last' ? 'May 15' : 'September 30'
    }
  }

  const getGrowingSeason = (latitude) => {
    // Calculate growing season length based on latitude
    const lat = Math.abs(latitude)
    
    if (lat < 25) {
      return '365 days' // Year-round growing (tropical)
    } else if (lat < 35) {
      return '280 days' // Long growing season
    } else if (lat < 45) {
      return '195 days' // Moderate growing season
    } else {
      return '120 days' // Short growing season
    }
  }

  const fetchSeasonalData = async (season) => {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Enhanced Philippines planting calendar with detailed plant information
      const mockPlantingCalendar = [
        {
          month: 'January',
          season: 'dry',
          outdoor: [
            { 
              name: 'Lettuce', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Cool-season crop perfect for dry season',
              care_tips: 'Partial shade, consistent moisture, harvest outer leaves',
              varieties: ['Romaine', 'Butterhead', 'Iceberg'],
              harvest_time: '45-60 days'
            },
            { 
              name: 'Spinach', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Fast-growing leafy green',
              care_tips: 'Rich soil, regular watering, harvest young leaves',
              varieties: ['Baby Spinach', 'Savoy'],
              harvest_time: '40-50 days'
            },
            { 
              name: 'Radishes', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Quick-growing root vegetable',
              care_tips: 'Loose soil, consistent moisture, harvest when 2-3cm diameter',
              varieties: ['Cherry Belle', 'French Breakfast'],
              harvest_time: '25-30 days'
            },
            { 
              name: 'Strawberries', 
              timing: 'Plant runners', 
              difficulty: 'Easy',
              description: 'Sweet fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, consistent moisture',
              varieties: ['Sweet Charlie', 'Camarosa', 'Festival'],
              harvest_time: '60-90 days'
            },
            { 
              name: 'Citrus Trees', 
              timing: 'Plant saplings', 
              difficulty: 'Medium',
              description: 'Perfect time to plant citrus trees in dry season',
              care_tips: 'Well-draining soil, full sun, water deeply but infrequently',
              varieties: ['Calamansi', 'Lemon', 'Orange'],
              harvest_time: '2-3 years'
            }
          ],
          tips: 'January is perfect for starting warm-season crops. The dry season provides ideal conditions for cool-season vegetables outdoors.',
          weather_considerations: 'Dry season conditions are ideal for most vegetables. Water early morning to avoid evaporation.',
          philippines_specific: 'Great time to plant leafy greens and start tomatoes/peppers for the upcoming wet season.'
        },
        {
          month: 'February',
          season: 'dry',
          outdoor: [
            { 
              name: 'Kale', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Nutrient-dense leafy green, perfect for dry season',
              care_tips: 'Rich soil, regular watering, harvest outer leaves regularly',
              varieties: ['Curly Kale', 'Lacinato', 'Red Russian'],
              harvest_time: '50-65 days'
            },
            { 
              name: 'Cabbage', 
              timing: 'Transplant seedlings', 
              difficulty: 'Medium',
              description: 'Cool-season crop, great for dry season',
              care_tips: 'Consistent moisture, protect from pests, harvest when heads are firm',
              varieties: ['Green Cabbage', 'Red Cabbage', 'Napa'],
              harvest_time: '70-90 days'
            },
            { 
              name: 'Carrots', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Root vegetable perfect for dry season',
              care_tips: 'Loose, deep soil, consistent moisture, thin seedlings',
              varieties: ['Nantes', 'Danvers', 'Chantenay'],
              harvest_time: '70-80 days'
            },
            { 
              name: 'Blueberries', 
              timing: 'Plant bushes', 
              difficulty: 'Medium',
              description: 'Sweet berries perfect for dry season',
              care_tips: 'Acidic soil, full sun, consistent moisture',
              varieties: ['Bluecrop', 'Jersey', 'Patriot'],
              harvest_time: '2-3 years'
            },
            { 
              name: 'Avocado Trees', 
              timing: 'Plant saplings', 
              difficulty: 'Medium',
              description: 'Perfect time to plant avocado trees',
              care_tips: 'Well-draining soil, full sun, water deeply but infrequently',
              varieties: ['Hass', 'Fuerte', 'Reed'],
              harvest_time: '3-4 years'
            }
          ],
          tips: 'February is ideal for starting warm-season crops. Continue planting cool-season vegetables outdoors.',
          weather_considerations: 'Dry season continues - maintain consistent watering schedule.',
          philippines_specific: 'Perfect time to start eggplant and other heat-loving crops for the upcoming wet season.'
        },
        {
          month: 'March',
          season: 'dry',
          outdoor: [
            { 
              name: 'Beans', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Fast-growing legume perfect for dry season',
              care_tips: 'Warm soil, consistent moisture, provide support for pole varieties',
              varieties: ['Green Beans', 'Lima Beans', 'Snap Beans'],
              harvest_time: '50-70 days'
            },
            { 
              name: 'Corn', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Warm-season crop perfect for dry season',
              care_tips: 'Plant in blocks for pollination, consistent moisture, full sun',
              varieties: ['Sweet Corn', 'Popcorn', 'Ornamental'],
              harvest_time: '60-90 days'
            },
            { 
              name: 'Squash', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, plenty of space, consistent moisture',
              varieties: ['Zucchini', 'Yellow Squash', 'Butternut'],
              harvest_time: '45-55 days'
            },
            { 
              name: 'Cucumbers', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Vining crop that loves warm weather',
              care_tips: 'Warm soil, provide support, consistent moisture',
              varieties: ['English', 'Pickling', 'Lemon'],
              harvest_time: '50-70 days'
            },
            { 
              name: 'Grapes', 
              timing: 'Plant vines', 
              difficulty: 'Medium',
              description: 'Sweet fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, provide support structure',
              varieties: ['Thompson Seedless', 'Concord', 'Muscat'],
              harvest_time: '2-3 years'
            },
            { 
              name: 'Mango Trees', 
              timing: 'Plant saplings', 
              difficulty: 'Easy',
              description: 'National fruit of the Philippines, perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water deeply but infrequently',
              varieties: ['Carabao', 'Pico', 'Indian'],
              harvest_time: '3-5 years'
            }
          ],
          tips: 'March is perfect for transplanting warm-season crops. The dry season provides ideal conditions.',
          weather_considerations: 'Warm, dry conditions are perfect for most warm-season vegetables. Water consistently.',
          philippines_specific: 'Great time to plant heat-loving crops like corn, beans, and squash that will thrive in the dry season.'
        },
        {
          month: 'April',
          season: 'dry',
          outdoor: [
            { 
              name: 'Tomatoes', 
              timing: 'Transplant seedlings', 
              difficulty: 'Medium',
              description: 'Warm-season crop perfect for dry season',
              care_tips: 'Warm soil, provide support, consistent moisture, full sun',
              varieties: ['Cherry', 'Roma', 'Beefsteak'],
              harvest_time: '60-80 days from transplant'
            },
            { 
              name: 'Peppers', 
              timing: 'Transplant seedlings', 
              difficulty: 'Medium',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, consistent moisture, protect from strong winds',
              varieties: ['Bell', 'Jalapeño', 'Habanero'],
              harvest_time: '70-90 days from transplant'
            },
            { 
              name: 'Eggplant', 
              timing: 'Transplant seedlings', 
              difficulty: 'Medium',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, consistent moisture, stake for support',
              varieties: ['Long Purple', 'Black Beauty', 'Japanese'],
              harvest_time: '80-100 days from transplant'
            },
            { 
              name: 'Okra', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Heat and drought tolerant crop',
              care_tips: 'Warm soil, consistent moisture, harvest when pods are 3-4 inches',
              varieties: ['Clemson Spineless', 'Red Burgundy', 'Jing Orange'],
              harvest_time: '50-60 days'
            },
            { 
              name: 'Pineapple', 
              timing: 'Plant crowns', 
              difficulty: 'Easy',
              description: 'Tropical fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water sparingly',
              varieties: ['Smooth Cayenne', 'Red Spanish', 'Sugarloaf'],
              harvest_time: '18-24 months'
            },
            { 
              name: 'Coconut Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Easy',
              description: 'Tree of life in the Philippines, perfect for dry season',
              care_tips: 'Sandy soil, full sun, water regularly when young',
              varieties: ['Malayan Dwarf', 'Tall', 'Hybrid'],
              harvest_time: '5-7 years'
            }
          ],
          tips: 'April is perfect for transplanting warm-season crops. The dry season provides ideal growing conditions.',
          weather_considerations: 'Warm, dry conditions are perfect for heat-loving crops. Water consistently.',
          philippines_specific: 'Excellent time to plant tomatoes, peppers, and eggplant that will thrive in the dry season heat.'
        },
        {
          month: 'May',
          season: 'dry',
          outdoor: [
            { 
              name: 'Melons', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Medium',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, plenty of space, consistent moisture, full sun',
              varieties: ['Watermelon', 'Cantaloupe', 'Honeydew'],
              harvest_time: '80-100 days'
            },
            { 
              name: 'Sweet Corn', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Warm-season crop perfect for dry season',
              care_tips: 'Plant in blocks for pollination, consistent moisture, full sun',
              varieties: ['Sweet Corn', 'Popcorn', 'Ornamental'],
              harvest_time: '60-90 days'
            },
            { 
              name: 'Watermelon', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Medium',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, plenty of space, consistent moisture, full sun',
              varieties: ['Sugar Baby', 'Crimson Sweet', 'Charleston Gray'],
              harvest_time: '80-100 days'
            },
            { 
              name: 'Pumpkin', 
              timing: 'Direct sow', 
              difficulty: 'Easy',
              description: 'Heat-loving crop perfect for dry season',
              care_tips: 'Warm soil, plenty of space, consistent moisture, full sun',
              varieties: ['Jack O\'Lantern', 'Sugar Pie', 'Miniature'],
              harvest_time: '90-120 days'
            },
            { 
              name: 'Guava', 
              timing: 'Plant trees', 
              difficulty: 'Easy',
              description: 'Tropical fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['White Guava', 'Pink Guava', 'Strawberry Guava'],
              harvest_time: '2-3 years'
            },
            { 
              name: 'Banana Trees', 
              timing: 'Plant suckers', 
              difficulty: 'Easy',
              description: 'Tropical fruit tree perfect for the Philippines',
              care_tips: 'Rich soil, full sun, water regularly, remove old leaves',
              varieties: ['Lakatan', 'Saba', 'Latundan'],
              harvest_time: '1-2 years'
            }
          ],
          tips: 'May is perfect for heat-loving crops. Prepare for the transition to wet season.',
          weather_considerations: 'Hot, dry conditions are perfect for melons and corn. Water consistently.',
          philippines_specific: 'Great time to plant melons and corn that will thrive in the dry season heat.'
        },
        {
          month: 'June',
          season: 'wet',
          outdoor: [
            { 
              name: 'Okra', 
              timing: 'Direct sow or transplant', 
              difficulty: 'Easy',
              description: 'Heat and humidity loving crop, perfect for wet season',
              care_tips: 'Warm soil, consistent moisture, harvest when pods are 3-4 inches',
              varieties: ['Clemson Spineless', 'Red Burgundy', 'Jing Orange'],
              harvest_time: '50-60 days'
            },
            { 
              name: 'Sweet Potato', 
              timing: 'Plant slips', 
              difficulty: 'Easy',
              description: 'Tropical crop that thrives in wet season',
              care_tips: 'Well-draining soil, plenty of space, harvest when leaves yellow',
              varieties: ['Beauregard', 'Jewel', 'Garnet'],
              harvest_time: '90-120 days'
            },
            { 
              name: 'Taro', 
              timing: 'Plant corms', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, loves wet conditions',
              care_tips: 'Rich soil, consistent moisture, partial shade',
              varieties: ['Dasheen', 'Bun Long'],
              harvest_time: '180-200 days'
            },
            { 
              name: 'Eggplant', 
              timing: 'Transplant seedlings', 
              difficulty: 'Medium',
              description: 'Heat-loving crop perfect for wet season',
              care_tips: 'Warm soil, consistent moisture, stake for support',
              varieties: ['Long Purple', 'Black Beauty', 'Japanese'],
              harvest_time: '80-100 days'
            },
            { 
              name: 'Papaya', 
              timing: 'Plant seeds or seedlings', 
              difficulty: 'Easy',
              description: 'Tropical fruit perfect for wet season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['Solo', 'Red Lady', 'Tainung'],
              harvest_time: '6-9 months'
            },
            { 
              name: 'Jackfruit Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Large tropical fruit tree perfect for wet season',
              care_tips: 'Rich soil, full sun, water regularly, provide space',
              varieties: ['Black Gold', 'Golden Pillow', 'Honey Gold'],
              harvest_time: '3-4 years'
            }
          ],
          tips: 'Wet season is perfect for heat-loving crops. Ensure good drainage and watch for fungal diseases.',
          weather_considerations: 'High humidity increases disease risk. Improve air circulation and avoid overhead watering.',
          philippines_specific: 'Traditional Filipino crops like taro and sweet potato thrive in wet season conditions.'
        },
        {
          month: 'July',
          season: 'wet',
          outdoor: [
            { 
              name: 'Taro', 
              timing: 'Plant corms', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, loves wet conditions',
              care_tips: 'Rich soil, consistent moisture, partial shade',
              varieties: ['Dasheen', 'Bun Long'],
              harvest_time: '180-200 days'
            },
            { 
              name: 'Sweet Potato', 
              timing: 'Plant slips', 
              difficulty: 'Easy',
              description: 'Tropical crop that thrives in wet season',
              care_tips: 'Well-draining soil, plenty of space, harvest when leaves yellow',
              varieties: ['Beauregard', 'Jewel', 'Garnet'],
              harvest_time: '90-120 days'
            },
            { 
              name: 'Cassava', 
              timing: 'Plant cuttings', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, drought and flood tolerant',
              care_tips: 'Well-draining soil, consistent moisture, harvest when leaves yellow',
              varieties: ['Sweet Cassava', 'Bitter Cassava'],
              harvest_time: '8-12 months'
            },
            { 
              name: 'Dragon Fruit', 
              timing: 'Plant cuttings', 
              difficulty: 'Easy',
              description: 'Exotic tropical fruit perfect for wet season',
              care_tips: 'Well-draining soil, full sun, provide support structure',
              varieties: ['White Flesh', 'Red Flesh', 'Yellow Flesh'],
              harvest_time: '1-2 years'
            },
            { 
              name: 'Rambutan Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Tropical fruit tree perfect for wet season',
              care_tips: 'Rich soil, full sun, water regularly, protect from strong winds',
              varieties: ['Binjai', 'Lebak Bulus', 'Rapiah'],
              harvest_time: '3-4 years'
            },
            { 
              name: 'Ginger', 
              timing: 'Plant rhizomes', 
              difficulty: 'Easy',
              description: 'Tropical spice crop perfect for wet season',
              care_tips: 'Rich soil, consistent moisture, partial shade',
              varieties: ['Common Ginger', 'Turmeric', 'Galangal'],
              harvest_time: '8-10 months'
            }
          ],
          tips: 'Wet season is perfect for traditional Filipino crops. Ensure good drainage and watch for fungal diseases.',
          weather_considerations: 'High humidity increases disease risk. Improve air circulation and avoid overhead watering.',
          philippines_specific: 'Traditional Filipino crops like taro, sweet potato, and cassava thrive in wet season conditions.'
        },
        {
          month: 'August',
          season: 'wet',
          outdoor: [
            { 
              name: 'Ube (Purple Yam)', 
              timing: 'Plant tubers', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, loves wet conditions',
              care_tips: 'Rich soil, consistent moisture, partial shade, provide support',
              varieties: ['Purple Yam', 'White Yam'],
              harvest_time: '8-12 months'
            },
            { 
              name: 'Gabi (Taro)', 
              timing: 'Plant corms', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, loves wet conditions',
              care_tips: 'Rich soil, consistent moisture, partial shade',
              varieties: ['Dasheen', 'Bun Long'],
              harvest_time: '180-200 days'
            },
            { 
              name: 'Kamote (Sweet Potato)', 
              timing: 'Plant slips', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop that thrives in wet season',
              care_tips: 'Well-draining soil, plenty of space, harvest when leaves yellow',
              varieties: ['Beauregard', 'Jewel', 'Garnet'],
              harvest_time: '90-120 days'
            },
            { 
              name: 'Luya (Ginger)', 
              timing: 'Plant rhizomes', 
              difficulty: 'Easy',
              description: 'Traditional Filipino spice crop perfect for wet season',
              care_tips: 'Rich soil, consistent moisture, partial shade',
              varieties: ['Common Ginger', 'Turmeric', 'Galangal'],
              harvest_time: '8-10 months'
            }
          ],
          tips: 'Wet season is perfect for traditional Filipino root crops. Ensure good drainage and watch for fungal diseases.',
          weather_considerations: 'High humidity increases disease risk. Improve air circulation and avoid overhead watering.',
          philippines_specific: 'Traditional Filipino crops like ube, gabi, and kamote thrive in wet season conditions.'
        },
        {
          month: 'September',
          season: 'wet',
          outdoor: [
            { 
              name: 'Bawang (Garlic)', 
              timing: 'Plant cloves for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when leaves yellow',
              varieties: ['Hardneck', 'Softneck'],
              harvest_time: '240-270 days'
            },
            { 
              name: 'Sibuyas (Onions)', 
              timing: 'Plant sets for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when tops fall over',
              varieties: ['Red Onion', 'White Onion', 'Yellow Onion'],
              harvest_time: '100-120 days'
            },
            { 
              name: 'Cover Crops', 
              timing: 'Plant to improve soil', 
              difficulty: 'Easy',
              description: 'Plant cover crops to improve soil health for next season',
              care_tips: 'Choose nitrogen-fixing crops, till under before flowering',
              varieties: ['Legumes', 'Grasses', 'Brassicas'],
              harvest_time: '60-90 days'
            },
            { 
              name: 'Lansones', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Tropical fruit tree perfect for wet season',
              care_tips: 'Rich soil, full sun, water regularly, protect from strong winds',
              varieties: ['Paete', 'Longkong', 'Duku'],
              harvest_time: '3-4 years'
            },
            { 
              name: 'Durian Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Hard',
              description: 'King of fruits, tropical tree perfect for wet season',
              care_tips: 'Rich soil, full sun, water regularly, provide space for large tree',
              varieties: ['Monthong', 'Chanee', 'Kradum'],
              harvest_time: '5-7 years'
            }
          ],
          tips: 'September is perfect for planting garlic and onions for next year. Consider cover crops to improve soil health.',
          weather_considerations: 'Wet season conditions are perfect for root development and soil improvement.',
          philippines_specific: 'Traditional Filipino crops like bawang and sibuyas are perfect for planting during wet season.'
        },
        {
          month: 'October',
          season: 'wet',
          outdoor: [
            { 
              name: 'Bawang (Garlic)', 
              timing: 'Plant cloves for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when leaves yellow',
              varieties: ['Hardneck', 'Softneck'],
              harvest_time: '240-270 days'
            },
            { 
              name: 'Cover Crops', 
              timing: 'Plant to improve soil', 
              difficulty: 'Easy',
              description: 'Plant cover crops to improve soil health for next season',
              care_tips: 'Choose nitrogen-fixing crops, till under before flowering',
              varieties: ['Legumes', 'Grasses', 'Brassicas'],
              harvest_time: '60-90 days'
            },
            { 
              name: 'Star Fruit', 
              timing: 'Plant seedlings', 
              difficulty: 'Easy',
              description: 'Tropical fruit tree perfect for wet season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['Arkin', 'Fwang Tung', 'Kari'],
              harvest_time: '2-3 years'
            },
            { 
              name: 'Chico Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Tropical fruit tree perfect for wet season',
              care_tips: 'Rich soil, full sun, water regularly, protect from strong winds',
              varieties: ['Makok', 'Ponderosa', 'Hachiya'],
              harvest_time: '3-4 years'
            }
          ],
          tips: 'October is perfect for planting garlic for next year. Consider cover crops to improve soil health.',
          weather_considerations: 'Wet season conditions are perfect for root development and soil improvement.',
          philippines_specific: 'Traditional Filipino crops like bawang are perfect for planting during wet season.'
        },
        {
          month: 'November',
          season: 'dry',
          outdoor: [
            { 
              name: 'Bawang (Garlic)', 
              timing: 'Plant cloves for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when leaves yellow',
              varieties: ['Hardneck', 'Softneck'],
              harvest_time: '240-270 days'
            },
            { 
              name: 'Sibuyas (Onions)', 
              timing: 'Plant sets for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when tops fall over',
              varieties: ['Red Onion', 'White Onion', 'Yellow Onion'],
              harvest_time: '100-120 days'
            },
            { 
              name: 'Pomelo', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Large citrus fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['Chandler', 'Oro Blanco', 'Melogold'],
              harvest_time: '3-4 years'
            },
            { 
              name: 'Calamansi Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Easy',
              description: 'Filipino citrus tree perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['Philippine Lime', 'Kalamansi'],
              harvest_time: '2-3 years'
            }
          ],
          tips: 'November is perfect for planting garlic and onions for next year. The dry season provides ideal conditions.',
          weather_considerations: 'Dry season conditions are perfect for root development. Water consistently.',
          philippines_specific: 'Traditional Filipino crops like bawang and sibuyas are perfect for planting during dry season.'
        },
        {
          month: 'December',
          season: 'dry',
          outdoor: [
            { 
              name: 'Bawang (Garlic)', 
              timing: 'Plant cloves for next year', 
              difficulty: 'Easy',
              description: 'Traditional Filipino crop, plant for next dry season harvest',
              care_tips: 'Well-draining soil, consistent moisture, harvest when leaves yellow',
              varieties: ['Hardneck', 'Softneck'],
              harvest_time: '240-270 days'
            },
            { 
              name: 'Atis (Sugar Apple)', 
              timing: 'Plant seedlings', 
              difficulty: 'Easy',
              description: 'Sweet tropical fruit perfect for dry season',
              care_tips: 'Well-draining soil, full sun, water regularly',
              varieties: ['Custard Apple', 'Sugar Apple'],
              harvest_time: '2-3 years'
            },
            { 
              name: 'Soursop Trees', 
              timing: 'Plant seedlings', 
              difficulty: 'Medium',
              description: 'Tropical fruit tree perfect for dry season',
              care_tips: 'Rich soil, full sun, water regularly, protect from strong winds',
              varieties: ['Guanabana', 'Soursop'],
              harvest_time: '3-4 years'
            }
          ],
          tips: 'December is perfect for planning next year\'s garden and planting garlic for next year. Order seeds and supplies for the upcoming wet season.',
          weather_considerations: 'Dry season conditions are perfect for root development. Water consistently.',
          philippines_specific: 'Traditional Filipino crops like bawang are perfect for planting during dry season. Plan for the upcoming wet season.'
        }
      ]

      // Philippines seasonal tips (Wet and Dry seasons)
      const mockSeasonalTips = {
        wet: [
          {
            title: 'Drainage Management',
            description: 'Ensure proper drainage to prevent waterlogging. Use raised beds or containers.',
            icon: Droplets
          },
          {
            title: 'Disease Prevention',
            description: 'High humidity increases disease risk. Improve air circulation and avoid overhead watering.',
            icon: Cloud
          },
          {
            title: 'Mold Prevention',
            description: 'Monitor for fungal diseases. Use organic fungicides and remove affected plants quickly.',
            icon: AlertTriangle
          }
        ],
        dry: [
          {
            title: 'Water Conservation',
            description: 'Water deeply but less frequently. Use mulch to retain soil moisture.',
            icon: Droplets
          },
          {
            title: 'Heat Protection',
            description: 'Provide shade for heat-sensitive plants. Water early morning or evening.',
            icon: Sun
          },
          {
            title: 'Soil Preparation',
            description: 'Perfect time for soil testing and amendments. Prepare beds for next wet season.',
            icon: Leaf
          }
        ]
      }

      // Philippines recommended plants (Wet and Dry seasons)
      const mockRecommendedPlants = {
        wet: [
          { name: 'Okra', type: 'Vegetable', difficulty: 'Easy', harvest_time: '50-60 days' },
          { name: 'Eggplant', type: 'Vegetable', difficulty: 'Medium', harvest_time: '70-85 days' },
          { name: 'Sweet Potato', type: 'Vegetable', difficulty: 'Easy', harvest_time: '90-120 days' },
          { name: 'Taro', type: 'Vegetable', difficulty: 'Easy', harvest_time: '180-200 days' }
        ],
        dry: [
          { name: 'Tomatoes', type: 'Vegetable', difficulty: 'Easy', harvest_time: '60-80 days' },
          { name: 'Bell Peppers', type: 'Vegetable', difficulty: 'Medium', harvest_time: '60-90 days' },
          { name: 'Cucumbers', type: 'Vegetable', difficulty: 'Easy', harvest_time: '50-70 days' },
          { name: 'Basil', type: 'Herb', difficulty: 'Easy', harvest_time: '30-60 days' }
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
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-lg">
                    {months[selectedMonth]} Planting Guide
                  </h3>
                    {plantingCalendar[selectedMonth]?.season && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        plantingCalendar[selectedMonth].season === 'wet' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plantingCalendar[selectedMonth].season === 'wet' ? '🌧️ Wet Season' : '☀️ Dry Season'}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <Leaf className="h-5 w-5 mr-2 text-green-600" />
                        Outdoor Planting
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-4">
                          Discover the best outdoor plants for {months[selectedMonth]} in the Philippines
                        </p>
                        <button
                          onClick={() => handleViewRecommendedPlants(plantingCalendar[selectedMonth]?.outdoor || [], 'Outdoor')}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>View Recommended Plants</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                            </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                        Monthly Tip
                      </h4>
                      <p className="text-sm text-gray-700">
                        {plantingCalendar[selectedMonth]?.tips}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Cloud className="h-4 w-4 mr-2 text-blue-600" />
                        Weather Considerations
                      </h4>
                      <p className="text-sm text-gray-700">
                        {plantingCalendar[selectedMonth]?.weather_considerations}
                      </p>
                    </div>

                    {plantingCalendar[selectedMonth]?.philippines_specific && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          Philippines Specific
                        </h4>
                        <p className="text-sm text-gray-700">
                          {plantingCalendar[selectedMonth]?.philippines_specific}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Tabbed Interface */}
          <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="card p-0">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'weather'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🌤️ Weather
                </button>
                <button
                  onClick={() => setActiveTab('plants')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'plants'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🌱 Plants
                </button>
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'tips'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  💡 Tips
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card">
              {/* Weather Tab */}
              {activeTab === 'weather' && (
              <div className="space-y-4">
                  {/* Enhanced City Search Bar */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                      {/* Current Location Display */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Current Location: <strong>{currentCity}</strong></span>
                          {selectedLocation && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({selectedLocation.lat.toFixed(2)}, {selectedLocation.lng.toFixed(2)})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fetchWeatherDataForCity(currentCity)}
                            disabled={weatherLoading}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                            title="Refresh Weather Data"
                          >
                            <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                          </button>
                          <button
                            onClick={resetToCebu}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            title="Reset to Cebu"
                          >
                            🏠
                          </button>
                        </div>
                      </div>
                      
                      {/* Search Input with Dropdown */}
                      <div className="relative">
                        <input
                          type="text"
                          value={searchCity}
                          onChange={(e) => {
                            setSearchCity(e.target.value)
                            searchCities(e.target.value)
                          }}
                          onFocus={() => setShowSearchResults(searchResults.length > 0)}
                          onKeyPress={handleSearchKeyPress}
                          placeholder="Search for a city in the Philippines..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        
                        {/* Search Results Dropdown */}
                        {showSearchResults && searchResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {searchResults.map((city, index) => (
                              <button
                                key={index}
                                onClick={() => selectCity(city)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                              >
                                <div>
                                  <div className="font-medium text-gray-900">{city.name}</div>
                                  <div className="text-sm text-gray-500">{city.country}</div>
                                </div>
                                <MapPin className="w-4 h-4 text-gray-400" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Quick City Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500 mr-2">Quick select:</span>
                        {['Manila', 'Cebu', 'Davao', 'Baguio', 'Iloilo'].map(city => (
                          <button
                            key={city}
                            onClick={() => {
                              const cityData = searchResults.find(c => c.name.includes(city)) || 
                                             { name: `${city}, Philippines`, country: 'Philippines', lat: 0, lng: 0 }
                              selectCity(cityData)
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Weather - Enhanced */}
                  {weatherData && (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Current Weather</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {currentCity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {weatherLoading && (
                            <div className="text-xs text-gray-500">Loading...</div>
                          )}
                          <button
                            onClick={() => {
                              fetchWeatherDataForCity(currentCity)
                              fetchSevenDayForecast(currentCity)
                              fetchSoilTemperature(currentCity)
                              fetchPlantWeatherTolerance(currentCity, selectedPlant)
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
                            title="Refresh"
                            disabled={weatherLoading}
                          >
                            <RefreshCw className={`h-4 w-4 ${weatherLoading ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temp:</span>
                          <span className="font-medium">
                            {weatherData.temperature ? Math.round(weatherData.temperature) : 'N/A'}°C
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humidity:</span>
                          <span className="font-medium">
                            {weatherData.humidity ? weatherData.humidity : 'N/A'}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wind:</span>
                          <span className="font-medium">
                            {weatherData.windSpeed ? Math.round(weatherData.windSpeed) : 'N/A'} km/h
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conditions:</span>
                          <span className="font-medium capitalize text-xs">
                            {weatherData.conditions || 'N/A'}
                          </span>
                        </div>
                      </div>
                      {/* Debug info */}
                      <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                        <div className="font-medium text-gray-700 mb-2">Debug Info:</div>
                        <div className="grid grid-cols-2 gap-2 text-gray-600">
                          <div>Current City: <strong>{currentCity}</strong></div>
                          <div>Loading: {weatherLoading ? 'Yes' : 'No'}</div>
                          {selectedLocation && (
                            <>
                              <div>Latitude: {selectedLocation.lat.toFixed(4)}</div>
                              <div>Longitude: {selectedLocation.lng.toFixed(4)}</div>
                            </>
                          )}
                          <div>Last Fetch: {new Date().toLocaleTimeString()}</div>
                          <div>Data Source: {weatherData.mock ? 'Mock Data' : 'API'}</div>
                        </div>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            Raw Weather Data
                          </summary>
                          <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                            {JSON.stringify(weatherData, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  )}

                  {/* 7-Day Forecast - Compact */}
                  {sevenDayForecast.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">7-Day Forecast</h3>
                        <button
                          onClick={() => setShowForecast(!showForecast)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {showForecast ? 'Hide' : 'Show All'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {sevenDayForecast.slice(0, showForecast ? 7 : 3).map((day, index) => {
                          const date = new Date(day.date)
                          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                          const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          
                          const getScoreColor = (score) => {
                            if (score >= 6) return 'bg-green-100 text-green-800 border-green-200'
                            if (score >= 4) return 'bg-blue-100 text-blue-800 border-blue-200'
                            if (score >= 2) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            return 'bg-red-100 text-red-800 border-red-200'
                          }
                          
                  return (
                            <div key={index} className={`p-2 rounded border ${getScoreColor(day.planting_score)}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-sm">{dayName}, {monthDay}</div>
                                  <div className="text-xs opacity-75">{day.recommendation}</div>
                      </div>
                                <div className="text-right">
                                  <div className="font-medium text-sm">{day.temperature.average}°C</div>
                                  <div className="text-xs opacity-75">Score: {day.planting_score}/8</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Weather Suggestions - Compact */}
                  {weatherSuggestions.length > 0 && (
                      <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Weather Alerts</h3>
                      <div className="space-y-2">
                        {weatherSuggestions.slice(0, 3).map((suggestion, index) => {
                          const IconComponent = suggestion.icon
                          const bgColor = suggestion.type === 'warning' ? 'bg-red-50 border-red-200' : 
                                         suggestion.type === 'info' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                          const iconColor = suggestion.type === 'warning' ? 'text-red-600' : 
                                          suggestion.type === 'info' ? 'text-blue-600' : 'text-green-600'
                          
                          return (
                            <div key={index} className={`p-2 rounded border ${bgColor}`}>
                              <div className="flex items-start space-x-2">
                                <IconComponent className={`h-4 w-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 text-xs">{suggestion.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{suggestion.message}</p>
                                </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
                  )}
                </div>
              )}

              {/* Plants Tab */}
              {activeTab === 'plants' && (
                <div className="space-y-4">
                  {/* Plant Weather Tolerance - Compact */}
                  {plantWeatherTolerance && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Plant Analysis</h3>
                        <select
                          value={selectedPlant}
                          onChange={(e) => {
                            setSelectedPlant(e.target.value)
                            fetchPlantWeatherTolerance(userLocation.split(',')[0], e.target.value)
                          }}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">All Plants</option>
                          <option value="tomatoes">Tomatoes</option>
                          <option value="peppers">Peppers</option>
                          <option value="lettuce">Lettuce</option>
                          <option value="cucumbers">Cucumbers</option>
                          <option value="herbs">Herbs</option>
                          <option value="garlic">Garlic</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        {plantWeatherTolerance.plant_analysis.slice(0, 3).map((plant, index) => {
                          const statusColors = {
                            'Good': 'bg-green-50 border-green-200 text-green-800',
                            'Poor': 'bg-yellow-50 border-yellow-200 text-yellow-800',
                            'Critical': 'bg-red-50 border-red-200 text-red-800'
                          }
                          
                          return (
                            <div key={index} className={`p-3 rounded border ${statusColors[plant.status]}`}>
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-sm">{plant.plant_name}</h5>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[plant.status]}`}>
                                  {plant.status}
                                </span>
                              </div>
                              
                              {plant.warnings.length > 0 && (
                                <div className="mb-2">
                                  <div className="text-xs font-medium mb-1">⚠️ {plant.warnings[0]}</div>
                                </div>
                              )}
                              
                              {plant.recommendations.length > 0 && (
                                <div className="text-xs">💡 {plant.recommendations[0]}</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Soil Temperature - Compact */}
                  {soilTemperature && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Soil Temperature</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Shallow:</span>
                            <span className="font-medium ml-1">{soilTemperature.soil_temperature.shallow}°C</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Deep:</span>
                            <span className="font-medium ml-1">{soilTemperature.soil_temperature.deep}°C</span>
                          </div>
                        </div>
                        {soilTemperature.recommendations.slice(0, 2).map((rec, index) => (
                          <div key={index} className={`p-2 rounded text-xs mb-2 ${
                            rec.color === 'green' ? 'bg-green-50 text-green-800' :
                            rec.color === 'yellow' ? 'bg-yellow-50 text-yellow-800' :
                            'bg-blue-50 text-blue-800'
                          }`}>
                            <div className="font-medium">{rec.plant_type}</div>
                            <div>{rec.status}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Plants - Compact */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Recommended Plants</h3>
                    <div className="space-y-2">
                      {recommendedPlants.slice(0, 4).map((plant, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <h4 className="font-medium text-sm text-gray-900">{plant.name}</h4>
                            <p className="text-xs text-gray-600">{plant.type}</p>
                    </div>
                    <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                        {plant.difficulty}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{plant.harvest_time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                </div>
              )}

              {/* Tips Tab */}
              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Tips
                </h3>
                <div className="space-y-3">
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
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Plant Information Modal */}
      {showPlantModal && modalPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{modalPlant.image}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{modalPlant.name}</h2>
                    <p className="text-sm text-gray-600">{modalPlant.scientificName}</p>
                  </div>
                </div>
                  <button
                  onClick={() => setShowPlantModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                  ×
                  </button>
                </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  modalPlant.category === 'Fruit' ? 'bg-red-100 text-red-800' :
                  modalPlant.category === 'Vegetable' ? 'bg-green-100 text-green-800' :
                  modalPlant.category === 'Herb' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {modalPlant.category}
                </span>
                  </div>

              {/* Plant Information */}
              <div className="space-y-4">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{modalPlant.description}</p>
                  </div>

                {/* Growing Tips */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Growing Tips</h3>
                  <p className="text-gray-700">{modalPlant.growingTips}</p>
                  </div>

                {/* Philippines Specific */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">🇵🇭 Philippines Specific</h3>
                  <p className="text-green-700">{modalPlant.philippinesSpecific}</p>
                  </div>

                {/* Plant Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Harvest Time</h4>
                    <p className="text-sm text-gray-600">{modalPlant.harvestTime}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Difficulty</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modalPlant.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      modalPlant.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {modalPlant.difficulty}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                    <p className="text-sm text-gray-600">{modalPlant.category}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPlantModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Plants Modal */}
      {showRecommendedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {modalCategory} Planting Guide
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Recommended plants for {months[selectedMonth]} in the Philippines
                  </p>
                </div>
                <button
                  onClick={() => setShowRecommendedModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-8">
                {/* Trees Section */}
                {modalPlants.trees && modalPlants.trees.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🌳 Trees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modalPlants.trees.map((plant, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{plant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                              {plant.difficulty}
                            </span>
                          </div>
                          
                    <div className="space-y-2">
                            <p className="text-sm text-gray-600 font-medium">📅 {plant.timing}</p>
                            
                            {plant.description && (
                              <p className="text-sm text-gray-700">{plant.description}</p>
                            )}
                            
                            {plant.care_tips && (
                              <div className="bg-green-50 p-2 rounded text-xs">
                                <span className="font-medium text-green-800">💡 Care Tips:</span>
                                <p className="text-green-700 mt-1">{plant.care_tips}</p>
                      </div>
                            )}
                            
                            {plant.varieties && (
                              <div className="flex flex-wrap gap-1">
                                {plant.varieties.map((variety, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handlePlantVarietyClick(variety)
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-200"
                                    title={`Click to learn more about ${variety}`}
                                  >
                                    {variety}
                                  </button>
                                ))}
                      </div>
                            )}
                            
                            {plant.harvest_time && (
                              <p className="text-xs text-gray-500">⏱️ Harvest: {plant.harvest_time}</p>
                            )}
                      </div>
                    </div>
                      ))}
                  </div>
                </div>
                )}

                {/* Fruits Section */}
                {modalPlants.fruits && modalPlants.fruits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🍎 Fruits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modalPlants.fruits.map((plant, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-red-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{plant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                              {plant.difficulty}
                            </span>
              </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 font-medium">📅 {plant.timing}</p>
                            
                            {plant.description && (
                              <p className="text-sm text-gray-700">{plant.description}</p>
                            )}
                            
                            {plant.care_tips && (
                              <div className="bg-green-50 p-2 rounded text-xs">
                                <span className="font-medium text-green-800">💡 Care Tips:</span>
                                <p className="text-green-700 mt-1">{plant.care_tips}</p>
                              </div>
                            )}
                            
                            {plant.varieties && (
                              <div className="flex flex-wrap gap-1">
                                {plant.varieties.map((variety, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handlePlantVarietyClick(variety)
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-200"
                                    title={`Click to learn more about ${variety}`}
                                  >
                                    {variety}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {plant.harvest_time && (
                              <p className="text-xs text-gray-500">⏱️ Harvest: {plant.harvest_time}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vegetables Section */}
                {modalPlants.vegetables && modalPlants.vegetables.length > 0 && (
                      <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🥬 Vegetables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modalPlants.vegetables.map((plant, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{plant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                              {plant.difficulty}
                            </span>
                      </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 font-medium">📅 {plant.timing}</p>
                            
                            {plant.description && (
                              <p className="text-sm text-gray-700">{plant.description}</p>
                            )}
                            
                            {plant.care_tips && (
                              <div className="bg-green-50 p-2 rounded text-xs">
                                <span className="font-medium text-green-800">💡 Care Tips:</span>
                                <p className="text-green-700 mt-1">{plant.care_tips}</p>
                        </div>
                            )}
                            
                            {plant.varieties && (
                              <div className="flex flex-wrap gap-1">
                                {plant.varieties.map((variety, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handlePlantVarietyClick(variety)
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-200"
                                    title={`Click to learn more about ${variety}`}
                                  >
                                    {variety}
                                  </button>
                                ))}
                              </div>
                            )}
                            
                            {plant.harvest_time && (
                              <p className="text-xs text-gray-500">⏱️ Harvest: {plant.harvest_time}</p>
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

                {/* Herbs Section */}
                {modalPlants.herbs && modalPlants.herbs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🌿 Herbs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modalPlants.herbs.map((plant, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-lg">{plant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(plant.difficulty)}`}>
                              {plant.difficulty}
                            </span>
          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 font-medium">📅 {plant.timing}</p>
                            
                            {plant.description && (
                              <p className="text-sm text-gray-700">{plant.description}</p>
                            )}
                            
                            {plant.care_tips && (
                              <div className="bg-green-50 p-2 rounded text-xs">
                                <span className="font-medium text-green-800">💡 Care Tips:</span>
                                <p className="text-green-700 mt-1">{plant.care_tips}</p>
        </div>
                            )}
                            
                            {plant.varieties && (
                              <div className="flex flex-wrap gap-1">
                                {plant.varieties.map((variety, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      handlePlantVarietyClick(variety)
                                    }}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 hover:scale-105 transition-all duration-200 cursor-pointer border border-blue-200"
                                    title={`Click to learn more about ${variety}`}
                                  >
                                    {variety}
                                  </button>
                                ))}
      </div>
                            )}
                            
                            {plant.harvest_time && (
                              <p className="text-xs text-gray-500">⏱️ Harvest: {plant.harvest_time}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowRecommendedModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeasonalPlanning
