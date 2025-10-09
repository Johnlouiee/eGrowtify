import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, CheckCircle, XCircle, Globe,
  Sun, Snowflake, Leaf, Flower2, RefreshCw, Settings,
  BarChart3, Grid, List, Download, Upload, Star,
  Clock, MapPin, Thermometer, Droplets, Wind, Zap,
  Target, TrendingUp, Activity, Shield, Crown
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageSeasonalContent = () => {
  const [seasonalContent, setSeasonalContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeason, setFilterSeason] = useState('all')
  const [filterRegion, setFilterRegion] = useState('all')
  const [selectedContent, setSelectedContent] = useState(null)
  const [showContentDetails, setShowContentDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState('cards') // cards, table, list
  const [stats, setStats] = useState({
    total: 0,
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0
  })

  useEffect(() => {
    fetchSeasonalContent()
  }, [])

  const fetchSeasonalContent = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/seasonal-content')
      const contentData = response.data || []
      setSeasonalContent(contentData)
      
      // Calculate stats
      const calculatedStats = {
        total: contentData.length,
        spring: contentData.filter(c => c.season?.toLowerCase() === 'spring').length,
        summer: contentData.filter(c => c.season?.toLowerCase() === 'summer').length,
        autumn: contentData.filter(c => c.season?.toLowerCase() === 'autumn' || c.season?.toLowerCase() === 'fall').length,
        winter: contentData.filter(c => c.season?.toLowerCase() === 'winter').length
      }
      setStats(calculatedStats)
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
    const matchesSearch = content.season?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.region?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeason = filterSeason === 'all' || content.season === filterSeason
    const matchesRegion = filterRegion === 'all' || content.region === filterRegion
    return matchesSearch && matchesSeason && matchesRegion
  })

  const getSeasonColor = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring': return 'bg-green-100 text-green-800'
      case 'summer': return 'bg-yellow-100 text-yellow-800'
      case 'autumn':
      case 'fall': return 'bg-orange-100 text-orange-800'
      case 'winter': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeasonIcon = (season) => {
    switch (season?.toLowerCase()) {
      case 'spring': return <Flower2 className="h-4 w-4" />
      case 'summer': return <Sun className="h-4 w-4" />
      case 'autumn':
      case 'fall': return <Leaf className="h-4 w-4" />
      case 'winter': return <Snowflake className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-75"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Seasonal Content Hub</h1>
                  <p className="text-sm text-slate-600">Manage seasonal planning guides and tips</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchSeasonalContent}
                className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Add Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Total Content</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  All seasonal guides
                </p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-green-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Flower2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stats.spring}</p>
                  <p className="text-xs text-slate-500">Spring</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Spring Content</p>
                <p className="text-xs text-green-600 flex items-center">
                  <Flower2 className="h-3 w-3 mr-1" />
                  Spring guides
                </p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-yellow-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                  <Sun className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stats.summer}</p>
                  <p className="text-xs text-slate-500">Summer</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Summer Content</p>
                <p className="text-xs text-yellow-600 flex items-center">
                  <Sun className="h-3 w-3 mr-1" />
                  Summer guides
                </p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-orange-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stats.autumn}</p>
                  <p className="text-xs text-slate-500">Autumn</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Autumn Content</p>
                <p className="text-xs text-orange-600 flex items-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  Autumn guides
                </p>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Snowflake className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{stats.winter}</p>
                  <p className="text-xs text-slate-500">Winter</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1">Winter Content</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <Snowflake className="h-3 w-3 mr-1" />
                  Winter guides
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Filters and Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 mb-8 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search seasonal content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <select
                  value={filterSeason}
                  onChange={(e) => setFilterSeason(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="all">All Seasons</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                >
                  <option value="all">All Regions</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200/60">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Card View"
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="Table View"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  title="List View"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Seasonal Content Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((content) => (
              <div key={content.id} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${getSeasonColor(content.season).split(' ')[0]} ${getSeasonColor(content.season).split(' ')[1]}`}>
                        {getSeasonIcon(content.season)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{content.season} Guide</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{content.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSeasonColor(content.season)}`}>
                        {content.season}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Month: {content.month}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="h-4 w-4 mr-2 text-green-500" />
                      <span>Region: {content.region}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Updated: {new Date(content.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContent(content)
                          setShowContentDetails(true)
                        }}
                        className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                      <button className="flex items-center px-3 py-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-xl transition-all duration-200">
                        <Edit className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteContent(content.id)}
                      className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Seasonal Content ({filteredContent.length})
                </h3>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Season</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredContent.map((content) => (
                    <tr key={content.id} className="hover:bg-slate-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded-lg ${getSeasonColor(content.season).split(' ')[0]} ${getSeasonColor(content.season).split(' ')[1]}`}>
                            {getSeasonIcon(content.season)}
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeasonColor(content.season)}`}>
                            {content.season}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{content.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{content.month}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{content.region}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedContent(content)
                              setShowContentDetails(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="text-green-600 hover:text-green-900 flex items-center px-2 py-1 rounded-lg hover:bg-green-50 transition-all duration-200">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content.id)}
                            className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((content) => (
              <div key={content.id} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${getSeasonColor(content.season).split(' ')[0]} ${getSeasonColor(content.season).split(' ')[1]}`}>
                        {getSeasonIcon(content.season)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{content.season} Guide</h3>
                        <p className="text-slate-600 mb-3">{content.description}</p>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Month: {content.month}</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500">
                            <MapPin className="h-4 w-4 mr-2 text-green-500" />
                            <span>Region: {content.region}</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-500">
                            <Clock className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Updated: {new Date(content.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContent(content)
                          setShowContentDetails(true)
                        }}
                        className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="flex items-center px-3 py-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContent(content.id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Content Details Modal */}
        {showContentDetails && selectedContent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Seasonal Content Details</h3>
                  </div>
                  <button
                    onClick={() => setShowContentDetails(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-slate-900">{selectedContent.season} Guide</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded-lg ${getSeasonColor(selectedContent.season).split(' ')[0]} ${getSeasonColor(selectedContent.season).split(' ')[1]}`}>
                          {getSeasonIcon(selectedContent.season)}
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSeasonColor(selectedContent.season)}`}>
                          {selectedContent.season}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{selectedContent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-blue-100 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Month</label>
                      </div>
                      <p className="text-slate-900 font-medium">{selectedContent.month}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-green-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-green-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Region</label>
                      </div>
                      <p className="text-slate-900 font-medium">{selectedContent.region}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-purple-100 rounded-lg">
                          <Clock className="h-4 w-4 text-purple-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Last Updated</label>
                      </div>
                      <p className="text-slate-900 font-medium">
                        {new Date(selectedContent.updated_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-amber-100 rounded-lg">
                          <Star className="h-4 w-4 text-amber-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                      </div>
                      <p className="text-slate-900 font-medium">Active</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setShowContentDetails(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                      Close
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Content
                    </button>
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
