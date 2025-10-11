import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Plus, ShoppingCart, Leaf, MapPin, Trash2, Edit, Droplets, Scissors, Sun, Crown, ArrowRight, Camera, Upload } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const GridPlanner = forwardRef(({ selectedGarden, onGardenUpdate, onPlantUpdate }, ref) => {
  const { isPremium } = useAuth()
  const navigate = useNavigate()
  const [gridSpaces, setGridSpaces] = useState([])
  const [plants, setPlants] = useState([])
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [spacesToPurchase, setSpacesToPurchase] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState(null)
  const [showPlantModal, setShowPlantModal] = useState(false)

  const [plantForm, setPlantForm] = useState({
    plant_id: '',
    planting_date: '',
    notes: ''
  })
  const [draggedPlant, setDraggedPlant] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [updatingPlant, setUpdatingPlant] = useState(null)
  const [selectedPlantSpace, setSelectedPlantSpace] = useState(null)
  const [isIndoorGrid, setIsIndoorGrid] = useState(false)

  useEffect(() => {
    if (selectedGarden) {
      fetchGridSpaces()
    }
  }, [selectedGarden])

  // Fetch plants after grid spaces are loaded
  useEffect(() => {
    if (selectedGarden && gridSpaces.length > 0) {
      fetchPlants()
    }
  }, [selectedGarden, gridSpaces])

  // Expose refresh function to parent component
  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (selectedGarden) {
        fetchGridSpaces()
        fetchPlants()
      }
    }
  }), [selectedGarden])

  const fetchGridSpaces = async () => {
    if (!selectedGarden) return
    
    try {
      const response = await axios.get(`/garden/${selectedGarden.id}/grid-spaces`)
      setGridSpaces(response.data.grid_spaces || [])
    } catch (error) {
      console.error('Error fetching grid spaces:', error)
      // Create mock grid spaces for demo
      createMockGridSpaces()
    }
  }

  const fetchPlants = async () => {
    try {
      const response = await axios.get('/garden')
      const apiPlants = response.data.plants || []
      
      console.log('🌱 GridPlanner - Raw API plants:', apiPlants)
      console.log('🌱 GridPlanner - Selected garden ID:', selectedGarden?.id)
      
      // Show all plants but mark which ones belong to this garden
      console.log('🌱 Showing all plants, marking garden-specific ones')
      const gardenPlants = apiPlants
      
      // Get plant IDs that are already placed in the grid
      const placedPlantIds = gridSpaces
        .filter(space => space.plant_id)
        .map(space => space.plant_id)
      
      console.log('🌱 Plants already in grid:', placedPlantIds)
      
      // Transform all plants - no garden filtering
      const transformedPlants = gardenPlants.map(item => ({
        id: item.plant.id,
        name: item.plant.name,
        type: item.plant.type,
        environment: item.plant.environment,
        care_guide: item.plant.care_guide,
        ideal_soil_type: item.plant.ideal_soil_type,
        garden_id: item.plant.garden_id,
        planting_date: item.tracking.planting_date,
        latest_image: item.plant.latest_image,
        isPlaced: placedPlantIds.includes(item.plant.id),
        belongsToGarden: true // All plants are available for now
      }))
      
      console.log('🌱 GridPlanner - Transformed plants for garden:', transformedPlants)
      setPlants(transformedPlants)
    } catch (error) {
      console.error('Error fetching plants:', error)
      toast.error('Failed to load your plants')
      setPlants([])
    }
  }

  const createMockGridSpaces = () => {
    const spaces = []
    const gridSize = selectedGarden.grid_size || '3x3'
    const [rows, cols] = gridSize.split('x').map(Number)
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        spaces.push({
          id: `${row}-${col}`,
          garden_id: selectedGarden.id,
          grid_position: `${row},${col}`,
          plant_id: null,
          planting_date: null,
          last_watered: null,
          last_fertilized: null,
          last_pruned: null,
          notes: '',
          is_active: true
        })
      }
    }
    
    // Add some sample plants for demo purposes
    if (selectedGarden.id === 'static-2' && gridSize === '6x6') {
      // Add a few sample plants to the Herb Collection
      spaces[0].plant_id = 2 // Basil
      spaces[0].planting_date = '2024-02-01'
      spaces[0].notes = 'Basil - Row 1, Col 1'
      
      spaces[7].plant_id = 5 // Mint
      spaces[7].planting_date = '2024-02-15'
      spaces[7].notes = 'Mint - Row 2, Col 3'
      
      spaces[12].plant_id = 2 // Another Basil
      spaces[12].planting_date = '2024-03-01'
      spaces[12].notes = 'Basil - Row 3, Col 1'
    }
    
    setGridSpaces(spaces)
  }

  const handlePurchaseSpaces = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/garden/purchase-spaces', {
        garden_id: selectedGarden.id,
        spaces_to_purchase: spacesToPurchase
      })
      
      toast.success(`${spacesToPurchase} additional grid spaces purchased for ₱${spacesToPurchase * 20}!`)
      setShowPurchaseModal(false)
      setSpacesToPurchase(1)
      fetchGridSpaces()
      onGardenUpdate()
    } catch (error) {
      console.error('Error purchasing spaces:', error)
      toast.error('Failed to purchase grid spaces')
    } finally {
      setLoading(false)
    }
  }

  const handlePlacePlant = (space) => {
    console.log('🌱 Opening plant modal for space:', space)
    console.log('🌱 Available plants:', plants)
    setSelectedSpace(space)
    setShowPlantModal(true)
  }

  const handlePlantSubmit = async (e) => {
    e.preventDefault()
    
    // Check if selected plant is already placed
    const selectedPlant = plants.find(p => p.id == plantForm.plant_id)
    if (selectedPlant && selectedPlant.isPlaced) {
      toast.error(`${selectedPlant.name} is already placed in the grid`)
      return
    }
    
    setLoading(true)
    
    try {
      const response = await axios.post('/garden/place-plant', {
        space_id: selectedSpace.id,
        plant_id: plantForm.plant_id,
        planting_date: plantForm.planting_date,
        notes: plantForm.notes
      })
      
      toast.success('Plant placed successfully!')
      setShowPlantModal(false)
      setPlantForm({ plant_id: '', planting_date: '', notes: '' })
      fetchGridSpaces()
      fetchPlants()
    } catch (error) {
      console.error('Error placing plant:', error)
      toast.error('Failed to place plant')
    } finally {
      setLoading(false)
    }
  }

  const handleRemovePlant = async (space) => {
    if (window.confirm('Are you sure you want to remove this plant?')) {
      try {
        await axios.post(`/garden/remove-plant/${space.id}`)
        toast.success('Plant removed successfully!')
        fetchGridSpaces()
      } catch (error) {
        console.error('Error removing plant:', error)
        toast.error('Failed to remove plant')
      }
    }
  }

  const handleDragStart = (e, plant) => {
    setDraggedPlant(plant)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, space) => {
    e.preventDefault()
    
    if (!draggedPlant) return
    
    // Check if space is already occupied
    if (space.plant_id) {
      toast.error('This space is already occupied!')
      return
    }

    try {
      // Use the plant's existing planting date, or today's date if not available
      const plantingDate = draggedPlant.planting_date || new Date().toISOString().split('T')[0]
      
      await axios.post('/garden/place-plant', {
        space_id: space.id,
        plant_id: draggedPlant.id,
        planting_date: plantingDate,
        notes: `Placed via drag and drop`
      })
      
      toast.success(`${draggedPlant.name} placed successfully!`)
      setDraggedPlant(null)
      fetchGridSpaces()
    } catch (error) {
      console.error('Error placing plant:', error)
      toast.error('Failed to place plant')
    }
  }

  const handleDragEnd = () => {
    setDraggedPlant(null)
  }

  const handlePlantSelect = (space) => {
    if (space.plant_id) {
      setSelectedPlantSpace(space)
    }
  }

  const handleImageUpload = async (e, space) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('🔄 Starting image upload...', { file: file.name, spaceId: space.id })
    setUploadingImage(space.id)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('space_id', space.id)

      console.log('📤 Sending upload request...')
      // Upload image for this planted space
      const response = await axios.post('/garden/upload-plant-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('📥 Upload response:', response.data)
      
      const { care_suggestions } = response.data
      
      if (care_suggestions && care_suggestions.confidence > 0.5) {
        let suggestions = []
        if (care_suggestions.needs_water) suggestions.push('💧 Water')
        if (care_suggestions.needs_fertilize) suggestions.push('☀️ Fertilize')
        if (care_suggestions.needs_prune) suggestions.push('✂️ Prune')
        
        if (suggestions.length > 0) {
          toast.success(`Image uploaded! AI suggests: ${suggestions.join(', ')}`, { duration: 5000 })
        } else {
          toast.success('Image uploaded! AI analysis: Plant looks healthy! 🌱')
        }
      } else {
        toast.success('Plant image uploaded successfully!')
      }
      
      // Update the selected plant space immediately with the new data
      if (selectedPlantSpace) {
        const updatedSpace = {
          ...selectedPlantSpace,
          image_path: response.data.image_path,
          care_suggestions: response.data.care_suggestions,
          last_updated: new Date().toISOString()
        }
        setSelectedPlantSpace(updatedSpace)
      }
      
      // Refresh grid spaces and plants to update the overall state
      await fetchGridSpaces()
      await fetchPlants()
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      console.error('❌ Error response:', error.response?.data)
      console.error('❌ Error status:', error.response?.status)
      toast.error(`Failed to upload plant image: ${error.response?.data?.error || error.message}`)
    } finally {
      setUploadingImage(null)
    }
  }

  const handlePlantUpdate = async (space, action) => {
    setUpdatingPlant(space.id)
    
    try {
      const today = new Date().toISOString().split('T')[0]
      
      await axios.post('/garden/update-plant-care', {
        space_id: space.id,
        action: action, // 'water', 'fertilize', 'prune'
        date: today
      })
      
      toast.success(`Plant ${action}ed successfully!`)
      fetchGridSpaces()
    } catch (error) {
      console.error(`Error ${action}ing plant:`, error)
      toast.error(`Failed to ${action} plant`)
    } finally {
      setUpdatingPlant(null)
    }
  }

  const getGridDimensions = () => {
    const gridSize = selectedGarden?.grid_size || '3x3'
    const [rows, cols] = gridSize.split('x').map(Number)
    return { rows, cols }
  }

  const getTotalSpaces = () => {
    return selectedGarden?.total_grid_spaces || 9
  }

  const getUsedSpaces = () => {
    return gridSpaces.filter(space => space.plant_id).length
  }

  const getAvailableSpaces = () => {
    return getTotalSpaces() - getUsedSpaces()
  }

  if (!selectedGarden) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Select a garden to view grid planner</p>
        </div>
      </div>
    )
  }

  const { rows, cols } = getGridDimensions()

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Grid Planner</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsIndoorGrid(!isIndoorGrid)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                isIndoorGrid 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>{isIndoorGrid ? '🏠 Indoor' : '🌱 Outdoor'}</span>
            </button>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buy Spaces</span>
          </button>
        </div>
        </div>
        
        {/* Premium upgrade notice for Basic Plan users */}
        {!isPremium && (
          <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Basic Plan - Limited Grid</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              You're using a 3x3 grid planner. Upgrade to Premium for a 6x6 grid and more features!
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="mt-2 flex items-center space-x-1 text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              <span>Upgrade Now</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        )}
        
        {/* Grid Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{getTotalSpaces()}</div>
            <div className="text-gray-500">Total Spaces</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{getUsedSpaces()}</div>
            <div className="text-gray-500">Used</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-600">{getAvailableSpaces()}</div>
            <div className="text-gray-500">Available</div>
          </div>
        </div>
      </div>

      {/* My Plants Section */}
      {plants.length > 0 ? (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            All Plants - Drag to Grid
          </h4>
          <div className="flex flex-wrap gap-2">
            {plants.map((plant) => {
              const isDisabled = plant.isPlaced
              
              return (
                <div
                  key={plant.id}
                  draggable={!isDisabled}
                  onDragStart={!isDisabled ? (e) => handleDragStart(e, plant) : undefined}
                  onDragEnd={handleDragEnd}
                  onClick={isDisabled ? (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast.error(`${plant.name} is already placed in the grid`)
                  } : undefined}
                  className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors ${
                    isDisabled
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50 pointer-events-none' 
                      : 'bg-green-50 border-green-200 cursor-move hover:bg-green-100'
                  }`}
                  title={
                    plant.isPlaced 
                      ? `${plant.name} is already placed in grid` 
                      : `Drag ${plant.name} to place in grid`
                  }
                >
                <Leaf className={`h-4 w-4 ${isDisabled ? 'text-gray-300' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-green-800'}`}>
                  {plant.name}
                </span>
                <span className={`text-xs ${isDisabled ? 'text-gray-300' : 'text-green-600'}`}>
                  ({plant.type})
                </span>
                {plant.isPlaced && (
                  <span className="text-xs text-gray-400 ml-1 font-bold">✓ PLACED</span>
                )}
              </div>
            );
          })}
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Plants in {selectedGarden?.name || 'Selected Garden'}
          </h4>
          <div className="text-center py-4">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">No plants in this garden yet</p>
            <p className="text-xs text-gray-400">Add plants to this garden first, then you can place them in the grid</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="p-4">
        <div 
          className="grid gap-1 mx-auto overflow-auto max-h-96"
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            maxWidth: cols > 3 ? '500px' : '300px'
          }}
        >
          {gridSpaces.map((space) => {
            const isOccupied = space.plant_id
            const plant = plants.find(p => p.id === space.plant_id)
            
            return (
              <div
                key={space.id}
                className={`
                  aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all
                  ${cols > 3 ? 'h-12 w-12' : 'h-16 w-16'}
                  ${isOccupied 
                    ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                  }
                  ${draggedPlant && !isOccupied ? 'border-blue-300 bg-blue-50' : ''}
                  ${selectedPlantSpace && selectedPlantSpace.id === space.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                `}
                onClick={() => isOccupied ? handlePlantSelect(space) : handlePlacePlant(space)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, space)}
                title={isOccupied ? `${plant?.name || 'Plant'} - Click to select` : 'Click to place plant or drag a plant here'}
              >
                {isOccupied ? (
                  <div className="text-center">
                    <Leaf className={`${cols > 3 ? 'h-4 w-4' : 'h-6 w-6'} text-green-600 mx-auto mb-1`} />
                    <div className={`${cols > 3 ? 'text-[10px]' : 'text-xs'} font-medium text-green-800 truncate px-1`}>
                      {plant?.name || 'Plant'}
                    </div>
                    <div className={`${cols > 3 ? 'text-[8px]' : 'text-xs'} text-green-600`}>
                      {space.grid_position}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Plus className={`${cols > 3 ? 'h-3 w-3' : 'h-4 w-4'} mx-auto mb-1`} />
                    <div className={`${cols > 3 ? 'text-[8px]' : 'text-xs'}`}>{space.grid_position}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Selected Plant Details */}
        {selectedPlantSpace ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Selected Plant Details</h4>
              <button
                onClick={() => setSelectedPlantSpace(null)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕ Close
              </button>
            </div>
            {(() => {
              const space = selectedPlantSpace
                const plant = plants.find(p => p.id === space.plant_id)
                return (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">{plant?.name || 'Plant'}</span>
                      <span className="text-xs text-gray-500">({space.grid_position})</span>
                    </div>
                    <button
                      onClick={() => handleRemovePlant(space)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                    
                    {/* Image Preview and Upload */}
                    <div className="mb-3">
                      {(space.image_path || plant?.latest_image) ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={`/${space.image_path || plant?.latest_image}`}
                            alt="Plant preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                          />
                          <div className="flex-1">
                            <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, space)}
                                className="hidden"
                                id={`upload-${space.id}`}
                                disabled={uploadingImage === space.id}
                              />
                              <Camera className="h-3 w-3" />
                              <span>
                                {uploadingImage === space.id ? 'Uploading...' : 'Update Image'}
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, space)}
                            className="hidden"
                            id={`upload-${space.id}`}
                            disabled={uploadingImage === space.id}
                          />
                          <Camera className="h-3 w-3" />
                          <span>
                            {uploadingImage === space.id ? 'Uploading...' : 'Upload Plant Image'}
                          </span>
                        </label>
                      )}
                    </div>
                    
                    {/* Last Updated Picture Box */}
                    {(space.image_path || plant?.latest_image) && (
                      <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="text-xs font-medium text-gray-800 mb-2">📸 Plant Image</div>
                        <div className="flex items-center space-x-3">
                          <img
                            src={`/${space.image_path || plant?.latest_image}`}
                            alt="Plant image"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                          />
                          <div className="flex-1">
                            <div className="text-xs text-gray-600">
                              {space.last_updated ? 
                                `Updated: ${new Date(space.last_updated).toLocaleDateString()}` : 
                                space.image_path ? 'Grid space image' : 'Original plant image'
                              }
                            </div>
                            <div className="text-xs text-gray-500">
                              {space.last_updated ? 
                                `Time: ${new Date(space.last_updated).toLocaleTimeString()}` : 
                                ''
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Care Suggestions */}
                    {space.care_suggestions && (space.care_suggestions.confidence > 0.3 || space.care_suggestions.reasoning) && (
                      <div className={`mb-3 p-2 border rounded-lg ${
                        space.care_suggestions.needs_water && 
                        space.care_suggestions.reasoning && 
                        (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                         space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                         space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                         space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                         space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                          ? 'bg-red-50 border-red-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className={`text-xs font-medium ${
                            space.care_suggestions.needs_water && 
                            space.care_suggestions.reasoning && 
                            (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                              ? 'text-red-800' 
                              : 'text-blue-800'
                          }`}>
                            {space.care_suggestions.needs_water && 
                             space.care_suggestions.reasoning && 
                             (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                              space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                              space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                              space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                              space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                              ? '🚨 Urgent Care Needed' 
                              : '🤖 AI Analysis'
                            }
                          </div>
                          <div className={`text-xs ${
                            space.care_suggestions.needs_water && 
                            space.care_suggestions.reasoning && 
                            (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                             space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                              ? 'text-red-600' 
                              : 'text-blue-600'
                          }`}>
                            Confidence: {Math.round(space.care_suggestions.confidence * 100)}%
                          </div>
                        </div>
                        <div className={`text-xs mb-2 ${
                          space.care_suggestions.needs_water && 
                          space.care_suggestions.reasoning && 
                          (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                           space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                           space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                           space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                           space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                            ? 'text-red-700' 
                            : 'text-blue-700'
                        }`}>
                          {space.care_suggestions.reasoning}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {space.care_suggestions.needs_water && (
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                              space.care_suggestions.reasoning && 
                              (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                               space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                               space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                               space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                               space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              💧 {space.care_suggestions.reasoning && 
                                   (space.care_suggestions.reasoning.toLowerCase().includes('urgent') ||
                                    space.care_suggestions.reasoning.toLowerCase().includes('health issues detected') ||
                                    space.care_suggestions.reasoning.toLowerCase().includes('mold detected') ||
                                    space.care_suggestions.reasoning.toLowerCase().includes('rot detected') ||
                                    space.care_suggestions.reasoning.toLowerCase().includes('disease detected'))
                                    ? 'Urgent Care Needed' 
                                    : 'Needs Water'
                              }
                            </span>
                          )}
                          {space.care_suggestions.needs_fertilize && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                              ☀️ Needs Fertilizer
                            </span>
                          )}
                          {space.care_suggestions.needs_prune && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                              ✂️ Needs Pruning
                            </span>
                          )}
                          {!space.care_suggestions.needs_water && !space.care_suggestions.needs_fertilize && !space.care_suggestions.needs_prune && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                              🌱 Plant looks healthy!
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Analysis Status */}
                    {space.care_suggestions && (space.care_suggestions.confidence > 0.3 || space.care_suggestions.reasoning) && (
                      <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-xs font-medium text-green-800 mb-1">📊 Analysis Status</div>
                        <div className="text-xs text-green-700">
                          {space.last_updated ? 
                            `Last analyzed: ${new Date(space.last_updated).toLocaleDateString()} at ${new Date(space.last_updated).toLocaleTimeString()}` : 
                            'Analysis pending'
                          }
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          {space.care_suggestions.needs_water || space.care_suggestions.needs_fertilize || space.care_suggestions.needs_prune ? 
                            '⚠️ Plant needs attention' : 
                            '✅ Plant is healthy'
                          }
                        </div>
                      </div>
                    )}
                    
                    {/* Smart Update Actions Based on AI Analysis */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">AI Suggested Actions:</span>
                      <div className="flex flex-wrap gap-1">
                        {/* Show Water button only if AI suggests it needs water */}
                        {space.care_suggestions && space.care_suggestions.needs_water && (
                          <button
                            onClick={() => handlePlantUpdate(space, 'water')}
                            disabled={updatingPlant === space.id}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 border border-blue-200"
                          >
                            <Droplets className="h-3 w-3" />
                            <span>Water</span>
                          </button>
                        )}
                        
                        {/* Show Fertilize button only if AI suggests it needs fertilizer */}
                        {space.care_suggestions && space.care_suggestions.needs_fertilize && (
                          <button
                            onClick={() => handlePlantUpdate(space, 'fertilize')}
                            disabled={updatingPlant === space.id}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 disabled:opacity-50 border border-yellow-200"
                          >
                            <Sun className="h-3 w-3" />
                            <span>Fertilize</span>
                          </button>
                        )}
                        
                        {/* Show Prune button only if AI suggests it needs pruning */}
                        {space.care_suggestions && space.care_suggestions.needs_prune && (
                          <button
                            onClick={() => handlePlantUpdate(space, 'prune')}
                            disabled={updatingPlant === space.id}
                            className="flex items-center space-x-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 border border-red-200"
                          >
                            <Scissors className="h-3 w-3" />
                            <span>Prune</span>
                          </button>
                        )}
                        
                        {/* Show "Plant looks healthy" message if no care needed */}
                        {space.care_suggestions && 
                         !space.care_suggestions.needs_water && 
                         !space.care_suggestions.needs_fertilize && 
                         !space.care_suggestions.needs_prune && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-700 rounded border border-green-200">
                            <span className="mr-1">🌱</span>
                            <span>No care needed</span>
                          </span>
                        )}
                        
                        {/* Show message if no AI analysis available */}
                        {(!space.care_suggestions || space.care_suggestions.confidence <= 0.5) && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200">
                            <span className="mr-1">📷</span>
                            <span>Upload image for AI suggestions</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
          </div>
        ) : (
          gridSpaces.filter(space => space.plant_id).length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <p className="text-sm text-gray-600">👆 Click on a planted space in the grid to view details</p>
            </div>
          )
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Purchase Additional Grid Spaces</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Spaces
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={spacesToPurchase}
                  onChange={(e) => setSpacesToPurchase(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Cost:</strong> ₱{spacesToPurchase * 20} ({spacesToPurchase} spaces × ₱20 each)
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handlePurchaseSpaces}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Purchase'}
                </button>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plant Placement Modal */}
      {showPlantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Place Plant at {selectedSpace?.grid_position}
            </h3>
            {plants.length === 0 ? (
              <div className="text-center py-8">
                <Leaf className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-4">You don't have any plants yet.</p>
                <p className="text-sm text-gray-400 mb-4">Add plants first, then you can place them in the grid.</p>
                <button
                  onClick={() => setShowPlantModal(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            ) : (
            <form onSubmit={handlePlantSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Plant
                </label>
                <select
                  value={plantForm.plant_id}
                    onChange={(e) => {
                      const selectedPlantId = e.target.value
                      const selectedPlant = plants.find(p => p.id == selectedPlantId)
                      
                      setPlantForm({
                        ...plantForm, 
                        plant_id: selectedPlantId,
                        planting_date: selectedPlant?.planting_date || ''
                      })
                    }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Choose a plant</option>
                    {plants.map((plant) => {
                      console.log('🌱 Rendering plant option:', plant)
                      const isDisabled = plant.isPlaced
                      
                      return (
                        <option 
                          key={plant.id} 
                          value={plant.id}
                          disabled={isDisabled}
                          style={isDisabled ? { color: '#9CA3AF', fontStyle: 'italic' } : {}}
                        >
                          {plant.isPlaced 
                            ? `${plant.name} (${plant.type}) - Already Placed` 
                            : `${plant.name} (${plant.type})`
                          }
                    </option>
                      )
                    })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planting Date
                </label>
                <input
                  type="date"
                  value={plantForm.planting_date}
                  onChange={(e) => setPlantForm({...plantForm, planting_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={plantForm.notes}
                  onChange={(e) => setPlantForm({...plantForm, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="3"
                  placeholder="Add any notes about this plant..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Placing...' : 'Place Plant'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPlantModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
})

export default GridPlanner
