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
        environment: 'indoor',
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
    planting_date: ''
  })
  
  const [plantImage, setPlantImage] = useState(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const gridPlannerRef = useRef()
  
  // Garden alerts state
  const [gardenAlerts, setGardenAlerts] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)

  useEffect(() => {
    fetchGardens()
    fetchPlants()
  }, [isPremium]) // Re-fetch when subscription status changes

  // Fetch alerts when a garden is selected
  useEffect(() => {
    if (selectedGarden) {
      fetchGardenAlerts(selectedGarden.id)
    }
  }, [selectedGarden])

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setPlantImage(file)
    setIsRecognizing(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post('/ai-recognition', formData, {
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
        toast.error(response.data.error)
      } else {
        toast.error('Could not recognize plant. Please enter the name manually.')
      }
    } catch (error) {
      console.error('AI recognition error:', error)
      toast.error('Failed to recognize plant. Please enter the name manually.')
    } finally {
      setIsRecognizing(false)
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
      
      // Only show API gardens for real users, not static demo data
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
        toast.error('Please sign in to manage your garden')
        navigate('/login')
        return
      }
      console.error('Error fetching gardens:', error)
      // If API fails, show empty list instead of static demo data
      setGardens([])
    }
  }

  const fetchPlants = async () => {
    try {
      const response = await axios.get('/garden')
      const apiPlants = response.data.plants || []
      console.log('🌱 Fetched plants:', apiPlants)
      // Only show API plants for real users, not static demo data
      setPlants(apiPlants)
      setLoading(false)
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please sign in to view your plants')
        navigate('/login')
        return
      }
      console.error('Error fetching plants:', error)
      // If API fails, show empty list instead of static demo data
      setPlants([])
      setLoading(false)
    }
  }

  const fetchGardenAlerts = async (gardenId) => {
    if (!gardenId) return
    
    try {
      setAlertsLoading(true)
      const response = await axios.get('/api/smart-alerts')
      const allAlerts = response.data.alerts || []
      
      // Filter alerts for the specific garden
      const gardenSpecificAlerts = allAlerts.filter(alert => 
        alert.garden_id === gardenId || alert.garden_name === selectedGarden?.name
      )
      
      setGardenAlerts(gardenSpecificAlerts)
    } catch (error) {
      console.error('Error fetching garden alerts:', error)
      setGardenAlerts([])
    } finally {
      setAlertsLoading(false)
    }
  }

  const markAlertCompleted = async (alertId, action) => {
    try {
      console.log('🎯 Marking alert as completed:', { alertId, action })
      
      // Check if this is a mock/demo alert
      if (alertId.includes('mock') || alertId.includes('demo')) {
        console.log('🎯 Demo alert detected, updating locally only')
        
        // Update local state immediately for demo alerts
        setGardenAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: 'completed' }
              : alert
          )
        )
        
        toast.success(`Plant ${action}ed successfully! (Demo mode)`)
        return
      }
      
      const response = await axios.post('/api/alerts/mark-completed', {
        alert_id: alertId,
        action: action
      })
      
      console.log('🎯 Backend response:', response.data)
      
      if (response.data.success) {
        toast.success(response.data.message)
        
        // Update local state immediately for better UX
        setGardenAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: 'completed' }
              : alert
          )
        )
        
        // Refresh garden alerts to get updated data
        if (selectedGarden) {
          setTimeout(() => {
            fetchGardenAlerts(selectedGarden.id)
          }, 1000) // Small delay to ensure backend has processed
        }
      } else {
        throw new Error(response.data.error || 'Failed to mark alert as completed')
      }
    } catch (error) {
      console.error('Error marking alert as completed:', error)
      
      // For demo purposes, still update the local state even if backend fails
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('🎯 Backend error, updating locally for demo purposes')
        setGardenAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: 'completed' }
              : alert
          )
        )
        toast.success(`Plant ${action}ed successfully! (Demo mode)`)
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
        garden_id: '', planting_date: ''
      })
      setPlantImage(null)
      setIsRecognizing(false)
      setShowAddPlant(false)
      fetchPlants()
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
                <div className="w-full max-w-xs">
                  <input
                    type="text"
                    value={plantSearch}
                    onChange={(e) => setPlantSearch(e.target.value)}
                    placeholder="Search plants, gardens, or environment..."
                    className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400"
                  />
                </div>
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
              {plants
                .filter((p) => {
                  const q = plantSearch.trim().toLowerCase()
                  if (!q) return true
                  return (
                    (p.plant.name || '').toLowerCase().includes(q) ||
                    (p.garden?.name || '').toLowerCase().includes(q) ||
                    (p.plant.environment || '').toLowerCase().includes(q) ||
                    (p.plant.type || '').toLowerCase().includes(q)
                  )
                })
                .map((plantData, index) => (
                <li key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-8 items-center gap-2">
                    <div className="col-span-3 flex items-center gap-3">
                      {plantData.plant.latest_image && 
                       !plantData.plant.latest_image.includes('blob') && 
                       !plantData.plant.latest_image.includes('_blob') ? (
                        <img
                          src={`/${plantData.plant.latest_image}`}
                          alt={plantData.plant.name}
                          className="w-9 h-9 rounded-lg object-cover border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(plantData.plant.latest_image)}
                          title="Click to view full size"
                          onError={(e) => {
                            console.log('Image load error:', plantData.plant.latest_image)
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
                        <div className="font-semibold text-gray-900 leading-none">{plantData.plant.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{plantData.plant.type}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-gray-700 truncate">{plantData.garden?.name || '—'}</div>
                    <div className="col-span-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        <Sun className="h-3 w-3" /> {plantData.plant.environment}
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
                          onClick={() => deletePlant(plantData.tracking.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-1 text-[10px] text-gray-400 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(plantData.tracking.planting_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {plants.length === 0 && (
                <li className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Leaf className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-2">No plants yet</p>
                    <p className="text-sm text-gray-400">Add your first plant to get started!</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
            </div>
          </div>

          {/* Right Side - Grid Planner and Alerts */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Garden Alerts Widget */}
              {selectedGarden && (
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-blue-600" />
                      Garden Alerts
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {showAlerts ? 'Hide' : 'Show'} All
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
                  
                  {alertsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : gardenAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {gardenAlerts.slice(0, showAlerts ? gardenAlerts.length : 3).map((alert) => (
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
                               
                               {alert.recommendation && (
                                 <div className="bg-blue-50 border-l-2 border-blue-400 p-2 mb-2 rounded">
                                   <div className="text-xs font-medium text-blue-800 mb-1">💡 Recommendation</div>
                                   <div className="text-xs text-blue-700">{alert.recommendation}</div>
                                 </div>
                               )}
                               
                               {alert.grid_position && (
                                 <div className="text-xs text-gray-500 mb-2">
                                   📍 Position: {alert.grid_position}
                                 </div>
                               )}
                               
                               <div className="flex items-center space-x-2">
                                 <Clock className="w-3 h-3 text-gray-400" />
                                 <span className="text-xs text-gray-500">
                                   Due: {new Date(alert.due_date).toLocaleDateString()}
                                 </span>
                               </div>
                            </div>
                             {alert.status !== 'completed' && (
                               <div className="flex space-x-1">
                                 <button
                                   onClick={() => {
                                     const actionMap = {
                                       'watering': 'water',
                                       'fertilizing': 'fertilize',
                                       'pruning': 'prune'
                                     }
                                     markAlertCompleted(alert.id, actionMap[alert.type])
                                   }}
                                   className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                 >
                                   <CheckCircle className="w-3 h-3 inline mr-1" />
                                   Done
                                 </button>
                                 <button
                                   onClick={() => snoozeAlert(alert.id, 24)}
                                   className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                 >
                                   <Clock className="w-3 h-3 inline mr-1" />
                                   Snooze
                                 </button>
                               </div>
                             )}
                             {alert.status === 'completed' && (
                               <div className="flex items-center text-green-600">
                                 <CheckCircle className="w-4 h-4 mr-1" />
                                 <span className="text-sm font-medium">Completed</span>
                               </div>
                             )}
                          </div>
                        </div>
                      ))}
                      
                      {gardenAlerts.length > 3 && !showAlerts && (
                        <div className="text-center">
                          <button
                                onClick={() => setShowAlerts(true)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                +{gardenAlerts.length - 3} more alerts
                              </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No alerts for this garden</p>
                    </div>
                  )}
                </div>
              )}
              
              <GridPlanner 
                ref={gridPlannerRef}
                selectedGarden={selectedGarden} 
                onGardenUpdate={fetchGardens}
                onPlantUpdate={gridPlannerRef}
              />
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
                      disabled={isRecognizing}
                    />
                    <label
                      htmlFor="plant-image-upload"
                      className={`flex items-center space-x-2 px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isRecognizing 
                          ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                          : 'border-green-300 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        {isRecognizing ? 'Recognizing...' : 'Upload Image'}
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
                    <option value="indoor">Indoor</option>
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
                      <option key={garden.id} value={garden.id}>{garden.name}</option>
                    ))}
                  </select>
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
                  <textarea
                    value={plantForm.care_guide}
                    onChange={(e) => setPlantForm({...plantForm, care_guide: e.target.value})}
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingPlant ? 'Update Plant' : 'Add Plant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddPlant(false)
                      setEditingPlant(null)
                      setPlantForm({
                        name: '', type: '', environment: '', care_guide: '', ideal_soil_type: '',
                        garden_id: '', planting_date: ''
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
      </div>
    </div>
  )
}

export default Garden

