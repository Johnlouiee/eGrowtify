import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Edit, Trash2, Leaf, MapPin, Calendar, Droplets, Sun, Scissors } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Garden = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [gardens, setGardens] = useState([])
  const [plants, setPlants] = useState([])
  const [plantSearch, setPlantSearch] = useState('')
  const [showAddGarden, setShowAddGarden] = useState(false)
  const [showAddPlant, setShowAddPlant] = useState(false)
  const [editingGarden, setEditingGarden] = useState(null)
  const [editingPlant, setEditingPlant] = useState(null)
  const [loading, setLoading] = useState(true)

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
    type: '',
    environment: '',
    care_guide: '',
    ideal_soil_type: '',
    watering_frequency: '',
    fertilizing_frequency: '',
    pruning_frequency: '',
    garden_id: '',
    planting_date: ''
  })

  useEffect(() => {
    fetchGardens()
    fetchPlants()
  }, [])

  const fetchGardens = async () => {
    try {
      const response = await axios.get('/garden')
      setGardens(response.data.gardens || [])
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please sign in to manage your garden')
        navigate('/login')
        return
      }
      console.error('Error fetching gardens:', error)
    }
  }

  const fetchPlants = async () => {
    try {
      const response = await axios.get('/garden')
      setPlants(response.data.plants || [])
      setLoading(false)
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error('Please sign in to view your plants')
        navigate('/login')
        return
      }
      console.error('Error fetching plants:', error)
      setLoading(false)
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
      // Normalize payload to match backend (INT frequencies, required care_guide)
      const payload = {
        ...plantForm,
        watering_frequency: toIntOrNull(plantForm.watering_frequency),
        fertilizing_frequency: toIntOrNull(plantForm.fertilizing_frequency),
        pruning_frequency: toIntOrNull(plantForm.pruning_frequency),
        garden_id: Number(plantForm.garden_id),
        care_guide: plantForm.care_guide || 'General care'
      }

      if (editingPlant) {
        await axios.post(`/plant/edit/${editingPlant.tracking.id}`, payload)
        toast.success('Plant updated successfully!')
        setEditingPlant(null)
      } else {
        await axios.post('/plant/add', payload)
        toast.success('Plant added successfully!')
      }
      setPlantForm({
        name: '', type: '', environment: '', care_guide: '', ideal_soil_type: '',
        watering_frequency: '', fertilizing_frequency: '', pruning_frequency: '',
        garden_id: '', planting_date: ''
      })
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
    if (window.confirm('Are you sure you want to delete this garden?')) {
      try {
        await axios.post(`/garden/delete/${gardenId}`)
        toast.success('Garden deleted successfully!')
        fetchGardens()
      } catch (error) {
        toast.error('Error deleting garden')
      }
    }
  }

  const deletePlant = async (trackingId) => {
    if (window.confirm('Are you sure you want to delete this plant?')) {
      try {
        await axios.post(`/plant/delete/${trackingId}`)
        toast.success('Plant deleted successfully!')
        fetchPlants()
      } catch (error) {
        toast.error('Error deleting plant')
      }
    }
  }

  const editGarden = (garden) => {
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

        {/* Gardens Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Gardens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardens.map((garden) => (
              <div key={garden.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{garden.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => editGarden(garden)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteGarden(garden.id)}
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
                </div>
              </div>
            ))}
          </div>
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
              <div className="grid grid-cols-12 text-xs font-semibold text-gray-600">
                <div className="col-span-3">Plant</div>
                <div className="col-span-2">Garden</div>
                <div className="col-span-2">Environment</div>
                <div className="col-span-2">Watering (days)</div>
                <div className="col-span-2">Pruning (days)</div>
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
                  <div className="grid grid-cols-12 items-center gap-2">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Leaf className="h-5 w-5 text-green-700" />
                      </div>
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
                    <div className="col-span-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span>{plantData.plant.watering_frequency ?? 'n/a'}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4 text-rose-600" />
                        <span>{plantData.plant.pruning_frequency ?? 'n/a'}</span>
                      </div>
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
                <li className="px-6 py-12 text-center text-gray-500">No plants yet. Add your first plant to get started.</li>
              )}
            </ul>
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
                {/* Plant name removed: backend will default to type if omitted */}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Watering Frequency (days)</label>
                    <input
                      type="number"
                      min="0"
                      value={plantForm.watering_frequency}
                      onChange={(e) => setPlantForm({...plantForm, watering_frequency: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizing Frequency (days)</label>
                    <input
                      type="number"
                      min="0"
                      value={plantForm.fertilizing_frequency}
                      onChange={(e) => setPlantForm({...plantForm, fertilizing_frequency: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pruning Frequency (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={plantForm.pruning_frequency}
                    onChange={(e) => setPlantForm({...plantForm, pruning_frequency: e.target.value})}
                    className="input-field"
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
                        watering_frequency: '', fertilizing_frequency: '', pruning_frequency: '',
                        garden_id: '', planting_date: ''
                      })
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
      </div>
    </div>
  )
}

export default Garden

