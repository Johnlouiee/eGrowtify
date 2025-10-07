import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, CheckCircle, XCircle, Users, TrendingUp,
  Upload, X, Save, Clock, Calendar, Star, FileImage, Video,
  Play, Pause, Volume2, VolumeX, Settings, MoreVertical,
  ChevronDown, ChevronUp, Image, FileText, List, Grid,
  Copy, Move, Download, Share2, Heart, Bookmark
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
  const [showAddModuleModal, setShowAddModuleModal] = useState(false)
  const [showEditModuleModal, setShowEditModuleModal] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [showAddLessonModal, setShowAddLessonModal] = useState(false)
  const [showEditLessonModal, setShowEditLessonModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)
  const [showAddQuizModal, setShowAddQuizModal] = useState(false)
  const [showEditQuizModal, setShowEditQuizModal] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [expandedModules, setExpandedModules] = useState({})
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '30 min',
    difficulty: 'Beginner',
    lessons: [],
    quiz: { title: '', questions: [] },
    images: [],
    videos: []
  })
  const [lessonFormData, setLessonFormData] = useState({
    title: '',
    content: '',
    points: []
  })
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    questions: []
  })
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    image: null
  })

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

  // Module CRUD Functions
  const openAddModuleModal = (path) => {
    setSelectedPath(path)
    setModuleFormData({
      title: '',
      description: '',
      estimatedTime: '30 min',
      difficulty: path.difficulty,
      lessons: [],
      quiz: { title: '', questions: [] },
      images: [],
      videos: []
    })
    setShowAddModuleModal(true)
  }

  const openEditModuleModal = (module) => {
    setEditingModule(module)
    setModuleFormData({
      title: module.title,
      description: module.description,
      estimatedTime: module.estimatedTime,
      difficulty: module.difficulty,
      lessons: module.lessons,
      quiz: module.quiz,
      images: module.images || [],
      videos: module.videos || []
    })
    setShowEditModuleModal(true)
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    try {
      const newModule = {
        id: `module-${Date.now()}`,
        ...moduleFormData,
        lessons: moduleFormData.lessons.map((lesson, index) => ({
          id: index + 1,
          ...lesson
        })),
        quiz: {
          ...moduleFormData.quiz,
          questions: moduleFormData.quiz.questions.map((question, index) => ({
            id: index + 1,
            ...question
          }))
        }
      }

      // Update the learning paths state
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === selectedPath.id 
            ? { ...path, modules: [...path.modules, newModule] }
            : path
        )
      )

      toast.success('Module added successfully!')
      setShowAddModuleModal(false)
      resetModuleForm()
    } catch (error) {
      console.error('Error adding module:', error)
      toast.error('Failed to add module')
    }
  }

  const handleEditModule = async (e) => {
    e.preventDefault()
    try {
      const updatedModule = {
        ...editingModule,
        ...moduleFormData,
        lessons: moduleFormData.lessons.map((lesson, index) => ({
          id: lesson.id || index + 1,
          ...lesson
        })),
        quiz: {
          ...moduleFormData.quiz,
          questions: moduleFormData.quiz.questions.map((question, index) => ({
            id: question.id || index + 1,
            ...question
          }))
        }
      }

      // Update the learning paths state
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === selectedPath.id 
            ? { 
                ...path, 
                modules: path.modules.map(module => 
                  module.id === editingModule.id ? updatedModule : module
                )
              }
            : path
        )
      )

      toast.success('Module updated successfully!')
      setShowEditModuleModal(false)
      setEditingModule(null)
      resetModuleForm()
    } catch (error) {
      console.error('Error updating module:', error)
      toast.error('Failed to update module')
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      try {
        setLearningPaths(prevPaths => 
          prevPaths.map(path => 
            path.id === selectedPath.id 
              ? { 
                  ...path, 
                  modules: path.modules.filter(module => module.id !== moduleId)
                }
              : path
          )
        )

        toast.success('Module deleted successfully!')
      } catch (error) {
        console.error('Error deleting module:', error)
        toast.error('Failed to delete module')
      }
    }
  }

  // Lesson CRUD Functions
  const openAddLessonModal = () => {
    setLessonFormData({
      title: '',
      content: '',
      points: ['']
    })
    setShowAddLessonModal(true)
  }

  const openEditLessonModal = (lesson) => {
    setEditingLesson(lesson)
    setLessonFormData({
      title: lesson.title,
      content: lesson.content,
      points: lesson.points || ['']
    })
    setShowEditLessonModal(true)
  }

  const handleAddLesson = () => {
    const newLesson = {
      id: Date.now(),
      ...lessonFormData
    }

    setModuleFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }))

    toast.success('Lesson added successfully!')
    setShowAddLessonModal(false)
    resetLessonForm()
  }

  const handleEditLesson = () => {
    setModuleFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson => 
        lesson.id === editingLesson.id 
          ? { ...lesson, ...lessonFormData }
          : lesson
      )
    }))

    toast.success('Lesson updated successfully!')
    setShowEditLessonModal(false)
    setEditingLesson(null)
    resetLessonForm()
  }

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setModuleFormData(prev => ({
        ...prev,
        lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
      }))
      toast.success('Lesson deleted successfully!')
    }
  }

  // Quiz CRUD Functions
  const openAddQuizModal = () => {
    setQuizFormData({
      title: '',
      questions: []
    })
    setShowAddQuizModal(true)
  }

  const openEditQuizModal = (quiz) => {
    setEditingQuiz(quiz)
    setQuizFormData({
      title: quiz.title,
      questions: quiz.questions || []
    })
    setShowEditQuizModal(true)
  }

  const handleAddQuiz = () => {
    setModuleFormData(prev => ({
      ...prev,
      quiz: quizFormData
    }))

    toast.success('Quiz added successfully!')
    setShowAddQuizModal(false)
    resetQuizForm()
  }

  const handleEditQuiz = () => {
    setModuleFormData(prev => ({
      ...prev,
      quiz: quizFormData
    }))

    toast.success('Quiz updated successfully!')
    setShowEditQuizModal(false)
    setEditingQuiz(null)
    resetQuizForm()
  }

  // Question CRUD Functions
  const openAddQuestionModal = () => {
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      image: null
    })
  }

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      ...questionFormData
    }

    setQuizFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))

    toast.success('Question added successfully!')
    resetQuestionForm()
  }

  const handleEditQuestion = (questionId) => {
    setQuizFormData(prev => ({
      ...prev,
      questions: prev.questions.map(question => 
        question.id === questionId 
          ? { ...question, ...questionFormData }
          : question
      )
    }))

    toast.success('Question updated successfully!')
    resetQuestionForm()
  }

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuizFormData(prev => ({
        ...prev,
        questions: prev.questions.filter(question => question.id !== questionId)
      }))
      toast.success('Question deleted successfully!')
    }
  }

  // Form Reset Functions
  const resetModuleForm = () => {
    setModuleFormData({
      title: '',
      description: '',
      estimatedTime: '30 min',
      difficulty: 'Beginner',
      lessons: [],
      quiz: { title: '', questions: [] },
      images: [],
      videos: []
    })
  }

  const resetLessonForm = () => {
    setLessonFormData({
      title: '',
      content: '',
      points: ['']
    })
  }

  const resetQuizForm = () => {
    setQuizFormData({
      title: '',
      questions: []
    })
  }

  const resetQuestionForm = () => {
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      image: null
    })
  }

  // Utility Functions
  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const addLessonPoint = () => {
    setLessonFormData(prev => ({
      ...prev,
      points: [...prev.points, '']
    }))
  }

  const removeLessonPoint = (index) => {
    setLessonFormData(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }))
  }

  const updateLessonPoint = (index, value) => {
    setLessonFormData(prev => ({
      ...prev,
      points: prev.points.map((point, i) => i === index ? value : point)
    }))
  }

  const addQuestionOption = () => {
    setQuestionFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removeQuestionOption = (index) => {
    setQuestionFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const updateQuestionOption = (index, value) => {
    setQuestionFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }))
  }

  // Media Upload Functions
  const handleImageUpload = async (file) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setModuleFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          id: Date.now(),
          url: response.data.fileUrl,
          name: file.name,
          size: file.size,
          type: file.type
        }]
      }))
      
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (file) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setModuleFormData(prev => ({
        ...prev,
        videos: [...prev.videos, {
          id: Date.now(),
          url: response.data.fileUrl,
          name: file.name,
          size: file.size,
          type: file.type
        }]
      }))
      
      toast.success('Video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (imageId) => {
    setModuleFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
    toast.success('Image removed!')
  }

  const removeVideo = (videoId) => {
    setModuleFormData(prev => ({
      ...prev,
      videos: prev.videos.filter(vid => vid.id !== videoId)
    }))
    toast.success('Video removed!')
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
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setSelectedPath(path)
                        setShowPathDetails(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Modules
                    </button>
                    <button 
                      onClick={() => openEditModal(path)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Edit Learning Path"
                    >
                      <Edit className="h-6 w-6" />
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
                    onClick={() => openAddModuleModal(path)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                  >
                    <Plus className="h-5 w-5 mr-2" />
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

                  {/* Enhanced Modules Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h5 className="text-lg font-medium text-gray-900">{selectedPath.difficulty} Learning Path Modules</h5>
                        <div className="flex items-center mt-2">
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(selectedPath.difficulty)}`}>
                            {selectedPath.difficulty} Level
                          </span>
                          <span className="ml-3 text-sm text-gray-500">
                            {selectedPath.modules.length} modules
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* View Mode Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                          >
                            <Grid className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                          >
                            <List className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => openAddModuleModal(selectedPath)}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add New Module
                        </button>
                      </div>
                    </div>
                    
                    {/* Modules Display */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedPath.modules.map((module) => (
                          <div key={module.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            {/* Module Header */}
                            <div className="p-4 border-b border-gray-100">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h6 className="font-semibold text-gray-900 text-lg">{module.title}</h6>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{module.description}</p>
                                </div>
                                <div className="flex items-center space-x-2 ml-3">
                                  <button
                                    onClick={() => openEditModuleModal(module)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Edit Module"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    title="Delete Module"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {module.estimatedTime}
                                </div>
                                <button
                                  onClick={() => toggleModuleExpansion(module.id)}
                                  className="flex items-center text-xs text-blue-600 hover:text-blue-700"
                                >
                                  {expandedModules[module.id] ? 'Less' : 'More'}
                                  {expandedModules[module.id] ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                                </button>
                              </div>
                            </div>
                            
                            {/* Module Content */}
                            <div className="p-4">
                              {/* Lessons Summary */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h7 className="text-sm font-medium text-gray-700">Lessons ({module.lessons.length})</h7>
                                  <button
                                    onClick={() => openAddLessonModal()}
                                    className="px-3 py-1 text-sm text-green-600 hover:text-green-700 flex items-center bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Lesson
                                  </button>
                                </div>
                                {expandedModules[module.id] ? (
                                  <div className="space-y-2">
                                    {module.lessons.map((lesson, index) => (
                                      <div key={lesson.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                                        <div className="flex items-center">
                                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                            {index + 1}
                                          </span>
                                          <span className="text-sm text-gray-700">{lesson.title}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <button
                                            onClick={() => openEditLessonModal(lesson)}
                                            className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                                            title="Edit Lesson"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                            title="Delete Lesson"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500">
                                    {module.lessons.slice(0, 2).map(lesson => lesson.title).join(', ')}
                                    {module.lessons.length > 2 && ` +${module.lessons.length - 2} more`}
                                  </div>
                                )}
                              </div>
                              
                              {/* Quiz Summary */}
                              <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h7 className="text-sm font-medium text-gray-700">Quiz</h7>
                                  <button
                                    onClick={() => openAddQuizModal()}
                                    className="px-3 py-1 text-sm text-green-600 hover:text-green-700 flex items-center bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Quiz
                                  </button>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {module.quiz.title || 'No quiz added'}
                                </div>
                                {module.quiz.questions && module.quiz.questions.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {module.quiz.questions.length} questions
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPath.modules.map((module) => (
                          <div key={module.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4">
                                    <h6 className="font-semibold text-gray-900">{module.title}</h6>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {module.estimatedTime}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                                  
                                  <div className="flex items-center space-x-6 mt-3 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      {module.lessons.length} lessons
                                    </div>
                                    <div className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {module.quiz.questions ? module.quiz.questions.length : 0} quiz questions
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => openEditModuleModal(module)}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteModule(module.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
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

        {/* Add Module Modal */}
        {showAddModuleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Module</h3>
                  <button
                    onClick={() => {
                      setShowAddModuleModal(false)
                      resetModuleForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddModule} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                      <input
                        type="text"
                        value={moduleFormData.title}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time</label>
                      <select
                        value={moduleFormData.estimatedTime}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="15 min">15 minutes</option>
                        <option value="20 min">20 minutes</option>
                        <option value="25 min">25 minutes</option>
                        <option value="30 min">30 minutes</option>
                        <option value="35 min">35 minutes</option>
                        <option value="40 min">40 minutes</option>
                        <option value="45 min">45 minutes</option>
                        <option value="50 min">50 minutes</option>
                        <option value="55 min">55 minutes</option>
                        <option value="60 min">1 hour</option>
                        <option value="65 min">1 hour 5 minutes</option>
                        <option value="70 min">1 hour 10 minutes</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={moduleFormData.description}
                      onChange={(e) => setModuleFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Images Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Module Images</h4>
                    <div className="space-y-4">
                      {/* Upload New Image */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload module images</p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            Array.from(e.target.files).forEach(file => {
                              handleImageUpload(file)
                            })
                          }}
                          className="hidden"
                          id="image-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Choose Images'}
                        </label>
                      </div>

                      {/* Display Uploaded Images */}
                      {moduleFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {moduleFormData.images.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <button
                                  onClick={() => removeImage(image.id)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Videos Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Module Videos</h4>
                    <div className="space-y-4">
                      {/* Upload New Video */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload module videos</p>
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          onChange={(e) => {
                            Array.from(e.target.files).forEach(file => {
                              handleVideoUpload(file)
                            })
                          }}
                          className="hidden"
                          id="video-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="video-upload"
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Choose Videos'}
                        </label>
                      </div>

                      {/* Display Uploaded Videos */}
                      {moduleFormData.videos.length > 0 && (
                        <div className="space-y-4">
                          {moduleFormData.videos.map((video) => (
                            <div key={video.id} className="relative group border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <Video className="h-12 w-12 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{video.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeVideo(video.id)}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lessons Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Lessons ({moduleFormData.lessons.length})</h4>
                      <button
                        type="button"
                        onClick={openAddLessonModal}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Lesson
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {moduleFormData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                {index + 1}
                              </span>
                              <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => openEditLessonModal(lesson)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quiz Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Quiz</h4>
                      <button
                        type="button"
                        onClick={openAddQuizModal}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Quiz
                      </button>
                    </div>
                    
                    {moduleFormData.quiz.title ? (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{moduleFormData.quiz.title}</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {moduleFormData.quiz.questions.length} questions
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditQuizModal(moduleFormData.quiz)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No quiz added yet</div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModuleModal(false)
                        resetModuleForm()
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Module
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showAddLessonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Lesson</h3>
                  <button
                    onClick={() => {
                      setShowAddLessonModal(false)
                      resetLessonForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                    <input
                      type="text"
                      value={lessonFormData.title}
                      onChange={(e) => setLessonFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
                    <textarea
                      value={lessonFormData.content}
                      onChange={(e) => setLessonFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Key Points</label>
                    <div className="space-y-2">
                      {lessonFormData.points.map((point, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => updateLessonPoint(index, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Key point ${index + 1}`}
                          />
                          {lessonFormData.points.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLessonPoint(index)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addLessonPoint}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Key Point
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddLessonModal(false)
                        resetLessonForm()
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLesson}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Quiz Modal */}
        {showAddQuizModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Quiz</h3>
                  <button
                    onClick={() => {
                      setShowAddQuizModal(false)
                      resetQuizForm()
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                    <input
                      type="text"
                      value={quizFormData.title}
                      onChange={(e) => setQuizFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Questions Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900">Questions ({quizFormData.questions.length})</h4>
                      <button
                        type="button"
                        onClick={openAddQuestionModal}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Question
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {quizFormData.questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-gray-900">Question {index + 1}</h5>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => handleEditQuestion(question.id)}
                                className="p-1 text-gray-400 hover:text-blue-600"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{question.question}</p>
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
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddQuizModal(false)
                        resetQuizForm()
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddQuiz}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Question Modal */}
        {showAddQuizModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Question</h3>
                  <button
                    onClick={resetQuestionForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                    <textarea
                      value={questionFormData.question}
                      onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Image (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {questionFormData.image ? (
                        <div className="space-y-2">
                          <Image className="mx-auto h-12 w-12 text-green-500" />
                          <p className="text-sm text-gray-600">Image uploaded</p>
                        </div>
                      ) : (
                        <div>
                          <Image className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload a question image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleFileUpload(e.target.files[0], 'image')
                          }
                        }}
                        className="mt-2"
                        disabled={uploading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options</label>
                    <div className="space-y-2">
                      {questionFormData.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correct"
                            checked={questionFormData.correct === index}
                            onChange={() => setQuestionFormData(prev => ({ ...prev, correct: index }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateQuestionOption(index, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${index + 1}`}
                          />
                          {questionFormData.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeQuestionOption(index)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addQuestionOption}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Option
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
                    <textarea
                      value={questionFormData.explanation}
                      onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Explain why this answer is correct..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={resetQuestionForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Add Question
                    </button>
                  </div>
                </div>
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

