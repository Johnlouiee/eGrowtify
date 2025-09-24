import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FlaskConical, Factory, LeafyGreen, Recycle, Beaker, Sprout, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Shield, Microscope, Video, PlayCircle, X, 
  Scissors, TreePine, Droplets, Sun, Wind
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
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  const modules = [
    {
      id: 'advanced-pruning',
      title: 'Master Pruning Techniques',
      icon: Scissors,
      color: 'green',
      estimatedTime: '35 min',
      difficulty: 'Expert',
      description: 'Learn professional pruning methods for trees, shrubs, and plants',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lessons: [
        {
          title: 'Pruning Fundamentals',
          content: 'Master the basics of professional pruning:',
          points: [
            'When to prune: Timing for different plant types',
            'Proper cuts: Making clean, angled cuts',
            'Tool selection: Choosing the right pruning tools',
            'Safety first: Protecting yourself and your plants'
          ],
          type: 'lesson'
        },
        {
          title: 'Tree Pruning Techniques',
          content: 'Advanced methods for tree care:',
          points: [
            'Crown thinning: Removing branches for better air flow',
            'Crown raising: Removing lower branches safely',
            'Crown reduction: Reducing tree size properly',
            'Deadwood removal: Cleaning up damaged branches'
          ],
          type: 'lesson'
        },
        {
          title: 'Shrub and Plant Pruning',
          content: 'Specialized pruning for different plants:',
          points: [
            'Hedge trimming: Creating formal and informal shapes',
            'Rose pruning: Encouraging healthy blooms',
            'Fruit tree pruning: Maximizing fruit production',
            'Ornamental pruning: Creating artistic shapes'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the best time to prune most trees?',
            options: ['Summer', 'Winter when dormant', 'Spring when growing', 'Fall'],
            correct: 1
          },
          {
            question: 'What is crown thinning?',
            options: ['Cutting the top off', 'Removing branches for better air flow', 'Making the tree shorter', 'Removing all leaves'],
            correct: 1
          },
          {
            question: 'Why is it important to make clean cuts when pruning?',
            options: ['It looks better', 'It helps plants heal faster', 'It saves time', 'It uses less energy'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'tree-care',
      title: 'Professional Tree Care',
      icon: TreePine,
      color: 'emerald',
      estimatedTime: '40 min',
      difficulty: 'Expert',
      description: 'Advanced techniques for maintaining healthy trees',
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      lessons: [
        {
          title: 'Tree Health Assessment',
          content: 'Learn to evaluate tree condition:',
          points: [
            'Visual inspection: Looking for signs of problems',
            'Root health: Checking for root damage or disease',
            'Bark examination: Identifying pest and disease issues',
            'Growth patterns: Understanding normal vs. abnormal growth'
          ],
          type: 'lesson'
        },
        {
          title: 'Tree Support Systems',
          content: 'When and how to support trees:',
          points: [
            'Cabling: Supporting weak branches',
            'Bracing: Strengthening tree structure',
            'Staking: Supporting young or damaged trees',
            'Guying: Anchoring trees in windy areas'
          ],
          type: 'lesson'
        },
        {
          title: 'Tree Preservation',
          content: 'Protecting trees during construction:',
          points: [
            'Root protection: Preventing damage during building',
            'Soil compaction: Avoiding soil damage',
            'Water management: Ensuring proper irrigation',
            'Long-term care: Maintaining tree health over time'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What should you look for when assessing tree health?',
            options: ['Only the leaves', 'Signs of problems in bark, roots, and growth', 'Only the height', 'Only the color'],
            correct: 1
          },
          {
            question: 'What is tree cabling used for?',
            options: ['Making trees grow faster', 'Supporting weak branches', 'Making trees shorter', 'Removing branches'],
            correct: 1
          },
          {
            question: 'Why is root protection important during construction?',
            options: ['It looks better', 'It prevents tree damage and death', 'It saves money', 'It makes work easier'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'irrigation-systems',
      title: 'Advanced Irrigation Systems',
      icon: Droplets,
      color: 'blue',
      estimatedTime: '38 min',
      difficulty: 'Expert',
      description: 'Design and install professional irrigation systems',
      lessons: [
        {
          title: 'System Design Principles',
          content: 'Plan efficient irrigation systems:',
          points: [
            'Water pressure: Understanding system requirements',
            'Zone planning: Grouping plants by water needs',
            'Coverage patterns: Ensuring even water distribution',
            'Efficiency factors: Minimizing water waste'
          ],
          type: 'lesson'
        },
        {
          title: 'Drip Irrigation Installation',
          content: 'Install professional drip systems:',
          points: [
            'Main line installation: Running water to zones',
            'Emitter placement: Positioning for optimal coverage',
            'Filter systems: Keeping water clean',
            'Timer programming: Automating water delivery'
          ],
          type: 'lesson'
        },
        {
          title: 'System Maintenance',
          content: 'Keep irrigation systems working properly:',
          points: [
            'Regular inspections: Checking for problems',
            'Cleaning filters: Maintaining water flow',
            'Winterizing: Protecting systems from cold',
            'Repair techniques: Fixing common problems'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the main benefit of drip irrigation?',
            options: ['It uses more water', 'It delivers water directly to plant roots efficiently', 'It waters faster', 'It costs less'],
            correct: 1
          },
          {
            question: 'Why is zone planning important in irrigation?',
            options: ['It looks better', 'It groups plants by water needs', 'It saves time', 'It uses less equipment'],
            correct: 1
          },
          {
            question: 'What should you do to winterize irrigation systems?',
            options: ['Leave them running', 'Drain water to prevent freezing damage', 'Cover with blankets', 'Add more water'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'greenhouse-management',
      title: 'Greenhouse Operations',
      icon: Sun,
      color: 'orange',
      estimatedTime: '42 min',
      difficulty: 'Expert',
      description: 'Master greenhouse climate control and plant management',
      lessons: [
        {
          title: 'Climate Control Systems',
          content: 'Manage temperature, humidity, and ventilation:',
          points: [
            'Heating systems: Maintaining optimal temperatures',
            'Cooling methods: Ventilation and shade systems',
            'Humidity control: Managing moisture levels',
            'Air circulation: Ensuring proper air movement'
          ],
          type: 'lesson'
        },
        {
          title: 'Lighting Management',
          content: 'Optimize light for plant growth:',
          points: [
            'Natural light: Maximizing sunlight exposure',
            'Supplemental lighting: Adding artificial light',
            'Light duration: Controlling day length',
            'Light quality: Using different light spectrums'
          ],
          type: 'lesson'
        },
        {
          title: 'Plant Management',
          content: 'Advanced greenhouse plant care:',
          points: [
            'Spacing strategies: Optimizing plant density',
            'Pest control: Managing pests in controlled environments',
            'Disease prevention: Keeping plants healthy',
            'Harvest timing: Maximizing production'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'What is the main purpose of greenhouse ventilation?',
            options: ['To make it cooler', 'To control temperature, humidity, and air circulation', 'To save energy', 'To look better'],
            correct: 1
          },
          {
            question: 'Why might you need supplemental lighting in a greenhouse?',
            options: ['To save money', 'To provide extra light when natural light is insufficient', 'To make it warmer', 'To reduce humidity'],
            correct: 1
          },
          {
            question: 'What is important for pest control in greenhouses?',
            options: ['Using only chemicals', 'Prevention and early detection', 'Ignoring small problems', 'Removing all plants'],
            correct: 1
          }
        ]
      }
    },
    {
      id: 'wind-protection',
      title: 'Wind Protection Strategies',
      icon: Wind,
      color: 'gray',
      estimatedTime: '30 min',
      difficulty: 'Expert',
      description: 'Create effective windbreaks and protect plants from wind damage',
      lessons: [
        {
          title: 'Understanding Wind Effects',
          content: 'Learn how wind affects plants:',
          points: [
            'Physical damage: Breaking branches and stems',
            'Moisture loss: Increasing water evaporation',
            'Temperature effects: Creating wind chill',
            'Soil erosion: Removing topsoil and nutrients'
          ],
          type: 'lesson'
        },
        {
          title: 'Windbreak Design',
          content: 'Plan effective wind protection:',
          points: [
            'Height and density: Creating proper barriers',
            'Distance calculations: Positioning windbreaks correctly',
            'Plant selection: Choosing wind-resistant species',
            'Multiple rows: Building layered protection'
          ],
          type: 'lesson'
        },
        {
          title: 'Maintenance and Care',
          content: 'Keep windbreaks working effectively:',
          points: [
            'Regular pruning: Maintaining proper density',
            'Replacement planting: Filling gaps in barriers',
            'Health monitoring: Keeping plants strong',
            'Seasonal adjustments: Adapting to changing needs'
          ],
          type: 'lesson'
        }
      ],
      quiz: {
        questions: [
          {
            question: 'How does wind affect plants?',
            options: ['It only helps them grow', 'It can cause physical damage and moisture loss', 'It makes them stronger', 'It has no effect'],
            correct: 1
          },
          {
            question: 'What is important in windbreak design?',
            options: ['Only the height', 'Height, density, and proper positioning', 'Only the type of plants', 'Only the color'],
            correct: 1
          },
          {
            question: 'Why is regular maintenance important for windbreaks?',
            options: ['It looks better', 'It keeps the protection working effectively', 'It saves money', 'It uses less water'],
            correct: 1
          }
        ]
      }
    }
  ]

  useEffect(() => {
    // Expert plan is now independent - no prerequisites required
    // Users can access expert content directly

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
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getQuestionHint = (moduleId, questionIndex) => {
    const hints = {
      'advanced-pruning': [
        'Most trees are best pruned during winter when they are dormant and not actively growing.',
        'Crown thinning involves removing some branches to improve air flow and light penetration.',
        'Clean cuts help plants heal faster and reduce the risk of disease entering the wound.'
      ],
      'tree-care': [
        'Tree health assessment should look at bark, roots, and growth patterns, not just leaves.',
        'Tree cabling is used to support weak branches that might break under stress.',
        'Root protection during construction prevents tree damage and potential death.'
      ],
      'irrigation-systems': [
        'Drip irrigation delivers water directly to plant roots, making it very efficient.',
        'Zone planning groups plants with similar water needs together for better efficiency.',
        'Winterizing irrigation systems involves draining water to prevent freezing damage.'
      ],
      'greenhouse-management': [
        'Greenhouse ventilation controls temperature, humidity, and air circulation for optimal growing.',
        'Supplemental lighting provides extra light when natural sunlight is insufficient.',
        'Pest control in greenhouses focuses on prevention and early detection rather than just treatment.'
      ],
      'wind-protection': [
        'Wind can cause physical damage to plants and increase moisture loss through evaporation.',
        'Effective windbreak design considers height, density, and proper positioning.',
        'Regular maintenance keeps windbreaks working effectively to protect other plants.'
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
                    <h3 className="font-semibold text-blue-900 mb-2">Quiz Tips for Expert Gardeners</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• You're now at the expert level - apply your advanced knowledge</li>
                      <li>• Think about the science and techniques behind each concept</li>
                      <li>• Consider how these advanced methods improve plant health and yields</li>
                      <li>• There's no passing rate - just do your best and learn!</li>
                      <li>• Trust your gardening experience and the lessons you've learned</li>
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
                    : 'border-purple-200 bg-purple-50 hover:border-purple-300 hover:shadow-lg cursor-pointer'
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


