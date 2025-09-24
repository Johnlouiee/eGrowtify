import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Video, PlayCircle, X
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
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

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
            options: ['Too much light', 'Too much water', 'Cold weather', 'Old age'],
            correct: 1
          },
          {
            question: 'What causes plants to grow tall and thin?',
            options: ['Too much water', 'Not enough light', 'Too much food', 'Cold weather'],
            correct: 1
          },
          {
            question: 'What causes brown tips on leaves?',
            options: ['Too much water', 'Dry air', 'Too much light', 'Old age'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'tools',
      title: 'Essential Gardening Tools',
      icon: Target,
      color: 'gray',
      estimatedTime: '15 min',
      difficulty: 'Beginner',
      description: 'Learn about basic tools every gardener needs',
      lessons: [
        {
          title: 'Must-Have Tools',
          content: 'Start with these essential gardening tools:',
          points: [
            'Hand trowel: For planting and digging small holes',
            'Watering can: For gentle watering of plants',
            'Pruning shears: For cutting stems and dead leaves',
            'Gloves: Protect your hands from dirt and thorns'
          ],
          type: 'lesson'
        },
        {
          title: 'Tool Care',
          content: 'Keep your tools in good condition:',
          points: [
            'Clean tools after each use',
            'Store in dry place to prevent rust',
            'Sharpen blades regularly',
            'Oil moving parts to keep them working'
          ],
          type: 'lesson'
        },
        {
          title: 'Budget-Friendly Options',
          content: 'Start gardening without breaking the bank:',
          points: [
            'Use old spoons as small trowels',
            'Reuse containers as planters',
            'Make your own compost from kitchen scraps',
            'Start with seeds instead of buying plants'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What tool is best for planting small plants?',
            options: ['Big shovel', 'Hand trowel', 'Rake', 'Hoe'],
            correct: 1
          },
          {
            question: 'How should you store gardening tools?',
            options: ['In water', 'In a dry place', 'In the sun', 'In the dirt'],
            correct: 1
          },
          {
            question: 'What can you use instead of buying expensive planters?',
            options: ['Old containers', 'Only new pots', 'Only clay pots', 'Only plastic'],
            correct: 0
          }
        ]
      }
    },
    {
      id: 'seeds',
      title: 'Starting from Seeds',
      icon: Sprout,
      color: 'lime',
      estimatedTime: '20 min',
      difficulty: 'Beginner',
      description: 'Learn how to grow plants from seeds successfully',
      lessons: [
        {
          title: 'Choosing Seeds',
          content: 'Pick the right seeds for beginners:',
          points: [
            'Fast-growing seeds: Radishes, lettuce, beans',
            'Easy seeds: Sunflowers, marigolds, basil',
            'Read seed packets for planting instructions',
            'Start with a few types to learn'
          ],
          type: 'lesson'
        },
        {
          title: 'Planting Seeds',
          content: 'Simple steps to plant seeds:',
          points: [
            'Use good soil in small containers',
            'Plant seeds at the right depth',
            'Keep soil moist but not wet',
            'Place in warm, bright spot'
          ],
          type: 'lesson'
        },
        {
          title: 'Caring for Seedlings',
          content: 'Help your baby plants grow strong:',
          points: [
            'Water gently with spray bottle',
            'Give plenty of light',
            'Thin out crowded seedlings',
            'Transplant when they get bigger'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'Which seeds are good for beginners?',
            options: ['Slow-growing ones', 'Fast-growing ones', 'Expensive ones', 'Rare ones'],
            correct: 1
          },
          {
            question: 'How should you water small seedlings?',
            options: ['With a hose', 'Gently with spray bottle', 'Pour lots of water', 'Never water'],
            correct: 1
          },
          {
            question: 'What should you do with crowded seedlings?',
            options: ['Leave them alone', 'Thin them out', 'Add more seeds', 'Move them all'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'harvest',
      title: 'Harvesting Your Plants',
      icon: Award,
      color: 'gold',
      estimatedTime: '18 min',
      difficulty: 'Beginner',
      description: 'Learn when and how to harvest your plants',
      lessons: [
        {
          title: 'When to Harvest',
          content: 'Know the right time to pick your plants:',
          points: [
            'Herbs: Pick leaves when plant is healthy',
            'Lettuce: Cut outer leaves, let center grow',
            'Tomatoes: Pick when fully colored',
            'Flowers: Cut when buds are just opening'
          ],
          type: 'lesson'
        },
        {
          title: 'How to Harvest',
          content: 'Proper harvesting techniques:',
          points: [
            'Use clean, sharp tools',
            'Cut at the right angle',
            'Don\'t take more than 1/3 of plant',
            'Harvest in morning when plants are fresh'
          ],
          type: 'lesson'
        },
        {
          title: 'Using Your Harvest',
          content: 'Make the most of what you grow:',
          points: [
            'Use fresh herbs in cooking',
            'Share extra vegetables with friends',
            'Dry herbs for later use',
            'Save seeds for next year'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'When is the best time to harvest?',
            options: ['At night', 'In the morning', 'At noon', 'Any time'],
            correct: 1
          },
          {
            question: 'How much of a plant should you harvest at once?',
            options: ['All of it', 'Half of it', 'No more than 1/3', 'Just the top'],
            correct: 2
          },
          {
            question: 'What can you do with extra vegetables?',
            options: ['Throw them away', 'Share with friends', 'Feed to pets', 'Put in trash'],
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
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      brown: 'bg-amber-100 text-amber-700 border-amber-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
      lime: 'bg-lime-100 text-lime-700 border-lime-200',
      gold: 'bg-yellow-200 text-yellow-800 border-yellow-300'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getQuestionHint = (moduleId, questionIndex) => {
    const hints = {
      'intro': [
        'Think about plants that live for just one season vs. many years.',
        'Which plant would be hardest for a beginner to care for?',
        'Starting small helps you learn without getting overwhelmed.'
      ],
      'light': [
        'Most vegetables need lots of direct sunlight to grow well.',
        'South-facing windows get the most sunlight throughout the day.',
        'Some plants can survive with very little light.'
      ],
      'soil': [
        'Drainage holes let extra water escape so roots don\'t rot.',
        'Perlite is added to soil to help water drain better.',
        'Garden soil is too heavy and dense for small containers.'
      ],
      'water': [
        'Morning watering gives plants time to dry before night.',
        'The finger test is the easiest way to check soil moisture.',
        'Too much water can cause roots to rot and die.'
      ],
      'climate': [
        'Most houseplants like room temperature, not too hot or cold.',
        'You can increase humidity by grouping plants or using humidifiers.',
        'Plants need less water in winter when they grow slower.'
      ],
      'starter': [
        'Mint is known for growing very quickly and spreading.',
        'Radishes are one of the fastest vegetables to grow.',
        'Some plants are almost impossible to kill, even with poor care.'
      ],
      'problems': [
        'Too much water is the most common mistake beginners make.',
        'Plants stretch toward light when they don\'t get enough.',
        'Brown tips usually mean the air is too dry for the plant.'
      ],
      'tools': [
        'A hand trowel is perfect for small planting jobs.',
        'Tools last longer when stored in dry places.',
        'You can reuse many household items for gardening.'
      ],
      'seeds': [
        'Fast-growing seeds give beginners quick results and confidence.',
        'Small seedlings need gentle watering to avoid damage.',
        'Crowded seedlings compete for space and nutrients.'
      ],
      'harvest': [
        'Morning is when plants are freshest and full of water.',
        'Taking too much at once can stress the plant.',
        'Sharing extra produce is a great way to spread gardening joy.'
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
                    <h3 className="font-semibold text-blue-900 mb-2">Quiz Tips for Beginners</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Read each question carefully - the answer is usually in the lesson you just learned</li>
                      <li>• Don't worry if you're unsure - you'll see the correct answers after submitting</li>
                      <li>• Think about what makes sense for plant care and growing</li>
                      <li>• There's no passing rate - just do your best and learn!</li>
                      <li>• Take your time - there's no rush!</li>
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Beginner Gardener Path</h1>
          <p className="text-xl text-gray-600">Master the fundamentals of plant care with our structured learning modules</p>
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
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
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
                    : 'border-green-200 bg-green-50 hover:border-green-300 hover:shadow-lg cursor-pointer'
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
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <Award className="h-16 w-16 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 text-center mb-3">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 text-center mb-6 text-lg">
              You've completed the Beginner Gardener Path! You're now ready to move on to the Intermediate level.
            </p>
            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/learning/intermediate"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <TrendingUp className="h-6 w-6 mr-3" />
                Proceed to Intermediate Path
              </Link>
              <p className="text-sm text-green-600 font-medium">
                Ready to level up your gardening skills? 🌿
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

export default BeginnerLearningPath


