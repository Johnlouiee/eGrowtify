import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, CheckCircle, XCircle, Users, TrendingUp,
  Upload, X, Save, Clock, Calendar, Star, FileImage, Video
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getLearningPathModules, getModuleData } from '../../utils/learningPathData'

const ManageLearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [selectedPath, setSelectedPath] = useState(null)
  const [showPathDetails, setShowPathDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPath, setEditingPath] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
    duration: '1 week',
    modules_count: 4,
    is_active: true,
    video: null
  })
  const [uploading, setUploading] = useState(false)
  const [showModuleDetails, setShowModuleDetails] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    try {
      setLoading(true)
      // Get the actual learning path data that users see
      const allModules = getLearningPathModules()
      
      // Create learning path objects for admin management
      const learningPathsData = Object.keys(allModules).map(difficulty => ({
        id: difficulty.toLowerCase(),
        title: `${difficulty} Learning Path`,
        description: `Comprehensive ${difficulty.toLowerCase()} level modules focused on plants and soil`,
        difficulty: difficulty,
        estimatedTime: `${allModules[difficulty].reduce((total, module) => {
          const time = parseInt(module.estimatedTime) || 30
          return total + time
        }, 0)} min`,
        modules_count: allModules[difficulty].length,
        is_active: true,
        modules: allModules[difficulty]
      }))
      
      setLearningPaths(learningPathsData)
    } catch (error) {
      console.error('Error fetching learning paths:', error)
      toast.error('Failed to load learning paths')
    } finally {
      setLoading(false)
    }
  }


  const handleTogglePathStatus = async (pathId, currentStatus) => {
    try {
      // Update the local state instead of making API calls
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === pathId 
            ? { ...path, is_active: !currentStatus }
            : path
        )
      )
      toast.success(`Learning path ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error updating learning path status:', error)
      toast.error('Failed to update learning path status')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileUpload = async (file, type) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setFormData(prev => ({
        ...prev,
        [type]: response.data.fileUrl
      }))
      
      toast.success(`${type} uploaded successfully`)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }


  const handleEditPath = async (e) => {
    e.preventDefault()
    try {
      // Update the local state instead of making API calls
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === editingPath.id 
            ? { 
                ...path, 
                title: formData.title,
                description: formData.description,
                difficulty: formData.difficulty,
                modules_count: formData.modules_count,
                is_active: formData.is_active
              }
            : path
        )
      )
      toast.success('Learning path updated successfully')
      setShowEditModal(false)
      setEditingPath(null)
      resetForm()
    } catch (error) {
      console.error('Error updating learning path:', error)
      toast.error('Failed to update learning path')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      duration: '1 week',
      modules_count: 4,
      is_active: true,
      video: null
    })
  }

  const openEditModal = (path) => {
    setEditingPath(path)
    setFormData({
      title: path.title,
      description: path.description,
      difficulty: path.difficulty,
      duration: path.duration || '1 week',
      modules_count: path.modules_count,
      is_active: path.is_active,
      video: path.video || null
    })
    setShowEditModal(true)
  }

  const getAllModuleData = () => {
    return getLearningPathModules()
  }

  const openModuleDetails = (module) => {
    setSelectedModule(module)
    setShowModuleDetails(true)
  }

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || path.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning paths...</p>
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
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage User Learning Paths</h1>
                  <p className="text-sm text-gray-600">Edit modules, lessons, and quizzes for the 3 learning paths users see in their dashboard</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Manage modules within the 3 learning paths: Beginner, Intermediate, and Expert
            </div>
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
                  placeholder="Search learning paths..."
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
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedPath(path)
                        setShowPathDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => openEditModal(path)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{path.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{path.modules_count} Modules</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Status: {path.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePathStatus(path.id, path.is_active)}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      path.is_active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {path.is_active ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPath(path)
                      setShowPathDetails(true)
                    }}
                    className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Module
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Path Details Modal */}
        {showPathDetails && selectedPath && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Learning Path Details</h3>
                  <button
                    onClick={() => setShowPathDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(selectedPath.difficulty)}`}>
                      {selectedPath.difficulty}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-lg text-gray-900">{selectedPath.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-gray-900">{selectedPath.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Modules Count</label>
                      <p className="mt-1 text-gray-900">{selectedPath.modules_count}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 text-gray-900">
                        {selectedPath.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>

                  {/* Modules Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-medium text-gray-900">{selectedPath.difficulty} Learning Path Modules</h5>
                      <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Module
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(selectedPath.difficulty)}`}>
                          {selectedPath.difficulty} Level
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {selectedPath.modules.length} modules
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPath.modules.map((module) => (
                          <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h6 className="font-medium text-gray-900">{module.title}</h6>
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                
                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {module.estimatedTime}
                                </div>
                                
                                {/* Lessons */}
                                <div className="mt-3">
                                  <h7 className="text-sm font-medium text-gray-700">Lessons ({module.lessons.length}):</h7>
                                  <ul className="mt-1 space-y-1">
                                    {module.lessons.map((lesson) => (
                                      <li key={lesson.id} className="text-sm text-gray-600 flex items-center">
                                        <BookOpen className="h-3 w-3 mr-2 text-blue-500" />
                                        {lesson.title}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Quiz */}
                                <div className="mt-3">
                                  <h7 className="text-sm font-medium text-gray-700">Quiz:</h7>
                                  <div className="mt-1">
                                    <p className="text-sm text-gray-600">{module.quiz.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {module.quiz.questions.length} questions
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => openModuleDetails(module)}
                                className="ml-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/learning/${selectedPath.difficulty.toLowerCase()}`}
                      target="_blank"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-center flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View User Experience
                    </Link>
                    <button 
                      onClick={() => openEditModal(selectedPath)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                    >
                      Edit Path
                    </button>
                    <button
                      onClick={() => setShowPathDetails(false)}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Edit Learning Path Modal */}
        {showEditModal && editingPath && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Learning Path</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingPath(null)
                      resetForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditPath} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="1 week">1 Week</option>
                        <option value="2 weeks">2 Weeks</option>
                        <option value="1 month">1 Month</option>
                        <option value="2 months">2 Months</option>
                        <option value="3 months">3 Months</option>
                        <option value="6 months">6 Months</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Modules</label>
                      <select
                        name="modules_count"
                        value={formData.modules_count}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="3">3 Modules</option>
                        <option value="4">4 Modules</option>
                        <option value="5">5 Modules</option>
                        <option value="6">6 Modules</option>
                        <option value="7">7 Modules</option>
                        <option value="8">8 Modules</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Active</label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Path Intro Video (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.video ? (
                        <div className="space-y-2">
                          <Video className="mx-auto h-12 w-12 text-green-500" />
                          <p className="text-sm text-gray-600">Video uploaded</p>
                        </div>
                      ) : (
                        <div>
                          <Video className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload a learning path intro video</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(e.target.files[0], 'video')
                          }
                        }}
                        className="mt-2"
                        disabled={uploading}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <FileImage className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-800">Module Media Management</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Images and videos for individual modules are managed within each module. 
                          Use the "View Details" button on modules to add or edit module-specific media content.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingPath(null)
                        resetForm()
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Path
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Module Details Modal */}
        {showModuleDetails && selectedModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Module Details</h3>
                  <button
                    onClick={() => {
                      setShowModuleDetails(false)
                      setSelectedModule(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-medium text-gray-900">{selectedModule.title}</h4>
                    <p className="text-gray-600 mt-2">{selectedModule.description}</p>
                  </div>
                  
                  {/* Lessons Section */}
                  <div className="border-t pt-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-4">Lessons</h5>
                    <div className="space-y-3">
                      {selectedModule.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h6 className="font-medium text-gray-900">{lesson.title}</h6>
                              <p className="text-sm text-gray-600 mt-1">{lesson.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quiz Section */}
                  <div className="border-t pt-6">
                    <h5 className="text-lg font-medium text-gray-900 mb-4">Quiz</h5>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h6 className="font-medium text-gray-900 mb-3">{selectedModule.quiz.title}</h6>
                      <div className="space-y-3">
                        {selectedModule.quiz.questions.map((question, index) => (
                          <div key={question.id} className="border-l-4 border-blue-200 pl-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <div className="space-y-1">
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center">
                                  <span className={`w-2 h-2 rounded-full mr-2 ${
                                    optionIndex === question.correct ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></span>
                                  <span className={`text-sm ${
                                    optionIndex === question.correct ? 'text-green-700 font-medium' : 'text-gray-600'
                                  }`}>
                                    {option}
                                    {optionIndex === question.correct && ' (Correct)'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setShowModuleDetails(false)
                        setSelectedModule(null)
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close
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

export default ManageLearningPaths

