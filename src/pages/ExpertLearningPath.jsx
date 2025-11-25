import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Video, PlayCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'
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
        
        // Check if backend returned empty array (no content in database)
        if (response.data && response.data.length === 0) {
          console.log('No content in database, using fallback data')
          // Fallback to hardcoded data
          const fallbackModules = getModuleData('Expert').map(module => ({
            ...module,
            icon: Award,
            color: 'purple'
          }))
          setModules(fallbackModules)
        } else {
          // Use backend data
          const backendModules = response.data.map(module => ({
            ...module,
            icon: Award,
            color: 'purple'
          }))
          setModules(backendModules)
        }
      } catch (error) {
        console.error('Error loading modules from backend:', error)
        // Fallback to hardcoded data
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

  useEffect(() => {
    // Load existing progress from localStorage
    const loadProgress = () => {
      const storageKey = getStorageKey('expertProgress')
      const savedProgress = localStorage.getItem(storageKey)
      
      if (savedProgress) {
        try {
          const progressData = JSON.parse(savedProgress)
          setCompletedModules(progressData.completedModules || [])
          setModuleProgress(progressData.moduleProgress || {})
          setQuizAttempts(progressData.quizAttempts || {})
        } catch (error) {
          console.error('Error loading progress:', error)
          setCompletedModules([])
          setModuleProgress({})
          setQuizAttempts({})
        }
      }
    }

    loadProgress()
  }, [user]) // Re-run when user changes

  // Save progress whenever completedModules or moduleProgress changes
  useEffect(() => {
    const saveProgress = () => {
      const storageKey = getStorageKey('expertProgress')
      const progressData = {
        completedModules,
        moduleProgress,
        quizAttempts,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(storageKey, JSON.stringify(progressData))
    }

    saveProgress()
  }, [completedModules, moduleProgress, quizAttempts, user])

  const startModule = (module) => {
    setCurrentModule(module)
    setCurrentLesson(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
    setShowRetakeOption(false)
  }

  const handleModuleClick = (module) => {
    const isCompleted = isModuleCompleted(module.id)
    const hasQuizAttempts = quizAttempts[module.id] && quizAttempts[module.id].length > 0
    
    if (isCompleted && hasQuizAttempts) {
      setCurrentModule(module)
      setShowRetakeOption(true)
    } else {
      startModule(module)
    }
  }

  const handleRetakeQuiz = () => {
    setShowRetakeOption(false)
    setShowQuiz(true)
    setQuizAnswers({})
    setShowQuizResults(false)
    setQuizScore(0)
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
      setShowQuiz(true)
    }
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
    let score = 0
    currentModule.quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correct) {
        score++
      }
    })
    
    setQuizScore(score)
    setShowQuizResults(true)
    
    // Record quiz attempt
    const attempt = {
      score,
      totalQuestions: currentModule.quiz.questions.length,
      answers: { ...quizAnswers },
      timestamp: new Date().toISOString(),
      attemptNumber: (quizAttempts[currentModule.id]?.length || 0) + 1
    }
    
    setQuizAttempts(prev => ({
      ...prev,
      [currentModule.id]: [...(prev[currentModule.id] || []), attempt]
    }))
    
    // Mark module as completed
    if (!completedModules.includes(currentModule.id)) {
      setCompletedModules(prev => [...prev, currentModule.id])
    }
    
    // Check if all expert modules are completed
    const allModulesCompleted = completedModules.length + 1 >= modules.length
    if (allModulesCompleted) {
      // Update learning progress to 100%
      const storageKey = getStorageKey('learningProgress')
      const currentProgress = JSON.parse(localStorage.getItem(storageKey) || '{}')
      currentProgress.expert = 100
      localStorage.setItem(storageKey, JSON.stringify(currentProgress))
      
      toast.success('🎉 Congratulations! You have completed the Expert Learning Path! You are now a master gardener!')
    } else {
      const nextModule = getNextModule()
      if (nextModule && !isModuleLocked(nextModule.id)) {
        toast.success(`Quiz completed! Score: ${score}/${currentModule.quiz.questions.length}. You can now proceed to the next module!`)
      } else {
        toast.success(`Quiz completed! Score: ${score}/${currentModule.quiz.questions.length}`)
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
    return completedModules.includes(moduleId)
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

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetakeQuiz}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Retake Quiz
                </button>
                <button
                  onClick={handleContinueFromResults}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Results
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
                    <p className="text-sm text-gray-600">{currentModule.description}</p>
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
          {!showQuiz ? (
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
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {currentModule.lessons[currentLesson].content}
                  </p>

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

                  {/* Points */}
                  <div className="space-y-4">
                    {currentModule.lessons[currentLesson].points && Array.isArray(currentModule.lessons[currentLesson].points) && currentModule.lessons[currentLesson].points.map((point, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
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
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz: {currentModule.quiz.title}</h2>
                  <p className="text-gray-600">Test your knowledge of this module</p>
                </div>

                {!showQuizResults ? (
                  <div className="space-y-6">
                    {currentModule.quiz.questions.map((question, index) => (
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
                        disabled={Object.keys(quizAnswers).length !== currentModule.quiz.questions.length}
                        className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-10 w-10 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                      <p className="text-lg text-gray-600">
                        You scored {quizScore} out of {currentModule.quiz.questions.length}
                      </p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {currentModule.quiz.questions.map((question, index) => (
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
                            {question.explanation}
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
                      {getNextModule() && !isModuleLocked(getNextModule().id) && (
                        <button
                          onClick={goToNextModule}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
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
              {completedModules.length} of {modules.length} modules completed
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
                  style={{ width: `${Math.round((completedModules.length / modules.length) * 100)}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((completedModules.length / modules.length) * 100)}%
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