import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Edit, Trash2, Leaf, MapPin, Calendar, Droplets, Sun, Scissors, Camera, Bell, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import GridPlanner from '../components/GridPlanner'

const Garden = () => {
  const { user, isPremium } = useAuth()
  const navigate = useNavigate()
  
  // Determine grid size based on subscription plan
  const getGridSizeForPlan = (isPremium) => {
    return isPremium ? '6x6' : '3x3'
  }
  
  const getGridSpacesForPlan = (isPremium) => {
    return isPremium ? 36 : 9
  }
  
  // Static data for demonstration - grid size now depends on subscription
  const staticGardens = [
    {
      id: 'static-1',
      name: 'My Backyard Garden',
      garden_type: 'vegetable',
      location_city: 'Manila',
      location_country: 'Philippines',
      grid_size: getGridSizeForPlan(isPremium),
      base_grid_spaces: getGridSpacesForPlan(isPremium),
      additional_spaces_purchased: 0,
      total_grid_spaces: getGridSpacesForPlan(isPremium),
      used_grid_spaces: 0
    },
    {
      id: 'static-2',
      name: 'Herb Collection',
      garden_type: 'herb',
      location_city: 'Quezon City',
      location_country: 'Philippines',
      grid_size: getGridSizeForPlan(isPremium),
      base_grid_spaces: getGridSpacesForPlan(isPremium),
      additional_spaces_purchased: 0,
      total_grid_spaces: getGridSpacesForPlan(isPremium),
      used_grid_spaces: 0
    }
  ]
  
  console.log('🌱 Static gardens created with isPremium:', isPremium, 'grid_size:', getGridSizeForPlan(isPremium))

  const staticPlants = [
    {
      plant: {
        name: 'Tomato Plant',
        type: 'vegetable',
        environment: 'outdoor',
        watering_frequency: 3,
        fertilizing_frequency: 14,
        pruning_frequency: 7,
        care_guide: 'Water regularly, provide support for vines, and ensure good drainage.'
      },
      garden: {
        id: 'static-1',
        name: 'My Backyard Garden'
      },
      tracking: {
        id: 'static-plant-1',
        planting_date: '2024-01-15'
      }
    },
    {
      plant: {
        name: 'Basil',
        type: 'herb',
        environment: 'outdoor',
        watering_frequency: 2,
        fertilizing_frequency: 30,
        pruning_frequency: 14,
        care_guide: 'Keep soil moist but not waterlogged. Pinch flowers to encourage leaf growth.'
      },
      garden: {
        id: 'static-2',
        name: 'Herb Collection'
      },
      tracking: {
        id: 'static-plant-2',
        planting_date: '2024-02-01'
      }
    }
  ]

  const [gardens, setGardens] = useState([])
  const [plants, setPlants] = useState([])
  const [plantSearch, setPlantSearch] = useState('')
  const [showAddGarden, setShowAddGarden] = useState(false)
  const [showAddPlant, setShowAddPlant] = useState(false)
  const [editingGarden, setEditingGarden] = useState(null)
  const [editingPlant, setEditingPlant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedGarden, setSelectedGarden] = useState(null)

  const [gardenForm, setGardenForm] = useState({
    name: '',
    garden_type: '',
    location_city: '',
    location_country: ''
  })
  const countryToCities = {
    Philippines: ['Manila', 'Quezon City', 'Cebu City', 'Davao City', 'Baguio'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Seattle'],
    Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    UK: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'],
    Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide']
  }

  const [plantForm, setPlantForm] = useState({
    name: '',
    type: '',
    environment: '',
    care_guide: '',
    ideal_soil_type: '',
    garden_id: '',
    planting_date: new Date().toISOString().split('T')[0] // Default to today's date
  })
  
  const [plantImage, setPlantImage] = useState(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const gridPlannerRef = useRef()
  const [showGridPlannerModal, setShowGridPlannerModal] = useState(false)
  
  // AI Recognition usage state
  const [aiUsage, setAiUsage] = useState(null)
  const [loadingUsage, setLoadingUsage] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // Garden alerts state
  const [gardenAlerts, setGardenAlerts] = useState([])
  const [completedActions, setCompletedActions] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [alertFilter, setAlertFilter] = useState('all')
  
  // Plants pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    console.log('🌱 Garden component - isPremium:', isPremium, 'type:', typeof isPremium)
    fetchGardens()
    fetchPlants()
    fetchAiUsage()
  }, [isPremium]) // Re-fetch when subscription status changes
  
  // Fetch AI usage when modal opens
  useEffect(() => {
    if (showAddPlant) {
      fetchAiUsage()
    }
  }, [showAddPlant])

  // Fetch alerts when a garden is selected
  useEffect(() => {
    if (selectedGarden) {
      fetchGardenAlerts(selectedGarden.id)
    }
  }, [selectedGarden])

  // Auto-refresh alerts every 30 seconds
  useEffect(() => {
    if (!selectedGarden) return

    const interval = setInterval(() => {
      fetchGardenAlerts(selectedGarden.id)
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [selectedGarden])

  // Refresh alerts when plants are updated
  const refreshAlerts = () => {
    if (selectedGarden) {
      fetchGardenAlerts(selectedGarden.id)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setPlantImage(file)
    setIsRecognizing(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post('/api/ai-recognition', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Handle the response format from the AI recognition endpoint
      let plantName = ''
      let plantType = ''
      let careGuide = ''
      
      if (response.data.plant_name) {
        plantName = response.data.plant_name
        plantType = response.data.plant_type || ''
        careGuide = response.data.care_guide || ''
      } else if (response.data.suggestions && response.data.suggestions.length > 0) {
        plantName = response.data.suggestions[0].plant_name || response.data.suggestions[0].name
        plantType = response.data.suggestions[0].plant_type || ''
        careGuide = response.data.suggestions[0].care_guide || ''
      }
      
      if (plantName) {
        // Auto-fill plant name
        setPlantForm(prev => ({...prev, name: plantName}))
        
        // Auto-fill plant type if available
        if (plantType) {
          setPlantForm(prev => ({...prev, type: plantType}))
        }
        
        // Auto-fill care guide if available
        if (careGuide) {
          setPlantForm(prev => ({...prev, care_guide: careGuide}))
        }
        
        toast.success(`Plant recognized: ${plantName}`)
      } else if (response.data.error) {
        // Check if it's a usage limit error
        if (response.data.limit_reached || response.data.needs_payment) {
          toast.error('Free analysis limit reached. Please purchase additional analyses or subscribe to Premium.', {
            duration: 5000,
            action: {
              label: 'Subscribe',
              onClick: () => navigate('/subscription')
            }
          })
        } else {
          toast.error(response.data.error)
        }
      } else {
        toast.error('Could not recognize plant. Please enter the name manually.')
      }
    } catch (error) {
      console.error('AI recognition error:', error)
      
      // Check if it's a 402 Payment Required (usage limit reached)
      if (error?.response?.status === 402 && (error?.response?.data?.limit_reached || error?.response?.data?.needs_payment)) {
        toast.error('Free analysis limit reached. Please purchase additional analyses or subscribe to Premium.', {
          duration: 5000,
          action: {
            label: 'Subscribe',
            onClick: () => navigate('/subscription')
          }
        })
      } else if (error?.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Failed to recognize plant. Please enter the name manually.')
      }
    } finally {
      setIsRecognizing(false)
      // Refresh usage after recognition attempt
      fetchAiUsage()
    }
  }

  const fetchAiUsage = async () => {
    try {
      setLoadingUsage(true)
      const response = await axios.get('/api/ai-analysis/usage')
      if (response.data.success) {
        setAiUsage(response.data)
      }
    } catch (error) {
      console.error('Error fetching AI usage:', error)
      // Set default values if API fails
      setAiUsage({
        free_remaining: 3,
        total_remaining: 3,
        is_premium: false,
        price_per_analysis: 20.00
      })
    } finally {
      setLoadingUsage(false)
    }
  }

  const purchaseOneTimeRecognition = async () => {
    try {
      setPurchasing(true)
      const response = await axios.post('/api/ai-analysis/purchase', {
        quantity: 1,
        payment_method: 'demo' // For demo purposes
      })
      
      if (response.data.success) {
        toast.success(`Successfully purchased 1 recognition for ₱${response.data.total_paid.toFixed(2)}`)
        setShowPaymentModal(false)
        // Refresh usage status
        await fetchAiUsage()
      } else {
        toast.error(response.data.error || 'Purchase failed')
      }
    } catch (error) {
      console.error('Error purchasing recognition:', error)
      toast.error(error.response?.data?.error || 'Failed to purchase recognition')
    } finally {
      setPurchasing(false)
    }
  }

  const fetchGardens = async () => {
    try {
      const response = await axios.get('/garden')
      const apiGardens = response.data.gardens || []
      
      // Update API gardens to respect subscription plan
      const updatedApiGardens = apiGardens.map(garden => ({
        ...garden,
        grid_size: getGridSizeForPlan(isPremium),
        base_grid_spaces: getGridSpacesForPlan(isPremium),
        total_grid_spaces: getGridSpacesForPlan(isPremium)
      }))
      
      // Always use real gardens from API (even if empty array for new users)
      setGardens(updatedApiGardens)
      
      // Update selected garden if it exists in the new data
      if (selectedGarden) {
        const updatedGarden = updatedApiGardens.find(g => g.id === selectedGarden.id)
        if (updatedGarden) {
          setSelectedGarden(updatedGarden)
        }
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        // User not logged in, show demo data instead of redirecting
        console.log('🌱 User not logged in, showing demo gardens')
        setGardens(staticGardens)
        return
      }
      console.error('Error fetching gardens:', error)
      // If user is logged in but API fails, show empty state
      if (user) {
        console.log('🌱 API failed for logged-in user, showing empty state')
        setGardens([])
      } else {
        // If user is not logged in and API fails, show demo data
        console.log('🌱 API failed, showing demo gardens')
        setGardens(staticGardens)
      }
    }
  }

  const fetchPlants = async () => {
    try {
      const response = await axios.get('/garden')
      const apiPlants = response.data.plants || []
      console.log('🌱 Fetched plants:', apiPlants)
      
      // Always use real plants from API (even if empty array for new users)
      setPlants(apiPlants)
      setLoading(false)
    } catch (error) {
      if (error?.response?.status === 401) {
        // User not logged in, show demo data instead of redirecting
        console.log('🌱 User not logged in, showing demo data')
        setPlants(staticPlants)
        setLoading(false)
        return
      }
      console.error('Error fetching plants:', error)
      // If user is logged in but API fails, show empty state
      if (user) {
        console.log('🌱 API failed for logged-in user, showing empty state')
        setPlants([])
      } else {
        // If user is not logged in and API fails, show demo data
        console.log('🌱 API failed, showing demo data')
        setPlants(staticPlants)
      }
      setLoading(false)
    }
  }

  const fetchGardenAlerts = async (gardenId) => {
    if (!gardenId) return
    
    try {
      setAlertsLoading(true)
      const response = await axios.get('/api/smart-alerts')
      const allAlerts = response.data.alerts || []
      const completedActions = response.data.completed_actions || []
      
      // Filter alerts for the specific garden
      const gardenSpecificAlerts = allAlerts.filter(alert => 
        alert.garden_id === gardenId || alert.garden_name === selectedGarden?.name
      )
      
      // Filter completed actions for the specific garden
      const gardenCompletedActions = completedActions.filter(action => 
        action.garden_name === selectedGarden?.name
      )
      
      setGardenAlerts(gardenSpecificAlerts)
      setCompletedActions(gardenCompletedActions)
    } catch (error) {
      console.error('Error fetching garden alerts:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      setGardenAlerts([])
      setCompletedActions([])
    } finally {
      setAlertsLoading(false)
    }
  }

  // Filter alerts based on selected care type
  const getFilteredAlerts = () => {
    if (alertFilter === 'all') return gardenAlerts
    
    const filterMap = {
      'water': 'watering',
      'fertilize': 'fertilizing', 
      'prune': 'pruning'
    }
    
    return gardenAlerts.filter(alert => alert.type === filterMap[alertFilter])
  }

  // Plants pagination and search logic
  const getFilteredPlants = () => {
    let filtered = plants
    
    // If a garden is selected, filter by that garden
    if (selectedGarden) {
      filtered = plants.filter(plant => {
        // Handle both API plants (with garden.id) and static plants (with garden.id)
        const plantGardenId = plant.garden?.id || plant.garden_id
        return plantGardenId === selectedGarden.id
      })
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(plant => {
        const plantName = plant.plant?.name || plant.name
        const plantType = plant.plant?.type || plant.type
        const plantEnvironment = plant.plant?.environment || plant.environment
        const gardenName = plant.garden?.name || selectedGarden?.name || ''
        
        return plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               plantType.toLowerCase().includes(searchQuery.toLowerCase()) ||
               plantEnvironment.toLowerCase().includes(searchQuery.toLowerCase()) ||
               gardenName.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }
    
    return filtered
  }

  const getPaginatedPlants = () => {
    const filtered = getFilteredPlants()
    
    if (itemsPerPage === 'all') {
      return filtered
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    const filtered = getFilteredPlants()
    return itemsPerPage === 'all' ? 1 : Math.ceil(filtered.length / itemsPerPage)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const markAlertCompleted = async (alertId, action) => {
    try {
      console.log('🎯 Marking alert as completed:', { alertId, action })
      console.log('🎯 Current garden alerts before completion:', gardenAlerts)
      
      const response = await axios.post('/api/alerts/mark-completed', {
        alert_id: alertId,
        action: action
      })
      
      console.log('🎯 Backend response:', response.data)
      
      if (response.data.success) {
        // Show success message immediately
        toast.success(`Plant ${action}ed successfully!`)
        
        // Remove the alert from display immediately
        console.log('🎯 Removing alert from display immediately:', alertId)
        setGardenAlerts(prevAlerts => {
          const filteredAlerts = prevAlerts.filter(alert => alert.id !== alertId)
          console.log('🎯 Alerts after immediate removal:', filteredAlerts)
          return filteredAlerts
        })
        
        // Refresh garden alerts to get updated data from backend
        if (selectedGarden) {
          console.log('🎯 Refreshing garden alerts for garden:', selectedGarden.id)
          fetchGardenAlerts(selectedGarden.id)
        }
      } else {
        throw new Error(response.data.error || 'Failed to mark alert as completed')
      }
    } catch (error) {
      console.error('Error marking alert as completed:', error)
      
      // Handle backend errors properly
      if (error.response?.status === 404) {
        // Alert not found - it may have already been completed
        console.log('Alert not found, removing from local state:', alertId)
        setGardenAlerts(prevAlerts => 
          prevAlerts.filter(alert => alert.id !== alertId)
        )
        toast.success(`Plant ${action}ed successfully! (Alert already completed)`)
        return
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again.')
        return
      }
      
      // Show more specific error messages
      if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`)
      } else if (error.message) {
        toast.error(`Error: ${error.message}`)
      } else {
        toast.error('Failed to mark alert as completed')
      }
    }
  }

  const snoozeAlert = async (alertId, hours = 24) => {
    try {
      // Update local state immediately for better UX
      const newDueDate = new Date(Date.now() + hours * 60 * 60 * 1000)
      setGardenAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, due_date: newDueDate.toISOString(), status: 'snoozed' }
            : alert
        )
      )
      
      toast.success(`Alert snoozed for ${hours} hours`)
      
      // Optional: Call backend to persist snooze (if you want to implement this)
      // const response = await axios.post('/api/alerts/snooze', {
      //   alert_id: alertId,
      //   hours: hours
      // })
    } catch (error) {
      console.error('Error snoozing alert:', error)
      toast.error('Failed to snooze alert')
    }
  }

  const handleGardenSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingGarden) {
        await axios.post(`/garden/edit/${editingGarden.id}`, gardenForm)
        toast.success('Garden updated successfully!')
        setEditingGarden(null)
      } else {
        await axios.post('/garden/add', gardenForm)
        toast.success('Garden added successfully!')
      }
      setGardenForm({ name: '', garden_type: '', location_city: '', location_country: '' })
      setShowAddGarden(false)
      fetchGardens()
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please sign in first')
        navigate('/login')
        return
      }
      const raw = error.response?.data
      console.error('Garden save error response:', raw)
      const msg = raw?.error || raw?.message || (typeof raw === 'string' ? raw : 'Error saving garden')
      toast.error(msg)
    }
  }

  const toIntOrNull = (val) => {
    if (val === '' || val === null || val === undefined) return null
    const num = Number(val)
    return Number.isNaN(num) ? null : num
  }

  const handlePlantSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPlant) {
        // For editing, use JSON payload
        const payload = {
          ...plantForm,
          name: plantForm.name || plantForm.type,
          garden_id: Number(plantForm.garden_id),
          care_guide: plantForm.care_guide || 'General care'
        }
        await axios.post(`/plant/edit/${editingPlant.tracking.id}`, payload)
        toast.success('Plant updated successfully!')
        setEditingPlant(null)
      } else {
        // For new plants, check if we have an image
        if (plantImage) {
          // Send form data with image
          const formData = new FormData()
          formData.append('name', plantForm.name || plantForm.type)
          formData.append('type', plantForm.type)
          formData.append('environment', plantForm.environment)
          formData.append('care_guide', plantForm.care_guide || 'General care')
          formData.append('ideal_soil_type', plantForm.ideal_soil_type)
          formData.append('garden_id', plantForm.garden_id)
          formData.append('planting_date', plantForm.planting_date)
          formData.append('image', plantImage)
          
          await axios.post('/plant/add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
        } else {
          // Send JSON payload without image
          const payload = {
            ...plantForm,
            name: plantForm.name || plantForm.type,
            garden_id: Number(plantForm.garden_id),
            care_guide: plantForm.care_guide || 'General care'
          }
          await axios.post('/plant/add', payload)
        }
        toast.success('Plant added successfully!')
      }
      
      setPlantForm({
        name: '', type: '', environment: '', care_guide: '', ideal_soil_type: '',
        garden_id: '', planting_date: new Date().toISOString().split('T')[0]
      })
      setPlantImage(null)
      setIsRecognizing(false)
      setShowAddPlant(false)
      fetchPlants()
      // Refresh alerts when new plant is added
      refreshAlerts()
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please sign in first')
        navigate('/login')
        return
      }
      const msg = error.response?.data?.error || error.response?.data?.message || 'Error saving plant'
      toast.error(msg)
    }
  }

  const deleteGarden = async (gardenId) => {
    // Prevent deletion of static gardens
    if (gardenId.toString().startsWith('static-')) {
      toast.error('Cannot delete demo gardens')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this garden?')) {
      try {
        const response = await axios.post(`/garden/delete/${gardenId}`)
        toast.success('Garden deleted successfully!')
        fetchGardens()
      } catch (error) {
        console.error('Error deleting garden:', error)
        const errorMessage = error.response?.data?.error || error.message || 'Error deleting garden'
        toast.error(errorMessage)
      }
    }
  }

  const deletePlant = async (trackingId) => {
    // Prevent deletion of static plants
    if (trackingId.toString().startsWith('static-')) {
      toast.error('Cannot delete demo plants')
      return
    }
    
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await axios.post(`/plant/delete/${trackingId}`)
        toast.success('Plant deleted successfully!')
        fetchPlants()
        // Refresh grid planner
        if (gridPlannerRef.current) {
          gridPlannerRef.current.refresh()
        }
      } catch (error) {
        toast.error('Error deleting plant')
      }
    }
  }

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath)
    setShowImageModal(true)
  }

  const editGarden = (garden) => {
    // Prevent editing of static gardens
    if (garden.id.toString().startsWith('static-')) {
      toast.error('Cannot edit demo gardens')
      return
    }
    
    setEditingGarden(garden)
    setGardenForm({
      name: garden.name,
      garden_type: garden.garden_type,
      location_city: garden.location_city,
      location_country: garden.location_country
    })
    setShowAddGarden(true)
  }

  const editPlant = (plantData) => {
    // Prevent editing of static plants
    if (plantData.tracking.id.toString().startsWith('static-')) {
      toast.error('Cannot edit demo plants')
      return
    }
    
    setEditingPlant(plantData)
    setPlantForm({
      type: plantData.plant.type,
      environment: plantData.plant.environment,
      care_guide: plantData.plant.care_guide,
      ideal_soil_type: plantData.plant.ideal_soil_type,
      watering_frequency: plantData.plant.watering_frequency ?? '',
      fertilizing_frequency: plantData.plant.fertilizing_frequency ?? '',
      pruning_frequency: plantData.plant.pruning_frequency ?? '',
      garden_id: plantData.garden.id,
      planting_date: plantData.tracking.planting_date
    })
    setShowAddPlant(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Garden</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowAddGarden(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Garden</span>
            </button>
            <button
              onClick={() => setShowAddPlant(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Leaf className="h-5 w-5" />
              <span>Add Plant</span>
            </button>
          </div>
        </div>

        {/* Main Content with Grid Planner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Gardens and Plants */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gardens Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Gardens</h2>
              {gardens.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No gardens yet</h3>
                  <p className="text-gray-500 mb-4">Create your first garden to start planning your plants!</p>
                  <button
                    onClick={() => setShowAddGarden(true)}
                    className="btn-primary"
                  >
                    Create Your First Garden
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gardens.map((garden) => (
                  <div 
                    key={garden.id} 
                    className={`card cursor-pointer transition-all ${
                      selectedGarden?.id === garden.id 
                        ? 'ring-2 ring-green-500 bg-green-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedGarden(garden)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{garden.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            editGarden(garden)
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteGarden(garden.id)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4" />
                        <span>{garden.garden_type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{garden.location_city}, {garden.location_country}</span>
                      </div>
                      {garden.grid_size && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-200 rounded"></div>
                          <span>Grid: {garden.grid_size} ({garden.total_grid_spaces || 9} spaces)</span>
                          {!isPremium && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Basic Plan
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedGarden?.id === garden.id && (
                      <div className="mt-3 p-2 bg-green-100 rounded-lg">
                        <div className="text-sm text-green-800 font-medium">Selected for Grid Planning</div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              )}
            </div>

            {/* Plants Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">My Plants</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-full max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search plants, gardens, or environment..."
                      className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value) || e.target.value)}
                      className="rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400 text-sm"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Garden Selection Helper */}
              {!selectedGarden && gardens.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Tip:</strong> Click on a garden above to view its plants, or add a new plant to any garden.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Pagination Info */}
              <div className="mb-4 text-sm text-gray-600">
                {getFilteredPlants().length > 0 ? (
                  <span>
                    Showing {((currentPage - 1) * (itemsPerPage === 'all' ? getFilteredPlants().length : itemsPerPage)) + 1}-{Math.min(currentPage * (itemsPerPage === 'all' ? getFilteredPlants().length : itemsPerPage), getFilteredPlants().length)} of {getFilteredPlants().length} plants
                  </span>
                ) : (
                  <span>No plants found</span>
                )}
              </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-8 text-xs font-semibold text-gray-600">
                <div className="col-span-3">Plant</div>
                <div className="col-span-2">Garden</div>
                <div className="col-span-2">Environment</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {getPaginatedPlants().map((plantData, index) => {
                // Handle both API plant structure and static plant structure
                const plant = plantData.plant || plantData
                const garden = plantData.garden || { name: 'Unknown Garden' }
                const tracking = plantData.tracking || { id: plantData.id, planting_date: plantData.planting_date }
                const plantName = plant.name
                const plantType = plant.type
                const plantEnvironment = plant.environment
                const plantImage = plant.latest_image || plant.image_path
                const plantingDate = tracking.planting_date
                
                return (
                  <li key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-8 items-center gap-2">
                      <div className="col-span-3 flex items-center gap-3">
                        {plantImage && 
                         !plantImage.includes('blob') && 
                         !plantImage.includes('_blob') ? (
                          <img
                            src={`/${plantImage}`}
                            alt={plantName}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImageClick(plantImage)}
                            title="Click to view full size"
                            onError={(e) => {
                              console.log('Image load error:', plantImage)
                              e.target.style.display = 'none'
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex'
                              }
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-green-700" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 leading-none">{plantName}</div>
                          <div className="text-xs text-gray-500 capitalize">{plantType}</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-gray-700 truncate">{garden.name}</div>
                      <div className="col-span-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          <Sun className="h-3 w-3" /> {plantEnvironment}
                        </span>
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => editPlant(plantData)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deletePlant(tracking.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-1 text-[10px] text-gray-400 text-right">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {plantingDate ? new Date(plantingDate).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
              {getFilteredPlants().length === 0 && (
                <li className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Leaf className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">
                      {searchQuery ? 'No plants found matching your search' : 
                       selectedGarden ? 'No plants in this garden yet' : 
                       'Select a garden to view plants or add your first plant!'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {searchQuery ? 'Try adjusting your search terms' : 
                       selectedGarden ? 'Add your first plant to this garden!' :
                       'Choose a garden from the list above to see its plants'}
                    </p>
                  </div>
                </li>
              )}
            </ul>
            
            {/* Pagination Controls */}
            {getTotalPages() > 1 && itemsPerPage !== 'all' && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {getTotalPages()}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                    disabled={currentPage === getTotalPages()}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Go to page:</span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    className="rounded-md border-gray-300 text-sm"
                  >
                    {Array.from({ length: getTotalPages() }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
            </div>
          </div>

          {/* Right Side - Grid Planner and Alerts */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Garden Alerts Widget */}
              {selectedGarden && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-blue-600" />
                      Garden Alerts
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={refreshAlerts}
                        className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                        title="Refresh alerts"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Refresh
                      </button>
                      <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Show All
                      </button>
                      <button
                        onClick={() => navigate('/smart-alerts')}
                        className="text-sm text-green-600 hover:text-green-800 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        View All Alerts
                      </button>
                    </div>
                  </div>
                  
                  {/* Filter by care type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by care type:
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setAlertFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          alertFilter === 'all' 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setAlertFilter('water')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${
                          alertFilter === 'water' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <Droplets className="w-4 h-4 mr-1" />
                        Water
                      </button>
                      <button
                        onClick={() => setAlertFilter('fertilize')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${
                          alertFilter === 'fertilize' 
                            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                            : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        }`}
                      >
                        <Leaf className="w-4 h-4 mr-1" />
                        Fertilize
                      </button>
                      <button
                        onClick={() => setAlertFilter('prune')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center ${
                          alertFilter === 'prune' 
                            ? 'bg-pink-100 text-pink-700 border border-pink-300' 
                            : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                        }`}
                      >
                        <Scissors className="w-4 h-4 mr-1" />
                        Prune
                      </button>
                    </div>
                  </div>
                  
                  {alertsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : getFilteredAlerts().length > 0 ? (
                    <div className="space-y-3">
                      {getFilteredAlerts().slice(0, showAlerts ? getFilteredAlerts().length : 3).map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                          alert.status === 'completed' ? 'border-green-500 bg-green-50' :
                          alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                          alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                          'border-blue-500 bg-blue-50'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {alert.type === 'watering' && <Droplets className="w-4 h-4 text-blue-600" />}
                                {alert.type === 'fertilizing' && <Leaf className="w-4 h-4 text-green-600" />}
                                {alert.type === 'pruning' && <Scissors className="w-4 h-4 text-gray-600" />}
                                <span className="text-sm font-medium text-gray-900">{alert.plant_name}</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  alert.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  alert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {alert.status}
                                </span>
                              </div>
                               <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                               
                               {/* AI Suggested Actions */}
                               {alert.ai_suggested_actions && alert.ai_suggested_actions.length > 0 && (
                                 <div className="mb-3">
                                   <p className="text-sm font-medium text-gray-700 mb-2">AI Suggested Actions:</p>
                                   <div className="flex flex-wrap gap-2">
                                     {alert.ai_suggested_actions.map((action, index) => (
                                       <span
                                         key={index}
                                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                           action.type === 'water' ? 'bg-blue-100 text-blue-800' :
                                           action.type === 'fertilize' ? 'bg-yellow-100 text-yellow-800' :
                                           'bg-red-100 text-red-800'
                                         }`}
                                       >
                                         <span className="mr-1">{action.icon}</span>
                                         {action.label}
                                       </span>
                                     ))}
                                   </div>
                                 </div>
                               )}
                               
                               {/* Combined AI Analysis and Recommendation Card */}
                               {alert.recommendation && (
                                 <div className="bg-purple-50 border-l-2 border-purple-400 p-3 mb-3 rounded">
                                   <div className="flex items-center mb-2">
                                     <span className="text-sm font-medium text-purple-800 mr-2">🤖 AI Analysis</span>
                                     {alert.ai_confidence && (
                                       <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                         Confidence: {Math.round(alert.ai_confidence * 100)}%
                                       </span>
                                     )}
                                   </div>
                                   <div className="text-sm text-purple-700 mb-2">
                                     {alert.recommendation}
                                   </div>
                                   <div className="text-xs text-purple-600">
                                     💡 Recommendation: {alert.type === 'watering' ? 'Water thoroughly to help establish roots' : 
                                       alert.type === 'fertilizing' ? 'Apply appropriate fertilizer following package instructions' :
                                       alert.type === 'pruning' ? 'Prune for shape and air circulation' : 'Follow care guidelines'}
                                   </div>
                                 </div>
                               )}
                               
                               {/* Position and Due Date */}
                               <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                 <div className="flex items-center space-x-4">
                                   {alert.grid_position && (
                                     <div className="flex items-center">
                                       <span className="mr-1">📍</span>
                                       Position: {alert.grid_position}
                                     </div>
                                   )}
                                   <div className="flex items-center">
                                     <Clock className="w-3 h-3 mr-1" />
                                     Due: {new Date(alert.due_date).toLocaleDateString()}
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Action Buttons */}
                               {alert.status !== 'completed' && (
                                 <div className="flex space-x-2">
                                   <button
                                     onClick={() => {
                                       console.log('🎯 Prune button clicked for alert:', alert.id, 'Status:', alert.status)
                                       const actionMap = {
                                         'watering': 'water',
                                         'fertilizing': 'fertilize',
                                         'pruning': 'prune'
                                       }
                                       markAlertCompleted(alert.id, actionMap[alert.type])
                                     }}
                                     className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                       alert.type === 'watering' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                       alert.type === 'fertilizing' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                                       'bg-pink-600 hover:bg-pink-700 text-white'
                                     }`}
                                   >
                                     {alert.type === 'watering' ? '💧 Water' :
                                      alert.type === 'fertilizing' ? '🌱 Fertilize' :
                                      '✂️ Prune'}
                                   </button>
                                   <button
                                     onClick={() => snoozeAlert(alert.id, 24)}
                                     className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                   >
                                     <Clock className="w-4 h-4 inline mr-1" />
                                     Snooze
                                   </button>
                                 </div>
                               )}
                            </div>
                             {alert.status === 'completed' && (
                               <div className="flex items-center text-green-600">
                                 <CheckCircle className="w-4 h-4 mr-1" />
                                 <span className="text-sm font-medium">Completed - Removing in 2 seconds...</span>
                               </div>
                             )}
                          </div>
                        </div>
                      ))}
                      
                      {getFilteredAlerts().length > 3 && !showAlerts && (
                        <div className="text-center">
                          <button
                                onClick={() => setShowAlerts(true)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                +{getFilteredAlerts().length - 3} more alerts
                              </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">
                        <span className="text-blue-600 font-medium">No</span> alerts for this garden
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Completed Actions Section */}
              {selectedGarden && completedActions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      Recent Completed Actions
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {completedActions.slice(0, 5).map((action, index) => (
                      <div key={action.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              action.type === 'water' ? 'bg-blue-100' :
                              action.type === 'fertilize' ? 'bg-yellow-100' :
                              'bg-pink-100'
                            }`}>
                              {action.type === 'water' ? '💧' :
                               action.type === 'fertilize' ? '🌱' :
                               '✂️'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {action.plant_name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {action.type === 'water' ? 'Watered' :
                                 action.type === 'fertilize' ? 'Fertilized' :
                                 'Pruned'} • {new Date(action.action_date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Done</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {completedActions.length > 5 && (
                      <div className="text-center">
                        <button
                          onClick={() => navigate('/smart-alerts')}
                          className="text-sm text-green-600 hover:text-green-800"
                        >
                          View all {completedActions.length} completed actions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Grid Planner Button */}
              <div className="mt-4">
                <button
                  onClick={() => setShowGridPlannerModal(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <MapPin className="h-5 w-5" />
                  <span>Open Grid Planner</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Garden Modal */}
        {showAddGarden && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {editingGarden ? 'Edit Garden' : 'Add New Garden'}
              </h3>
              <form onSubmit={handleGardenSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garden Name</label>
                  <input
                    type="text"
                    value={gardenForm.name}
                    onChange={(e) => setGardenForm({...gardenForm, name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garden Type</label>
                  <select
                    value={gardenForm.garden_type}
                    onChange={(e) => setGardenForm({...gardenForm, garden_type: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="vegetable">Vegetable Garden</option>
                    <option value="herb">Herb Garden</option>
                    <option value="flower">Flower Garden</option>
                    <option value="fruit">Fruit Garden</option>
                    <option value="mixed">Mixed Garden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    value={gardenForm.location_country}
                    onChange={(e) => {
                      const country = e.target.value
                      const defaultCity = country ? (countryToCities[country]?.[0] || '') : ''
                      setGardenForm({ ...gardenForm, location_country: country, location_city: defaultCity })
                    }}
                    className="input-field"
                  >
                    <option value="">Select Country</option>
                    {Object.keys(countryToCities).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <select
                    value={gardenForm.location_city}
                    onChange={(e) => setGardenForm({ ...gardenForm, location_city: e.target.value })}
                    className="input-field"
                    disabled={!gardenForm.location_country}
                  >
                    <option value="">{gardenForm.location_country ? 'Select City' : 'Select a country first'}</option>
                    {(countryToCities[gardenForm.location_country] || []).map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingGarden ? 'Update Garden' : 'Add Garden'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddGarden(false)
                      setEditingGarden(null)
                      setGardenForm({ name: '', garden_type: '', location_city: '', location_country: '' })
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Plant Modal */}
        {showAddPlant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">
                {editingPlant ? 'Edit Plant' : 'Add New Plant'}
              </h3>
              <form onSubmit={handlePlantSubmit} className="space-y-4">
                {/* Plant Name Field with Image Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plant Name</label>
                  <div className="flex items-center space-x-3">
                    {/* Plant Image Display */}
                    {plantImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={URL.createObjectURL(plantImage)}
                          alt="Plant preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                    {/* Plant Name Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={plantForm.name}
                        onChange={(e) => setPlantForm({...plantForm, name: e.target.value})}
                        className="input-field"
                        placeholder="Enter plant name or upload image for AI recognition"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Image Upload for AI Recognition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Plant Image (AI Recognition)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="plant-image-upload"
                      disabled={isRecognizing || (!editingPlant && aiUsage && aiUsage.total_remaining === 0)}
                    />
                    <label
                      htmlFor="plant-image-upload"
                      className={`flex items-center space-x-2 px-4 py-2 border-2 border-dashed rounded-lg transition-colors ${
                        isRecognizing || (!editingPlant && aiUsage && aiUsage.total_remaining === 0)
                          ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                          : 'border-green-300 bg-green-50 hover:bg-green-100 cursor-pointer'
                      }`}
                    >
                      <Camera className={`h-4 w-4 ${
                        isRecognizing || (!editingPlant && aiUsage && aiUsage.total_remaining === 0)
                          ? 'text-gray-400' 
                          : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${
                        isRecognizing || (!editingPlant && aiUsage && aiUsage.total_remaining === 0)
                          ? 'text-gray-500' 
                          : 'text-green-700'
                      }`}>
                        {isRecognizing ? 'Recognizing...' : 
                         (!editingPlant && aiUsage && aiUsage.total_remaining === 0) ? 'No Credits Available' :
                         'Upload Image'}
                      </span>
                    </label>
                    {plantImage && (
                      <span className="text-sm text-gray-600">
                        {plantImage.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a clear photo of your plant for AI-powered name recognition
                  </p>
                  
                  {/* Image Preview */}
                  {plantImage && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                      <div className="relative inline-block">
                        <img
                          src={URL.createObjectURL(plantImage)}
                          alt="Plant preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPlantImage(null)
                            document.getElementById('plant-image-upload').value = ''
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Recognition Usage Indicator */}
                  {!editingPlant && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      {loadingUsage ? (
                        <div className="flex items-center justify-center py-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <span className="ml-2 text-sm text-gray-600">Loading usage...</span>
                        </div>
                      ) : aiUsage ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Camera className="h-5 w-5 text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">AI Recognition Credits</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              aiUsage.total_remaining > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {aiUsage.total_remaining} {aiUsage.total_remaining === 1 ? 'credit' : 'credits'} left
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Free tries:</span>
                              <span className="font-medium">{aiUsage.free_remaining || 0} / {aiUsage.free_allocation || 3}</span>
                            </div>
                            {aiUsage.purchased_credits > 0 && (
                              <div className="flex justify-between">
                                <span>Purchased credits:</span>
                                <span className="font-medium">{aiUsage.purchased_credits}</span>
                              </div>
                            )}
                          </div>
                          
                          {aiUsage.total_remaining === 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-sm font-medium text-gray-900 mb-2">No credits remaining. Choose an option:</p>
                              <div className="flex flex-col space-y-2">
                                <button
                                  type="button"
                                  onClick={() => setShowPaymentModal(true)}
                                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                                >
                                  <span>💳</span>
                                  <span>Buy 1 Recognition (₱{aiUsage.price_per_analysis?.toFixed(2) || '20.00'})</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddPlant(false)
                                    navigate('/subscription')
                                  }}
                                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                                >
                                  <span>👑</span>
                                  <span>Subscribe to Premium (Unlimited)</span>
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {aiUsage.total_remaining > 0 && aiUsage.total_remaining <= 2 && (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-xs text-amber-700 mb-2">Running low on credits!</p>
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setShowPaymentModal(true)}
                                  className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                                >
                                  Buy More
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowAddPlant(false)
                                    navigate('/subscription')
                                  }}
                                  className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-medium"
                                >
                                  Subscribe
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          Unable to load usage information. You can still try uploading an image.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plant Type</label>
                  <select
                    value={plantForm.type}
                    onChange={(e) => setPlantForm({...plantForm, type: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="herb">Herb</option>
                    <option value="flower">Flower</option>
                    <option value="fruit">Fruit</option>
                    <option value="tree">Tree</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <select
                    value={plantForm.environment}
                    onChange={(e) => setPlantForm({...plantForm, environment: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Environment</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Garden</label>
                  <select
                    value={plantForm.garden_id}
                    onChange={(e) => setPlantForm({...plantForm, garden_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select Garden</option>
                    {gardens.map((garden) => (
                      <option key={garden.id} value={garden.id}>
                        {garden.name} {garden.id.toString().startsWith('static-') ? '(Demo)' : ''}
                      </option>
                    ))}
                  </select>
                  {plantForm.garden_id && plantForm.garden_id.toString().startsWith('static-') && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Demo Garden Selected
                          </h3>
                          <div className="mt-1 text-sm text-yellow-700">
                            <p>You cannot add real plants to demo gardens. Please create a real garden first by clicking "Add Garden" above.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={plantForm.planting_date}
                    onChange={(e) => setPlantForm({...plantForm, planting_date: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Care Guide</label>
                  {plantForm.care_guide ? (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                      <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                        {plantForm.care_guide
                          .split('\n')
                          .filter(line => line.trim())
                          .map((line, index) => {
                            // Remove existing bullet points, dashes, or numbers if present
                            const cleanedLine = line.trim().replace(/^[•\-\*\d+\.\)]\s*/, '')
                            return (
                              <li key={index} className="leading-relaxed">{cleanedLine}</li>
                            )
                          })}
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm text-gray-500 italic">
                      No care guide provided. Care guide will be auto-generated from AI recognition or can be added later.
                    </div>
                  )}
                </div>
                <div className="flex space-x-4">
                  <button 
                    type="submit" 
                    className={`flex-1 ${plantForm.garden_id && plantForm.garden_id.toString().startsWith('static-') 
                      ? 'btn-disabled cursor-not-allowed opacity-50' 
                      : 'btn-primary'}`}
                    disabled={plantForm.garden_id && plantForm.garden_id.toString().startsWith('static-')}
                  >
                    {editingPlant ? 'Update Plant' : 'Add Plant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPlant(false)
                      setEditingPlant(null)
                      setPlantForm({
                        name: '', type: '', environment: '', care_guide: '', ideal_soil_type: '',
                        garden_id: '', planting_date: new Date().toISOString().split('T')[0]
                      })
                      setPlantImage(null)
                      setIsRecognizing(false)
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Payment Modal for One-Time Recognition Purchase */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Purchase AI Recognition</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">1x AI Recognition</span>
                  <span className="text-lg font-bold text-green-600">₱{aiUsage?.price_per_analysis?.toFixed(2) || '20.00'}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Get instant plant identification with AI-powered recognition. This is a one-time purchase.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select className="input-field" defaultValue="demo">
                  <option value="demo">Demo Payment (Instant)</option>
                  <option value="gcash">GCash</option>
                  <option value="paymaya">PayMaya</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={purchaseOneTimeRecognition}
                  disabled={purchasing}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {purchasing ? 'Processing...' : `Pay ₱${aiUsage?.price_per_analysis?.toFixed(2) || '20.00'}`}
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 btn-secondary"
                  disabled={purchasing}
                >
                  Cancel
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setShowAddPlant(false)
                    navigate('/subscription')
                  }}
                  className="w-full text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  👑 Or subscribe to Premium for unlimited recognition →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Plant Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={`/${selectedImage}`}
                alt="Plant image"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Planner Modal */}
      {showGridPlannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Grid Planner</h3>
              <button
                onClick={() => setShowGridPlannerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <GridPlanner 
                ref={gridPlannerRef}
                selectedGarden={selectedGarden} 
                onGardenUpdate={fetchGardens}
                onPlantUpdate={refreshAlerts}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Garden

