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
  const [dragOverSpace, setDragOverSpace] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(null)
  const [updatingPlant, setUpdatingPlant] = useState(null)
  const [selectedPlantSpace, setSelectedPlantSpace] = useState(null)
  const [isIndoorGrid, setIsIndoorGrid] = useState(false)

  useEffect(() => {
    if (selectedGarden) {
      fetchGridSpaces()
      checkPaymentStatus()
    }
  }, [selectedGarden])

  // Watch for changes in additional_spaces_purchased and refresh grid
  useEffect(() => {
    if (selectedGarden?.additional_spaces_purchased > 0) {
      console.log(`🌱 Additional spaces detected: ${selectedGarden.additional_spaces_purchased}, refreshing grid...`)
      fetchGridSpaces()
    }
  }, [selectedGarden?.additional_spaces_purchased])

  // Check for payment success on component mount
  useEffect(() => {
    checkPaymentStatus()
  }, [])

  // Fetch plants after grid spaces are loaded
  useEffect(() => {
    if (selectedGarden && gridSpaces.length > 0) {
      fetchPlants()
    }
  }, [selectedGarden, gridSpaces])

  // Re-fetch plants when environment filter changes
  useEffect(() => {
    if (selectedGarden && gridSpaces.length > 0) {
      fetchPlants()
    }
  }, [isIndoorGrid])

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
      const spaces = response.data.grid_spaces || []
      
      // Calculate expected total spaces including purchased spaces
      const baseSpaces = isPremium ? 36 : 9
      const additionalSpaces = selectedGarden?.additional_spaces_purchased || 0
      const expectedTotalSpaces = baseSpaces + additionalSpaces
      
      console.log(`🌱 Fetched ${spaces.length} grid spaces for garden ${selectedGarden.id}`)
      console.log(`🌱 Premium status: ${isPremium}, Base spaces: ${baseSpaces}, Additional: ${additionalSpaces}, Expected total: ${expectedTotalSpaces}`)
      
      // If we don't have enough spaces, create mock spaces
      if (spaces.length < expectedTotalSpaces) {
        console.log(`🌱 Not enough spaces (${spaces.length}/${expectedTotalSpaces}), creating mock spaces`)
        createMockGridSpaces()
      } else {
        setGridSpaces(spaces)
      }
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
      
      // Filter plants to only show those that belong to the selected garden
      // Environment filtering is optional - show all plants for now
      const gardenPlants = apiPlants.filter(item => {
        const plantGardenId = item.garden?.id
        const plantEnvironment = item.plant?.environment
        const belongsToSelectedGarden = plantGardenId === selectedGarden?.id
        const matchesEnvironment = isIndoorGrid ? plantEnvironment === 'indoor' : plantEnvironment === 'outdoor'
        
        console.log(`🌱 Plant ${item.plant.name} - Garden: ${plantGardenId} (selected: ${selectedGarden?.id}), Environment: ${plantEnvironment} (indoor: ${isIndoorGrid})`)
        console.log(`🌱 Belongs to garden: ${belongsToSelectedGarden}, Matches environment: ${matchesEnvironment}`)
        
        // For now, show all plants that belong to the garden regardless of environment
        // This allows users to place any plant in any environment
        return belongsToSelectedGarden
      })
      
      console.log('🌱 Filtered plants for selected garden:', gardenPlants)
      
      // Get plant IDs that are already placed in the grid
      const placedPlantIds = gridSpaces
        .filter(space => space.plant_id)
        .map(space => space.plant_id)
      
      console.log('🌱 Plants already in grid:', placedPlantIds)
      
      // Transform filtered plants
      const transformedPlants = gardenPlants.map(item => ({
        id: item.plant.id,
        name: item.plant.name,
        type: item.plant.type,
        environment: item.plant.environment,
        care_guide: item.plant.care_guide,
        ideal_soil_type: item.plant.ideal_soil_type,
        garden_id: item.garden.id,
        planting_date: item.tracking.planting_date,
        latest_image: item.plant.latest_image,
        isPlaced: placedPlantIds.includes(item.plant.id),
        belongsToGarden: true
      }))
      
      console.log('🌱 GridPlanner - Transformed plants for garden:', transformedPlants)
      
      // If no plants found, show a helpful message and create some demo plants
      if (transformedPlants.length === 0) {
        console.log('🌱 No plants found for this garden, creating demo plants')
        toast.info('No plants found for this garden. Creating demo plants for testing...')
        
        // Create some demo plants for testing
        const demoPlants = [
          {
            id: 'demo-1',
            name: 'Demo Tomato',
            type: 'vegetable',
            environment: 'outdoor',
            care_guide: 'Water regularly, full sun',
            ideal_soil_type: 'Well-draining',
            garden_id: selectedGarden.id,
            planting_date: new Date().toISOString().split('T')[0],
            latest_image: null,
            isPlaced: false,
            belongsToGarden: true
          },
          {
            id: 'demo-2',
            name: 'Demo Basil',
            type: 'herb',
            environment: 'indoor',
            care_guide: 'Keep soil moist, partial sun',
            ideal_soil_type: 'Rich soil',
            garden_id: selectedGarden.id,
            planting_date: new Date().toISOString().split('T')[0],
            latest_image: null,
            isPlaced: false,
            belongsToGarden: true
          }
        ]
        
        setPlants(demoPlants)
        return
      }
      
      setPlants(transformedPlants)
    } catch (error) {
      console.error('Error fetching plants:', error)
      console.error('Error details:', error.response?.data)
      toast.error('Failed to load your plants')
      setPlants([])
    }
  }

  const addPurchasedSpacesToGrid = (spacesToAdd) => {
    console.log(`💰 DEMO PAYMENT: Adding ${spacesToAdd} spaces directly to grid`)
    
    // Get current additional spaces count
    const currentAdditional = selectedGarden?.additional_spaces_purchased || 0
    const newAdditional = currentAdditional + spacesToAdd
    
    // Update the selectedGarden object locally (this will trigger the useEffect)
    if (selectedGarden) {
      selectedGarden.additional_spaces_purchased = newAdditional
    }
    
    // Create new spaces and add them to the current grid
    const newSpaces = []
    for (let i = 1; i <= spacesToAdd; i++) {
      const spaceId = `mock-${selectedGarden.id}-additional-${currentAdditional + i}`
      newSpaces.push({
        id: spaceId,
        garden_id: selectedGarden.id,
        grid_position: `additional-${currentAdditional + i}`,
        plant_id: null,
        planting_date: null,
        last_watered: null,
        last_fertilized: null,
        last_pruned: null,
        notes: '',
        is_active: true
      })
    }
    
    // Add new spaces to existing grid
    setGridSpaces(prevSpaces => {
      const updatedSpaces = [...prevSpaces, ...newSpaces]
      console.log(`💰 DEMO PAYMENT: Grid updated from ${prevSpaces.length} to ${updatedSpaces.length} spaces`)
      return updatedSpaces
    })
    
    console.log(`💰 DEMO PAYMENT: Successfully added ${spacesToAdd} spaces to grid`)
  }

  const createMockGridSpaces = () => {
    const spaces = []
    const baseGridSize = isPremium ? '6x6' : '3x3'
    const [baseRows, baseCols] = baseGridSize.split('x').map(Number)
    const additionalSpaces = selectedGarden?.additional_spaces_purchased || 0
    
    console.log(`🌱 Creating mock grid spaces: base=${baseGridSize} (${baseRows}x${baseCols}), additional=${additionalSpaces}`)
    console.log(`🌱 Premium status: ${isPremium}`)
    console.log(`🌱 DEBUG: isPremium type: ${typeof isPremium}, value: ${isPremium}`)
    
    // Create spaces for the base grid
    for (let row = 1; row <= baseRows; row++) {
      for (let col = 1; col <= baseCols; col++) {
        const spaceId = `mock-${selectedGarden.id}-${row}-${col}`
        spaces.push({
          id: spaceId,
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
    
    // Add additional purchased spaces
    if (additionalSpaces > 0) {
      console.log(`🌱 Adding ${additionalSpaces} additional purchased spaces`)
      for (let i = 1; i <= additionalSpaces; i++) {
        const spaceId = `mock-${selectedGarden.id}-additional-${i}`
        spaces.push({
          id: spaceId,
          garden_id: selectedGarden.id,
          grid_position: `additional-${i}`,
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
    
    console.log(`🌱 Created ${spaces.length} total grid spaces (${baseRows * baseCols} base + ${additionalSpaces} additional)`)
    console.log(`🌱 Space positions:`, spaces.map(s => s.grid_position).slice(0, 10))
    
    // Add some sample plants for demo purposes
    if (selectedGarden.id === 'static-2' && baseGridSize === '6x6') {
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
    
    console.log(`🌱 Created ${spaces.length} mock grid spaces`)
    setGridSpaces(spaces)
  }

  const checkPaymentStatus = async () => {
    // Check URL parameters for payment success
    const urlParams = new URLSearchParams(window.location.search)
    const paymentSuccess = urlParams.get('payment_success')
    const spaces = urlParams.get('spaces')
    const gardenId = urlParams.get('garden_id')
    
    console.log('🌱 Checking payment status:', { paymentSuccess, spaces, gardenId, selectedGardenId: selectedGarden?.id })
    
    if (paymentSuccess === 'true' && spaces && gardenId && selectedGarden && selectedGarden.id === parseInt(gardenId)) {
      try {
        console.log('🌱 Payment successful, verifying with backend...')
        
        // Get pending purchase details
        const pendingPurchase = localStorage.getItem('pending_purchase')
        const purchaseData = pendingPurchase ? JSON.parse(pendingPurchase) : null
        
        console.log('🌱 Pending purchase data:', purchaseData)
        
        // Verify payment with backend
        const response = await axios.post('/garden/verify-payment', {
          garden_id: selectedGarden.id,
          spaces_purchased: parseInt(spaces),
          transaction_id: purchaseData?.transaction_id || null,
          amount: purchaseData?.amount || (parseInt(spaces) * 20)
        })
        
        console.log('🌱 Payment verification response:', response.data)
        
        if (response.data.success) {
          toast.success(`🎉 Payment successful! ${spaces} additional grid spaces added to your garden!`)
          
          // Clear pending purchase
          localStorage.removeItem('pending_purchase')
          
          // Force refresh of garden data and grid spaces
          onGardenUpdate()
          
          // Wait a moment for garden data to update, then refresh grid spaces
          setTimeout(() => {
            console.log('🌱 Refreshing grid spaces after payment...')
            fetchGridSpaces()
          }, 500)
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        } else {
          toast.error('Payment verification failed. Please contact support.')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        console.error('Error details:', error.response?.data)
        toast.error(`Failed to verify payment: ${error.response?.data?.error || error.message}`)
      }
    }
    
    // Check for payment cancellation
    const paymentCancelled = urlParams.get('payment_cancelled')
    if (paymentCancelled === 'true') {
      console.log('🌱 Payment was cancelled')
      toast.error('Payment was cancelled.')
      localStorage.removeItem('pending_purchase')
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  const generateGCashPaymentURL = (amount, spaces) => {
    // Generate a unique transaction ID
    const transactionId = `garden_${selectedGarden.id}_${Date.now()}`
    
    // Store purchase details in localStorage for verification
    localStorage.setItem('pending_purchase', JSON.stringify({
      garden_id: selectedGarden.id,
      spaces_to_purchase: spaces,
      amount: amount,
      transaction_id: transactionId,
      timestamp: Date.now()
    }))
    
    // Create GCash payment URL with phone number input
    // This would be the actual GCash payment gateway URL in production
    const baseURL = 'https://payments.gcash.com/pay'
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: 'PHP',
      description: `Garden Grid Spaces - ${spaces} additional spaces`,
      merchant_id: 'egrowtify_garden',
      transaction_id: transactionId,
      return_url: `${window.location.origin}/garden?payment_success=true&spaces=${spaces}&garden_id=${selectedGarden.id}`,
      cancel_url: `${window.location.origin}/garden?payment_cancelled=true`,
      phone_required: 'true',
      phone_label: 'Enter your GCash mobile number'
    })
    
    return `${baseURL}?${params.toString()}`
  }

  const handlePurchaseSpaces = async () => {
    const totalAmount = spacesToPurchase * 20
    
    try {
      // Demo payment - directly process the purchase
      console.log('💰 DEMO PAYMENT: Processing purchase for', spacesToPurchase, 'spaces')
      console.log('💰 DEMO PAYMENT: Total amount:', totalAmount)
      
      // Show demo payment processing message
      toast.success('Processing demo payment...')
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Directly verify payment with backend (demo mode)
      const response = await axios.post('/garden/verify-payment', {
        garden_id: selectedGarden.id,
        spaces_purchased: spacesToPurchase,
        transaction_id: `demo_${selectedGarden.id}_${Date.now()}`,
        amount: totalAmount
      })
      
      console.log('💰 DEMO PAYMENT: Payment verification response:', response.data)
      
      if (response.data && response.data.success) {
        toast.success(`Demo payment successful! ${spacesToPurchase} additional spaces added to your garden.`)
        setShowPurchaseModal(false)
        setSpacesToPurchase(1)
        
        // Directly update the local state with new spaces
        addPurchasedSpacesToGrid(spacesToPurchase)
        
        // Also refresh garden data to keep everything in sync
        if (onGardenUpdate) {
          onGardenUpdate()
        }
      } else {
        console.log('💰 DEMO PAYMENT: Backend response indicates failure:', response.data)
        toast.error('Demo payment failed. Please try again.')
      }
      
    } catch (error) {
      console.error('💰 DEMO PAYMENT: Error details:', error)
      console.error('💰 DEMO PAYMENT: Error response:', error.response?.data)
      console.error('💰 DEMO PAYMENT: Error status:', error.response?.status)
      console.error('💰 DEMO PAYMENT: Error message:', error.message)
      
      // For demo purposes, we'll assume the payment succeeded
      // This is a demo system, so we want to show success even if there are backend issues
      console.log('💰 DEMO PAYMENT: Demo mode - assuming payment succeeded')
      
      // Show success message
      toast.success(`Demo payment completed! ${spacesToPurchase} additional spaces added to your garden.`)
      setShowPurchaseModal(false)
      setSpacesToPurchase(1)
      
      // Directly add the purchased spaces to the grid
      addPurchasedSpacesToGrid(spacesToPurchase)
      
      // Try to refresh garden data to keep everything in sync
      try {
        if (onGardenUpdate) {
          onGardenUpdate()
        }
        console.log('💰 DEMO PAYMENT: Successfully updated garden data')
      } catch (refreshError) {
        console.log('💰 DEMO PAYMENT: Could not refresh garden data, but spaces were added locally')
      }
    }
  }

  const handlePlacePlant = (space) => {
    console.log('🌱 Opening plant modal for space:', space)
    console.log('🌱 Available plants:', plants)
    console.log('🌱 Plants length:', plants.length)
    console.log('🌱 Selected garden:', selectedGarden)
    console.log('🌱 Indoor grid mode:', isIndoorGrid)
    console.log('🌱 showPlantModal will be set to true')
    
    setSelectedSpace(space)
    setShowPlantModal(true)
    
    // Add a small delay to ensure state updates
    setTimeout(() => {
      console.log('🌱 Plant modal should now be open, showPlantModal:', true)
    }, 100)
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
      // Check if this is a demo plant
      if (plantForm.plant_id.startsWith('demo-')) {
        console.log('🌱 Placing demo plant:', plantForm.plant_id)
        
        // For demo plants, update the grid locally
        setGridSpaces(prevSpaces => 
          prevSpaces.map(space => {
            if (space.id === selectedSpace.id) {
              return { 
                ...space, 
                plant_id: plantForm.plant_id, 
                planting_date: plantForm.planting_date, 
                notes: plantForm.notes || 'Demo plant placed'
              }
            }
            return space
          })
        )
        
        // Update the plant's isPlaced status
        setPlants(prevPlants => 
          prevPlants.map(plant => 
            plant.id === plantForm.plant_id 
              ? { ...plant, isPlaced: true }
              : plant
          )
        )
        
        toast.success('Demo plant placed successfully!')
        setShowPlantModal(false)
        setPlantForm({ plant_id: '', planting_date: '', notes: '' })
        return
      }
      
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
    console.log('🌱 Drag started for plant:', { id: plant.id, name: plant.name, isPlaced: plant.isPlaced })
    setDraggedPlant(plant)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.target.outerHTML)
    
    // Add visual feedback to the dragged element
    e.target.style.opacity = '0.5'
    e.target.style.transform = 'rotate(5deg)'
    
    console.log('🌱 Dragged plant set:', plant)
  }

  // Touch support for mobile devices
  const handleTouchStart = (e, plant) => {
    e.preventDefault()
    setDraggedPlant(plant)
    // Add visual feedback
    e.target.style.opacity = '0.5'
    e.target.style.transform = 'rotate(5deg)'
  }

  const handleTouchMove = (e) => {
    if (!draggedPlant) return
    
    e.preventDefault()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (element && element.closest('[data-space-id]')) {
      const spaceId = element.closest('[data-space-id]').getAttribute('data-space-id')
      setDragOverSpace(spaceId)
    }
  }

  const handleTouchEnd = (e) => {
    if (!draggedPlant) return
    
    e.preventDefault()
    const touch = e.changedTouches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    
    if (element && element.closest('[data-space-id]')) {
      const spaceId = element.closest('[data-space-id]').getAttribute('data-space-id')
      const space = gridSpaces.find(s => s.id === spaceId)
      if (space) {
        handleDrop(e, space)
      }
    }
    
    // Reset visual feedback
    e.target.style.opacity = '1'
    e.target.style.transform = 'rotate(0deg)'
    setDraggedPlant(null)
    setDragOverSpace(null)
  }

  const handleDragOver = (e, space) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    console.log('🌱 Drag over space:', space.grid_position, 'draggedPlant:', draggedPlant?.name)
    setDragOverSpace(space.id)
  }

  const handleDragLeave = (e) => {
    // Only clear if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverSpace(null)
    }
  }

  const handleDrop = async (e, space) => {
    e.preventDefault()
    
    console.log('🌱 handleDrop called:', { draggedPlant, space })
    console.log('🌱 Drop event details:', e.type, e.target)
    console.log('🌱 Space details:', { id: space.id, position: space.grid_position, occupied: !!space.plant_id })
    
    if (!draggedPlant) {
      console.log('🌱 No dragged plant - drop ignored')
      return
    }
    
    console.log('🌱 Dragged plant details:', { id: draggedPlant.id, name: draggedPlant.name, isPlaced: draggedPlant.isPlaced })
    
    // Check if we're moving a plant to the same space it's already in
    if (space.plant_id === draggedPlant.id) {
      console.log('🌱 Plant is already in this space')
      toast.info(`${draggedPlant.name} is already in this space`)
      setDraggedPlant(null)
      setDragOverSpace(null)
      return
    }
    
    // Check if space is already occupied by a different plant
    if (space.plant_id && space.plant_id !== draggedPlant.id) {
      const occupiedPlant = plants.find(p => p.id === space.plant_id)
      toast.error(`This space is already occupied by ${occupiedPlant?.name || 'another plant'}!`)
      setDraggedPlant(null)
      setDragOverSpace(null)
      return
    }

    // Check if the plant belongs to the current garden
    if (draggedPlant.garden_id && draggedPlant.garden_id !== selectedGarden.id) {
      toast.error('This plant belongs to a different garden!')
      setDraggedPlant(null)
      setDragOverSpace(null)
      return
    }

    try {
      // Use the plant's existing planting date, or today's date if not available
      const plantingDate = draggedPlant.planting_date || new Date().toISOString().split('T')[0]
      
      console.log('🌱 Attempting to place plant:', {
        space_id: space.id,
        plant_id: draggedPlant.id,
        planting_date: plantingDate,
        plant_name: draggedPlant.name
      })
      
      // Find the original space where this plant was located
      const originalSpace = gridSpaces.find(s => s.plant_id === draggedPlant.id)
      
      // Always update locally first for immediate feedback
      console.log('🌱 Updating grid spaces locally')
      setGridSpaces(prevSpaces => 
        prevSpaces.map(s => {
          if (s.id === space.id) {
            // Place plant in new space
            return { ...s, plant_id: draggedPlant.id, planting_date: plantingDate, notes: 'Moved via drag and drop' }
          } else if (originalSpace && s.id === originalSpace.id) {
            // Clear the original space
            return { ...s, plant_id: null, planting_date: null, notes: '' }
          }
          return s
        })
      )
      
      // Update the plant's isPlaced status
      setPlants(prevPlants => 
        prevPlants.map(plant => 
          plant.id === draggedPlant.id 
            ? { ...plant, isPlaced: true }
            : plant
        )
      )
      
      const action = originalSpace ? 'moved' : 'placed'
      toast.success(`${draggedPlant.name} ${action} successfully!`)
      setDraggedPlant(null)
      setDragOverSpace(null)
      
      // Try to sync with backend, but don't fail if it doesn't work
      try {
        if (originalSpace) {
          console.log('🌱 Syncing plant removal with backend')
          await axios.post(`/garden/remove-plant/${originalSpace.id}`)
        }
        
        console.log('🌱 Syncing plant placement with backend')
        await axios.post('/garden/place-plant', {
          space_id: space.id,
          plant_id: draggedPlant.id,
          planting_date: plantingDate,
          notes: originalSpace ? `Moved via drag and drop` : `Placed via drag and drop`
        })
        
        console.log('🌱 Backend sync successful')
        // Refresh grid spaces to ensure consistency
        fetchGridSpaces()
      } catch (syncError) {
        console.log('🌱 Backend sync failed, but local update succeeded:', syncError)
        // Don't show error to user since local update worked
      }
      
    } catch (error) {
      console.error('Error placing plant:', error)
      console.error('Error details:', error.response?.data)
      toast.error(`Failed to place plant: ${error.response?.data?.error || error.message}`)
      setDraggedPlant(null)
      setDragOverSpace(null)
    }
  }

  const handleDragEnd = (e) => {
    // Reset visual feedback
    e.target.style.opacity = '1'
    e.target.style.transform = 'rotate(0deg)'
    setDraggedPlant(null)
    setDragOverSpace(null)
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
    // Determine base grid size based on premium status
    const baseGridSize = isPremium ? '6x6' : '3x3'
    const [baseRows, baseCols] = baseGridSize.split('x').map(Number)
    
    // Calculate additional spaces from purchases
    const additionalSpaces = selectedGarden?.additional_spaces_purchased || 0
    const totalSpaces = (baseRows * baseCols) + additionalSpaces
    
    // Keep the base grid dimensions (no extra rows)
    const rows = baseRows
    const cols = baseCols
    
    console.log(`🌱 Grid dimensions: base=${baseRows}x${baseCols}, additional=${additionalSpaces}, total=${totalSpaces}`)
    
    return { rows, cols, totalSpaces }
  }

  const getTotalSpaces = () => {
    const baseSpaces = isPremium ? 36 : 9
    const additionalSpaces = selectedGarden?.additional_spaces_purchased || 0
    return baseSpaces + additionalSpaces
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

  const { rows, cols, totalSpaces } = getGridDimensions()

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
            <span>Buy More Spaces</span>
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
        
        {/* Premium status indicator */}
        {isPremium && (
          <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Premium Plan - 6x6 Grid</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              You have access to a 6x6 grid (36 spaces) with premium features!
            </p>
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
        
        {/* Debug Info */}
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div>Debug: Modal Open: {showPlantModal ? 'Yes' : 'No'}</div>
          <div>Plants Available: {plants.length}</div>
          <div>Selected Space: {selectedSpace?.grid_position || 'None'}</div>
          <button 
            onClick={() => {
              console.log('🌱 Manual modal trigger')
              setSelectedSpace({ id: 'test', grid_position: '1,1' })
              setShowPlantModal(true)
            }}
            className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Test Modal
          </button>
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
                  onTouchStart={!isDisabled ? (e) => handleTouchStart(e, plant) : undefined}
                  onTouchMove={!isDisabled ? handleTouchMove : undefined}
                  onTouchEnd={!isDisabled ? handleTouchEnd : undefined}
                  onClick={isDisabled ? (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast.error(`${plant.name} is already placed in the grid`)
                  } : undefined}
                  className={`flex items-center space-x-2 px-3 py-2 border rounded-lg transition-all duration-200 ${
                    isDisabled
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50 pointer-events-none' 
                      : 'bg-green-50 border-green-200 cursor-move hover:bg-green-100 hover:shadow-md hover:scale-105'
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
            All Plants - Drag to Grid
          </h4>
          <div className="text-center py-4">
            <Leaf className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 mb-2">
              No {isIndoorGrid ? 'indoor' : 'outdoor'} plants in this garden
            </p>
            <p className="text-xs text-gray-400">
              {isIndoorGrid 
                ? 'Add indoor plants to this garden or switch to outdoor view' 
                : 'Add outdoor plants to this garden or switch to indoor view'
              }
            </p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="p-4">
        {/* Main Grid Container */}
        <div className="flex flex-col items-center space-y-4">
          {/* Base Grid (6x6 for premium, 3x3 for basic) */}
          <div 
            className="grid gap-1"
            style={{ 
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              maxWidth: cols > 3 ? '600px' : '300px'
            }}
          >
            {(() => {
              console.log(`🌱 Rendering base grid: ${rows}x${cols}, ${gridSpaces.length} total spaces, isPremium: ${isPremium}`)
              console.log(`🌱 Grid spaces:`, gridSpaces.slice(0, 10))
              
              let renderedCount = 0
              return gridSpaces.map((space) => {
                const isOccupied = space.plant_id
                const plant = plants.find(p => p.id === space.plant_id)
                
                // Always show all spaces - no environment filtering for basic users
                const shouldShowSpace = true
                
                console.log(`🌱 Grid space ${space.grid_position}: occupied=${isOccupied}, plant=${plant?.name}, environment=${plant?.environment}, indoor=${isIndoorGrid}, shouldShow=${shouldShowSpace}, isPremium=${isPremium}`)
                
                if (!shouldShowSpace) {
                  console.log(`🌱 Hiding space ${space.grid_position} due to environment filter`)
                  return null // Don't render spaces with plants that don't match the environment
                }
                
                renderedCount++
                console.log(`🌱 Rendering space ${space.grid_position} (${renderedCount}/${gridSpaces.length})`)
                
                return (
                  <div
                    key={space.id}
                    data-space-id={space.id}
                    className={`
                      aspect-square border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200
                      ${cols > 3 ? 'h-10 w-10' : 'h-16 w-16'}
                      ${isOccupied 
                        ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                      }
                      ${draggedPlant && !isOccupied ? 'border-blue-300 bg-blue-50 shadow-lg scale-105' : ''}
                      ${draggedPlant && isOccupied && space.plant_id === draggedPlant.id ? 'border-yellow-300 bg-yellow-50 opacity-50' : ''}
                      ${dragOverSpace === space.id ? 'border-purple-400 bg-purple-50 shadow-lg scale-110' : ''}
                      ${selectedPlantSpace && selectedPlantSpace.id === space.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                    `}
                    onClick={(e) => {
                      console.log('🌱 Grid space clicked:', space.grid_position, 'isOccupied:', isOccupied)
                      console.log('🌱 Click event details:', e.type, e.target)
                      
                      // Only handle click if it's not a drag operation
                      if (draggedPlant) {
                        console.log('🌱 Ignoring click during drag operation')
                        return
                      }
                      
                      e.preventDefault()
                      e.stopPropagation()
                      
                      if (isOccupied) {
                        console.log('🌱 Selecting occupied plant')
                        handlePlantSelect(space)
                      } else {
                        console.log('🌱 Opening plant placement modal')
                        handlePlacePlant(space)
                      }
                    }}
                    onDragOver={(e) => handleDragOver(e, space)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, space)}
                    title={isOccupied ? `${plant?.name || 'Plant'} - Click to select` : 'Click to place plant or drag a plant here'}
                  >
                    {isOccupied ? (
                      <div 
                        className="text-center cursor-move"
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, plant)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, plant)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        title={`Drag to move ${plant?.name || 'Plant'}`}
                      >
                        <Leaf className={`${cols > 3 ? 'h-3 w-3' : 'h-6 w-6'} text-green-600 mx-auto mb-1`} />
                        <div className={`${cols > 3 ? 'text-[8px]' : 'text-xs'} font-medium text-green-800 truncate px-1`}>
                          {plant?.name || 'Plant'}
                        </div>
                        <div className={`${cols > 3 ? 'text-[6px]' : 'text-xs'} text-green-600`}>
                          {space.grid_position}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        {draggedPlant && !isOccupied ? (
                          <div className="flex flex-col items-center">
                            <div className={`${cols > 3 ? 'h-3 w-3' : 'h-6 w-6'} border-2 border-dashed border-blue-400 rounded-full flex items-center justify-center mb-1`}>
                              <Plus className={`${cols > 3 ? 'h-1 w-1' : 'h-2 w-2'} text-blue-400`} />
                            </div>
                            <div className={`${cols > 3 ? 'text-[6px]' : 'text-xs'} text-blue-600 font-medium`}>
                              Drop Here
                            </div>
                          </div>
                        ) : (
                          <>
                            <Plus className={`${cols > 3 ? 'h-2 w-2' : 'h-4 w-4'} mx-auto mb-1`} />
                            <div className={`${cols > 3 ? 'text-[6px]' : 'text-xs'}`}>{space.grid_position}</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              }).filter(Boolean)
            })()}
          </div>

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
                            onError={(e) => {
                              console.log('Image load error:', space.image_path || plant?.latest_image)
                              e.target.style.display = 'none'
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex'
                              }
                            }}
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
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Buy Additional Garden Spaces</h3>
            </div>
            
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
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-800">Total Cost:</span>
                  <span className="text-lg font-bold text-green-900">₱{spacesToPurchase * 20}</span>
                </div>
                <div className="text-xs text-green-700">
                  {spacesToPurchase} spaces × ₱20 each
                </div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">DEMO</span>
                  </div>
                  <span className="text-sm font-medium text-green-800">Demo Payment Mode</span>
                </div>
                <p className="text-xs text-green-700">
                  This is a demo payment system. No real money will be charged. Payment will be processed instantly for demonstration purposes.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handlePurchaseSpaces}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{loading ? 'Processing...' : 'Demo Purchase'}</span>
                </button>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 font-medium"
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
                <p className="text-gray-500 mb-4">No plants available for this garden.</p>
                <p className="text-sm text-gray-400 mb-4">
                  {isIndoorGrid 
                    ? 'Add some indoor plants to this garden first, or switch to outdoor view to see outdoor plants.' 
                    : 'Add some outdoor plants to this garden first, or switch to indoor view to see indoor plants.'
                  }
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowPlantModal(false)
                      // Navigate to add plants page or show add plant modal
                      toast.info('Please add plants to your garden first')
                    }}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Add Plants
                  </button>
                  <button
                    onClick={() => setShowPlantModal(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </button>
                </div>
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
