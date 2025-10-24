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
import AdminHeader from '../../components/AdminHeader'
import AdminCard, { AdminCardGrid } from '../../components/AdminCard'
import AdminFilters from '../../components/AdminFilters'
import AdminModal, { AdminModalFooter, AdminModalActions } from '../../components/AdminModal'
import AdminForm, { AdminFormField, AdminFormGroup, AdminFormActions } from '../../components/AdminForm'

const ManageLearningPaths = () => {
  const [learningPaths, setLearningPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [selectedPath, setSelectedPath] = useState(null)
  const [showPathDetails, setShowPathDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPath, setEditingPath] = useState(null)
  const [isEditingPath, setIsEditingPath] = useState(false)
  const [isAddingPath, setIsAddingPath] = useState(false)
  const [selectedModuleForAction, setSelectedModuleForAction] = useState(null)
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
  const [activeModuleTab, setActiveModuleTab] = useState('basic') // 'basic', 'lessons', 'quizzes'
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
    points: [],
    images: [],
    videos: []
  })
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    questions: [],
    images: []
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


  const handleAddPath = async (e) => {
    e.preventDefault()
    try {
      const newPath = {
        id: Date.now(), // Simple ID generation for demo
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        duration: formData.duration,
        is_active: formData.is_active,
        modules_count: 0,
        modules: []
      }
      
      setLearningPaths(prevPaths => [...prevPaths, newPath])
      toast.success('Learning path added successfully!')
      setIsAddingPath(false)
      resetForm()
    } catch (error) {
      console.error('Error adding learning path:', error)
      toast.error('Failed to add learning path')
    }
  }

  const handleEditPath = async (e) => {
    e.preventDefault()
    try {
      // Update the local state instead of making API calls
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === selectedPath.id 
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
      setIsEditingPath(false)
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
      points: [''],
      images: [],
      videos: []
    })
    setActiveModuleTab('lessons')
    // The lesson form will be shown in the main modal's lessons tab
  }

  const openEditLessonModal = (lesson) => {
    setEditingLesson(lesson)
    setLessonFormData({
      title: lesson.title,
      content: lesson.content,
      points: lesson.points || [''],
      images: lesson.images || [],
      videos: lesson.videos || []
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
      questions: [],
      images: []
    })
    setActiveModuleTab('quizzes')
    // The quiz form will be shown in the main modal's quizzes tab
  }

  const openEditQuizModal = (quiz) => {
    setEditingQuiz(quiz)
    setQuizFormData({
      title: quiz.title,
      questions: quiz.questions || [],
      images: quiz.images || []
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
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
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
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
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

  const removeImage = async (imageId) => {
    try {
      const imageToRemove = moduleFormData.images.find(img => img.id === imageId)
      if (imageToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: imageToRemove.url
        })
      }
      
      setModuleFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed!')
    } catch (error) {
      console.error('Error removing image:', error)
      // Still remove from UI even if server deletion fails
      setModuleFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed from module!')
    }
  }

  const removeVideo = async (videoId) => {
    try {
      const videoToRemove = moduleFormData.videos.find(vid => vid.id === videoId)
      if (videoToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: videoToRemove.url
        })
      }
      
      setModuleFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed!')
    } catch (error) {
      console.error('Error removing video:', error)
      // Still remove from UI even if server deletion fails
      setModuleFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed from module!')
    }
  }

  // Lesson Media Upload Functions
  const handleLessonImageUpload = async (file) => {
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
      
      setLessonFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
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

  const handleLessonVideoUpload = async (file) => {
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
      
      setLessonFormData(prev => ({
        ...prev,
        videos: [...prev.videos, {
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
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

  const removeLessonImage = async (imageId) => {
    try {
      const imageToRemove = lessonFormData.images.find(img => img.id === imageId)
      if (imageToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: imageToRemove.url
        })
      }
      
      setLessonFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed!')
    } catch (error) {
      console.error('Error removing image:', error)
      // Still remove from UI even if server deletion fails
      setLessonFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed from lesson!')
    }
  }

  const removeLessonVideo = async (videoId) => {
    try {
      const videoToRemove = lessonFormData.videos.find(vid => vid.id === videoId)
      if (videoToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: videoToRemove.url
        })
      }
      
      setLessonFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed!')
    } catch (error) {
      console.error('Error removing video:', error)
      // Still remove from UI even if server deletion fails
      setLessonFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed from lesson!')
    }
  }

  // Quiz Media Upload Functions
  const handleQuizImageUpload = async (file, questionNumber) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'image')
      formData.append('learning_path', 'true')
      formData.append('path_difficulty', 'Beginner')
      formData.append('module_id', 'plant-basics')
      formData.append('content_type', 'quiz_question')
      formData.append('content_id', questionNumber)
      formData.append('question_number', questionNumber)
      formData.append('title', `Quiz Question ${questionNumber}`)
      formData.append('description', `Image for quiz question ${questionNumber}`)
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setQuizFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
          type: file.type,
          questionNumber: questionNumber
        }]
      }))
      
      toast.success(`Image uploaded successfully for Question ${questionNumber}!`)
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeQuizImage = async (imageId) => {
    try {
      const imageToRemove = quizFormData.images.find(img => img.id === imageId)
      if (imageToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: imageToRemove.url
        })
      }
      
      setQuizFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed!')
    } catch (error) {
      console.error('Error removing image:', error)
      // Still remove from UI even if server deletion fails
      setQuizFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }))
      toast.success('Image removed from quiz!')
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <AdminHeader
        title="Manage Learning Paths"
        subtitle="Edit modules, lessons, and quizzes for the 3 learning paths users see in their dashboard"
        icon={BookOpen}
        iconColor="from-green-600 to-emerald-600"
        showBackButton={true}
        actions={[
          {
            text: "Add Module",
            icon: Plus,
            onClick: () => setShowAddModuleModal(true),
            className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search learning paths..."
          filters={[
            {
              value: filterDifficulty,
              onChange: setFilterDifficulty,
              options: [
                { value: 'all', label: 'All Difficulties' },
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Expert', label: 'Expert' }
              ]
            }
          ]}
          viewModes={[
            { id: 'grid', icon: Grid, title: 'Grid View' },
            { id: 'list', icon: List, title: 'List View' }
          ]}
          currentViewMode={viewMode}
          onViewModeChange={setViewMode}
        />



        {/* Learning Paths Grid */}
        <AdminCardGrid columns={3}>
          {filteredPaths.map((path) => (
            <AdminCard
              key={path.id}
              title={path.title}
              value={path.modules_count}
              subtitle={`${path.modules_count} Modules`}
              icon={BookOpen}
              iconColor={getDifficultyColor(path.difficulty).includes('green') ? 'from-green-500 to-green-600' : 
                         getDifficultyColor(path.difficulty).includes('blue') ? 'from-blue-500 to-blue-600' : 
                         'from-red-500 to-red-600'}
              status={path.is_active ? 'success' : 'error'}
              actions={[
                {
                  text: "View Modules",
                  icon: Eye,
                  onClick: () => {
                        setSelectedPath(path)
                        setShowPathDetails(true)
                  },
                  className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
                }
              ]}
            >
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyColor(path.difficulty)}`}>
                    {path.difficulty}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    path.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {path.is_active ? 'Active' : 'Inactive'}
                  </span>
                  </div>
                <p className="text-sm text-slate-600">{path.description}</p>
                  <button
                    onClick={() => handleTogglePathStatus(path.id, path.is_active)}
                  className={`w-full px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      path.is_active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                  {path.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
            </AdminCard>
          ))}
        </AdminCardGrid>

        {/* Enhanced Path Details Modal */}
        {showPathDetails && selectedPath && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-75"></div>
                      <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">Learning Path Details</h3>
                      <p className="text-slate-600 mt-1">Manage modules, lessons, and quizzes for {selectedPath.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowPathDetails(false)
                      setSelectedModuleForAction(null)
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
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
                  <div className="border-t border-slate-200/60 pt-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                      <div>
                          <h5 className="text-2xl font-bold text-slate-900">{selectedPath.difficulty} Learning Path Modules</h5>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getDifficultyColor(selectedPath.difficulty)}`}>
                            {selectedPath.difficulty} Level
                          </span>
                            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {selectedPath.modules.length} modules
                          </span>
                            <span className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                              {selectedPath.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
                          </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Enhanced View Mode Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Grid View"
                          >
                            <Grid className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                            title="List View"
                          >
                            <List className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => openAddModuleModal(selectedPath)}
                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <Plus className="h-6 w-6 mr-3" />
                          Add New Module
                        </button>
                      </div>
                    </div>
                    
                    {/* Enhanced Modules Display */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {selectedPath.modules.map((module) => (
                          <div 
                            key={module.id} 
                            onClick={() => setSelectedModuleForAction(selectedModuleForAction === module.id ? null : module.id)}
                            className={`group relative overflow-hidden backdrop-blur-sm rounded-2xl border transition-all duration-300 transform cursor-pointer ${
                              selectedModuleForAction === module.id 
                                ? 'bg-blue-50 border-blue-300 shadow-2xl shadow-blue-500/20 scale-105' 
                                : 'bg-white/80 border-slate-200/50 hover:border-blue-300/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105'
                            }`}
                          >
                            {/* Enhanced Module Header */}
                            <div className="p-6 border-b border-slate-200/60">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className={`p-2 rounded-lg shadow-lg ${
                                      selectedModuleForAction === module.id 
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                    }`}>
                                      <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <h6 className="font-bold text-slate-900 text-xl">{module.title}</h6>
                                      <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <Clock className="h-4 w-4 mr-1" />
                                        {module.estimatedTime}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-slate-600 leading-relaxed line-clamp-3">{module.description}</p>
                                </div>
                                
                                {/* Action Buttons - Show when selected */}
                                {selectedModuleForAction === module.id && (
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditModuleModal(module)
                                      }}
                                      className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                                      title="Edit Module"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteModule(module.id)
                                      }}
                                      className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                                      title="Delete Module"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    {module.lessons?.length || 0} lessons
                                  </div>
                                  <div className="flex items-center text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                                    <FileText className="h-4 w-4 mr-1" />
                                    {module.quiz?.questions?.length || 0} quiz
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => openModuleDetails(module)}
                                    className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => toggleModuleExpansion(module.id)}
                                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                  >
                                    {expandedModules[module.id] ? 'Less' : 'More'}
                                    {expandedModules[module.id] ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Module Content */}
                            <div className="p-6">
                              {/* Enhanced Lessons Summary */}
                              <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                                      <BookOpen className="h-5 w-5 text-white" />
                                    </div>
                                    <h7 className="text-lg font-bold text-slate-900">Lessons ({module.lessons.length})</h7>
                                  </div>
                                  <button
                                    onClick={() => openAddLessonModal()}
                                    className="px-4 py-2 text-sm text-green-600 hover:text-green-700 flex items-center bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Lesson
                                  </button>
                                </div>
                                {expandedModules[module.id] ? (
                                  <div className="space-y-3">
                                    {module.lessons.map((lesson, index) => (
                                      <div key={lesson.id} className="flex items-center justify-between bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow-md">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                            {index + 1}
                                        </div>
                                          <div>
                                            <span className="text-base font-semibold text-slate-900">{lesson.title}</span>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lesson.content}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            onClick={() => openEditLessonModal(lesson)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            title="Edit Lesson"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            title="Delete Lesson"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-slate-500 bg-slate-100 rounded-xl p-3">
                                    {module.lessons.slice(0, 2).map(lesson => lesson.title).join(', ')}
                                    {module.lessons.length > 2 && ` +${module.lessons.length - 2} more`}
                                  </div>
                                )}
                              </div>
                              
                              {/* Enhanced Quiz Summary */}
                              <div className="border-t border-slate-200/60 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                                      <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <h7 className="text-lg font-bold text-slate-900">Quiz</h7>
                                  </div>
                                  <button
                                    onClick={() => openAddQuizModal()}
                                    className="px-4 py-2 text-sm text-green-600 hover:text-green-700 flex items-center bg-green-50 rounded-xl hover:bg-green-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Quiz
                                  </button>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                  <div className="text-base font-semibold text-slate-900 mb-2">
                                  {module.quiz.title || 'No quiz added'}
                                </div>
                                {module.quiz.questions && module.quiz.questions.length > 0 && (
                                    <div className="flex items-center space-x-4">
                                      <div className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                                    {module.quiz.questions.length} questions
                                      </div>
                                      <div className="text-sm text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                                        Ready to use
                                      </div>
                                  </div>
                                )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPath.modules.map((module) => (
                          <div 
                            key={module.id} 
                            onClick={() => setSelectedModuleForAction(selectedModuleForAction === module.id ? null : module.id)}
                            className={`border rounded-lg shadow-sm transition-all duration-300 cursor-pointer ${
                              selectedModuleForAction === module.id 
                                ? 'bg-blue-50 border-blue-300 shadow-lg' 
                                : 'bg-white border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4">
                                    <h6 className={`font-semibold ${
                                      selectedModuleForAction === module.id ? 'text-blue-900' : 'text-gray-900'
                                    }`}>{module.title}</h6>
                                    <span className={`text-xs px-2 py-1 rounded ${
                                      selectedModuleForAction === module.id 
                                        ? 'text-blue-600 bg-blue-100' 
                                        : 'text-gray-500 bg-gray-100'
                                    }`}>
                                      {module.estimatedTime}
                                    </span>
                                  </div>
                                  <p className={`text-sm mt-1 ${
                                    selectedModuleForAction === module.id ? 'text-blue-700' : 'text-gray-600'
                                  }`}>{module.description}</p>
                                  
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
                                
                                {/* Action Buttons - Show when selected */}
                                {selectedModuleForAction === module.id ? (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditModuleModal(module)
                                      }}
                                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteModule(module.id)
                                      }}
                                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openModuleDetails(module)
                                      }}
                                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 flex items-center"
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Details
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setShowPathDetails(false)
                        setSelectedModuleForAction(null)
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Enhanced Add Module Modal */}
        {showAddModuleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-sm opacity-75"></div>
                      <div className="relative p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                        <Plus className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">Add New Module</h3>
                      <p className="text-slate-600 mt-1">Create a new learning module for {selectedPath?.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModuleModal(false)
                      resetModuleForm()
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleAddModule} className="space-y-8">
                  {/* Enhanced Basic Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Basic Information</h4>
                    </div>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Module Title</label>
                      <input
                        type="text"
                        value={moduleFormData.title}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                          placeholder="Enter module title..."
                        required
                      />
                    </div>
                    
                    <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Estimated Time</label>
                      <select
                        value={moduleFormData.estimatedTime}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
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
                  
                    <div className="mt-6">
                      <label className="block text-lg font-semibold text-slate-700 mb-3">Description</label>
                    <textarea
                      value={moduleFormData.description}
                      onChange={(e) => setModuleFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                        placeholder="Describe what students will learn in this module..."
                      required
                    />
                    </div>
                  </div>

                  {/* Enhanced Images Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                        <Image className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Module Images</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Enhanced Upload Area */}
                      <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center hover:border-green-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-sm opacity-25"></div>
                          <div className="relative p-6">
                            <Image className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Module Images</h5>
                            <p className="text-slate-600 mb-4">Add visual content to enhance learning experience</p>
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
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                        >
                              <Upload className="h-5 w-5 mr-2" />
                          {uploading ? 'Uploading...' : 'Choose Images'}
                        </label>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Display Uploaded Images */}
                      {moduleFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {moduleFormData.images.map((image) => (
                            <div key={image.id} className="relative group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-40 object-cover rounded-xl border border-slate-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-xl flex items-center justify-center">
                                <button
                                  onClick={() => removeImage(image.id)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-lg"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm font-semibold text-slate-900 truncate">{image.name}</p>
                                <p className="text-xs text-slate-500">{(image.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Videos Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Module Videos</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Enhanced Upload Area */}
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-sm opacity-25"></div>
                          <div className="relative p-6">
                            <Video className="mx-auto h-16 w-16 text-purple-500 mb-4" />
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Module Videos</h5>
                            <p className="text-slate-600 mb-4">Add video content to make learning more engaging</p>
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
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                        >
                              <Upload className="h-5 w-5 mr-2" />
                          {uploading ? 'Uploading...' : 'Choose Videos'}
                        </label>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Display Uploaded Videos */}
                      {moduleFormData.videos.length > 0 && (
                        <div className="space-y-4">
                          {moduleFormData.videos.map((video) => (
                            <div key={video.id} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Video className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h6 className="text-lg font-semibold text-slate-900 mb-1">{video.name}</h6>
                                  <p className="text-sm text-slate-500 mb-2">
                                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                      Video File
                                    </span>
                                    <span className="text-xs text-slate-500 bg-purple-100 px-3 py-1 rounded-full">
                                      Ready to use
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeVideo(video.id)}
                                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Content Management Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Content Management</h4>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 shadow-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('basic')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'basic'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Basic Info</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('lessons')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'lessons'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Lessons ({moduleFormData.lessons.length})</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('quizzes')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'quizzes'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Quiz</span>
                        </div>
                      </button>
                    </div>

                    {/* Tab Content */}
                    {activeModuleTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Lessons</h5>
                          <button
                            type="button"
                            onClick={openAddLessonModal}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {moduleFormData.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <span className="text-lg font-semibold text-slate-900">{lesson.title}</span>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lesson.content}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditLessonModal(lesson)}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                    title="Edit Lesson"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeModuleTab === 'quizzes' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Quiz</h5>
                          <button
                            type="button"
                            onClick={openAddQuizModal}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quiz
                          </button>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-slate-900 mb-2">
                                {moduleFormData.quiz.title || 'No quiz added'}
                              </div>
                              {moduleFormData.quiz.questions && moduleFormData.quiz.questions.length > 0 && (
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                                    {moduleFormData.quiz.questions.length} questions
                                  </div>
                                  <div className="text-sm text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                                    Ready to use
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Quiz Action Buttons */}
                            {moduleFormData.quiz.title && (
                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  type="button"
                                  onClick={() => openEditQuizModal(moduleFormData.quiz)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                  title="Edit Quiz"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this quiz?')) {
                                      setModuleFormData(prev => ({
                                        ...prev,
                                        quiz: { title: '', questions: [], images: [] }
                                      }))
                                      toast.success('Quiz deleted successfully!')
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                  title="Delete Quiz"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
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

        {/* Enhanced Edit Module Modal */}
        {showEditModuleModal && editingModule && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-75"></div>
                      <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl">
                        <Edit className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">Edit Module</h3>
                      <p className="text-slate-600 mt-1">Update module information and content</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModuleModal(false)
                      setEditingModule(null)
                      resetModuleForm()
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditModule} className="space-y-8">
                  {/* Enhanced Basic Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Basic Information</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Module Title</label>
                        <input
                          type="text"
                          value={moduleFormData.title}
                          onChange={(e) => setModuleFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                          placeholder="Enter module title..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Estimated Time</label>
                        <select
                          value={moduleFormData.estimatedTime}
                          onChange={(e) => setModuleFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
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
                    
                    <div className="mt-6">
                      <label className="block text-lg font-semibold text-slate-700 mb-3">Description</label>
                      <textarea
                        value={moduleFormData.description}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows="4"
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                        placeholder="Describe what students will learn in this module..."
                        required
                      />
                    </div>
                  </div>

                  {/* Enhanced Images Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                        <Image className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Module Images</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Enhanced Upload Area */}
                      <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center hover:border-green-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-sm opacity-25"></div>
                          <div className="relative p-6">
                            <Image className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Module Images</h5>
                            <p className="text-slate-600 mb-4">Add visual content to enhance learning experience</p>
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
                              id="edit-image-upload"
                              disabled={uploading}
                            />
                            <label
                              htmlFor="edit-image-upload"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Images'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Display Uploaded Images */}
                      {moduleFormData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {moduleFormData.images.map((image) => (
                            <div key={image.id} className="relative group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                              <img
                                src={image.url}
                                alt={image.name}
                                className="w-full h-40 object-cover rounded-xl border border-slate-200"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-xl flex items-center justify-center">
                                <button
                                  onClick={() => removeImage(image.id)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-lg"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm font-semibold text-slate-900 truncate">{image.name}</p>
                                <p className="text-xs text-slate-500">{(image.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Videos Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Module Videos</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Enhanced Upload Area */}
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-all duration-200 bg-white/50 backdrop-blur-sm">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-sm opacity-25"></div>
                          <div className="relative p-6">
                            <Video className="mx-auto h-16 w-16 text-purple-500 mb-4" />
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Module Videos</h5>
                            <p className="text-slate-600 mb-4">Add video content to make learning more engaging</p>
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
                              id="edit-video-upload"
                              disabled={uploading}
                            />
                            <label
                              htmlFor="edit-video-upload"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Videos'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Display Uploaded Videos */}
                      {moduleFormData.videos.length > 0 && (
                        <div className="space-y-4">
                          {moduleFormData.videos.map((video) => (
                            <div key={video.id} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Video className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h6 className="text-lg font-semibold text-slate-900 mb-1">{video.name}</h6>
                                  <p className="text-sm text-slate-500 mb-2">
                                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                      Video File
                                    </span>
                                    <span className="text-xs text-slate-500 bg-purple-100 px-3 py-1 rounded-full">
                                      Ready to use
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeVideo(video.id)}
                                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Content Management Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Content Management</h4>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 mb-6 bg-white rounded-xl p-1 shadow-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('basic')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'basic'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Basic Info</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('lessons')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'lessons'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>Lessons ({moduleFormData.lessons.length})</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModuleTab('quizzes')}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          activeModuleTab === 'quizzes'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>Quiz</span>
                        </div>
                      </button>
                    </div>

                    {/* Tab Content */}
                    {activeModuleTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Lessons</h5>
                          <button
                            type="button"
                            onClick={openAddLessonModal}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {moduleFormData.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <span className="text-lg font-semibold text-slate-900">{lesson.title}</span>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lesson.content}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditLessonModal(lesson)}
                                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                    title="Edit Lesson"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeModuleTab === 'quizzes' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Quiz</h5>
                          <button
                            type="button"
                            onClick={openAddQuizModal}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quiz
                          </button>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-slate-900 mb-2">
                                {moduleFormData.quiz.title || 'No quiz added'}
                              </div>
                              {moduleFormData.quiz.questions && moduleFormData.quiz.questions.length > 0 && (
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-slate-500 bg-blue-100 px-3 py-1 rounded-full">
                                    {moduleFormData.quiz.questions.length} questions
                                  </div>
                                  <div className="text-sm text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                                    Ready to use
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Quiz Action Buttons */}
                            {moduleFormData.quiz.title && (
                              <div className="flex items-center space-x-2 ml-4">
                                <button
                                  type="button"
                                  onClick={() => openEditQuizModal(moduleFormData.quiz)}
                                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                  title="Edit Quiz"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this quiz?')) {
                                      setModuleFormData(prev => ({
                                        ...prev,
                                        quiz: { title: '', questions: [], images: [] }
                                      }))
                                      toast.success('Quiz deleted successfully!')
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                  title="Delete Quiz"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModuleModal(false)
                        setEditingModule(null)
                        resetModuleForm()
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Update Module
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Lesson Modal */}
        {(showAddLessonModal || showEditLessonModal) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {showEditLessonModal ? 'Edit Lesson' : 'Add New Lesson'}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {showEditLessonModal ? 'Update lesson information and media' : 'Create a new lesson with content and media'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddLessonModal(false)
                      setShowEditLessonModal(false)
                      setEditingLesson(null)
                      setLessonFormData({
                        title: '',
                        content: '',
                        points: [''],
                        images: [],
                        videos: []
                      })
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={showEditLessonModal ? handleEditLesson : handleAddLesson} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Lesson Information</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                        <input
                          type="text"
                          value={lessonFormData.title}
                          onChange={(e) => setLessonFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter lesson title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Content</label>
                        <textarea
                          value={lessonFormData.content}
                          onChange={(e) => setLessonFormData(prev => ({ ...prev, content: e.target.value }))}
                          rows="4"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter lesson content"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lesson Media - Images */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                        <FileImage className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Lesson Images</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center bg-white/50">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                            <FileImage className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Lesson Images</h5>
                            <p className="text-slate-600">Add images to make the lesson more engaging and visual</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                Array.from(e.target.files).forEach(file => {
                                  handleLessonImageUpload(file)
                                })
                              }}
                              className="hidden"
                              id="lesson-image-upload"
                              disabled={uploading}
                            />
                            <label
                              htmlFor="lesson-image-upload"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Images'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Display Uploaded Images */}
                      {lessonFormData.images.length > 0 && (
                        <div className="space-y-4">
                          {lessonFormData.images.map((image) => (
                            <div key={image.id} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <FileImage className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h6 className="text-lg font-semibold text-slate-900 mb-1">{image.name}</h6>
                                  <p className="text-sm text-slate-500 mb-2">
                                    {(image.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                      Image File
                                    </span>
                                    <span className="text-xs text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                                      Ready to use
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeLessonImage(image.id)}
                                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lesson Media - Videos */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Lesson Videos</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-white/50">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                            <Video className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h5 className="text-lg font-semibold text-slate-900 mb-2">Upload Lesson Videos</h5>
                            <p className="text-slate-600">Add videos to enhance the learning experience</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="video/*"
                              multiple
                              onChange={(e) => {
                                Array.from(e.target.files).forEach(file => {
                                  handleLessonVideoUpload(file)
                                })
                              }}
                              className="hidden"
                              id="lesson-video-upload"
                              disabled={uploading}
                            />
                            <label
                              htmlFor="lesson-video-upload"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Videos'}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Display Uploaded Videos */}
                      {lessonFormData.videos.length > 0 && (
                        <div className="space-y-4">
                          {lessonFormData.videos.map((video) => (
                            <div key={video.id} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                                    <Video className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h6 className="text-lg font-semibold text-slate-900 mb-1">{video.name}</h6>
                                  <p className="text-sm text-slate-500 mb-2">
                                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                      Video File
                                    </span>
                                    <span className="text-xs text-slate-500 bg-purple-100 px-3 py-1 rounded-full">
                                      Ready to use
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeLessonVideo(video.id)}
                                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddLessonModal(false)
                        setShowEditLessonModal(false)
                        setEditingLesson(null)
                        setLessonFormData({
                          title: '',
                          content: '',
                          points: [''],
                          images: [],
                          videos: []
                        })
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {showEditLessonModal ? 'Update Lesson' : 'Add Lesson'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Quiz Modal */}
        {(showAddQuizModal || showEditQuizModal) && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {showEditQuizModal ? 'Edit Quiz' : 'Add New Quiz'}
                      </h3>
                      <p className="text-slate-600 mt-1">
                        {showEditQuizModal ? 'Update quiz information and media' : 'Create a new quiz with questions and media'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddQuizModal(false)
                      setShowEditQuizModal(false)
                      setEditingQuiz(null)
                      setQuizFormData({
                        title: '',
                        questions: [],
                        images: []
                      })
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={showEditQuizModal ? handleEditQuiz : handleAddQuiz} className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                    <h4 className="text-xl font-bold text-slate-900 mb-6">Quiz Information</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                        <input
                          type="text"
                          value={quizFormData.title}
                          onChange={(e) => setQuizFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter quiz title"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quiz Images by Question */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                        <FileImage className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Quiz Images by Question</h4>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Question Number Selection and Upload */}
                      <div className="bg-white rounded-2xl p-6 border border-slate-200">
                        <h5 className="text-lg font-semibold text-slate-900 mb-4">Add Image to Question</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Question Number</label>
                            <select
                              id="question-number-select"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">Choose question number...</option>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>Question {num}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="flex items-end">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const questionNumber = document.getElementById('question-number-select').value
                                if (!questionNumber) {
                                  toast.error('Please select a question number first!')
                                  return
                                }
                                if (e.target.files[0]) {
                                  handleQuizImageUpload(e.target.files[0], parseInt(questionNumber))
                                  e.target.value = '' // Reset file input
                                }
                              }}
                              className="hidden"
                              id="quiz-image-upload"
                              disabled={uploading}
                            />
                            <label
                              htmlFor="quiz-image-upload"
                              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 cursor-pointer disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                            >
                              <Upload className="h-5 w-5 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose Image'}
                            </label>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h6 className="text-sm font-medium text-blue-800">How to add images:</h6>
                              <p className="text-sm text-blue-700 mt-1">
                                1. Select the question number you want to add an image to<br/>
                                2. Click "Choose Image" to select an image file<br/>
                                3. The image will be associated with that specific question
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display Uploaded Images by Question */}
                      {quizFormData.images.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-lg font-semibold text-slate-900">Uploaded Images</h5>
                          {quizFormData.images.map((image) => (
                            <div key={image.id} className="relative group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                    <FileImage className="h-8 w-8 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h6 className="text-lg font-semibold text-slate-900">{image.name}</h6>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Question {image.questionNumber}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-2">
                                    {(image.size / (1024 * 1024)).toFixed(2)} MB
                                  </p>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                      Image File
                                    </span>
                                    <span className="text-xs text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                                      Ready to use
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeQuizImage(image.id)}
                                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddQuizModal(false)
                        setShowEditQuizModal(false)
                        setEditingQuiz(null)
                        setQuizFormData({
                          title: '',
                          questions: [],
                          images: [],
                          videos: []
                        })
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      {showEditQuizModal ? 'Update Quiz' : 'Add Quiz'}
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
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        setEditingModule(selectedModule)
                        setModuleFormData({
                          title: selectedModule.title,
                          description: selectedModule.description,
                          estimatedTime: selectedModule.estimatedTime,
                          difficulty: selectedModule.difficulty,
                          lessons: selectedModule.lessons,
                          quiz: selectedModule.quiz,
                          images: selectedModule.images || [],
                          videos: selectedModule.videos || []
                        })
                        setShowModuleDetails(false)
                        setShowEditModuleModal(true)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Module
                    </button>
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

