import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Video, PlayCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const BeginnerLearningPath = () => {
  const [currentModule, setCurrentModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [moduleProgress, setModuleProgress] = useState({})
  const [showVideo, setShowVideo] = useState(false)

  const modules = [
    {
      id: 'intro',
      title: 'Introduction to Planting',
      icon: BookOpen,
      color: 'green',
      estimatedTime: '15 min',
      difficulty: 'Beginner',
      description: 'Learn the fundamentals of plant types and choosing your first plants',
      lessons: [
        {
          title: 'Understanding Plant Types',
          content: 'Plants are categorized into three main types based on their life cycle:',
          points: [
            'Annuals: Complete their life cycle in one growing season (marigolds, lettuce)',
            'Perennials: Live for multiple years (roses, hostas, many herbs)',
            'Biennials: Take two years to complete their cycle (carrots, parsley)'
          ],
          type: 'lesson'
        },
        {
          title: 'Choosing Beginner-Friendly Plants',
          content: 'Start with these forgiving plants that are perfect for beginners:',
          points: [
            'Herbs: Basil, mint, parsley, chives',
            'Vegetables: Lettuce, spinach, radishes, cherry tomatoes',
            'Flowers: Marigolds, calendula, sunflowers',
            'Houseplants: Pothos, snake plant, spider plant'
          ],
          type: 'lesson'
        },
        {
          title: 'Starting Small Strategy',
          content: 'The key to success is starting small and building confidence:',
          points: [
            'Begin with 3-5 plants maximum',
            'Learn the daily care routine first',
            'Master watering and light requirements',
            'Scale up gradually as you gain experience'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What type of plant completes its life cycle in one season?',
            options: ['Annual', 'Perennial', 'Biennial', 'All of the above'],
            correct: 0
          },
          {
            question: 'Which is NOT a good beginner plant?',
            options: ['Basil', 'Orchid', 'Lettuce', 'Marigold'],
            correct: 1
          },
          {
            question: 'How many plants should a beginner start with?',
            options: ['10-15', '3-5', '20+', 'Just one'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'light',
      title: 'Light Basics',
      icon: Sun,
      color: 'yellow',
      estimatedTime: '20 min',
      difficulty: 'Beginner',
      description: 'Master the art of providing proper light for your plants',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual gardening video
      lessons: [
        {
          title: 'Understanding Light Requirements',
          content: 'Different plants have different light needs:',
          points: [
            'Full sun: 6-8 hours of direct sunlight (most vegetables)',
            'Partial sun: 3-6 hours of direct sun (many herbs)',
            'Partial shade: 2-4 hours of direct sun (some flowers)',
            'Full shade: Less than 2 hours of direct sun (hostas, ferns)'
          ],
          type: 'lesson'
        },
        {
          title: 'Indoor Light Management',
          content: 'Maximize light for indoor plants:',
          points: [
            'Place plants near south or east-facing windows',
            'Rotate plants weekly for even growth',
            'Use grow lights if natural light is insufficient',
            'Clean windows regularly to maximize light transmission'
          ],
          type: 'lesson'
        },
        {
          title: 'Low-Light Plant Options',
          content: 'Perfect plants for darker spaces:',
          points: [
            'Pothos: Tolerates low light, easy to care for',
            'Snake Plant: Very forgiving, needs minimal water',
            'ZZ Plant: Thrives in low light, drought tolerant',
            'Peace Lily: Beautiful flowers, low light tolerant'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'How many hours of direct sun do most vegetables need?',
            options: ['2-4 hours', '6-8 hours', '10+ hours', 'No direct sun'],
            correct: 1
          },
          {
            question: 'Which window direction provides the best light for indoor plants?',
            options: ['North', 'South', 'West', 'All are equal'],
            correct: 1
          },
          {
            question: 'Which plant is best for low-light conditions?',
            options: ['Tomato', 'Snake Plant', 'Sunflower', 'Rose'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'soil',
      title: 'Soil & Containers',
      icon: Leaf,
      color: 'brown',
      estimatedTime: '18 min',
      difficulty: 'Beginner',
      description: 'Learn about proper soil and container selection',
      lessons: [
        {
          title: 'Choosing the Right Soil',
          content: 'Soil is the foundation of plant health:',
          points: [
            'Use quality potting mix for containers',
            'Avoid heavy garden soil in pots',
            'Look for well-draining, nutrient-rich mixes',
            'Consider organic options for edible plants'
          ],
          type: 'lesson'
        },
        {
          title: 'Container Selection',
          content: 'The right container makes all the difference:',
          points: [
            'Ensure drainage holes in all containers',
            'Add saucers indoors to catch excess water',
            'Choose appropriate size for plant growth',
            'Consider material: clay, plastic, or ceramic'
          ],
          type: 'lesson'
        },
        {
          title: 'Soil Amendments',
          content: 'Improve your soil with these additions:',
          points: [
            'Compost: Adds nutrients and improves structure',
            'Perlite: Improves drainage and aeration',
            'Vermiculite: Helps retain moisture',
            'Organic matter: Feeds beneficial soil organisms'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the most important feature of a plant container?',
            options: ['Color', 'Drainage holes', 'Size', 'Material'],
            correct: 1
          },
          {
            question: 'Which soil amendment improves drainage?',
            options: ['Compost', 'Perlite', 'Clay', 'Sand'],
            correct: 1
          },
          {
            question: 'Should you use garden soil in containers?',
            options: ['Yes, always', 'No, use potting mix', 'Only for large plants', 'Depends on the plant'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'water',
      title: 'Watering Fundamentals',
      icon: Droplets,
      color: 'blue',
      estimatedTime: '25 min',
      difficulty: 'Beginner',
      description: 'Master the most important aspect of plant care',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual watering video
      lessons: [
        {
          title: 'Watering Principles',
          content: 'The golden rules of watering:',
          points: [
            'Water deeply but less frequently',
            'Let top 2-5 cm of soil dry between waterings',
            'Morning watering reduces disease risk',
            'Avoid watering leaves to prevent fungal issues'
          ],
          type: 'lesson'
        },
        {
          title: 'The Finger Test',
          content: 'The simplest way to check if your plant needs water:',
          points: [
            'Insert finger into soil up to first knuckle',
            'If soil feels dry, it\'s time to water',
            'If soil feels moist, wait a day or two',
            'Different plants have different moisture needs'
          ],
          type: 'lesson'
        },
        {
          title: 'Watering Techniques',
          content: 'Proper watering methods for different situations:',
          points: [
            'Bottom watering: Place pot in water tray',
            'Top watering: Pour water directly on soil',
            'Misting: For humidity-loving plants',
            'Deep watering: Ensures roots get moisture'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the best time of day to water plants?',
            options: ['Evening', 'Morning', 'Midday', 'Any time'],
            correct: 1
          },
          {
            question: 'How do you check if a plant needs water?',
            options: ['Look at the leaves', 'Finger test', 'Check the pot weight', 'All of the above'],
            correct: 3
          },
          {
            question: 'What happens if you water too frequently?',
            options: ['Plants grow faster', 'Root rot can occur', 'More flowers', 'Nothing'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'climate',
      title: 'Temperature & Humidity',
      icon: Thermometer,
      color: 'orange',
      estimatedTime: '20 min',
      difficulty: 'Beginner',
      description: 'Understand how temperature and humidity affect your plants',
      lessons: [
        {
          title: 'Optimal Temperature Ranges',
          content: 'Most plants thrive in specific temperature ranges:',
          points: [
            'Most houseplants: 18-27°C (65-80°F)',
            'Avoid drafts from windows and doors',
            'Keep away from heat vents and radiators',
            'Monitor temperature fluctuations'
          ],
          type: 'lesson'
        },
        {
          title: 'Humidity Management',
          content: 'Humidity is crucial for many plants:',
          points: [
            'Tropical plants prefer 40-60% humidity',
            'Use humidifiers for dry indoor air',
            'Group plants together to increase humidity',
            'Pebble trays can help increase local humidity'
          ],
          type: 'lesson'
        },
        {
          title: 'Seasonal Adjustments',
          content: 'Adapt your care to seasonal changes:',
          points: [
            'Reduce watering in winter months',
            'Increase humidity during heating season',
            'Move plants away from cold windows',
            'Harden off seedlings before outdoor planting'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What temperature range do most houseplants prefer?',
            options: ['10-15°C', '18-27°C', '30-35°C', '5-10°C'],
            correct: 1
          },
          {
            question: 'How can you increase humidity for plants?',
            options: ['Use a humidifier', 'Group plants together', 'Use pebble trays', 'All of the above'],
            correct: 3
          },
          {
            question: 'What should you do in winter?',
            options: ['Water more', 'Reduce watering', 'Move to colder spot', 'Nothing'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'starter',
      title: 'Starter Plants & Easy Wins',
      icon: Sprout,
      color: 'emerald',
      estimatedTime: '22 min',
      difficulty: 'Beginner',
      description: 'Discover the best plants to start your gardening journey',
      lessons: [
        {
          title: 'Herb Garden Essentials',
          content: 'Start with these easy-to-grow herbs:',
          points: [
            'Basil: Loves warmth and regular watering',
            'Mint: Grows vigorously, perfect for beginners',
            'Parsley: Biennial, great for cooking',
            'Chives: Perennial, comes back every year'
          ],
          type: 'lesson'
        },
        {
          title: 'Beginner Vegetables',
          content: 'These vegetables are forgiving for new gardeners:',
          points: [
            'Lettuce: Fast-growing, can harvest multiple times',
            'Spinach: Cool-season crop, easy to grow',
            'Radishes: Ready in 3-4 weeks',
            'Cherry tomatoes: More forgiving than large tomatoes'
          ],
          type: 'lesson'
        },
        {
          title: 'Easy Houseplants',
          content: 'Perfect indoor plants for beginners:',
          points: [
            'Pothos: Very forgiving, great for low light',
            'Spider Plant: Produces baby plants easily',
            'Snake Plant: Nearly indestructible',
            'Peace Lily: Beautiful flowers, low maintenance'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'Which herb is known for growing vigorously?',
            options: ['Basil', 'Mint', 'Parsley', 'Chives'],
            correct: 1
          },
          {
            question: 'How long do radishes take to mature?',
            options: ['1 week', '3-4 weeks', '2 months', '6 months'],
            correct: 1
          },
          {
            question: 'Which houseplant is nearly indestructible?',
            options: ['Orchid', 'Snake Plant', 'Fiddle Leaf Fig', 'Succulent'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'problems',
      title: 'Common Problems & Quick Fixes',
      icon: AlertCircle,
      color: 'red',
      estimatedTime: '30 min',
      difficulty: 'Beginner',
      description: 'Learn to identify and solve common plant problems',
      lessons: [
        {
          title: 'Yellow Leaves Diagnosis',
          content: 'Yellow leaves can indicate several issues:',
          points: [
            'Overwatering: Most common cause, check soil moisture',
            'Underwatering: Soil feels dry, plant looks wilted',
            'Nutrient deficiency: Older leaves turn yellow first',
            'Natural aging: Bottom leaves yellow and drop naturally'
          ],
          type: 'lesson'
        },
        {
          title: 'Growth Problems',
          content: 'Identify and fix growth issues:',
          points: [
            'Leggy growth: Insufficient light, move to brighter spot',
            'Stunted growth: Check for root bound conditions',
            'No flowers: May need more light or different fertilizer',
            'Wilting: Could be over/under watering or disease'
          ],
          type: 'lesson'
        },
        {
          title: 'Quick Fixes',
          content: 'Simple solutions for common problems:',
          points: [
            'Brown tips: Low humidity, increase moisture',
            'Drooping: Check watering schedule',
            'Pale leaves: May need fertilizer or more light',
            'Slow growth: Ensure proper light and nutrients'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the most common cause of yellow leaves?',
            options: ['Too much light', 'Overwatering', 'Cold temperature', 'Old age'],
            correct: 1
          },
          {
            question: 'What causes leggy growth in plants?',
            options: ['Too much water', 'Insufficient light', 'Too much fertilizer', 'Cold weather'],
            correct: 1
          },
          {
            question: 'What causes brown tips on leaves?',
            options: ['Too much water', 'Low humidity', 'Too much light', 'Old age'],
            correct: 1
          }
        ]
      }
    }
  ]

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('beginnerProgress')
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
    localStorage.setItem('beginnerProgress', JSON.stringify(progress))
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
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      brown: 'bg-amber-100 text-amber-700 border-amber-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      red: 'bg-red-100 text-red-700 border-red-200'
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Beginner Gardener Path</h1>
          <p className="text-xl text-gray-600">Master the fundamentals of plant care with our structured learning modules</p>
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
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
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
                    : 'border-green-200 bg-green-50'
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
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 text-center mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 text-center mb-4">
              You've completed the Beginner Gardener Path! You're now ready to move on to the Intermediate level.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/learning/intermediate"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Start Intermediate Path
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

export default BeginnerLearningPath


