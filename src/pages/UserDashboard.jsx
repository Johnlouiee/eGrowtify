import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Leaf, BarChart3, Camera, Settings, Plus, Bell, Calendar, 
  BookOpen, TrendingUp, Users, Star, MapPin, Droplets, 
  Scissors, Sun, Thermometer, AlertCircle, CheckCircle,
  Play, Award, Target, Clock, Heart, Zap, Lock, Crown, User
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import WeatherCard from '../components/WeatherCard'
import { getLearningPathModules, getModuleData } from '../utils/learningPathData'

const UserDashboard = () => {
  const { user, isPremium, refreshAuthStatus, updateProfile } = useAuth()
  const [lastAuthRefresh, setLastAuthRefresh] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [plants, setPlants] = useState([])
  const [gardens, setGardens] = useState([])
  const [learningProgress, setLearningProgress] = useState({})
  const [seasonalTips, setSeasonalTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState({})
  
  // Store actual modules from backend (same as learning path pages use)
  const [actualModules, setActualModules] = useState({
    Beginner: [],
    Intermediate: [],
    Expert: []
  })
  
  // Get learning paths data from centralized source (fallback)
  const allModules = getLearningPathModules()
  
  // Track which learning paths are active
  const [pathStatus, setPathStatus] = useState({
    beginner: true,
    intermediate: true,
    expert: true
  })

  // Skill level onboarding modal
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [savingSkill, setSavingSkill] = useState(false)
  
  // Crop interest selection modal
  const [showCropModal, setShowCropModal] = useState(false)
  const [savingCrop, setSavingCrop] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState('')

  // learning_level is purely informational now; do not default it here
  const userLearningLevel = user && user.learning_level

  // Learning paths data with access control - using centralized data
  const learningPaths = [
    {
      id: 'beginner',
      title: 'Beginner Gardener',
      description: 'Start your gardening journey with the basics',
      icon: Play,
      color: 'bg-green-500',
      progress: learningProgress.beginner || 0,
      modules: allModules.Beginner.map(module => module.title),
      isAccessible: pathStatus.beginner, // Check if path is active
      isLocked: false,
      isActive: pathStatus.beginner
    },
    {
      id: 'intermediate',
      title: 'Intermediate Gardener',
      description: 'Expand your knowledge and skills',
      icon: TrendingUp,
      color: 'bg-blue-500',
      progress: learningProgress.intermediate || 0,
      modules: allModules.Intermediate.map(module => module.title),
      // Access is based only on progress/subscription; gardener type is informational
      isAccessible: pathStatus.intermediate && (isPremium || (learningProgress.beginner >= 100)),
      isLocked: !isPremium && (learningProgress.beginner < 100),
      isActive: pathStatus.intermediate
    },
    {
      id: 'expert',
      title: 'Expert Gardener',
      description: 'Master advanced gardening techniques',
      icon: Award,
      color: 'bg-purple-500',
      progress: learningProgress.expert || 0,
      modules: allModules.Expert.map(module => module.title),
      isAccessible: pathStatus.expert && (isPremium || (learningProgress.intermediate >= 100)), // Accessible if active AND (premium OR intermediate completed)
      isLocked: !isPremium && (learningProgress.intermediate < 100),
      isActive: pathStatus.expert
    }
  ]

  const quickActions = [
    {
      title: 'AI Plant Recognition',
      description: 'Identify plants and analyze soil',
      icon: Camera,
      path: '/ai-recognition',
      color: 'bg-purple-500'
    },
    {
      title: 'Photo Capture',
      description: 'Open AI camera to scan plants & soil',
      icon: Leaf,
      path: '/ai-recognition',
      color: 'bg-green-500'
    },
    {
      title: 'Smart Alerts',
      description: 'View care reminders and notifications',
      icon: Bell,
      path: '/smart-alerts',
      color: 'bg-blue-500'
    },
    {
      title: 'Seasonal Planning',
      description: 'Plan your garden year-round',
      icon: Calendar,
      path: '/seasonal-planning',
      color: 'bg-orange-500'
    }
  ]

  // Create user-specific localStorage keys
  const getStorageKey = (key) => {
    if (!user) return key // Fallback for non-authenticated users
    return `${key}_user_${user.id}`
  }

  const clearOldProgressData = () => {
    console.log('🧹 DASHBOARD: FORCE CLEARING ALL LEARNING PATH DATA...')
    
    // Clear all possible localStorage keys that might contain progress data
    const oldKeys = [
      'beginnerProgress',
      'intermediateProgress', 
      'expertProgress',
      'learningProgress',
      'userProgress',
      'moduleProgress',
      'completedModules',
      'quizAnswers',
      'currentLesson',
      'showQuiz',
      'showQuizResults',
      'quizScore'
    ]
    
    // Clear known keys
    oldKeys.forEach(key => {
      localStorage.removeItem(key)
      console.log(`✅ Dashboard cleared: ${key}`)
    })
    
    // FORCE CLEAR ALL learning path related keys (more aggressive approach)
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.includes('beginnerProgress') || 
        key.includes('intermediateProgress') || 
        key.includes('expertProgress') ||
        key.includes('learningProgress') ||
        key.includes('userProgress') ||
        key.includes('moduleProgress') ||
        key.includes('completedModules') ||
        key.includes('quiz') ||
        key.includes('lesson') ||
        key.includes('_user_')
      )) {
        keysToRemove.push(key)
      }
    }
    
    // Remove all identified keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log(`✅ Dashboard FORCE CLEARED: ${key}`)
    })
    
    console.log(`🎉 Dashboard FORCE CLEARED ${keysToRemove.length} learning path keys`)
  }

  // Show skill-level modal until the user chooses a level
  useEffect(() => {
    if (!user) return

    try {
      const key = `skillLevelCompleted_user_${user.id}`
      const completed = localStorage.getItem(key)

      // If backend already has a learning_level, assume they chose before and mark completed
      if (user.learning_level) {
        if (!completed) {
          localStorage.setItem(key, 'completed')
        }
        setShowSkillModal(false)
        return
      }

      // No learning_level yet → only show if they haven't completed onboarding locally
      if (!completed) {
        setShowSkillModal(true)
      } else {
        setShowSkillModal(false)
      }
    } catch {
      // If localStorage fails, just always show for users without a stored completion flag
      setShowSkillModal(true)
    }
  }, [user])

  const handleSkillChoice = async (level) => {
    if (!user) return
    setSavingSkill(true)
    try {
      const normalized = level === 'experienced' ? 'experienced' : 'beginner'
      // Persist the choice, but it should not gate learning paths anymore
      await updateProfile({ learning_level: normalized })
      try {
        const key = `skillLevelCompleted_user_${user.id}`
        localStorage.setItem(key, 'completed')
      } catch {}
      setShowSkillModal(false)
      // After skill level is set, check if crop interest needs to be set
      if (!user.primary_crop_focus) {
        setTimeout(() => setShowCropModal(true), 300)
      }
    } catch (e) {
      console.error('Error updating learning level', e)
    } finally {
      setSavingSkill(false)
    }
  }

  // Show crop interest modal after skill level is set (or if already set but crop isn't)
  useEffect(() => {
    if (!user) return
    if (showSkillModal) {
      setShowCropModal(false) // Don't show crop modal while skill modal is showing
      return
    }

    try {
      const cropKey = `cropInterestCompleted_user_${user.id}`
      const cropCompleted = localStorage.getItem(cropKey)

      // If backend already has primary_crop_focus, mark as completed
      if (user.primary_crop_focus) {
        if (!cropCompleted) {
          localStorage.setItem(cropKey, 'completed')
        }
        setShowCropModal(false)
        return
      }

      // No crop focus yet → only show if they haven't completed onboarding locally
      // Also check if skill level is set (either in backend or localStorage)
      const skillKey = `skillLevelCompleted_user_${user.id}`
      const skillCompleted = localStorage.getItem(skillKey) || user.learning_level
      
      if (!cropCompleted && skillCompleted) {
        setShowCropModal(true)
      } else {
        setShowCropModal(false)
      }
    } catch {
      // If localStorage fails, check backend
      if (!user.primary_crop_focus && user.learning_level) {
        setShowCropModal(true)
      } else {
        setShowCropModal(false)
      }
    }
  }, [user, showSkillModal])

  const handleCropChoice = async (cropType) => {
    if (!user) return
    setSavingCrop(true)
    try {
      await updateProfile({ primary_crop_focus: cropType })
      try {
        const key = `cropInterestCompleted_user_${user.id}`
        localStorage.setItem(key, 'completed')
      } catch {}
      setShowCropModal(false)
      toast.success(`Your focus is set to ${cropType}!`)
    } catch (e) {
      console.error('Error updating crop focus', e)
      toast.error('Failed to save crop interest')
    } finally {
      setSavingCrop(false)
    }
  }

  // Fetch actual modules from backend API (same as learning path pages)
  // Also check if paths are active
  useEffect(() => {
    const loadModules = async () => {
      const difficulties = ['Beginner', 'Intermediate', 'Expert']
      const loadedModules = { Beginner: [], Intermediate: [], Expert: [] }
      const pathStatuses = { beginner: true, intermediate: true, expert: true }
      
      for (const difficulty of difficulties) {
        try {
          const response = await axios.get(`/api/learning-paths/${difficulty}`)
          
          // Check if path is deactivated (error response)
          if (response.data && response.data.error && response.data.is_active === false) {
            const pathKey = difficulty.toLowerCase()
            pathStatuses[pathKey] = false
            console.log(`${difficulty} learning path is deactivated`)
            continue // Skip loading modules for deactivated paths
          }
          
          // Check if response is an array (valid modules)
          if (Array.isArray(response.data) && response.data.length > 0) {
            // Use backend data
            const backendModules = response.data.map(module => {
              // Ensure quizzes is properly formatted as an array
              let quizzes = module.quizzes
              if (quizzes && typeof quizzes === 'string') {
                try {
                  quizzes = JSON.parse(quizzes)
                } catch (e) {
                  console.error('Error parsing quizzes:', e)
                  quizzes = []
                }
              }
              // If quizzes is not an array, try to use quiz as fallback
              if (!Array.isArray(quizzes)) {
                if (module.quiz) {
                  quizzes = Array.isArray(module.quiz) ? module.quiz : [module.quiz]
                } else {
                  quizzes = []
                }
              }
              return {
                ...module,
                quizzes: quizzes
              }
            })
            loadedModules[difficulty] = backendModules
          } else {
            // Fallback to static data
            loadedModules[difficulty] = getModuleData(difficulty)
          }
        } catch (error) {
          // Check if path is deactivated (403 error)
          if (error.response && error.response.status === 403) {
            const pathKey = difficulty.toLowerCase()
            pathStatuses[pathKey] = false
            console.log(`${difficulty} learning path is deactivated`)
            continue
          }
          
          console.error(`Error loading ${difficulty} modules from backend:`, error)
          // Fallback to static data
          loadedModules[difficulty] = getModuleData(difficulty)
        }
      }
      
      setActualModules(loadedModules)
      setPathStatus(pathStatuses)
    }
    
    loadModules()
  }, [user?.primary_crop_focus]) // Reload modules when crop interest changes
  
  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/notifications')
        setNotifications(response.data || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }
    
    if (user) {
      fetchNotifications()
    }
  }, [user])

  useEffect(() => {
    if (!user) return // Don't run if user is not available
    
    // Load learning progress from localStorage
    const loadLearningProgress = () => {
      const calculateProgress = () => {
        const beginnerKey = getStorageKey('beginnerProgress')
        const intermediateKey = getStorageKey('intermediateProgress')
        const expertKey = getStorageKey('expertProgress')
        
        const beginnerData = localStorage.getItem(beginnerKey)
        const intermediateData = localStorage.getItem(intermediateKey)
        const expertData = localStorage.getItem(expertKey)
        
        let beginnerProgress = 0
        let intermediateProgress = 0
        let expertProgress = 0
        
        // Helper function to check if a module is completed
        // A module is completed if:
        // 1. It has quizzes AND all quizzes are completed, OR
        // 2. It has no quizzes AND it's in the completedModules array
        const isModuleCompleted = (module, quizAttempts, completedModules) => {
          if (!module) return false
          const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
          
          // If module has no quizzes, check if it's in completedModules
          if (quizzes.length === 0) {
            return completedModules.includes(module.id)
          }
          
          // If module has quizzes, all must be completed
          return quizzes.every(quiz => {
            const quizKey = `${module.id}_${quiz.title}`
            return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
          })
        }
        
        if (beginnerData) {
          try {
            const parsed = JSON.parse(beginnerData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Beginner.length > 0 ? actualModules.Beginner : allModules.Beginner
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            beginnerProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing beginner progress:', error)
          }
        }
        
        if (intermediateData) {
          try {
            const parsed = JSON.parse(intermediateData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Intermediate.length > 0 ? actualModules.Intermediate : allModules.Intermediate
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            intermediateProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing intermediate progress:', error)
          }
        }
        
        if (expertData) {
          try {
            const parsed = JSON.parse(expertData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Expert.length > 0 ? actualModules.Expert : allModules.Expert
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            expertProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing expert progress:', error)
          }
        }
        
        return {
          beginner: beginnerProgress,
          intermediate: intermediateProgress,
          expert: expertProgress
        }
      }
      
      const progress = calculateProgress()
      setLearningProgress(progress)
    }

    loadLearningProgress()
    fetchDashboardData()
    
    // Only refresh auth status if not done recently
    const now = Date.now()
    if (now - lastAuthRefresh > 5000) { // 5 seconds minimum between refreshes
      refreshAuthStatus() // Refresh subscription status
      setLastAuthRefresh(now)
    }
  }, [user, actualModules]) // Re-run when user changes or modules are loaded

  // Listen for localStorage changes to update learning progress
  useEffect(() => {
    const updateLearningProgress = () => {
      const calculateProgress = () => {
        const beginnerKey = getStorageKey('beginnerProgress')
        const intermediateKey = getStorageKey('intermediateProgress')
        const expertKey = getStorageKey('expertProgress')
        
        const beginnerData = localStorage.getItem(beginnerKey)
        const intermediateData = localStorage.getItem(intermediateKey)
        const expertData = localStorage.getItem(expertKey)
        
        let beginnerProgress = 0
        let intermediateProgress = 0
        let expertProgress = 0
        
        // Helper function to check if a module is completed
        // A module is completed if:
        // 1. It has quizzes AND all quizzes are completed, OR
        // 2. It has no quizzes AND it's in the completedModules array
        const isModuleCompleted = (module, quizAttempts, completedModules) => {
          if (!module) return false
          const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
          
          // If module has no quizzes, check if it's in completedModules
          if (quizzes.length === 0) {
            return completedModules.includes(module.id)
          }
          
          // If module has quizzes, all must be completed
          return quizzes.every(quiz => {
            const quizKey = `${module.id}_${quiz.title}`
            return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
          })
        }
        
        if (beginnerData) {
          try {
            const parsed = JSON.parse(beginnerData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Beginner.length > 0 ? actualModules.Beginner : allModules.Beginner
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            beginnerProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing beginner progress:', error)
          }
        }
        
        if (intermediateData) {
          try {
            const parsed = JSON.parse(intermediateData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Intermediate.length > 0 ? actualModules.Intermediate : allModules.Intermediate
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            intermediateProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing intermediate progress:', error)
          }
        }
        
        if (expertData) {
          try {
            const parsed = JSON.parse(expertData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Expert.length > 0 ? actualModules.Expert : allModules.Expert
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            expertProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing expert progress:', error)
          }
        }
        
        return {
          beginner: beginnerProgress,
          intermediate: intermediateProgress,
          expert: expertProgress
        }
      }
      
      const progress = calculateProgress()
      setLearningProgress(progress)
    }

    // Update progress when component mounts or when localStorage changes
    updateLearningProgress()
    
    // Listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', updateLearningProgress)
    
    // Also update when the page becomes visible (user comes back from learning path)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateLearningProgress()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('storage', updateLearningProgress)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user, actualModules]) // Re-run when user changes or modules are loaded

  const handleLearningPathClick = (path) => {
    // Check if path is active first
    if (!path.isActive) {
      toast.error('This learning path has been deactivated and is currently unavailable.')
      return
    }
    
    if (!path.isAccessible) {
      if (path.isLocked) {
        toast.error('Complete the previous level or upgrade to Premium to access this learning path!')
      } else {
        toast.error('This learning path is not available!')
      }
      return
    }

    // Navigate to learning path content
    if (path.id === 'beginner') {
      window.location.href = '/learning/beginner'
      return
    }
    if (path.id === 'intermediate' && path.isAccessible) {
      window.location.href = '/learning/intermediate'
      return
    }
    if (path.id === 'expert' && path.isAccessible) {
      window.location.href = '/learning/expert'
      return
    }
    toast.success(`Starting ${path.title} learning path!`)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch notifications (handle errors gracefully)
      try {
        const notificationsResponse = await axios.get('/notifications')
        if (notificationsResponse.data && Array.isArray(notificationsResponse.data)) {
          setNotifications(notificationsResponse.data)
        } else if (notificationsResponse.data) {
          setNotifications([notificationsResponse.data])
        }
      } catch (notifError) {
        // Silently handle notifications errors - endpoint may not be fully implemented
        console.log('Notifications endpoint not available, using empty array')
        setNotifications([])
      }
      
      // Fetch plants and gardens
      try {
        const gardenResponse = await axios.get('/garden')
        setPlants(gardenResponse.data.plants || [])
        setGardens(gardenResponse.data.gardens || [])
      } catch (gardenError) {
        console.log('Garden data not available')
        setPlants([])
        setGardens([])
      }
      
      // Calculate learning progress from localStorage
      const calculateProgress = () => {
        const beginnerKey = getStorageKey('beginnerProgress')
        const intermediateKey = getStorageKey('intermediateProgress')
        const expertKey = getStorageKey('expertProgress')
        
        const beginnerData = localStorage.getItem(beginnerKey)
        const intermediateData = localStorage.getItem(intermediateKey)
        const expertData = localStorage.getItem(expertKey)
        
        let beginnerProgress = 0
        let intermediateProgress = 0
        let expertProgress = 0
        
        // Helper function to check if a module is completed
        // A module is completed if:
        // 1. It has quizzes AND all quizzes are completed, OR
        // 2. It has no quizzes AND it's in the completedModules array
        const isModuleCompleted = (module, quizAttempts, completedModules) => {
          if (!module) return false
          const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
          
          // If module has no quizzes, check if it's in completedModules
          if (quizzes.length === 0) {
            return completedModules.includes(module.id)
          }
          
          // If module has quizzes, all must be completed
          return quizzes.every(quiz => {
            const quizKey = `${module.id}_${quiz.title}`
            return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
          })
        }
        
        if (beginnerData) {
          try {
            const parsed = JSON.parse(beginnerData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Beginner.length > 0 ? actualModules.Beginner : allModules.Beginner
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            beginnerProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing beginner progress:', error)
          }
        }
        
        if (intermediateData) {
          try {
            const parsed = JSON.parse(intermediateData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Intermediate.length > 0 ? actualModules.Intermediate : allModules.Intermediate
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            intermediateProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing intermediate progress:', error)
          }
        }
        
        if (expertData) {
          try {
            const parsed = JSON.parse(expertData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Expert.length > 0 ? actualModules.Expert : allModules.Expert
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            expertProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing expert progress:', error)
          }
        }
        
        return {
          beginner: beginnerProgress,
          intermediate: intermediateProgress,
          expert: expertProgress
        }
      }
      
      const progress = calculateProgress()
      setLearningProgress(progress)
      
      // Fetch seasonal tips (using seasonal-planning endpoint)
      try {
        const tipsResponse = await axios.get('/seasonal-planning')
        if (tipsResponse.data?.tips) {
          const currentSeason = tipsResponse.data.current_season
          const seasonTips = tipsResponse.data.tips[currentSeason] || []
          setSeasonalTips(seasonTips.map((tip, index) => ({
            id: index + 1,
            title: `${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} Tip`,
            description: tip,
            icon: Sun
          })))
        } else {
          // Set fallback data if response doesn't have tips
          setSeasonalTips([
            { id: 1, title: 'Spring Planting Tips', description: 'Best time to start your vegetable garden', icon: Sun },
            { id: 2, title: 'Watering Schedule', description: 'Adjust watering frequency for warmer weather', icon: Droplets },
            { id: 3, title: 'Pest Prevention', description: 'Natural ways to keep pests away', icon: AlertCircle }
          ])
        }
      } catch (tipsError) {
        // Silently fall back to mock data if endpoint doesn't exist
        console.log('Seasonal tips endpoint not available, using fallback data')
        setSeasonalTips([
          { id: 1, title: 'Spring Planting Tips', description: 'Best time to start your vegetable garden', icon: Sun },
          { id: 2, title: 'Watering Schedule', description: 'Adjust watering frequency for warmer weather', icon: Droplets },
          { id: 3, title: 'Pest Prevention', description: 'Natural ways to keep pests away', icon: AlertCircle }
        ])
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set mock data for demonstration
      setNotifications([
        { id: 1, message: 'Time to water your tomato plants', type: 'watering', urgent: true },
        { id: 2, message: 'Your basil needs fertilizer', type: 'fertilizing', urgent: false },
        { id: 3, message: 'New seasonal tip available!', type: 'tip', urgent: false }
      ])
      setSeasonalTips([
        { id: 1, title: 'Spring Planting Tips', description: 'Best time to start your vegetable garden', icon: Sun },
        { id: 2, title: 'Watering Schedule', description: 'Adjust watering frequency for warmer weather', icon: Droplets },
        { id: 3, title: 'Pest Prevention', description: 'Natural ways to keep pests away', icon: AlertCircle }
      ])
      
      // Calculate learning progress from localStorage even if API fails
      const calculateProgress = () => {
        const beginnerKey = getStorageKey('beginnerProgress')
        const intermediateKey = getStorageKey('intermediateProgress')
        const expertKey = getStorageKey('expertProgress')
        
        const beginnerData = localStorage.getItem(beginnerKey)
        const intermediateData = localStorage.getItem(intermediateKey)
        const expertData = localStorage.getItem(expertKey)
        
        let beginnerProgress = 0
        let intermediateProgress = 0
        let expertProgress = 0
        
        // Helper function to check if a module is completed
        // A module is completed if:
        // 1. It has quizzes AND all quizzes are completed, OR
        // 2. It has no quizzes AND it's in the completedModules array
        const isModuleCompleted = (module, quizAttempts, completedModules) => {
          if (!module) return false
          const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
          
          // If module has no quizzes, check if it's in completedModules
          if (quizzes.length === 0) {
            return completedModules.includes(module.id)
          }
          
          // If module has quizzes, all must be completed
          return quizzes.every(quiz => {
            const quizKey = `${module.id}_${quiz.title}`
            return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
          })
        }
        
        if (beginnerData) {
          try {
            const parsed = JSON.parse(beginnerData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Beginner.length > 0 ? actualModules.Beginner : allModules.Beginner
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            beginnerProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing beginner progress:', error)
          }
        }
        
        if (intermediateData) {
          try {
            const parsed = JSON.parse(intermediateData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Intermediate.length > 0 ? actualModules.Intermediate : allModules.Intermediate
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            intermediateProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing intermediate progress:', error)
          }
        }
        
        if (expertData) {
          try {
            const parsed = JSON.parse(expertData)
            // Use actual modules from backend, fallback to static if not loaded yet
            const modulesToCheck = actualModules.Expert.length > 0 ? actualModules.Expert : allModules.Expert
            const totalModules = parsed.totalModules || modulesToCheck.length
            const quizAttempts = parsed.quizAttempts || {}
            const completedModules = parsed.completedModules || []
            
            // Count actually completed modules
            const actuallyCompleted = modulesToCheck.filter(module => 
              isModuleCompleted(module, quizAttempts, completedModules)
            ).length
            
            expertProgress = totalModules > 0 ? Math.round((actuallyCompleted / totalModules) * 100) : 0
          } catch (error) {
            console.error('Error parsing expert progress:', error)
          }
        }
        
        return {
          beginner: beginnerProgress,
          intermediate: intermediateProgress,
          expert: expertProgress
        }
      }
      
      const progress = calculateProgress()
      setLearningProgress(progress)
    } finally {
      setLoading(false)
    }
  }

  const getUrgentNotifications = () => {
    return notifications.filter(n => n.urgent).length
  }

  const getProfilePhoto = () => {
    try {
      return localStorage.getItem('profilePhotoPath') || null
    } catch {
      return null
    }
  }

  const getTotalPlants = () => {
    return plants.length
  }

  const getHealthyPlants = () => {
    return plants.filter(p => p.health_status === 'healthy').length
  }

  const getNeedsAttention = () => {
    return plants.filter(p => p.health_status === 'needs_attention').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Skill Level Onboarding Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
            <button
              onClick={() => setShowSkillModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip for now
            </button>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">What kind of gardener are you?</h2>
                <p className="text-sm text-gray-600 mt-1">
                  This helps us personalize your learning path, tips, and recommendations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                onClick={() => handleSkillChoice('beginner')}
                disabled={savingSkill}
                className="border border-gray-200 rounded-xl p-4 text-left hover:border-green-400 hover:shadow-md transition-all disabled:opacity-60"
              >
                <h3 className="font-semibold text-gray-900 mb-1">New to gardening</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Start with the basics, step-by-step guides, and beginner-friendly plants.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Beginner learning path highlighted</li>
                  <li>Simpler recommendations and explanations</li>
                  <li>More guidance and reminders</li>
                </ul>
              </button>

              <button
                type="button"
                onClick={() => handleSkillChoice('experienced')}
                disabled={savingSkill}
                className="border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all disabled:opacity-60"
              >
                <h3 className="font-semibold text-gray-900 mb-1">Have experience</h3>
                <p className="text-xs text-gray-600 mb-2">
                  Skip the basics and unlock more advanced content and controls.
                </p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>Intermediate path available immediately</li>
                  <li>More detailed, technical recommendations</li>
                  <li>Less hand-holding, more optimization tips</li>
                </ul>
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-4">
              You can change this later in your profile settings if you pick the wrong option.
            </p>
          </div>
        </div>
      )}

      {/* Crop Interest Selection Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative">
            <button
              onClick={() => {
                try {
                  const key = `cropInterestCompleted_user_${user.id}`
                  localStorage.setItem(key, 'skipped')
                } catch {}
                setShowCropModal(false)
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip for now
            </button>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">What primary type of plant are you most interested in growing right now?</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Please select only one. This helps personalize your learning content and recommendations.
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {['Fruits', 'Vegetables', 'Flowers', 'Herbs'].map((cropType) => {
                const icons = {
                  Fruits: '🍎',
                  Vegetables: '🥬',
                  Flowers: '🌸',
                  Herbs: '🌿'
                }
                const colors = {
                  Fruits: 'border-red-200 hover:border-red-400',
                  Vegetables: 'border-green-200 hover:border-green-400',
                  Flowers: 'border-pink-200 hover:border-pink-400',
                  Herbs: 'border-purple-200 hover:border-purple-400'
                }
                return (
                  <label
                    key={cropType}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedCrop === cropType
                        ? `${colors[cropType]} bg-opacity-10`
                        : 'border-gray-200 hover:border-gray-300'
                    } ${savingCrop ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="cropInterest"
                      value={cropType}
                      checked={selectedCrop === cropType}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      disabled={savingCrop}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-2xl">{icons[cropType]}</span>
                    <span className="font-semibold text-gray-900 flex-1">{cropType}</span>
                  </label>
                )
              })}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={handleCropChoice.bind(null, selectedCrop)}
                disabled={!selectedCrop || savingCrop}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingCrop ? 'Saving...' : 'Continue'}
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const key = `cropInterestCompleted_user_${user.id}`
                    localStorage.setItem(key, 'skipped')
                  } catch {}
                  setShowCropModal(false)
                }}
                className="btn-secondary"
                disabled={savingCrop}
              >
                Skip
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-4">
              You can change this later in your profile settings.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header with Notifications */}
        <div className="flex justify-between items-start mb-8">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your garden today.
          </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {getProfilePhoto() ? (
                <img src={`/${getProfilePhoto()}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-gray-500" />
              )}
            </div>
            <Link
              to="/profile"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Admin Notifications/Announcements */}
        {notifications.length > 0 && (
          <div className="mb-8 space-y-3">
            {notifications.map((notification) => {
              const getPriorityColor = (priority) => {
                switch (priority) {
                  case 'High': return 'border-red-500 bg-red-50'
                  case 'Medium': return 'border-yellow-500 bg-yellow-50'
                  case 'Low': return 'border-blue-500 bg-blue-50'
                  default: return 'border-gray-500 bg-gray-50'
                }
              }

              const getTypeIcon = (type) => {
                switch (type) {
                  case 'Maintenance': return AlertCircle
                  case 'Update': return Bell
                  case 'Feature': return Zap
                  case 'System': return Settings
                  default: return Bell
                }
              }

              const IconComponent = getTypeIcon(notification.type)

              return (
                <div
                  key={notification.id}
                  className={`border-l-4 rounded-lg p-4 shadow-sm ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${
                        notification.priority === 'High' ? 'bg-red-100' :
                        notification.priority === 'Medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          notification.priority === 'High' ? 'text-red-600' :
                          notification.priority === 'Medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          notification.priority === 'High' ? 'bg-red-200 text-red-800' :
                          notification.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Learning Paths */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Choose your journey</span>
                  <button
                    onClick={() => {
                      clearOldProgressData()
                      setLearningProgress({ beginner: 0, intermediate: 0, expert: 0 })
                      toast.success('All learning progress reset to 0%!')
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                    title="Reset all learning progress to 0%"
                  >
                    Reset All Progress
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.filter(path => path.isActive).map((path) => {
                  const IconComponent = path.icon
                  return (
                    <div 
                      key={path.id} 
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                        path.isAccessible 
                          ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-primary-300 hover:shadow-xl cursor-pointer' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 cursor-not-allowed opacity-75'
                      }`}
                      onClick={() => handleLearningPathClick(path)}
                    >
                      {/* Lock overlay for locked paths */}
                      {!path.isAccessible && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
                          <div className="bg-white rounded-full p-3 shadow-lg">
                            <Lock className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                      )}
                      
                      {/* Premium badge for locked paths */}
                      {path.isLocked && (
                        <div className="absolute top-3 right-3 z-20">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Crown className="h-3 w-3" />
                            <span>Premium</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 ${path.color} text-white rounded-xl shadow-lg ${!path.isAccessible ? 'opacity-60' : ''}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${path.isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                              {path.progress}%
                            </div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                </div>
                        <h3 className={`text-lg font-bold mb-2 transition-colors ${
                          path.isAccessible 
                            ? 'text-gray-900 group-hover:text-primary-600' 
                            : 'text-gray-500'
                        }`}>
                          {path.title}
                </h3>
                        <p className={`text-sm mb-4 ${path.isAccessible ? 'text-gray-600' : 'text-gray-500'}`}>
                          {path.description}
                        </p>
                        
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={path.isAccessible ? 'text-gray-700' : 'text-gray-500'}>Progress</span>
                            <span className={path.isAccessible ? 'text-gray-700' : 'text-gray-500'}>{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 ${path.color} rounded-full transition-all duration-500 ${!path.isAccessible ? 'opacity-60' : ''}`}
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Modules */}
                        <div className="mt-4">
                          <div className={`text-xs font-medium mb-2 ${path.isAccessible ? 'text-gray-700' : 'text-gray-500'}`}>
                            Modules:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {path.modules.slice(0, 2).map((module, index) => (
                              <span 
                                key={index} 
                                className={`px-2 py-1 text-xs rounded-md ${
                                  path.isAccessible 
                                    ? 'bg-gray-100 text-gray-600' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {module}
                              </span>
                            ))}
                            {path.modules.length > 2 && (
                              <span className={`px-2 py-1 text-xs rounded-md ${
                                path.isAccessible 
                                  ? 'bg-primary-100 text-primary-600' 
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                +{path.modules.length - 2} more
                              </span>
                            )}
          </div>
        </div>

                        {/* Lock message for free users */}
                        {path.isLocked && !isPremium && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Lock className="h-4 w-4 text-yellow-600" />
                              <span className="text-xs text-yellow-800">
                                Complete Beginner level or upgrade to Premium to unlock
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Weather Card */}
            <WeatherCard />
          </div>
        </div>
            
        {/* Plant Tracking and Seasonal Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plant Tracking */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Plants</h2>
                <p className="text-sm text-gray-500 mt-1">Your current plants</p>
              </div>
              <Link
                to="/garden"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {plants.slice(0, 4).map((plantData, index) => {
                // Handle both API plant structure and static plant structure
                const plant = plantData.plant || plantData
                const plantImage = plant.latest_image || plant.image_path
                
                return (
                <div key={index} className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {plantImage && 
                         !plantImage.includes('blob') && 
                         !plantImage.includes('_blob') &&
                         !imageErrors[`${plant.id || index}-${plantImage}`] ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-300 shadow-sm relative">
                            <img
                              src={`/${plantImage}`}
                              alt={plant.name || 'Plant'}
                              className="w-full h-full object-cover"
                              onError={() => {
                                setImageErrors(prev => ({
                                  ...prev,
                                  [`${plant.id || index}-${plantImage}`]: true
                                }))
                              }}
                            />
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              plantData.plant?.health_status === 'healthy' 
                                ? 'bg-green-500' 
                                : 'bg-yellow-500'
                            }`}></div>
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm relative">
                            <Leaf className="h-7 w-7 text-green-600" />
                            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              plantData.plant?.health_status === 'healthy' 
                                ? 'bg-green-500' 
                                : 'bg-yellow-500'
                            }`}></div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{plant.name || 'Plant'}</h3>
                        <p className="text-sm text-gray-600 capitalize">{plant.type || 'Unknown'}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-gray-500">
                              {plant.watering_frequency || 'N/A'} days
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {new Date(plantData.tracking?.planting_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        Planted {new Date(plantData.tracking?.planting_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                )
              })}
              {plants.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No plants yet</h3>
                  <p className="text-gray-600">Your added plants will appear here</p>
                </div>
              )}
            </div>

            
          </div>

          {/* Seasonal Gardening Tips */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seasonal Tips</h2>
                <p className="text-sm text-gray-500 mt-1">Expert advice for this season</p>
              </div>
              <Link
                to="/seasonal-planning"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {seasonalTips.map((tip, index) => {
                const IconComponent = tip.icon
                return (
                  <div key={tip.id} className="group relative overflow-hidden bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                            {tip.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {seasonalTips.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sun className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tips available</h3>
                  <p className="text-gray-600 mb-4">Get personalized seasonal advice for your garden</p>
                  <Link
                    to="/seasonal-planning"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Get Seasonal Advice
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserDashboard

