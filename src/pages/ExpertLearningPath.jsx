import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Video, PlayCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import ImageDisplay from '../components/ImageDisplay'
import { useAuth } from '../contexts/AuthContext'
import { getModuleData } from '../utils/learningPathData'

const ExpertLearningPath = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentModule, setCurrentModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [showQuizSelection, setShowQuizSelection] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [moduleProgress, setModuleProgress] = useState({})
  const [showVideo, setShowVideo] = useState(false)
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizAttempts, setQuizAttempts] = useState({})
  const [showRetakeOption, setShowRetakeOption] = useState(false)

  // Create user-specific localStorage keys
  const getStorageKey = (key) => {
    if (!user) return key // Fallback for non-authenticated users
    return `${key}_user_${user.id}`
  }

  // Get modules from backend API
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await axios.get('/api/learning-paths/Expert')
        
        // Check if path is deactivated (error response)
        if (response.data && response.data.error && response.data.is_active === false) {
          toast.error(response.data.message || 'This learning path has been deactivated')
          navigate('/dashboard')
          return
        }
        
        // Check if response is an array (valid modules) or error object
        if (!Array.isArray(response.data)) {
          if (response.data.error) {
            toast.error(response.data.message || 'This learning path is unavailable')
            navigate('/dashboard')
            return
          }
        }
        
        // Check if backend returned empty array (no content in database)
        if (Array.isArray(response.data) && response.data.length === 0) {
          console.log('No content in database, using fallback data')
          // Fallback to hardcoded data
          const fallbackModules = getModuleData('Expert').map(module => ({
            ...module,
            icon: Award,
            color: 'purple'
          }))
          setModules(fallbackModules)
        } else if (Array.isArray(response.data)) {
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
              quizzes: quizzes,
              icon: Award,
              color: 'purple'
            }
          })
          setModules(backendModules)
        }
      } catch (error) {
        console.error('Error loading modules from backend:', error)
        
        // Check if path is deactivated (403 error)
        if (error.response && error.response.status === 403) {
          const errorData = error.response.data
          toast.error(errorData.message || 'This learning path has been deactivated')
          navigate('/dashboard')
          return
        }
        
        // Fallback to hardcoded data only if it's not a deactivation error
        const fallbackModules = getModuleData('Expert').map(module => ({
          ...module,
          icon: Award,
          color: 'purple'
        }))
        setModules(fallbackModules)
      } finally {
        setLoading(false)
      }
    }
    
    loadModules()
  }, [])

  // Clear old progress data function
  const clearOldProgressData = () => {
    const allPossibleKeys = [
      'beginnerProgress',
      'intermediateProgress', 
      'expertProgress',
      'learningProgress',
      'userProgress'
    ]

    allPossibleKeys.forEach(key => {
      localStorage.removeItem(key)
      localStorage.removeItem(`${key}_user_${user?.id}`)
    })
  }

  // Load progress AFTER modules are loaded and validate against current modules
  useEffect(() => {
    if (modules.length === 0 || loading) return // Wait for modules to load
    
    const loadProgress = () => {
      const storageKey = getStorageKey('expertProgress')
      const savedProgress = localStorage.getItem(storageKey)
      
      if (savedProgress) {
        try {
          const progressData = JSON.parse(savedProgress)
          
          // Get current module IDs
          const currentModuleIds = modules.map(m => m.id)
          
          // Validate and filter completed modules - only keep those that exist in current modules
          const validCompletedModules = (progressData.completedModules || []).filter(
            moduleId => currentModuleIds.includes(moduleId)
          )
          
          // Validate and filter module progress - only keep those that exist in current modules
          const validModuleProgress = {}
          Object.keys(progressData.moduleProgress || {}).forEach(moduleId => {
            if (currentModuleIds.includes(moduleId)) {
              validModuleProgress[moduleId] = progressData.moduleProgress[moduleId]
            }
          })
          
          // Validate and filter quiz attempts - only keep those that exist in current modules
          // Quiz attempts are stored with keys like "moduleId_quizTitle"
          const validQuizAttempts = {}
          Object.keys(progressData.quizAttempts || {}).forEach(quizKey => {
            // Extract module ID from quiz key (format: "moduleId_quizTitle")
            // Find first underscore to separate module ID from quiz title
            const underscoreIndex = quizKey.indexOf('_')
            if (underscoreIndex > 0) {
              const moduleId = quizKey.substring(0, underscoreIndex)
              if (currentModuleIds.includes(moduleId)) {
                validQuizAttempts[quizKey] = progressData.quizAttempts[quizKey]
              }
            }
          })
          
          // Only update if we have valid progress data
          if (validCompletedModules.length > 0 || Object.keys(validModuleProgress).length > 0 || Object.keys(validQuizAttempts).length > 0) {
            setCompletedModules(validCompletedModules)
            setModuleProgress(validModuleProgress)
            setQuizAttempts(validQuizAttempts)
          } else {
            // If no valid progress, initialize empty
            setCompletedModules([])
            setModuleProgress({})
            setQuizAttempts({})
          }
        } catch (error) {
          console.error('Error loading progress:', error)
          setCompletedModules([])
          setModuleProgress({})
          setQuizAttempts({})
        }
      } else {
        // No saved progress, initialize empty
        setCompletedModules([])
        setModuleProgress({})
        setQuizAttempts({})
      }
    }

    loadProgress()
  }, [modules, loading, user]) // Re-run when modules load or user changes

  // Check if all quizzes in a module are completed - defined early for use in save progress
  const areAllQuizzesCompleted = (module) => {
    if (!module) return false
    
    const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
    if (quizzes.length === 0) return false // No quizzes means not completed
    
    // Check if all quizzes have at least one attempt
    return quizzes.every(quiz => {
      const quizKey = `${module.id}_${quiz.title}`
      return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
    })
  }

  // Save progress whenever completedModules, moduleProgress, or quizAttempts changes
  // This ensures progress persists even after learning path completion
  useEffect(() => {
    if (modules.length === 0) return // Don't save if modules haven't loaded yet
    
    const saveProgress = () => {
      const storageKey = getStorageKey('expertProgress')
      // Check if all modules are completed
      const allCompleted = modules.every(m => {
        const mod = modules.find(module => module.id === m.id)
        return areAllQuizzesCompleted(mod)
      })
      
      const progressData = {
        completedModules,
        moduleProgress,
        quizAttempts,
        totalModules: modules.length, // Store total module count for accurate progress calculation
        lastUpdated: new Date().toISOString(),
        pathCompleted: allCompleted // Mark path as completed but keep all progress
      }
      localStorage.setItem(storageKey, JSON.stringify(progressData))
    }

    saveProgress()
  }, [completedModules, moduleProgress, quizAttempts, modules, user])

  const startModule = (module) => {
    setCurrentModule(module)
    setCurrentLesson(0)
    setShowQuiz(false)
    setShowQuizSelection(false)
    setCurrentQuiz(null)
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
    setShowRetakeOption(false)
  }

  const handleModuleClick = (module) => {
    const isCompleted = isModuleCompleted(module.id)
    // Check if any quiz has been attempted
    const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
    const hasQuizAttempts = quizzes.some(quiz => {
      const quizKey = `${module.id}_${quiz.title}`
      return quizAttempts[quizKey] && quizAttempts[quizKey].length > 0
    })
    
    // Allow users to review even if completed - show options screen
    if (isCompleted && hasQuizAttempts) {
      setCurrentModule(module)
      setShowRetakeOption(true)
    } else {
      // Start module normally (allows review even if completed)
      startModule(module)
    }
  }

  const handleReviewLessons = () => {
    setShowRetakeOption(false)
    // Start from first lesson to allow full review
    setCurrentLesson(0)
    setShowQuiz(false)
    setShowQuizSelection(false)
    setCurrentQuiz(null)
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
  }

  const handleRetakeQuiz = () => {
    setShowRetakeOption(false)
    // Show quiz selection if multiple quizzes, otherwise show the quiz directly
    const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
    if (quizzes.length > 1) {
      setShowQuizSelection(true)
    } else if (quizzes.length === 1) {
      setCurrentQuiz(quizzes[0])
      setShowQuiz(true)
      setQuizAnswers({})
      setShowQuizResults(false)
      setQuizScore(0)
    }
  }

  const handleContinueFromResults = () => {
    setShowRetakeOption(false)
    setShowQuizResults(true)
    const attempts = quizAttempts[currentModule.id]
    if (attempts && attempts.length > 0) {
      const lastAttempt = attempts[attempts.length - 1]
      setQuizScore(lastAttempt.score)
      setQuizAnswers(lastAttempt.answers)
    }
  }

  const nextLesson = () => {
    if (currentLesson < currentModule.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
    } else {
      // Show quiz selection if there are multiple quizzes, otherwise show the single quiz
      const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
      if (quizzes.length > 1) {
        setShowQuizSelection(true)
        setShowQuiz(false) // Ensure showQuiz is false when showing selection
      } else if (quizzes.length === 1) {
        setCurrentQuiz(quizzes[0])
        setShowQuizSelection(false)
        setShowQuiz(true)
      } else {
        // No quizzes available - show message or keep on last lesson
        toast.error('No quizzes available for this module')
      }
    }
  }

  const selectQuiz = (quiz) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      toast.error('This quiz has no questions')
      return
    }
    setCurrentQuiz(quiz)
    setShowQuizSelection(false)
    setShowQuiz(true)
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
  }

  const previousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1)
    }
  }

  const handleQuizAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const submitQuiz = () => {
    if (!currentQuiz) return
    
    let score = 0
    currentQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        score++
      }
    })
    
    setQuizScore(score)
    setShowQuizResults(true)
    
    // Record quiz attempt - track by module ID and quiz title
    const quizKey = `${currentModule.id}_${currentQuiz.title}`
    const attempt = {
      score,
      totalQuestions: currentQuiz.questions.length,
      answers: { ...quizAnswers },
      timestamp: new Date().toISOString(),
      quizTitle: currentQuiz.title,
      attemptNumber: (quizAttempts[quizKey]?.length || 0) + 1
    }
    
    // Update quiz attempts
    const updatedQuizAttempts = {
      ...quizAttempts,
      [quizKey]: [...(quizAttempts[quizKey] || []), attempt]
    }
    
    setQuizAttempts(updatedQuizAttempts)
    
    // Check if all quizzes in the module are now completed
    const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
    const allQuizzesCompleted = quizzes.every(quiz => {
      const qKey = `${currentModule.id}_${quiz.title}`
      return updatedQuizAttempts[qKey] && updatedQuizAttempts[qKey].length > 0
    })
    
    // Mark module as completed only if all quizzes are completed
    if (allQuizzesCompleted && !completedModules.includes(currentModule.id)) {
      setCompletedModules(prev => [...prev, currentModule.id])
    }
    
    // Check if all expert modules are completed
    const allModulesCompleted = modules.every(m => {
      const mod = modules.find(module => module.id === m.id)
      return areAllQuizzesCompleted(mod)
    })
    if (allModulesCompleted) {
      // Update learning progress to 100% - but DO NOT reset module progress
      const storageKey = getStorageKey('learningProgress')
      const currentProgress = JSON.parse(localStorage.getItem(storageKey) || '{}')
      currentProgress.expert = 100
      localStorage.setItem(storageKey, JSON.stringify(currentProgress))
      
      // Ensure progress is saved - progress should persist even after completion
      const progressStorageKey = getStorageKey('expertProgress')
      const progressData = {
        completedModules,
        moduleProgress,
        quizAttempts,
        totalModules: modules.length,
        lastUpdated: new Date().toISOString(),
        pathCompleted: true // Mark path as completed but keep all progress
      }
      localStorage.setItem(progressStorageKey, JSON.stringify(progressData))
      
      toast.success('🎉 Congratulations! You have completed the Expert Learning Path! You are now a master gardener! Your progress has been saved.')
    } else {
      // Check if all quizzes in this module are now completed
      const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
      const completedQuizzes = quizzes.filter(quiz => {
        const qKey = `${currentModule.id}_${quiz.title}`
        return updatedQuizAttempts[qKey] && updatedQuizAttempts[qKey].length > 0
      }).length
      
      if (allQuizzesCompleted && quizzes.length > 1) {
        const nextModule = getNextModule()
        if (nextModule && !isModuleLocked(nextModule.id)) {
          toast.success(`All quizzes completed! Score: ${score}/${currentQuiz.questions.length}. Module is now complete! You can now proceed to the next module!`)
        } else {
          toast.success(`All quizzes completed! Score: ${score}/${currentQuiz.questions.length}. Module is now complete!`)
        }
      } else if (quizzes.length > 1) {
        toast.success(`Quiz completed! Score: ${score}/${currentQuiz.questions.length}. Complete ${quizzes.length - completedQuizzes} more quiz${quizzes.length - completedQuizzes > 1 ? 'zes' : ''} to finish this module.`)
      } else {
        const nextModule = getNextModule()
        if (nextModule && !isModuleLocked(nextModule.id)) {
          toast.success(`Quiz completed! Score: ${score}/${currentQuiz.questions.length}. You can now proceed to the next module!`)
        } else {
          toast.success(`Quiz completed! Score: ${score}/${currentQuiz.questions.length}`)
        }
      }
    }
  }

  const resetQuiz = () => {
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
  }

  const getProgressPercentage = () => {
    if (!currentModule) return 0
    const totalLessons = currentModule.lessons.length + 1 // +1 for quiz
    const currentProgress = showQuiz ? currentModule.lessons.length : currentLesson
    return Math.round((currentProgress / totalLessons) * 100)
  }

  const getModuleProgress = (moduleId) => {
    return moduleProgress[moduleId] || 0
  }

  const isModuleCompleted = (moduleId) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return completedModules.includes(moduleId)
    
    // Check if all quizzes are completed
    return areAllQuizzesCompleted(module)
  }

  const isModuleLocked = (moduleId) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId)
    if (moduleIndex === 0) return false // First module is always unlocked
    const previousModule = modules[moduleIndex - 1]
    return !isModuleCompleted(previousModule.id)
  }

  const getNextModule = () => {
    const currentIndex = modules.findIndex(m => m.id === currentModule.id)
    if (currentIndex < modules.length - 1) {
      return modules[currentIndex + 1]
    }
    return null
  }

  const goToNextModule = () => {
    const nextModule = getNextModule()
    if (nextModule && !isModuleLocked(nextModule.id)) {
      startModule(nextModule)
    }
  }

  if (currentModule && showRetakeOption) {
    const attempts = quizAttempts[currentModule.id] || []
    const lastAttempt = attempts[attempts.length - 1]
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button 
                  onClick={() => setCurrentModule(null)}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Modules
                </button>
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                    <p className="text-sm text-gray-600">Module completed - Choose your next action</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Module Completed!</h2>
                <p className="text-gray-600">You have already completed this module. What would you like to do?</p>
              </div>

              {lastAttempt && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Last Quiz Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{lastAttempt.score}/{lastAttempt.totalQuestions}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{lastAttempt.attemptNumber}</div>
                      <div className="text-sm text-gray-600">Attempt</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round((lastAttempt.score / lastAttempt.totalQuestions) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Percentage</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleReviewLessons}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Review Lessons
                </button>
                <button
                  onClick={handleRetakeQuiz}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Retake Quiz
                </button>
                <button
                  onClick={handleContinueFromResults}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Quiz Results
                </button>
                <button
                  onClick={() => setCurrentModule(null)}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Back to Modules
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button 
                  onClick={() => setCurrentModule(null)}
                  className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Modules
                </button>
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                    <p className="text-sm text-gray-600">
                      {currentModule.description}
                      {isModuleCompleted(currentModule.id) && (
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          ✓ Completed - Review Mode
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {getProgressPercentage()}% Complete
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showQuiz && !showQuizSelection ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-gray-200 h-2">
                <div 
                  className="bg-purple-600 h-2 transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>

              {/* Lesson Content */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Lesson {currentLesson + 1}: {currentModule.lessons[currentLesson].title}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentLesson + 1} of {currentModule.lessons.length}
                  </span>
                </div>

                <div className="prose max-w-none">
                  {/* Lesson Content */}
                  {currentModule.lessons[currentLesson].content && (
                    <div className="mb-6">
                      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                        {currentModule.lessons[currentLesson].content}
                      </p>
                    </div>
                  )}

                  {/* Lesson Images */}
                  {currentModule.lessons[currentLesson].images && currentModule.lessons[currentLesson].images.length > 0 && (
                    <div className="mb-6 space-y-4">
                      {currentModule.lessons[currentLesson].images.map((image, imgIndex) => (
                        <div key={imgIndex} className="rounded-lg overflow-hidden">
                          <img 
                            src={image.url || image} 
                            alt={image.description || `Lesson image ${imgIndex + 1}`}
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Lesson Videos */}
                  {currentModule.lessons[currentLesson].videos && currentModule.lessons[currentLesson].videos.length > 0 && (
                    <div className="mb-6 space-y-4">
                      {currentModule.lessons[currentLesson].videos.map((video, vidIndex) => (
                        <div key={vidIndex} className="rounded-lg overflow-hidden">
                          <video 
                            src={video.url || video} 
                            controls
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Points - Key Information */}
                  {currentModule.lessons[currentLesson].points && Array.isArray(currentModule.lessons[currentLesson].points) && currentModule.lessons[currentLesson].points.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Points:</h3>
                      <div className="space-y-3">
                        {currentModule.lessons[currentLesson].points.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
                            <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed flex-1">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <button
                    onClick={previousLesson}
                    disabled={currentLesson === 0}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    {/* Go to Quiz button - always visible for review */}
                    {(currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])).length > 0 && (
                      <button
                        onClick={() => {
                          const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
                          if (quizzes.length > 1) {
                            setShowQuizSelection(true)
                            setShowQuiz(false)
                          } else if (quizzes.length === 1) {
                            setCurrentQuiz(quizzes[0])
                            setShowQuizSelection(false)
                            setShowQuiz(true)
                            setQuizAnswers({})
                            setShowQuizResults(false)
                            setQuizScore(0)
                          }
                        }}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Go to Quiz
                      </button>
                    )}
                    
                    <button
                      onClick={nextLesson}
                      className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      {currentLesson === currentModule.lessons.length - 1 ? 'Start Quiz' : 'Next Lesson'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : showQuizSelection ? (
            // Quiz Selection Screen
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a Quiz</h2>
                  <p className="text-gray-600">Choose which quiz you'd like to take</p>
                  {(() => {
                    const quizzes = currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])
                    const completedCount = quizzes.filter(quiz => {
                      const qKey = `${currentModule.id}_${quiz.title}`
                      return quizAttempts[qKey] && quizAttempts[qKey].length > 0
                    }).length
                    if (quizzes.length > 1) {
                      return (
                        <p className="text-sm text-gray-500 mt-2">
                          {completedCount} of {quizzes.length} quizzes completed
                          {completedCount < quizzes.length && ` • Complete all ${quizzes.length} quizzes to finish this module`}
                        </p>
                      )
                    }
                    return null
                  })()}
                </div>

                <div className="space-y-4">
                  {(currentModule.quizzes || (currentModule.quiz ? [currentModule.quiz] : [])).map((quiz, index) => {
                    const quizKey = `${currentModule.id}_${quiz.title}`
                    const attempts = quizAttempts[quizKey] || []
                    const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null
                    const isCompleted = attempts.length > 0
                    
                    return (
                      <div key={index} className={`border rounded-lg p-6 transition-colors ${
                        isCompleted 
                          ? 'border-purple-300 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{quiz.title || `Quiz ${index + 1}`}</h3>
                              {isCompleted && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {quiz.questions?.length || 0} questions
                              {lastAttempt && (
                                <span className="ml-2 text-purple-600 font-medium">
                                  • Last score: {lastAttempt.score}/{lastAttempt.totalQuestions}
                                </span>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => selectQuiz(quiz)}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            {lastAttempt ? 'Retake' : 'Start Quiz'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowQuizSelection(false)
                      setShowQuiz(false)
                      setCurrentQuiz(null)
                      // Go back to last lesson
                      if (currentModule.lessons.length > 0) {
                        setCurrentLesson(currentModule.lessons.length - 1)
                      }
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 inline mr-2" />
                    Back to Lessons
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz: {currentQuiz?.title || 'Quiz'}</h2>
                  <p className="text-gray-600">Test your knowledge of this module</p>
                </div>

                {!showQuizResults ? (
                  currentQuiz ? (
                  <div className="space-y-6">
                    {currentQuiz.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {index + 1}. {question.question}
                        </h3>
                        
                        {(question.image || question.video) && (
                          <div className="mb-4">
                            {question.image && (
                              <img 
                                src={question.image} 
                                alt={question.imageDescription || 'Quiz image'}
                                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                              />
                            )}
                            {question.video && (
                              <video 
                                src={question.video} 
                                controls
                                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                              />
                            )}
                          </div>
                        )}

                        <div className="space-y-3">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optionIndex}
                                checked={quizAnswers[question.id] === optionIndex}
                                onChange={() => handleQuizAnswer(question.id, optionIndex)}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="text-center">
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== currentQuiz.questions.length}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>No quiz available</p>
                    </div>
                  )
                ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                      <p className="text-lg text-gray-600">
                        You scored {quizScore} out of {currentQuiz?.questions?.length || 0}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {currentQuiz?.questions?.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded-full ${
                                  optionIndex === question.correct 
                                    ? 'bg-green-500' 
                                    : quizAnswers[question.id] === optionIndex 
                                      ? 'bg-red-500' 
                                      : 'bg-gray-300'
                                }`}></div>
                                <span className={`${
                                  optionIndex === question.correct 
                                    ? 'text-green-700 font-medium' 
                                    : quizAnswers[question.id] === optionIndex 
                                      ? 'text-red-700' 
                                      : 'text-gray-600'
                                }`}>
                                  {option}
                                  {optionIndex === question.correct && ' (Correct)'}
                                  {quizAnswers[question.id] === optionIndex && optionIndex !== question.correct && ' (Your Answer)'}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            {question.explanation || 'No explanation provided for this question.'}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={resetQuiz}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Retake Quiz
                      </button>
                      {getNextModule() && !isModuleLocked(getNextModule().id) && areAllQuizzesCompleted(currentModule) && (
                        <button
                          onClick={goToNextModule}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                        >
                          Next Module
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      )}
                      {getNextModule() && !isModuleLocked(getNextModule().id) && !areAllQuizzesCompleted(currentModule) && (
                        <button
                          disabled
                          className="px-6 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center opacity-50"
                          title="Complete all quizzes in this module to proceed"
                        >
                          Next Module
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      )}
                      <button
                        onClick={() => setCurrentModule(null)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Back to Modules
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning modules...</p>
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
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="flex items-center">
                <Award className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Expert Learning Path</h1>
                  <p className="text-sm text-gray-600">Master professional plant and soil management</p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {modules.filter(m => isModuleCompleted(m.id)).length} of {modules.length} modules completed
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${modules.length > 0 ? Math.round((modules.filter(m => isModuleCompleted(m.id)).length / modules.length) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {modules.length > 0 ? Math.round((modules.filter(m => isModuleCompleted(m.id)).length / modules.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const isCompleted = isModuleCompleted(module.id)
            const isLocked = isModuleLocked(module.id)
            const IconComponent = module.icon || Award

            return (
              <div 
                key={module.id} 
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-xl cursor-pointer'
                }`}
                onClick={() => !isLocked && handleModuleClick(module)}
              >
                {/* Lock overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <Lock className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                )}

                {/* Completion badge */}
                {isCompleted && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-purple-500 text-white rounded-full p-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-${module.color}-100 mr-4`}>
                      <IconComponent className={`h-6 w-6 text-${module.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">{module.estimatedTime}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">{module.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {module.lessons.length} lessons
                    </div>
                    
                    {isLocked ? (
                      <span className="text-sm text-gray-500">Complete previous module</span>
                    ) : (
                      <button className="flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium">
                        {isCompleted ? 'Review' : 'Start'}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ExpertLearningPath