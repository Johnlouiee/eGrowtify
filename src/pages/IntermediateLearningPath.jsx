import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Beaker, Bug, LayoutGrid, CalendarDays, Droplets, Leaf, Sun, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Shield, Recycle, Video, PlayCircle, X, LeafyGreen
} from 'lucide-react'
import toast from 'react-hot-toast'
import ImageDisplay from '../components/ImageDisplay'
import { useAuth } from '../contexts/AuthContext'

const IntermediateLearningPath = () => {
  const { user } = useAuth()
  const [currentModule, setCurrentModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [moduleProgress, setModuleProgress] = useState({})
  const [showVideo, setShowVideo] = useState(false)
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  // Create user-specific localStorage keys
  const getStorageKey = (key) => {
    if (!user) return key // Fallback for non-authenticated users
    return `${key}_user_${user.id}`
  }

  const modules = [
    {
      id: 'nutrition',
      title: 'Plant Nutrition & Fertilizing - Feeding Your Garden',
      icon: Beaker,
      color: 'blue',
      estimatedTime: '35 min',
      difficulty: 'Intermediate',
      description: 'Master the science of plant nutrition and develop smart fertilizing strategies for optimal plant health',
      lessons: [
        {
          title: 'Understanding Plant Nutrients - The Building Blocks of Growth',
          content: 'Plants are like athletes - they need the right nutrients in the right amounts to perform at their best. Understanding plant nutrition is key to growing healthy, productive plants:',
          points: [
            '🌿 NITROGEN (N) - The Growth Engine: Essential for leaf and stem growth, makes leaves green and lush. Deficiency signs: Yellow leaves, stunted growth. Excess signs: Dark green leaves, weak stems. Best for: Leafy vegetables, lawns, foliage plants.',
            '🌸 PHOSPHORUS (P) - The Root & Flower Power: Critical for root development, flowering, and fruiting. Deficiency signs: Purple leaves, poor flowering, weak roots. Excess signs: Can block other nutrients. Best for: Flowering plants, root vegetables, young plants.',
            '💪 POTASSIUM (K) - The Disease Fighter: Strengthens plants against diseases, improves fruit quality, helps with water regulation. Deficiency signs: Brown leaf edges, weak stems, poor fruit quality. Best for: Fruit trees, tomatoes, peppers.',
            '🔬 SECONDARY NUTRIENTS: Calcium (strong cell walls), Magnesium (chlorophyll production), Sulfur (protein synthesis). These are needed in smaller amounts but are still essential for plant health.',
            '⚡ MICRONUTRIENTS: Iron, zinc, copper, manganese, boron, molybdenum. Needed in tiny amounts but crucial for specific plant functions. Deficiency can cause specific symptoms like yellowing between leaf veins.',
            '📊 NUTRIENT BALANCE: The key is balance - too much of one nutrient can block others. Use balanced fertilizers (like 10-10-10) unless you have specific needs. Test your soil to know what your plants actually need.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/learning/intermediate/nutrient-deficiency-chart.jpg',
              alt: 'Plant nutrient deficiency symptoms chart',
              description: 'Visual chart showing different nutrient deficiency symptoms in plants with leaf color changes and growth patterns',
              type: 'analysis'
            },
            {
              src: '/images/learning/intermediate/npk-fertilizer-labels.jpg',
              alt: 'NPK fertilizer labels explanation',
              description: 'Examples of fertilizer labels showing NPK ratios and what each number means for plant nutrition',
              type: 'analysis'
            }
          ]
        },
        {
          title: 'Types of Plant Food',
          content: 'Different ways to feed your plants:',
          points: [
            'Liquid fertilizer: Works fast, easy to use',
            'Granular fertilizer: Releases slowly over time',
            'Organic options: Compost, manure, fish emulsion',
            'Choose what works best for your plants'
          ],
          type: 'lesson'
        },
        {
          title: 'When and How to Fertilize',
          content: 'Timing and methods for feeding plants:',
          points: [
            'Spring: When plants start growing again',
            'Summer: Feed heavy feeders like tomatoes',
            'Fall: Stop feeding most plants',
            'Follow package directions for amounts'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'Which nutrient helps plants grow tall and green?',
            options: ['Phosphorus', 'Nitrogen', 'Potassium', 'Calcium'],
            correct: 1
          },
          {
            question: 'When should you stop fertilizing most plants?',
            options: ['Spring', 'Summer', 'Fall', 'Winter'],
            correct: 2
          },
          {
            question: 'Can too much fertilizer hurt plants?',
            options: ['No, never', 'Yes, it can burn roots', 'Only in winter', 'Only for flowers'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'pests',
      title: 'Pest & Disease Control',
      icon: Bug,
      color: 'red',
      estimatedTime: '30 min',
      difficulty: 'Intermediate',
      description: 'Learn to identify and control common garden problems',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lessons: [
        {
          title: 'Preventing Problems',
          content: 'Keep your plants healthy to avoid pests and diseases:',
          points: [
            'Give plants enough space for good air flow',
            'Remove dead leaves and debris regularly',
            'Keep new plants separate for a few weeks',
            'Healthy plants fight off problems better'
          ],
          type: 'lesson'
        },
        {
          title: 'Common Garden Pests',
          content: 'Know what bugs to look for:',
          points: [
            'Aphids: Small green or black bugs on new growth',
            'Spider mites: Tiny red dots with fine webs',
            'Whiteflies: Small white bugs that fly away',
            'Scale: Hard bumps on stems and leaves'
          ],
          type: 'lesson'
        },
        {
          title: 'Natural Pest Control',
          content: 'Safe ways to control pests:',
          points: [
            'Hand pick bugs when you see them',
            'Use soapy water to spray small bugs',
            'Attract helpful insects like ladybugs',
            'Use chemicals only as a last resort'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the best way to prevent pest problems?',
            options: ['Spray pesticides', 'Keep plants healthy', 'Remove all plants', 'Call an expert'],
            correct: 1
          },
          {
            question: 'Which pest makes fine webs on plants?',
            options: ['Aphids', 'Spider mites', 'Whiteflies', 'Scale insects'],
            correct: 1
          },
          {
            question: 'What should you try first for pest control?',
            options: ['Strong chemicals', 'Natural methods', 'Remove the plant', 'Do nothing'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'seasonal',
      title: 'Seasonal Garden Planning',
      icon: CalendarDays,
      color: 'green',
      estimatedTime: '28 min',
      difficulty: 'Intermediate',
      description: 'Plan your garden for year-round success',
      lessons: [
        {
          title: 'Cool vs Warm Season Plants',
          content: 'Know which plants grow in which seasons:',
          points: [
            'Cool season: Lettuce, spinach, peas, broccoli',
            'Warm season: Tomatoes, peppers, beans, corn',
            'Know your frost dates for planting',
            'Different areas have different growing seasons'
          ],
          type: 'lesson'
        },
        {
          title: 'Succession Planting',
          content: 'Keep your garden producing all season:',
          points: [
            'Plant new seeds every 2-3 weeks',
            'Replace finished crops with new ones',
            'Mix fast and slow growing plants',
            'Use covers to extend the season'
          ],
          type: 'lesson'
        },
        {
          title: 'Crop Rotation',
          content: 'Move plants around to keep soil healthy:',
          points: [
            'Don\'t plant the same family in the same spot',
            'Follow heavy feeders with light feeders',
            'Prevents diseases from building up',
            'Use cover crops to improve soil'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'Which plants grow in cool weather?',
            options: ['Tomatoes', 'Lettuce', 'Peppers', 'Corn'],
            correct: 1
          },
          {
            question: 'What is succession planting?',
            options: ['Planting one crop', 'Planting at different times', 'Planting in rows', 'Using only seeds'],
            correct: 1
          },
          {
            question: 'Why rotate crops?',
            options: ['Saves money', 'Keeps soil healthy', 'Looks better', 'Easier to manage'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'design',
      title: 'Garden Design & Layout',
      icon: LayoutGrid,
      color: 'purple',
      estimatedTime: '32 min',
      difficulty: 'Intermediate',
      description: 'Create beautiful and productive garden layouts',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lessons: [
        {
          title: 'Understanding Your Garden Space',
          content: 'Know your garden\'s unique conditions:',
          points: [
            'Map where the sun shines throughout the day',
            'Find areas that are wet or dry',
            'Check for wind patterns',
            'Look for microclimates in your space'
          ],
          type: 'lesson'
        },
        {
          title: 'Companion Planting',
          content: 'Plant friends together for better results:',
          points: [
            'Marigolds help keep pests away from tomatoes',
            'Basil grows well with peppers',
            'Strong-smelling herbs repel insects',
            'Some plants help others grow better'
          ],
          type: 'lesson'
        },
        {
          title: 'Vertical Growing',
          content: 'Use vertical space to grow more:',
          points: [
            'Trellises support climbing plants',
            'Vertical planters save ground space',
            'Hanging baskets use overhead space',
            'Living walls create privacy and beauty'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is a microclimate?',
            options: ['A small garden', 'Different growing conditions in small areas', 'Indoor gardening', 'Container gardening'],
            correct: 1
          },
          {
            question: 'Which plant helps keep pests away from tomatoes?',
            options: ['Potatoes', 'Marigolds', 'Corn', 'Cabbage'],
            correct: 1
          },
          {
            question: 'What is the main benefit of vertical gardening?',
            options: ['Saves water', 'Uses more space', 'Prevents pests', 'Improves soil'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'advanced-soil',
      title: 'Advanced Soil-Plant Relationships',
      icon: LeafyGreen,
      color: 'emerald',
      estimatedTime: '30 min',
      difficulty: 'Intermediate',
      description: 'Master soil chemistry and plant nutrition relationships',
      lessons: [
        {
          title: 'Soil pH and Plant Health',
          content: 'Understanding how soil acidity affects plant growth:',
          points: [
            'Acidic soil (pH 4.5-6.5): Perfect for blueberries, azaleas, and rhododendrons',
            'Neutral soil (pH 6.5-7.5): Ideal for most vegetables and garden plants',
            'Alkaline soil (pH 7.5-8.5): Good for lavender, clematis, and some herbs',
            'Testing pH: Use test strips or send samples to extension services'
          ],
          type: 'lesson'
        },
        {
          title: 'Nutrient Availability and Soil Type',
          content: 'How different soil types affect nutrient availability:',
          points: [
            'Clay soil: Holds nutrients well but may lock them up',
            'Sandy soil: Nutrients wash away quickly, need frequent feeding',
            'Loamy soil: Balanced nutrient retention and availability',
            'Organic matter: Improves nutrient availability in all soil types'
          ],
          type: 'lesson'
        },
        {
          title: 'Plant-Specific Soil Requirements',
          content: 'Advanced understanding of plant soil preferences:',
          points: [
            'Root depth: Deep-rooted plants need well-drained soil',
            'Water needs: Match soil drainage to plant water requirements',
            'Nutrient demands: Heavy feeders need rich, fertile soil',
            'Seasonal changes: Adjust soil conditions for different growth phases'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'This soil test shows a pH of 5.2. Which plant would thrive best?',
            image: '/images/soil-ph-test.jpg',
            options: ['Tomatoes', 'Blueberries', 'Lavender', 'Lettuce'],
            correct: 1,
            explanation: 'A pH of 5.2 is acidic, which is perfect for blueberries. They require acidic soil (pH 4.5-6.0) to absorb nutrients properly and produce healthy fruit.'
          },
          {
            question: 'This plant is showing nutrient deficiency symptoms. What soil improvement would help most?',
            image: '/images/plant-nutrient-deficiency.jpg',
            options: ['Add more sand', 'Add compost and organic matter', 'Increase watering', 'Add lime'],
            correct: 1,
            explanation: 'Nutrient deficiency often indicates poor soil fertility. Adding compost and organic matter improves nutrient availability and soil structure for better plant health.'
          },
          {
            question: 'This soil sample feels gritty and drains very quickly. What type of soil is this?',
            image: '/images/soil-sandy-texture.jpg',
            options: ['Clay soil', 'Sandy soil', 'Loamy soil', 'Peaty soil'],
            correct: 1,
            explanation: 'Sandy soil feels gritty and drains quickly. It\'s great for drought-tolerant plants but needs frequent watering and fertilizing for most garden plants.'
          }
        ]
      }
    },
    {
      id: 'compost',
      title: 'Composting & Soil Health',
      icon: Recycle,
      color: 'brown',
      estimatedTime: '25 min',
      difficulty: 'Intermediate',
      description: 'Make your own compost and improve soil health',
      lessons: [
        {
          title: 'What is Compost?',
          content: 'Understanding the magic of compost:',
          points: [
            'Compost is broken-down organic matter',
            'It adds nutrients to soil naturally',
            'It helps soil hold water better',
            'It\'s free fertilizer for your plants'
          ],
          type: 'lesson'
        },
        {
          title: 'What Goes in Compost',
          content: 'Know what to add to your compost pile:',
          points: [
            'Green materials: Vegetable scraps, grass clippings',
            'Brown materials: Dry leaves, newspaper, cardboard',
            'Avoid: Meat, dairy, oily foods',
            'Mix greens and browns for best results'
          ],
          type: 'lesson'
        },
        {
          title: 'Making Great Compost',
          content: 'Steps to make quality compost:',
          points: [
            'Choose a good spot in your yard',
            'Layer green and brown materials',
            'Keep it moist but not soaking wet',
            'Turn it every few weeks to help it break down'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is compost made from?',
            options: ['Fresh soil', 'Broken-down organic matter', 'Plant food', 'Water'],
            correct: 1
          },
          {
            question: 'What should you avoid putting in compost?',
            options: ['Vegetable scraps', 'Meat and dairy', 'Dry leaves', 'Grass clippings'],
            correct: 1
          },
          {
            question: 'How often should you turn your compost?',
            options: ['Every day', 'Every few weeks', 'Never', 'Once a year'],
            correct: 1
          }
        ]
      }
    }
  ]

  useEffect(() => {
    // FORCE CLEAR all old progress data first (aggressive migration)
    clearOldProgressData()
    
    // FORCE RESET - Always start with empty progress for now
    console.log('🔄 FORCE RESETTING ALL PROGRESS - Starting fresh for all users')
    setCompletedModules([])
    setModuleProgress({})
    
    // Clear any remaining progress data
    const storageKey = getStorageKey('intermediateProgress')
    localStorage.removeItem(storageKey)
    
    // Also clear any other possible keys
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
    
    console.log('✅ ALL PROGRESS RESET - Every user now starts with 0%')
    
    // For now, allow access to intermediate path (remove beginner requirement temporarily)
    // toast.error('Please complete the Beginner Learning Path first!')
    // window.location.href = '/learning/beginner'
  }, [user]) // Re-run when user changes

  const clearOldProgressData = () => {
    console.log('🧹 FORCE CLEARING ALL LEARNING PATH DATA...')
    
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
      console.log(`✅ Cleared: ${key}`)
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
      console.log(`✅ FORCE CLEARED: ${key}`)
    })
    
    console.log(`🎉 FORCE CLEARED ${keysToRemove.length} learning path keys`)
  }

  const saveProgress = (newCompletedModules, newModuleProgress) => {
    const progress = {
      version: '2.0', // Version to identify new format
      completedModules: newCompletedModules,
      moduleProgress: newModuleProgress,
      userId: user?.id, // Store user ID for verification
      lastUpdated: new Date().toISOString()
    }
    const storageKey = getStorageKey('intermediateProgress')
    localStorage.setItem(storageKey, JSON.stringify(progress))
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

    // Always mark module as completed and show results
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
    
    setQuizScore(score)
    setShowQuizResults(true)
    
    toast.success(`Quiz completed! You scored ${Math.round(score)}%. Check your answers below.`)
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
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      brown: 'bg-amber-100 text-amber-700 border-amber-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getQuestionHint = (moduleId, questionIndex) => {
    const hints = {
      'nutrition': [
        'Nitrogen is what makes plants green and helps them grow tall.',
        'Fall is when most plants slow down and need less food.',
        'Too much fertilizer can burn plant roots and harm them.'
      ],
      'pests': [
        'Keeping plants healthy is the best way to prevent problems.',
        'Spider mites create fine webs on plants.',
        'Natural methods are safer and often more effective than chemicals.'
      ],
      'seasonal': [
        'Cool season crops like lettuce grow best in spring and fall.',
        'Succession planting means planting at different times for continuous harvest.',
        'Crop rotation prevents soil from getting depleted of nutrients.'
      ],
      'design': [
        'Microclimates are small areas with different growing conditions.',
        'Marigolds are known to help repel pests from tomatoes.',
        'Vertical gardening helps you grow more in less space.'
      ],
      'advanced-soil': [
        'Acidic soil (pH 5.2) is perfect for acid-loving plants like blueberries.',
        'Nutrient deficiency symptoms often indicate poor soil fertility that can be improved with organic matter.',
        'Sandy soil feels gritty and drains quickly, which is great for drought-tolerant plants.'
      ],
      'compost': [
        'Compost is organic matter that has broken down naturally.',
        'Meat and dairy can attract pests and create bad smells.',
        'Turning compost helps it break down faster and more evenly.'
      ]
    }
    return hints[moduleId]?.[questionIndex] || 'Think about what you learned in the lesson above.'
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
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {currentLesson + 1} of {currentModule.lessons.length}
                  </span>
                </div>
                
                <button
                  onClick={nextLesson}
                  className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
              
              {/* Quiz Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Quiz Tips for Intermediate Gardeners</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• You've learned the basics - now apply that knowledge to more advanced concepts</li>
                      <li>• Think about how different techniques work together in your garden</li>
                      <li>• Consider the "why" behind each answer - what makes it the best choice?</li>
                      <li>• There's no passing rate - just do your best and learn!</li>
                      <li>• If unsure, think about what would work best for plant health</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">Answer all questions to complete this module. You'll see the correct answers after submitting!</p>
              
              <div className="space-y-8">
                {currentModule.quiz.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {questionIndex + 1}. {question.question}
                    </h3>
                    
                    {/* Question Image */}
                    {question.image && (
                      <div className="mb-6">
                        <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                          <div className="text-center">
                            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                              <div className="text-center">
                                <div className="text-4xl mb-2">🧪</div>
                                <p className="text-gray-600 text-sm">Soil/Plant Analysis</p>
                                <p className="text-gray-500 text-xs">(Image would be displayed here)</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">
                              {question.image.includes('ph') ? 'Soil pH test result' : 
                               question.image.includes('deficiency') ? 'Plant nutrient deficiency symptoms' : 
                               'Soil texture analysis'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Question Hint */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-800">
                          <strong>Hint:</strong> {getQuestionHint(currentModule.id, questionIndex)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
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

          {/* Quiz Results Review */}
          {showQuizResults && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Results: {currentModule.title}</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">Your Score: {Math.round(quizScore)}%</h3>
                  <p className="text-blue-800">Great job completing this module! Here are the correct answers:</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {currentModule.quiz.questions.map((question, questionIndex) => {
                  const userAnswer = quizAnswers[questionIndex]
                  const correctAnswer = question.correct
                  const isCorrect = userAnswer === correctAnswer
                  
                  return (
                    <div key={questionIndex} className="border-b border-gray-200 pb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {questionIndex + 1}. {question.question}
                      </h3>
                      
                      {/* Question Image in Results */}
                      {question.image && (
                        <div className="mb-6">
                          <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                            <div className="text-center">
                              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">🧪</div>
                                  <p className="text-gray-600 text-sm">Soil/Plant Analysis</p>
                                  <p className="text-gray-500 text-xs">(Image would be displayed here)</p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 italic">
                                {question.image.includes('ph') ? 'Soil pH test result' : 
                                 question.image.includes('deficiency') ? 'Plant nutrient deficiency symptoms' : 
                                 'Soil texture analysis'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        {question.options.map((option, optionIndex) => {
                          let optionClass = "p-3 rounded-lg border-2 "
                          let textClass = "text-gray-700"
                          
                          if (optionIndex === correctAnswer) {
                            optionClass += "border-green-500 bg-green-50"
                            textClass = "text-green-800 font-semibold"
                          } else if (optionIndex === userAnswer && !isCorrect) {
                            optionClass += "border-red-500 bg-red-50"
                            textClass = "text-red-800"
                          } else {
                            optionClass += "border-gray-200 bg-gray-50"
                            textClass = "text-gray-600"
                          }
                          
                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center">
                                {optionIndex === correctAnswer && (
                                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <X className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                                )}
                                <span className={textClass}>{option}</span>
                                {optionIndex === correctAnswer && (
                                  <span className="ml-auto text-green-600 font-semibold">Correct Answer</span>
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <span className="ml-auto text-red-600 font-semibold">Your Answer</span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Explanation for picture-based questions */}
                      {question.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-1">Explanation:</h4>
                              <p className="text-sm text-blue-800">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    setCurrentModule(null)
                    setShowQuiz(false)
                    setShowQuizResults(false)
                    setQuizAnswers({})
                  }}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Back to Modules
                </button>
              </div>
              
              {/* Show completion message if this was the last module */}
              {completedModules.length + 1 === modules.length && (
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
                    <button
                      onClick={() => {
                        setCurrentModule(null)
                        setShowQuiz(false)
                        setShowQuizResults(false)
                        setQuizAnswers({})
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Modules
                    </button>
                  </div>
                </div>
              )}
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
              {Math.min(100, Math.round((completedModules.length / modules.length) * 100))}% Complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (completedModules.length / modules.length) * 100)}%` }}
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
                    : 'border-blue-200 bg-blue-50 hover:border-blue-300 hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => (isAvailable || isCompleted) && startModule(module)}
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
                  
                  {/* Review Button for Completed Modules */}
                  {isCompleted && (
                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startModule(module)
                        }}
                        className="w-full px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        Review Module
                      </button>
                    </div>
                  )}
                  
                  {/* Next Module Button */}
                  {isCompleted && index < modules.length - 1 && (
                    <div className="mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const nextModule = modules[index + 1]
                          if (getModuleStatus(nextModule.id) !== 'locked') {
                            startModule(nextModule)
                          }
                        }}
                        className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        Next: {modules[index + 1].title}
                      </button>
                    </div>
                  )}
                  
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
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 text-center mb-3">
              Excellent Work! 🎉
            </h3>
            <p className="text-blue-700 text-center mb-6 text-lg">
              You've mastered the Intermediate Gardener Path! You're now ready for the Expert level.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/learning/expert"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <TrendingUp className="h-6 w-6 mr-3" />
                Proceed to Expert Path
              </Link>
              <p className="text-sm text-blue-600 font-medium">
                Ready to become a Master Gardener? 🌱
              </p>
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


