import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, CheckCircle, XCircle, Globe
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageSeasonalContent = () => {
  const [seasonalContent, setSeasonalContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeason, setFilterSeason] = useState('all')
  const [selectedContent, setSelectedContent] = useState(null)
  const [showContentDetails, setShowContentDetails] = useState(false)

  useEffect(() => {
    fetchSeasonalContent()
  }, [])

  const fetchSeasonalContent = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/seasonal-content')
      setSeasonalContent(response.data)
    } catch (error) {
      console.error('Error fetching seasonal content:', error)
      toast.error('Failed to load seasonal content')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this seasonal content? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/admin/seasonal-content/${contentId}`)
      toast.success('Seasonal content deleted successfully')
      fetchSeasonalContent() // Refresh the list
    } catch (error) {
      console.error('Error deleting seasonal content:', error)
      toast.error('Failed to delete seasonal content')
    }
  }

  const filteredContent = seasonalContent.filter(content => {
    const matchesSearch = content.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeason = filterSeason === 'all' || content.season === filterSeason
    return matchesSearch && matchesSeason
  })

  const getSeasonColor = (season) => {
    switch (season.toLowerCase()) {
      case 'spring': return 'bg-green-100 text-green-800'
      case 'summer': return 'bg-yellow-100 text-yellow-800'
      case 'autumn':
      case 'fall': return 'bg-orange-100 text-orange-800'
      case 'winter': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seasonal content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                to="/admin" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Admin Dashboard
              </Link>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Seasonal Content</h1>
                  <p className="text-sm text-gray-600">Manage seasonal planning guides and tips</p>
                </div>
              </div>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Seasonal Content
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search seasonal content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filterSeason}
                  onChange={(e) => setFilterSeason(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Seasons</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Seasonal Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => (
            <div key={content.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSeasonColor(content.season)}`}>
                    {content.season}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedContent(content)
                        setShowContentDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.season} Guide</h3>
                <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Month: {content.month}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Region: {content.region}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Updated: {new Date(content.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Details Modal */}
        {showContentDetails && selectedContent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Seasonal Content Details</h3>
                  <button
                    onClick={() => setShowContentDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getSeasonColor(selectedContent.season)}`}>
                      {selectedContent.season}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Month</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContent.month}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Region</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedContent.region}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedContent.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageSeasonalContent
