import React, { useState, useEffect } from 'react'
import { Plus, ShoppingCart, Leaf, MapPin, Trash2, Edit, Droplets, Scissors, Sun } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const GridPlanner = ({ selectedGarden, onGardenUpdate }) => {
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

  useEffect(() => {
    if (selectedGarden) {
      fetchGridSpaces()
      fetchPlants()
    }
  }, [selectedGarden])

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
      const response = await axios.get('/plants')
      setPlants(response.data.plants || [])
    } catch (error) {
      console.error('Error fetching plants:', error)
      // Mock plants data
      setPlants([
        { id: 1, name: 'Tomato', type: 'vegetable' },
        { id: 2, name: 'Basil', type: 'herb' },
        { id: 3, name: 'Lettuce', type: 'vegetable' },
        { id: 4, name: 'Pepper', type: 'vegetable' },
        { id: 5, name: 'Mint', type: 'herb' }
      ])
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
    setSelectedSpace(space)
    setShowPlantModal(true)
  }

  const handlePlantSubmit = async (e) => {
    e.preventDefault()
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
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buy Spaces</span>
          </button>
        </div>
        
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
                `}
                onClick={() => handlePlacePlant(space)}
                title={isOccupied ? `${plant?.name || 'Plant'} - Click to manage` : 'Click to place plant'}
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

        {/* Plant Management for Occupied Spaces */}
        {gridSpaces.filter(space => space.plant_id).length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Planted Spaces</h4>
            {gridSpaces
              .filter(space => space.plant_id)
              .map((space) => {
                const plant = plants.find(p => p.id === space.plant_id)
                return (
                  <div key={space.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
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
                )
              })}
          </div>
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
            <form onSubmit={handlePlantSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Plant
                </label>
                <select
                  value={plantForm.plant_id}
                  onChange={(e) => setPlantForm({...plantForm, plant_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Choose a plant</option>
                  {plants.map((plant) => (
                    <option key={plant.id} value={plant.id}>
                      {plant.name} ({plant.type})
                    </option>
                  ))}
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
          </div>
        </div>
      )}
    </div>
  )
}

export default GridPlanner
