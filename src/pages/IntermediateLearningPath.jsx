import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Beaker, Bug, LayoutGrid, CalendarDays, Droplets, Leaf, Sun, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Shield, Recycle, Video, PlayCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const IntermediateLearningPath = () => {
  const [currentModule, setCurrentModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [moduleProgress, setModuleProgress] = useState({})
  const [showVideo, setShowVideo] = useState(false)

  const modules = [
    {
      id: 'nutrition',
      title: 'Advanced Plant Nutrition',
      icon: Beaker,
      color: 'blue',
      estimatedTime: '25 min',
      difficulty: 'Intermediate',
      description: 'Master the science of plant nutrition and feeding schedules',
      lessons: [
        {
          title: 'Understanding NPK and Micronutrients',
          content: 'Plants need a balanced diet of macro and micronutrients:',
          points: [
            'Nitrogen (N): Promotes leafy growth and green color',
            'Phosphorus (P): Essential for root development and flowering',
            'Potassium (K): Improves disease resistance and fruit quality',
            'Micronutrients: Iron, zinc, manganese, and others in small amounts'
          ],
          type: 'lesson'
        },
        {
          title: 'Organic vs Synthetic Fertilizers',
          content: 'Choose the right fertilizer type for your gardening philosophy:',
          points: [
            'Organic: Slow-release, improves soil structure, environmentally friendly',
            'Synthetic: Fast-acting, precise nutrient ratios, immediate results',
            'Hybrid approach: Use both for optimal plant health',
            'Soil testing: Determine what your plants actually need'
          ],
          type: 'lesson'
        },
        {
          title: 'Reading Fertilizer Labels',
          content: 'Decode fertilizer labels to make informed choices:',
      points: [
            'NPK ratios: 10-10-10 means 10% each of N, P, K',
            'Release rates: Quick-release vs slow-release formulations',
            'Application rates: Follow package instructions carefully',
            'Timing: When and how often to fertilize different plants'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What does the "P" in NPK stand for?',
            options: ['Potassium', 'Phosphorus', 'Protein', 'pH'],
            correct: 1
          },
          {
            question: 'Which nutrient promotes leafy growth?',
            options: ['Phosphorus', 'Nitrogen', 'Potassium', 'Calcium'],
            correct: 1
          },
          {
            question: 'What is the main advantage of organic fertilizers?',
            options: ['Fast-acting', 'Improves soil structure', 'Cheaper', 'More precise'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'pests',
      title: 'Pest & Disease Management',
      icon: Bug,
      color: 'red',
      estimatedTime: '30 min',
      difficulty: 'Intermediate',
      description: 'Learn integrated pest management and disease prevention',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual pest management video
      lessons: [
        {
          title: 'Preventative Care Strategies',
          content: 'Prevention is better than cure in plant health:',
          points: [
            'Proper spacing: Good airflow prevents fungal diseases',
            'Sanitation: Remove dead leaves and debris regularly',
            'Quarantine: Isolate new plants for 2-3 weeks',
            'Healthy soil: Strong plants resist pests and diseases'
          ],
          type: 'lesson'
        },
        {
          title: 'Identifying Common Pests',
          content: 'Know your enemy to fight effectively:',
          points: [
            'Aphids: Small, soft-bodied insects on new growth',
            'Spider mites: Tiny red or brown dots, fine webbing',
            'Whiteflies: Small white insects that fly when disturbed',
            'Scale insects: Hard or soft bumps on stems and leaves'
          ],
          type: 'lesson'
        },
        {
          title: 'Integrated Pest Management (IPM)',
          content: 'Use multiple strategies for effective pest control:',
      points: [
            'Cultural controls: Proper plant care and selection',
            'Physical controls: Hand-picking, barriers, traps',
            'Biological controls: Beneficial insects and natural predators',
            'Chemical controls: Use as last resort, choose least toxic options'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the first step in pest management?',
            options: ['Spray pesticides', 'Prevention', 'Remove all plants', 'Call an expert'],
            correct: 1
          },
          {
            question: 'Which pest creates fine webbing on plants?',
            options: ['Aphids', 'Spider mites', 'Whiteflies', 'Scale insects'],
            correct: 1
          },
          {
            question: 'What does IPM stand for?',
            options: ['Integrated Pest Management', 'Intensive Plant Monitoring', 'Internal Plant Maintenance', 'Individual Plant Method'],
            correct: 0
          }
        ]
      }
    },
    {
      id: 'seasonal',
      title: 'Seasonal Planning',
      icon: CalendarDays,
      color: 'green',
      estimatedTime: '28 min',
      difficulty: 'Intermediate',
      description: 'Master year-round garden planning and succession planting',
      lessons: [
        {
          title: 'Understanding Growing Seasons',
          content: 'Plan your garden around seasonal changes:',
          points: [
            'Cool season crops: Lettuce, spinach, peas, broccoli',
            'Warm season crops: Tomatoes, peppers, beans, corn',
            'Frost dates: Know your last spring and first fall frost',
            'Microclimates: Different areas have different growing conditions'
          ],
          type: 'lesson'
        },
        {
          title: 'Succession Planting',
          content: 'Maximize your harvest with continuous planting:',
          points: [
            'Staggered sowing: Plant every 2-3 weeks for continuous harvest',
            'Replacement planting: Replace finished crops immediately',
            'Intercropping: Plant fast and slow-growing crops together',
            'Season extension: Use row covers and cold frames'
          ],
          type: 'lesson'
        },
        {
          title: 'Crop Rotation Basics',
          content: 'Prevent soil depletion and disease buildup:',
      points: [
            'Rotate plant families: Don\'t plant same family in same spot',
            'Heavy feeders: Follow with light feeders or cover crops',
            'Disease prevention: Break pest and disease cycles',
            'Soil improvement: Use cover crops to build soil health'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'Which crops are considered cool season?',
            options: ['Tomatoes', 'Lettuce', 'Peppers', 'Corn'],
            correct: 1
          },
          {
            question: 'What is succession planting?',
            options: ['Planting only one crop', 'Staggered planting for continuous harvest', 'Planting in rows', 'Using only seeds'],
            correct: 1
          },
          {
            question: 'Why is crop rotation important?',
            options: ['Saves money', 'Prevents soil depletion', 'Looks better', 'Easier to manage'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'design',
      title: 'Garden Design Principles',
      icon: LayoutGrid,
      color: 'purple',
      estimatedTime: '32 min',
      difficulty: 'Intermediate',
      description: 'Create beautiful and functional garden layouts',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual garden design video
      lessons: [
        {
          title: 'Sun Mapping and Microclimates',
          content: 'Understand your garden\'s unique conditions:',
          points: [
            'Sun mapping: Track sunlight patterns throughout the day',
            'Microclimates: Small areas with different growing conditions',
            'Wind patterns: Consider wind exposure and protection',
            'Drainage: Identify wet and dry areas in your garden'
          ],
          type: 'lesson'
        },
        {
          title: 'Companion Planting',
          content: 'Use plant relationships to your advantage:',
          points: [
            'Beneficial combinations: Marigolds with tomatoes, basil with peppers',
            'Pest deterrents: Strong-smelling herbs repel certain insects',
            'Nitrogen fixers: Legumes improve soil for neighboring plants',
            'Trap crops: Sacrifice plants to protect main crops'
          ],
          type: 'lesson'
        },
        {
          title: 'Vertical Gardening',
          content: 'Maximize space with vertical growing:',
      points: [
            'Trellises: Support climbing vegetables and flowers',
            'Vertical planters: Grow herbs and small vegetables',
            'Hanging baskets: Utilize overhead space',
            'Living walls: Create green walls for privacy and beauty'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is a microclimate?',
            options: ['A small garden', 'Small areas with different growing conditions', 'Indoor gardening', 'Container gardening'],
            correct: 1
          },
          {
            question: 'Which plant is a good companion for tomatoes?',
            options: ['Potatoes', 'Marigolds', 'Corn', 'Cabbage'],
            correct: 1
          },
          {
            question: 'What is the main benefit of vertical gardening?',
            options: ['Saves water', 'Maximizes space', 'Prevents pests', 'Improves soil'],
            correct: 1
          }
        ]
      }
    }
  ]

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('intermediateProgress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedModules(progress.completedModules || [])
      setModuleProgress(progress.moduleProgress || {})
    }
  }, [])

  const saveProgress = (newCompletedModules, newModuleProgress) => {
    const progress = {
      completedModules: newCompletedModules,
      moduleProgress: newModuleProgress
    }
    localStorage.setItem('intermediateProgress', JSON.stringify(progress))
  }

  const startModule = (module) => {
    setCurrentModule(module)
    setCurrentLesson(0)
    setShowQuiz(false)
    setQuizAnswers({})
  }

  const nextLesson = () => {
    if (currentModule && currentLesson < currentModule.lessons.length - 1) {
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

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }))
  }

  const submitQuiz = () => {
    if (!currentModule) return

    const correctAnswers = currentModule.quiz.questions.reduce((count, question, index) => {
      return count + (quizAnswers[index] === question.correct ? 1 : 0)
    }, 0)

    const score = (correctAnswers / currentModule.quiz.questions.length) * 100

    if (score >= 70) {
      const newCompletedModules = [...completedModules, currentModule.id]
      const newModuleProgress = {
        ...moduleProgress,
        [currentModule.id]: {
          completed: true,
          score: score,
          completedAt: new Date().toISOString()
        }
      }
      
      setCompletedModules(newCompletedModules)
      setModuleProgress(newModuleProgress)
      saveProgress(newCompletedModules, newModuleProgress)
      
      toast.success(`Congratulations! You completed ${currentModule.title} with ${Math.round(score)}% score!`)
      setCurrentModule(null)
      setShowQuiz(false)
    } else {
      toast.error(`You scored ${Math.round(score)}%. You need 70% to pass. Try again!`)
    }
  }

  const getModuleStatus = (moduleId) => {
    if (completedModules.includes(moduleId)) {
      return 'completed'
    }
    const moduleIndex = modules.findIndex(m => m.id === moduleId)
    const previousModule = modules[moduleIndex - 1]
    if (moduleIndex === 0 || (previousModule && completedModules.includes(previousModule.id))) {
      return 'available'
    }
    return 'locked'
  }

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  if (currentModule) {
    const lesson = currentModule.lessons[currentLesson]
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Module Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentModule(null)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Modules
              </button>
              <div className="text-sm text-gray-500">
                Lesson {currentLesson + 1} of {currentModule.lessons.length}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${getColorClasses(currentModule.color)}`}>
                  <currentModule.icon className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                  <p className="text-gray-600">{currentModule.description}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentLesson + 1) / currentModule.lessons.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          {!showQuiz ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
                {currentModule.hasVideo && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Watch Video
                  </button>
                )}
              </div>
              <p className="text-lg text-gray-700 mb-6">{lesson.content}</p>
              
              <div className="space-y-4">
                {lesson.points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{point}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-8">
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
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {currentLesson === currentModule.lessons.length - 1 ? 'Take Quiz' : 'Next Lesson'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ) : (
            /* Quiz */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz: {currentModule.title}</h2>
              <p className="text-gray-600 mb-8">Answer all questions to complete this module. You need 70% to pass.</p>
              
              <div className="space-y-8">
                {currentModule.quiz.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {questionIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${questionIndex}`}
                            value={optionIndex}
                            checked={quizAnswers[questionIndex] === optionIndex}
                            onChange={() => handleQuizAnswer(questionIndex, optionIndex)}
                            className="mr-3 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(quizAnswers).length !== currentModule.quiz.questions.length}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="text-sm text-gray-500">
              {completedModules.length} of {modules.length} modules completed
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Intermediate Gardener Path</h1>
          <p className="text-xl text-gray-600">Level up your skills with advanced plant care, nutrition, and garden planning</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
            <div className="text-sm text-gray-500">
              {Math.round((completedModules.length / modules.length) * 100)}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon
            const status = getModuleStatus(module.id)
            const isCompleted = status === 'completed'
            const isLocked = status === 'locked'
            const isAvailable = status === 'available'
            
            return (
              <div 
                key={module.id} 
                className={`bg-white rounded-xl border shadow-sm transition-all duration-300 ${
                  isLocked 
                    ? 'border-gray-200 opacity-60 cursor-not-allowed' 
                    : isAvailable 
                    ? 'border-gray-200 hover:border-primary-300 hover:shadow-lg cursor-pointer' 
                    : 'border-blue-200 bg-blue-50'
                }`}
                onClick={() => isAvailable && startModule(module)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${getColorClasses(module.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {isLocked && <Lock className="h-5 w-5 text-gray-400" />}
                      {isAvailable && <Play className="h-5 w-5 text-primary-600" />}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {module.estimatedTime}
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {module.difficulty}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{module.lessons.length} lessons</span>
                      {module.hasVideo && (
                        <div className="flex items-center ml-2 text-red-600">
                          <Video className="h-3 w-3 mr-1" />
                          <span className="text-xs">Video</span>
                        </div>
                      )}
                    </div>
                    {isCompleted && (
                      <div className="text-sm text-green-600 font-medium">
                        Score: {Math.round(moduleProgress[module.id]?.score || 0)}%
                      </div>
                    )}
                  </div>
                  
                  {isLocked && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800">
                        Complete the previous module to unlock this one
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedModules.length === modules.length && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 text-center mb-2">
              Excellent Work! 🎉
            </h3>
            <p className="text-blue-700 text-center mb-4">
              You've mastered the Intermediate Gardener Path! You're now ready for the Expert level.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/learning/expert"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Expert Path
              </Link>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideo && currentModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Video: {currentModule.title}</h3>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="aspect-video w-full">
                  <iframe
                    src={currentModule.videoUrl}
                    title={`${currentModule.title} Video`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    Watch this video to see practical demonstrations of the concepts covered in this module.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IntermediateLearningPath


