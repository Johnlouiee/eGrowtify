import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FlaskConical, Factory, LeafyGreen, Recycle, Beaker, Sprout, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Shield, Microscope, Video, PlayCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'

const ExpertLearningPath = () => {
  const [currentModule, setCurrentModule] = useState(null)
  const [completedModules, setCompletedModules] = useState([])
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [moduleProgress, setModuleProgress] = useState({})
  const [showVideo, setShowVideo] = useState(false)

  const modules = [
    {
      id: 'propagation',
      title: 'Advanced Propagation Techniques',
      icon: Sprout,
      color: 'green',
      estimatedTime: '35 min',
      difficulty: 'Expert',
      description: 'Master professional propagation methods and techniques',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual propagation video
      lessons: [
        {
          title: 'Stem and Leaf Cuttings',
          content: 'Professional cutting techniques for maximum success:',
          points: [
            'Stem cuttings: Choose healthy, non-flowering stems',
            'Leaf cuttings: Use entire leaves or leaf sections',
            'Root cuttings: Harvest during dormant season',
            'Sterile technique: Clean tools and growing medium'
          ],
          type: 'lesson'
        },
        {
          title: 'Seed Saving and Treatment',
          content: 'Preserve and improve plant genetics:',
          points: [
            'Seed collection: Timing and proper storage methods',
            'Stratification: Cold treatment for germination',
            'Scarification: Breaking seed dormancy',
            'Genetic preservation: Maintaining plant diversity'
          ],
          type: 'lesson'
        },
        {
          title: 'Rooting Hormones and Media',
          content: 'Optimize rooting success with proper techniques:',
          points: [
            'Hormone types: IBA, NAA, and natural alternatives',
            'Growing media: Perlite, vermiculite, and custom mixes',
            'Environmental control: Temperature and humidity',
            'Monitoring: Root development and transplant timing'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'When should you take stem cuttings?',
            options: ['During flowering', 'From healthy, non-flowering stems', 'In winter only', 'After fruiting'],
            correct: 1
          },
          {
            question: 'What is stratification?',
            options: ['Seed storage', 'Cold treatment for germination', 'Seed cleaning', 'Plant breeding'],
            correct: 1
          },
          {
            question: 'Which hormone is commonly used for rooting?',
            options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Ethylene'],
            correct: 0
          }
        ]
      }
    },
    {
      id: 'greenhouse',
      title: 'Greenhouse & Controlled Environments',
      icon: Factory,
      color: 'blue',
      estimatedTime: '40 min',
      difficulty: 'Expert',
      description: 'Design and manage controlled growing environments',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual greenhouse video
      lessons: [
        {
          title: 'Environmental Control Systems',
          content: 'Master climate control for optimal plant growth:',
          points: [
            'Temperature control: Heating and cooling systems',
            'Humidity management: Ventilation and misting',
            'Air circulation: Fans and natural ventilation',
            'CO2 supplementation: Enhanced growth rates'
          ],
          type: 'lesson'
        },
        {
          title: 'Lighting and Photoperiod',
          content: 'Optimize light for different growth stages:',
          points: [
            'Light spectra: Blue for vegetative, red for flowering',
            'DLI targeting: Daily light integral calculations',
            'Photoperiod control: Day length manipulation',
            'LED technology: Energy-efficient growing lights'
          ],
          type: 'lesson'
        },
        {
          title: 'Automation and Monitoring',
          content: 'Implement smart systems for efficiency:',
          points: [
            'Irrigation automation: Drip and mist systems',
            'Sensor networks: Real-time monitoring',
            'Data logging: Track environmental parameters',
            'Remote control: Mobile and web-based management'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What does DLI stand for?',
            options: ['Daily Light Integral', 'Direct Light Intensity', 'Dynamic Light Index', 'Digital Light Interface'],
            correct: 0
          },
          {
            question: 'Which light spectrum promotes flowering?',
            options: ['Blue', 'Red', 'Green', 'Yellow'],
            correct: 1
          },
          {
            question: 'What is the main benefit of CO2 supplementation?',
            options: ['Reduced water use', 'Enhanced growth rates', 'Pest control', 'Disease prevention'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'sustainability',
      title: 'Sustainable & Regenerative Gardening',
      icon: Recycle,
      color: 'emerald',
      estimatedTime: '38 min',
      difficulty: 'Expert',
      description: 'Create self-sustaining, regenerative garden ecosystems',
      lessons: [
        {
          title: 'Soil Food Web Management',
          content: 'Build healthy soil ecosystems:',
          points: [
            'Composting systems: Hot and cold composting methods',
            'Beneficial microorganisms: Bacteria, fungi, and protozoa',
            'Soil testing: Understanding soil biology',
            'Organic matter: Building soil structure and fertility'
          ],
          type: 'lesson'
        },
        {
          title: 'Water Conservation Strategies',
          content: 'Implement water-wise gardening practices:',
          points: [
            'Mulching: Moisture retention and weed suppression',
            'Rainwater harvesting: Collection and storage systems',
            'Drip irrigation: Efficient water delivery',
            'Xeriscaping: Drought-tolerant plant selection'
          ],
          type: 'lesson'
        },
        {
          title: 'Polycultures and Biodiversity',
          content: 'Create resilient, diverse garden ecosystems:',
          points: [
            'Polyculture design: Multiple species integration',
            'Habitat creation: Supporting beneficial wildlife',
            'Pest management: Natural predator attraction',
            'Succession planning: Long-term ecosystem development'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the main benefit of polycultures?',
            options: ['Higher yields', 'Increased biodiversity and resilience', 'Lower costs', 'Easier management'],
            correct: 1
          },
          {
            question: 'Which is most effective for water conservation?',
            options: ['Daily watering', 'Mulching', 'Fertilizing', 'Pruning'],
            correct: 1
          },
          {
            question: 'What does the soil food web include?',
            options: ['Only plants', 'Bacteria, fungi, and protozoa', 'Only insects', 'Only earthworms'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'breeding',
      title: 'Plant Breeding & Genetics',
      icon: Beaker,
      color: 'purple',
      estimatedTime: '45 min',
      difficulty: 'Expert',
      description: 'Master the art and science of plant breeding',
      lessons: [
        {
          title: 'Pollination Control',
          content: 'Control plant reproduction for desired traits:',
          points: [
            'Hand pollination: Precise control over crosses',
            'Isolation techniques: Preventing unwanted pollination',
            'Timing: Optimal pollination windows',
            'Record keeping: Tracking parentage and traits'
          ],
          type: 'lesson'
        },
        {
          title: 'Trait Selection and Inheritance',
          content: 'Understand genetic principles in plant breeding:',
          points: [
            'Mendelian genetics: Dominant and recessive traits',
            'Phenotype vs genotype: Observable vs genetic traits',
            'Selection criteria: Choosing plants for breeding',
            'Line maintenance: Preserving desirable characteristics'
          ],
          type: 'lesson'
        },
        {
          title: 'Legal and Ethical Considerations',
          content: 'Navigate the legal aspects of plant breeding:',
          points: [
            'Plant patents: Intellectual property protection',
            'Open source seeds: Community breeding programs',
            'Genetic diversity: Preserving heirloom varieties',
            'Documentation: Proper record keeping and labeling'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the purpose of isolation in plant breeding?',
            options: ['Save space', 'Prevent unwanted pollination', 'Reduce costs', 'Increase yield'],
            correct: 1
          },
          {
            question: 'What is the difference between phenotype and genotype?',
            options: ['No difference', 'Phenotype is observable, genotype is genetic', 'Genotype is observable, phenotype is genetic', 'They are the same thing'],
            correct: 1
          },
          {
            question: 'Why is genetic diversity important?',
            options: ['Higher yields', 'Preserving heirloom varieties', 'Lower costs', 'Easier breeding'],
            correct: 1
          }
        ]
      }
    }
  ]

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('expertProgress')
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
    localStorage.setItem('expertProgress', JSON.stringify(progress))
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
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expert Gardener Path</h1>
          <p className="text-xl text-gray-600">Master advanced techniques and systems for professional-level gardening</p>
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
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
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
                    : 'border-purple-200 bg-purple-50'
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
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 text-center mb-2">
              Master Gardener Achieved! 🏆
            </h3>
            <p className="text-purple-700 text-center mb-4">
              Congratulations! You've completed the Expert Gardener Path and achieved Master Gardener status!
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
              >
                <Star className="h-4 w-4 mr-2" />
                View Dashboard
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

export default ExpertLearningPath


