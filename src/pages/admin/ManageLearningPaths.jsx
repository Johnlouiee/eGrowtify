import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, CheckCircle, XCircle, Users, TrendingUp,
  Upload, X, Save, Clock, Calendar, Star, FileImage, Video,
  Play, Pause, Volume2, VolumeX, Settings, MoreVertical,
  ChevronDown, ChevronUp, Image, FileText, List, Grid,
  Copy, Move, Download, Share2, Heart, Bookmark, Sparkles, AlertCircle
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
  const [editingLessonInline, setEditingLessonInline] = useState(null) // lesson ID being edited inline
  const [isEditingQuizInline, setIsEditingQuizInline] = useState(false) // whether quiz is being edited inline
  const [editingQuestionInline, setEditingQuestionInline] = useState(null) // question ID being edited inline
  const [moduleFormData, setModuleFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '30 min',
    difficulty: 'Beginner',
    lessons: [],
    quizzes: [], // Changed from single quiz to array of quizzes
    images: [],
    videos: []
  })
  const [filesToDelete, setFilesToDelete] = useState({
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
    images: [],
    videos: []
  })
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    image: null,
    video: null
  })

  // Generate static default modules for each difficulty level
  const getDefaultStaticModules = (difficulty) => {
    const baseModules = {
      'Beginner': [
        {
          id: 'basic-information',
          title: 'Basic Information - Getting Started',
          difficulty: 'Beginner',
          estimatedTime: '25 min',
          description: 'Essential information every beginner gardener needs to know',
          lessons: [
            {
              id: 1,
              title: 'Introduction to Gardening',
              content: 'Welcome to the wonderful world of gardening! Gardening is a rewarding hobby that connects you with nature and provides fresh produce, beautiful flowers, and a sense of accomplishment.',
              points: [
                '🌱 Gardening is accessible to everyone, regardless of space or experience',
                '🌿 Start small with a few plants to build confidence',
                '💧 Understanding your local climate and growing season is crucial',
                '🌞 Most plants need 6-8 hours of sunlight daily',
                '💡 Gardening teaches patience and observation skills',
                '🎯 Set realistic goals for your first growing season'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Essential Tools and Supplies',
              content: 'You don\'t need expensive equipment to start gardening. Here are the essential tools every beginner should have:',
              points: [
                '🪴 Containers with drainage holes (or garden space)',
                '🌱 Quality potting mix or garden soil',
                '💧 Watering can or hose with gentle spray',
                '✂️ Pruning shears for trimming plants',
                '🌿 Plant labels to track what you\'re growing',
                '📏 Basic measuring tools for spacing'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Basic Information Quiz',
            questions: [
              {
                id: 1,
                question: 'According to the Introduction to Gardening lesson, what is the best approach for beginners?',
                options: ['Start with a large garden immediately', 'Start small with a few plants to build confidence', 'Only garden if you have a large outdoor space', 'Wait until you have all expensive equipment'],
                correct: 1,
                explanation: '✅ CORRECT! Start small with a few plants to build confidence. Gardening is accessible to everyone, regardless of space or experience. Starting small helps you learn gradually and avoid feeling overwhelmed.',
                required: true
              },
              {
                id: 2,
                question: 'Based on the Essential Tools and Supplies lesson, what is the most important feature containers should have?',
                options: ['Expensive decorative design', 'Drainage holes', 'Large size', 'Bright colors'],
                correct: 1,
                explanation: '✅ CORRECT! Containers with drainage holes are essential. Without drainage holes, water accumulates at the bottom, causing root rot.',
                required: true
              },
              {
                id: 3,
                question: 'From the Introduction to Gardening lesson, what skills does gardening help develop?',
                options: ['Only physical strength', 'Patience and observation skills', 'Computer programming', 'Cooking skills'],
                correct: 1,
                explanation: '✅ CORRECT! Gardening teaches patience and observation skills. As you care for plants, you learn to observe their needs, notice changes, and be patient as they grow.',
                required: true
              }
            ]
          },
          quizzes: [
            {
              id: 'basic-info-quiz-1',
              title: 'Basic Information Quiz',
              questions: [
                {
                  id: 1,
                  question: 'According to the Introduction to Gardening lesson, what is the best approach for beginners?',
                  options: ['Start with a large garden immediately', 'Start small with a few plants to build confidence', 'Only garden if you have a large outdoor space', 'Wait until you have all expensive equipment'],
                  correct: 1,
                  explanation: '✅ CORRECT! Start small with a few plants to build confidence. Gardening is accessible to everyone, regardless of space or experience. Starting small helps you learn gradually and avoid feeling overwhelmed.',
                  required: true
                },
                {
                  id: 2,
                  question: 'Based on the Essential Tools and Supplies lesson, what is the most important feature containers should have?',
                  options: ['Expensive decorative design', 'Drainage holes', 'Large size', 'Bright colors'],
                  correct: 1,
                  explanation: '✅ CORRECT! Containers with drainage holes are essential. Without drainage holes, water accumulates at the bottom, causing root rot.',
                  required: true
                },
                {
                  id: 3,
                  question: 'From the Introduction to Gardening lesson, what skills does gardening help develop?',
                  options: ['Only physical strength', 'Patience and observation skills', 'Computer programming', 'Cooking skills'],
                  correct: 1,
                  explanation: '✅ CORRECT! Gardening teaches patience and observation skills. As you care for plants, you learn to observe their needs, notice changes, and be patient as they grow.',
                  required: true
                }
              ]
            }
          ],
          images: [],
          videos: []
        },
        {
          id: 'lessons',
          title: 'Essential Lessons - Core Gardening Skills',
          difficulty: 'Beginner',
          estimatedTime: '30 min',
          description: 'Learn the fundamental skills needed for successful gardening',
          lessons: [
            {
              id: 1,
              title: 'Watering Basics',
              content: 'Proper watering is the foundation of plant care. Understanding when and how to water is crucial for plant health.',
              points: [
                '💧 Water when the top inch of soil feels dry to touch',
                '🌱 Water deeply but less frequently to encourage strong roots',
                '🌿 Water in the morning to allow leaves to dry before evening',
                '🚫 Avoid overwatering - it\'s the #1 cause of plant death',
                '💡 Different plants have different water needs - observe your plants',
                '🌧️ Adjust watering based on weather and season'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Light Requirements',
              content: 'Understanding light needs helps you place plants in the right location for optimal growth.',
              points: [
                '☀️ Full sun: 6+ hours of direct sunlight (vegetables, most flowers)',
                '🌤️ Partial sun: 3-6 hours of direct sunlight (many herbs, some flowers)',
                '🌥️ Partial shade: 2-4 hours of direct sunlight (leafy greens, some houseplants)',
                '🌑 Full shade: Less than 2 hours of direct sunlight (ferns, some houseplants)',
                '🪟 Indoor plants: Place near windows based on their light needs',
                '🔄 Rotate indoor plants regularly for even growth'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Essential Lessons Quiz',
            questions: [
              {
                id: 1,
                question: 'When should you water your plants?',
                options: ['Every day at the same time', 'When the top inch of soil feels dry', 'Only when leaves droop', 'Once a week regardless'],
                correct: 1,
                explanation: '✅ CORRECT! Water when the top inch of soil feels dry. This ensures plants get water when needed without overwatering.',
                required: true
              },
              {
                id: 2,
                question: 'What does "full sun" mean?',
                options: ['All day sunlight', '6+ hours of direct sunlight', 'Bright indirect light', 'Morning sun only'],
                correct: 1,
                explanation: '✅ CORRECT! Full sun means 6 or more hours of direct sunlight daily. Most vegetables and flowering plants need full sun.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        },
        {
          id: 'quizzes',
          title: 'Knowledge Check - Test Your Understanding',
          difficulty: 'Beginner',
          estimatedTime: '20 min',
          description: 'Test your knowledge with comprehensive quizzes covering all beginner topics',
          lessons: [
            {
              id: 1,
              title: 'Preparing for Quizzes',
              content: 'Quizzes help reinforce what you\'ve learned and identify areas that need more attention. Take your time and think through each question.',
              points: [
                '📚 Review the lessons before taking quizzes',
                '🤔 Read each question carefully',
                '💭 Think about what you learned in the lessons',
                '✅ Don\'t worry about perfect scores - learning is the goal',
                '🔄 You can retake quizzes to improve your understanding',
                '📝 Review explanations to understand why answers are correct'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Comprehensive Beginner Quiz',
            questions: [
              {
                id: 1,
                question: 'What is the most common cause of plant death for beginners?',
                options: ['Too little sunlight', 'Overwatering', 'Not enough fertilizer', 'Wrong container size'],
                correct: 1,
                explanation: '✅ CORRECT! Overwatering is the #1 cause of plant death. It leads to root rot and prevents roots from getting oxygen. Always check soil moisture before watering and ensure proper drainage.',
                required: true
              },
              {
                id: 2,
                question: 'Which tool is essential for all container gardens?',
                options: ['Expensive fertilizer', 'Drainage holes in containers', 'Grow lights', 'Automatic watering system'],
                correct: 1,
                explanation: '✅ CORRECT! Drainage holes are absolutely essential. Without them, water accumulates at the bottom of containers, causing root rot and preventing roots from getting oxygen. Always use containers with drainage holes or create them yourself.',
                required: true
              },
              {
                id: 3,
                question: 'What should you do if a plant shows yellow leaves?',
                options: ['Water more frequently', 'Check for overwatering or nutrient issues', 'Move to full sun immediately', 'Add more fertilizer'],
                correct: 1,
                explanation: '✅ CORRECT! Yellow leaves can indicate overwatering, underwatering, or nutrient deficiency. Check the soil moisture first, then examine the plant\'s overall condition. Don\'t immediately change everything - diagnose the problem first.',
                required: true
              },
              {
                id: 4,
                question: 'Understanding How Plants Grow: What is the final stage in a plant\'s life cycle before it produces seeds?',
                options: ['Seed', 'Seedling', 'Flowering', 'Mature plant'],
                correct: 2,
                explanation: '✅ CORRECT! Flowering is the stage when plants produce flowers, which then develop into fruits and seeds. The plant life cycle typically goes: Seed → Seedling → Vegetative growth → Flowering → Fruiting/Seeding. Understanding these stages helps you provide appropriate care at each phase.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        }
      ],
      'Intermediate': [
        {
          id: 'basic-information',
          title: 'Advanced Information - Deepening Your Knowledge',
          difficulty: 'Intermediate',
          estimatedTime: '30 min',
          description: 'Expand your understanding with advanced gardening concepts and techniques',
          lessons: [
            {
              id: 1,
              title: 'Plant Nutrition and Fertilization',
              content: 'Understanding plant nutrition helps you provide the right nutrients at the right time for optimal growth and productivity.',
              points: [
                '🌿 NPK Ratio: Nitrogen (N) for leaves, Phosphorus (P) for roots/flowers, Potassium (K) for overall health',
                '⏰ Fertilize during active growth periods (spring/summer)',
                '🌱 Organic fertilizers feed soil life and release slowly',
                '⚡ Synthetic fertilizers provide quick nutrients but don\'t improve soil',
                '📊 Test soil before fertilizing to know what your plants need',
                '💧 Water before and after fertilizing to prevent root burn'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Pest and Disease Management',
              content: 'Preventing and managing pests and diseases is crucial for maintaining healthy plants.',
              points: [
                '🔍 Regular inspection helps catch problems early',
                '🌿 Healthy plants are naturally more resistant to pests and diseases',
                '🪴 Proper spacing improves air circulation and reduces disease spread',
                '🧪 Identify problems correctly before treating',
                '🌱 Use organic methods first (neem oil, insecticidal soap)',
                '🔄 Rotate crops to prevent pest and disease buildup'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Advanced Information Quiz',
            questions: [
              {
                id: 1,
                question: 'What does the "P" in NPK fertilizer stand for?',
                options: ['Potassium', 'Phosphorus', 'Protein', 'Photosynthesis'],
                correct: 1,
                explanation: '✅ CORRECT! P stands for Phosphorus, which is essential for root development, flowering, and fruiting.',
                required: true
              },
              {
                id: 2,
                question: 'When is the best time to fertilize plants?',
                options: ['Only in winter', 'During active growth periods', 'Every day', 'Only when plants show problems'],
                correct: 1,
                explanation: '✅ CORRECT! Fertilize during active growth periods (spring and summer) when plants can use the nutrients most effectively.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        },
        {
          id: 'lessons',
          title: 'Advanced Lessons - Mastering Techniques',
          difficulty: 'Intermediate',
          estimatedTime: '35 min',
          description: 'Learn advanced techniques to take your gardening to the next level',
          lessons: [
            {
              id: 1,
              title: 'Pruning and Training Plants',
              content: 'Proper pruning and training techniques help plants grow stronger and produce better yields.',
              points: [
                '✂️ Prune to remove dead, damaged, or diseased growth',
                '🌿 Prune to shape plants and encourage bushier growth',
                '🍅 Pinch suckers on tomatoes for better fruit production',
                '🌱 Train vining plants with supports for better air circulation',
                '⏰ Prune at the right time for each plant type',
                '🧹 Use clean, sharp tools to prevent disease spread'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Companion Planting',
              content: 'Companion planting uses beneficial plant relationships to improve growth and deter pests.',
              points: [
                '🌱 Some plants help each other when grown together',
                '🌿 Marigolds repel many garden pests',
                '🌾 Tall plants can provide shade for shade-loving plants',
                '🦋 Some plants attract beneficial insects',
                '🚫 Some plant combinations should be avoided',
                '📊 Plan your garden layout with companion planting in mind'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Advanced Lessons Quiz',
            questions: [
              {
                id: 1,
                question: 'Why should you prune plants?',
                options: ['To make them smaller', 'To remove dead/damaged growth and encourage healthy growth', 'To reduce watering needs', 'To make them grow faster'],
                correct: 1,
                explanation: '✅ CORRECT! Pruning removes dead, damaged, or diseased growth and encourages plants to grow stronger and produce better yields.',
                required: true
              },
              {
                id: 2,
                question: 'What is companion planting?',
                options: ['Growing only one type of plant', 'Using beneficial plant relationships', 'Growing plants in pairs', 'Growing plants far apart'],
                correct: 1,
                explanation: '✅ CORRECT! Companion planting uses beneficial relationships between plants to improve growth, deter pests, and maximize garden productivity.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        },
        {
          id: 'quizzes',
          title: 'Advanced Knowledge Assessment',
          difficulty: 'Intermediate',
          estimatedTime: '25 min',
          description: 'Test your intermediate gardening knowledge with comprehensive assessments',
          lessons: [
            {
              id: 1,
              title: 'Review and Assessment',
              content: 'These quizzes test your understanding of intermediate gardening concepts. Review the lessons and apply what you\'ve learned.',
              points: [
                '📖 Review all intermediate lessons before taking quizzes',
                '🧠 Apply concepts to real gardening situations',
                '💡 Think about how techniques work together',
                '📝 Note areas where you need more practice',
                '🔄 Use quiz results to guide further learning',
                '✅ Celebrate your progress and knowledge growth'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Comprehensive Intermediate Quiz',
            questions: [
              {
                id: 1,
                question: 'What is the primary benefit of organic fertilizers?',
                options: ['They work faster', 'They feed soil life and improve soil structure', 'They cost less', 'They last longer'],
                correct: 1,
                explanation: '✅ CORRECT! Organic fertilizers feed beneficial soil microorganisms and improve soil structure over time, creating healthier growing conditions.',
                required: true
              },
              {
                id: 2,
                question: 'When should you start treating a pest problem?',
                options: ['Wait until it\'s severe', 'As soon as you notice it', 'Only in spring', 'Never - let nature handle it'],
                correct: 1,
                explanation: '✅ CORRECT! Start treating pest problems as soon as you notice them. Early intervention is much more effective than waiting.',
                required: true
              },
              {
                id: 3,
                question: 'What is the main purpose of companion planting?',
                options: ['To save space', 'To use beneficial plant relationships', 'To reduce costs', 'To simplify watering'],
                correct: 1,
                explanation: '✅ CORRECT! Companion planting uses beneficial relationships between plants to improve growth, deter pests, attract beneficial insects, and maximize garden productivity.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        }
      ],
      'Expert': [
        {
          id: 'basic-information',
          title: 'Expert Information - Master-Level Knowledge',
          difficulty: 'Expert',
          estimatedTime: '40 min',
          description: 'Master advanced concepts and professional-level gardening information',
          lessons: [
            {
              id: 1,
              title: 'Soil Science and Chemistry',
              content: 'Understanding soil chemistry and science enables you to create optimal growing conditions for any plant.',
              points: [
                '🧪 Soil pH affects nutrient availability - most plants prefer 6.0-7.0',
                '🌱 Cation Exchange Capacity (CEC) measures soil\'s ability to hold nutrients',
                '🦠 Beneficial microorganisms are essential for healthy soil',
                '🌿 Organic matter improves soil structure and nutrient availability',
                '💧 Soil texture (sand, silt, clay) affects drainage and water retention',
                '📊 Regular soil testing guides amendment decisions'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Advanced Propagation Techniques',
              content: 'Master propagation techniques to multiply your plants and share with others.',
              points: [
                '🌱 Seed starting requires proper temperature, moisture, and light',
                '✂️ Stem cuttings can clone plants exactly',
                '🌿 Layering creates new plants while still attached to parent',
                '🔬 Grafting combines desirable traits from different plants',
                '⏰ Timing is crucial for successful propagation',
                '🌡️ Bottom heat and humidity domes improve success rates'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Expert Information Quiz',
            questions: [
              {
                id: 1,
                question: 'What pH range do most plants prefer?',
                options: ['4.0-5.0', '6.0-7.0', '8.0-9.0', '10.0-11.0'],
                correct: 1,
                explanation: '✅ CORRECT! Most plants prefer slightly acidic to neutral soil (pH 6.0-7.0) where nutrients are most available.',
                required: true
              },
              {
                id: 2,
                question: 'What does CEC stand for in soil science?',
                options: ['Carbon Exchange Capacity', 'Cation Exchange Capacity', 'Chemical Element Count', 'Crop Enhancement Coefficient'],
                correct: 1,
                explanation: '✅ CORRECT! CEC (Cation Exchange Capacity) measures a soil\'s ability to hold and exchange positively charged nutrient ions.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        },
        {
          id: 'lessons',
          title: 'Expert Lessons - Professional Techniques',
          difficulty: 'Expert',
          estimatedTime: '45 min',
          description: 'Learn professional-grade techniques used by master gardeners',
          lessons: [
            {
              id: 1,
              title: 'Integrated Pest Management (IPM)',
              content: 'IPM combines multiple strategies to manage pests while minimizing environmental impact.',
              points: [
                '🔍 Monitor and identify pests accurately',
                '🌿 Use cultural controls (proper spacing, crop rotation)',
                '🦋 Encourage beneficial insects and natural predators',
                '🧪 Use chemical controls only as last resort',
                '📊 Keep records to track pest patterns',
                '🔄 Rotate control methods to prevent resistance'
              ],
              images: [],
              videos: []
            },
            {
              id: 2,
              title: 'Advanced Soil Building',
              content: 'Build and maintain exceptional soil through advanced techniques and understanding.',
              points: [
                '🌱 No-till gardening preserves soil structure and beneficial organisms',
                '🔄 Cover crops add organic matter and fix nitrogen',
                '🌿 Composting creates nutrient-rich soil amendments',
                '🦠 Microbial inoculants introduce beneficial organisms',
                '📊 Regular soil testing guides improvement strategies',
                '🌍 Long-term soil health benefits entire ecosystem'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Expert Lessons Quiz',
            questions: [
              {
                id: 1,
                question: 'What is Integrated Pest Management (IPM)?',
                options: ['Using only chemicals', 'Combining multiple pest control strategies', 'Never treating pests', 'Using only organic methods'],
                correct: 1,
                explanation: '✅ CORRECT! IPM combines monitoring, cultural controls, biological controls, and chemical controls (as last resort) for effective, environmentally responsible pest management.',
                required: true
              },
              {
                id: 2,
                question: 'What is a primary benefit of no-till gardening?',
                options: ['Saves time', 'Preserves soil structure and beneficial organisms', 'Reduces watering', 'Makes planting easier'],
                correct: 1,
                explanation: '✅ CORRECT! No-till gardening preserves soil structure, maintains beneficial soil organisms, and prevents erosion while building soil health over time.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        },
        {
          id: 'quizzes',
          title: 'Expert Mastery Assessment',
          difficulty: 'Expert',
          estimatedTime: '30 min',
          description: 'Comprehensive assessment of expert-level gardening knowledge',
          lessons: [
            {
              id: 1,
              title: 'Mastery Assessment Preparation',
              content: 'These comprehensive assessments test your mastery of expert-level gardening concepts and techniques.',
              points: [
                '📚 Review all expert-level lessons thoroughly',
                '🧠 Apply advanced concepts to complex scenarios',
                '💡 Think critically about problem-solving approaches',
                '📊 Use assessment results to identify mastery areas',
                '🔄 Continue learning and refining techniques',
                '🌟 Share knowledge with other gardeners'
              ],
              images: [],
              videos: []
            }
          ],
          quiz: {
            title: 'Comprehensive Expert Quiz',
            questions: [
              {
                id: 1,
                question: 'Why is soil pH important for plant nutrition?',
                options: ['It doesn\'t matter', 'It affects nutrient availability', 'It only matters for vegetables', 'It changes daily'],
                correct: 1,
                explanation: '✅ CORRECT! Soil pH directly affects nutrient availability. Most nutrients are available at pH 6.0-7.0, while extreme pH levels lock up nutrients.',
                required: true
              },
              {
                id: 2,
                question: 'What is the correct order of IPM strategies?',
                options: ['Chemical first', 'Monitor, cultural controls, biological controls, chemical as last resort', 'Only biological', 'No order needed'],
                correct: 1,
                explanation: '✅ CORRECT! IPM follows this order: 1) Monitor and identify, 2) Cultural controls, 3) Biological controls, 4) Chemical controls as last resort.',
                required: true
              },
              {
                id: 3,
                question: 'What is the primary goal of advanced soil building?',
                options: ['To save money', 'To create long-term soil health and ecosystem benefits', 'To reduce watering', 'To grow faster plants'],
                correct: 1,
                explanation: '✅ CORRECT! Advanced soil building focuses on creating long-term soil health that benefits the entire ecosystem, not just individual plants.',
                required: true
              }
            ]
          },
          images: [],
          videos: []
        }
      ]
    }
    
    return baseModules[difficulty] || []
  }

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  const fetchLearningPaths = async () => {
    try {
      setLoading(true)
      
      // Try to load from API first (admin-managed content)
      const difficulties = ['Beginner', 'Intermediate', 'Expert']
      const learningPathsData = []
      
      for (const difficulty of difficulties) {
        try {
          // Try to get saved modules from API
          const response = await axios.get(`/api/learning-paths/${difficulty}`)
          let modules = []
          
          if (response.data && response.data.length > 0) {
            // Use saved modules from database
            modules = response.data
          } else {
            // If no saved modules, use static default modules
            modules = getDefaultStaticModules(difficulty)
      
            // Auto-save static modules to database for first-time setup
            try {
              for (const module of modules) {
                await axios.post(`/api/admin/learning-paths/${difficulty}/modules`, {
                  id: module.id,
                  module: module
                })
              }
              console.log(`Auto-saved ${modules.length} default modules for ${difficulty}`)
            } catch (saveError) {
              console.error(`Error auto-saving ${difficulty} modules:`, saveError)
              // Continue even if save fails
            }
          }
          
          // Ensure we always have the 3 static modules (merge with existing if needed)
          const staticModules = getDefaultStaticModules(difficulty)
          const existingModuleIds = modules.map(m => m.id)
          
          // Add any missing static modules
          staticModules.forEach(staticModule => {
            if (!existingModuleIds.includes(staticModule.id)) {
              modules.push(staticModule)
              // Try to save it
              axios.post(`/api/admin/learning-paths/${difficulty}/modules`, {
                id: staticModule.id,
                module: staticModule
              }).catch(err => console.error(`Error saving static module:`, err))
            }
          })
          
          learningPathsData.push({
        id: difficulty.toLowerCase(),
        title: `${difficulty} Learning Path`,
        description: `Comprehensive ${difficulty.toLowerCase()} level modules focused on plants and soil`,
        difficulty: difficulty,
            estimatedTime: `${modules.reduce((total, module) => {
              const time = parseInt(module.estimatedTime?.replace(' min', '') || module.estimatedTime || 30) || 30
          return total + time
        }, 0)} min`,
            modules_count: modules.length,
        is_active: true,
            modules: modules
          })
        } catch (apiError) {
          console.error(`Error loading ${difficulty} modules from API:`, apiError)
          // Fallback to static modules
          const modules = getDefaultStaticModules(difficulty)
          
          learningPathsData.push({
            id: difficulty.toLowerCase(),
            title: `${difficulty} Learning Path`,
            description: `Comprehensive ${difficulty.toLowerCase()} level modules focused on plants and soil`,
            difficulty: difficulty,
            estimatedTime: `${modules.reduce((total, module) => {
              const time = parseInt(module.estimatedTime?.replace(' min', '') || module.estimatedTime || 30) || 30
              return total + time
            }, 0)} min`,
            modules_count: modules.length,
            is_active: true,
            modules: modules
          })
        }
      }
      
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
    // Convert single quiz to quizzes array for backward compatibility
    const quizzes = module.quizzes || (module.quiz ? [module.quiz] : [])
    setModuleFormData({
      title: module.title,
      description: module.description,
      estimatedTime: module.estimatedTime,
      difficulty: module.difficulty,
      lessons: module.lessons,
      quizzes: quizzes,
      images: module.images || [],
      videos: module.videos || []
    })
    // Reset files to delete when opening modal
    setFilesToDelete({ images: [], videos: [] })
    setShowEditModuleModal(true)
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!moduleFormData.title || !moduleFormData.title.trim()) {
      toast.error('Please enter a module title')
      return
    }
    
    if (!moduleFormData.description || !moduleFormData.description.trim()) {
      toast.error('Please enter a module description')
      return
    }
    
    try {
      const newModule = {
        id: `module-${Date.now()}`,
        title: moduleFormData.title.trim(),
        description: moduleFormData.description.trim(),
        estimatedTime: moduleFormData.estimatedTime || '30 min',
        difficulty: moduleFormData.difficulty || selectedPath.difficulty,
        lessons: (moduleFormData.lessons || []).map((lesson, index) => ({
          id: lesson.id || index + 1,
          ...lesson
        })),
        quizzes: (moduleFormData.quizzes || []).map((quiz, quizIndex) => ({
          ...quiz,
          questions: (quiz.questions || []).map((question, index) => ({
            id: question.id || index + 1,
            ...question
          }))
        })),
        // Keep quiz field for backward compatibility (use first quiz if exists)
        quiz: (moduleFormData.quizzes && moduleFormData.quizzes.length > 0) ? {
          ...moduleFormData.quizzes[0],
          questions: (moduleFormData.quizzes[0].questions || []).map((question, index) => ({
            id: question.id || index + 1,
            ...question
          }))
        } : { title: '', questions: [] },
        images: moduleFormData.images || [],
        videos: moduleFormData.videos || []
      }

      // Save to backend API
      try {
        const response = await axios.post(`/api/admin/learning-paths/${selectedPath.difficulty}/modules`, {
          id: newModule.id,
          module: newModule
        })
        console.log('Module saved to backend:', response.data)
      } catch (apiError) {
        console.error('Error saving module to backend:', apiError)
        if (apiError.response?.status === 400 && apiError.response?.data?.error?.includes('already exists')) {
          // Module already exists, try updating instead
          try {
            await axios.put(`/api/admin/learning-paths/${selectedPath.difficulty}/modules`, {
              id: newModule.id,
              module: newModule
            })
            console.log('Module updated in backend')
          } catch (updateError) {
            console.error('Error updating module in backend:', updateError)
            toast.error('Module saved locally but failed to sync with server')
          }
        } else {
          toast.error('Module saved locally but failed to sync with server')
        }
      }

      // Update the learning paths state
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === selectedPath.id 
            ? { 
                ...path, 
                modules: [...(path.modules || []), newModule],
                modules_count: (path.modules || []).length + 1
              }
            : path
        )
      )

      toast.success('Module added successfully!')
      setShowAddModuleModal(false)
      setEditingLessonInline(null)
      setIsEditingQuizInline(false)
      resetModuleForm()
      
      // Update selectedPath to reflect the new module
      if (selectedPath) {
        setSelectedPath(prev => ({
          ...prev,
          modules: [...(prev.modules || []), newModule],
          modules_count: (prev.modules || []).length + 1
        }))
      }
    } catch (error) {
      console.error('Error adding module:', error)
      toast.error('Failed to add module')
    }
  }

  const handleEditModule = async (e) => {
    e.preventDefault()
    try {
      // Delete marked files from server when saving
      const deletePromises = []
      
      // Delete marked images
      for (const imageUrl of filesToDelete.images) {
        deletePromises.push(
          axios.post('/api/admin/delete-file', { fileUrl: imageUrl }).catch(err => {
            console.error('Error deleting image:', err)
            // Continue even if deletion fails
          })
        )
      }
      
      // Delete marked videos
      for (const videoUrl of filesToDelete.videos) {
        deletePromises.push(
          axios.post('/api/admin/delete-file', { fileUrl: videoUrl }).catch(err => {
            console.error('Error deleting video:', err)
            // Continue even if deletion fails
          })
        )
      }
      
      // Wait for all deletions to complete (or fail gracefully)
      await Promise.all(deletePromises)
      
      // Ensure we use the current form data, not stale editingModule data
      // Filter out any null/undefined entries and ensure arrays are clean
      const cleanImages = (moduleFormData.images || []).filter(img => img && img.id && img.url)
      const cleanVideos = (moduleFormData.videos || []).filter(vid => vid && vid.id && vid.url)
      
      const updatedModule = {
        ...editingModule,
        title: moduleFormData.title,
        description: moduleFormData.description,
        estimatedTime: moduleFormData.estimatedTime,
        difficulty: moduleFormData.difficulty,
        lessons: moduleFormData.lessons.map((lesson, index) => ({
          id: lesson.id || index + 1,
          ...lesson
        })),
        quizzes: (moduleFormData.quizzes || []).map((quiz, quizIndex) => ({
          ...quiz,
          questions: (quiz.questions || []).map((question, index) => ({
            id: question.id || index + 1,
            ...question
          }))
        })),
        // Keep quiz field for backward compatibility (use first quiz if exists)
        quiz: (moduleFormData.quizzes && moduleFormData.quizzes.length > 0) ? {
          ...moduleFormData.quizzes[0],
          questions: (moduleFormData.quizzes[0].questions || []).map((question, index) => ({
            id: question.id || index + 1,
            ...question
          }))
        } : { title: '', questions: [] },
        // CRITICAL: Use cleaned arrays from current form data (after deletions)
        // This ensures deleted files are NOT included in the saved module
        images: cleanImages,
        videos: cleanVideos
      }
      
      console.log('Saving module with images:', cleanImages.length, 'videos:', cleanVideos.length)

      // Save to backend API
      try {
        const saveResponse = await axios.put(`/api/admin/learning-paths/${selectedPath.difficulty}/modules`, {
          id: updatedModule.id,
          module: updatedModule
        })
        console.log('Module saved successfully:', saveResponse.data)
        console.log('Saved with images:', updatedModule.images.length, 'videos:', updatedModule.videos.length)
      } catch (apiError) {
        console.error('Error saving module to backend:', apiError)
        toast.error('Failed to save module to server. Changes may not persist.')
        // Continue with local state update even if API fails
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
      
      // Update selectedPath to reflect the changes
      if (selectedPath) {
        setSelectedPath(prev => ({
          ...prev,
          modules: prev.modules.map(module => 
            module.id === editingModule.id ? updatedModule : module
          )
        }))
      }
      
      // Refresh learning paths to ensure we have the latest data from backend
      // This ensures deleted files are properly removed from the module data
      try {
        const refreshResponse = await axios.get(`/api/learning-paths/${selectedPath.difficulty}`)
        if (refreshResponse.data && refreshResponse.data.length > 0) {
          const refreshedModule = refreshResponse.data.find(m => m.id === editingModule.id)
          if (refreshedModule) {
            // Update the module in learningPaths with fresh data from backend
            setLearningPaths(prevPaths => 
              prevPaths.map(path => 
                path.id === selectedPath.id 
                  ? { 
                      ...path, 
                      modules: path.modules.map(module => 
                        module.id === editingModule.id ? refreshedModule : module
                      )
                    }
                  : path
              )
            )
            // Also update selectedPath with fresh data
            if (selectedPath) {
              setSelectedPath(prev => ({
                ...prev,
                modules: prev.modules.map(module => 
                  module.id === editingModule.id ? refreshedModule : module
                )
              }))
            }
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing module data:', refreshError)
        // Continue even if refresh fails - we've already updated local state
      }
      
      // Clear files to delete list after successful save
      setFilesToDelete({ images: [], videos: [] })
      
      setShowEditModuleModal(false)
      setEditingModule(null)
      setEditingLessonInline(null)
      setIsEditingQuizInline(false)
      setEditingQuestionInline(null)
      resetModuleForm()
    } catch (error) {
      console.error('Error updating module:', error)
      toast.error('Failed to update module')
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      try {
        // Delete from backend API
        try {
          await axios.delete(`/api/admin/learning-paths/${selectedPath.difficulty}/modules/${moduleId}`)
        } catch (apiError) {
          console.error('Error deleting module from backend:', apiError)
          // Continue with local state update even if API fails
        }

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

        // Update selectedPath to reflect the deletion
        if (selectedPath) {
          setSelectedPath(prev => ({
            ...prev,
            modules: prev.modules.filter(module => module.id !== moduleId)
          }))
        }

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
    setShowAddLessonModal(true)
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

  const handleAddLesson = (e) => {
    e.preventDefault()
    const newLesson = {
      id: Date.now(),
      ...lessonFormData,
      points: lessonFormData.points.filter(point => point.trim() !== '') // Remove empty points
    }

    setModuleFormData(prev => ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }))

    toast.success('Lesson added successfully!')
    setShowAddLessonModal(false)
    resetLessonForm()
  }

  const handleEditLesson = (e) => {
    e.preventDefault()
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

  // Inline editing functions for module edit modal
  const startEditingLessonInline = (lesson) => {
    setEditingLessonInline(lesson.id)
    setLessonFormData({
      title: lesson.title,
      content: lesson.content,
      points: lesson.points || [''],
      images: lesson.images || [],
      videos: lesson.videos || []
    })
  }

  const saveLessonInline = () => {
    if (!editingLessonInline) return
    
    setModuleFormData(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson => 
        lesson.id === editingLessonInline 
          ? { ...lesson, ...lessonFormData }
          : lesson
      )
    }))
    
    toast.success('Lesson updated successfully!')
    setEditingLessonInline(null)
    resetLessonForm()
  }

  const cancelLessonInline = () => {
    setEditingLessonInline(null)
    resetLessonForm()
  }

  const startEditingQuizInline = () => {
    setIsEditingQuizInline(true)
    setQuizFormData({
      title: moduleFormData.quiz.title || '',
      questions: moduleFormData.quiz.questions || [],
      images: moduleFormData.quiz.images || []
    })
  }

  const saveQuizInline = () => {
    setModuleFormData(prev => ({
      ...prev,
      quiz: quizFormData
    }))
    
    toast.success('Quiz updated successfully!')
    setIsEditingQuizInline(false)
  }

  const cancelQuizInline = () => {
    setIsEditingQuizInline(false)
    // Restore original quiz data
    setQuizFormData({
      title: moduleFormData.quiz.title || '',
      questions: moduleFormData.quiz.questions || [],
      images: moduleFormData.quiz.images || []
    })
  }

  // Quiz CRUD Functions
  const openAddQuizModal = () => {
    // Always open for adding a new quiz
    setQuizFormData({
      title: '',
      questions: [],
      images: [],
      videos: []
    })
    setEditingQuiz(null)
    setShowAddQuizModal(true)
  }

  const openEditQuizModal = (quiz) => {
    // Open modal to edit an existing quiz
    setEditingQuiz(quiz)
    setQuizFormData({
      title: quiz.title || '',
      questions: quiz.questions || [],
      images: quiz.images || [],
      videos: quiz.videos || []
    })
    setShowEditQuizModal(true)
  }

  const handleAddQuiz = async (e) => {
    e.preventDefault()
    
    // Validate quiz title
    if (!quizFormData.title || !quizFormData.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }
    
    // Validate at least one question
    if (!quizFormData.questions || quizFormData.questions.length === 0) {
      toast.error('Please add at least one question to the quiz')
      return
    }
    
    // Validate each question has content and at least 2 options
    for (let i = 0; i < quizFormData.questions.length; i++) {
      const question = quizFormData.questions[i]
      if (!question.question || !question.question.trim()) {
        toast.error(`Question ${i + 1} is missing text`)
        return
      }
      const validOptions = (question.options || []).filter(opt => opt && opt.trim() !== '')
      if (validOptions.length < 2) {
        toast.error(`Question ${i + 1} needs at least 2 options`)
        return
      }
      if (question.correct === undefined || question.correct === null) {
        toast.error(`Question ${i + 1} needs a correct answer selected`)
        return
      }
      if (!question.explanation || !question.explanation.trim()) {
        toast.error(`Question ${i + 1} needs an explanation`)
        return
      }
    }
    
    try {
      // Ensure questions have proper IDs and quiz has unique ID
      const quizWithIds = {
        id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique quiz ID
        title: quizFormData.title.trim(),
        questions: quizFormData.questions.map((question, index) => ({
          id: question.id || Date.now() + index,
          question: question.question.trim(),
          options: question.options.filter(opt => opt && opt.trim() !== ''),
          correct: question.correct,
          explanation: question.explanation || '',
          image: question.image || null,
          video: question.video || null,
          required: question.required !== undefined ? question.required : true
        })),
        images: [], // Not used - images are added directly to questions
        videos: [] // Not used - videos removed for cleaner UI
      }
      
      // Add quiz to quizzes array
      const updatedModuleFormData = {
        ...moduleFormData,
        quizzes: [...(moduleFormData.quizzes || []), quizWithIds]
      }
      
      setModuleFormData(updatedModuleFormData)

      toast.success('Quiz added successfully!')
      setShowAddQuizModal(false)
      resetQuizForm()
    } catch (error) {
      console.error('Error adding quiz:', error)
      toast.error('Failed to add quiz')
    }
  }

  const handleEditQuiz = async (e) => {
    e.preventDefault()
    
    // Validate quiz title
    if (!quizFormData.title || !quizFormData.title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }
    
    // Validate at least one question
    if (!quizFormData.questions || quizFormData.questions.length === 0) {
      toast.error('Please add at least one question to the quiz')
      return
    }
    
    // Validate each question has content and at least 2 options
    for (let i = 0; i < quizFormData.questions.length; i++) {
      const question = quizFormData.questions[i]
      if (!question.question || !question.question.trim()) {
        toast.error(`Question ${i + 1} is missing text`)
        return
      }
      const validOptions = (question.options || []).filter(opt => opt && opt.trim() !== '')
      if (validOptions.length < 2) {
        toast.error(`Question ${i + 1} needs at least 2 options`)
        return
      }
      if (question.correct === undefined || question.correct === null) {
        toast.error(`Question ${i + 1} needs a correct answer selected`)
        return
      }
      if (!question.explanation || !question.explanation.trim()) {
        toast.error(`Question ${i + 1} needs an explanation`)
        return
      }
    }
    
    try {
      // Ensure questions have proper IDs and preserve quiz ID
      const quizWithIds = {
        id: editingQuiz.id || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Preserve existing ID or create new
        title: quizFormData.title.trim(),
        questions: quizFormData.questions.map((question, index) => ({
          id: question.id || Date.now() + index,
          question: question.question.trim(),
          options: question.options.filter(opt => opt && opt.trim() !== ''),
          correct: question.correct,
          explanation: question.explanation.trim(),
          image: question.image || null,
          video: question.video || null,
          required: question.required !== undefined ? question.required : true
        })),
        images: [], // Not used - images are added directly to questions
        videos: [] // Not used - videos removed for cleaner UI
      }
      
      // Update the specific quiz in quizzes array by ID
      const updatedQuizzes = (moduleFormData.quizzes || []).map(q => 
        (q.id && editingQuiz.id && q.id === editingQuiz.id) || q === editingQuiz ? quizWithIds : q
      )
      const updatedModuleFormData = {
        ...moduleFormData,
        quizzes: updatedQuizzes
      }
      
      setModuleFormData(updatedModuleFormData)

      toast.success('Quiz updated successfully!')
      setShowEditQuizModal(false)
      setEditingQuiz(null)
      resetQuizForm()
    } catch (error) {
      console.error('Error updating quiz:', error)
      toast.error('Failed to update quiz')
    }
  }

  // Generate Quiz from Lessons
  const generateQuizFromLessons = () => {
    if (!moduleFormData.lessons || moduleFormData.lessons.length === 0) {
      toast.error('No lessons available to generate quiz from')
      return
    }

    const generatedQuestions = []
    let questionId = 1

    // Generate questions from each lesson
    moduleFormData.lessons.forEach((lesson, lessonIndex) => {
      // Extract key information from lesson
      const lessonTitle = lesson.title || `Lesson ${lessonIndex + 1}`
      const lessonContent = lesson.content || ''
      const lessonPoints = lesson.points || []

      // Generate 1-2 questions per lesson based on content
      if (lessonContent) {
        // Question 1: Based on lesson title/content
        const question1 = {
          id: questionId++,
          question: `Based on the lesson "${lessonTitle}", ${generateQuestionFromContent(lessonContent)}`,
          options: generateOptionsFromContent(lessonContent, lessonPoints),
          correct: 0,
          explanation: `This question is based on the lesson: ${lessonTitle}. Review the lesson content to understand the correct answer.`
        }
        generatedQuestions.push(question1)
      }

      // Generate questions from key points
      if (lessonPoints && lessonPoints.length > 0) {
        lessonPoints.forEach((point, pointIndex) => {
          if (pointIndex < 2 && point.trim()) { // Max 2 questions per lesson from points
            const question = {
              id: questionId++,
              question: generateQuestionFromPoint(point),
              options: generateOptionsFromPoint(point, lessonPoints),
              correct: 0,
              explanation: `This question is based on: ${point.substring(0, 100)}...`
            }
            generatedQuestions.push(question)
          }
        })
      }
    })

    // Limit to 5-10 questions total
    const finalQuestions = generatedQuestions.slice(0, Math.min(10, generatedQuestions.length))

    if (finalQuestions.length === 0) {
      toast.error('Could not generate questions from lessons. Please ensure lessons have content.')
      return
    }

    // Create or update quiz
    const quizTitle = moduleFormData.quiz?.title || `${moduleFormData.title} Quiz`
    const existingQuiz = moduleFormData.quizzes && moduleFormData.quizzes.length > 0 
      ? moduleFormData.quizzes[0] 
      : null

    const newQuiz = {
      id: existingQuiz?.id || `quiz-${Date.now()}`,
      title: quizTitle,
      questions: finalQuestions,
      images: [],
      videos: []
    }

    // Update module form data
    const updatedQuizzes = existingQuiz 
      ? moduleFormData.quizzes.map(q => q.id === existingQuiz.id ? newQuiz : q)
      : [newQuiz, ...(moduleFormData.quizzes || [])]

    setModuleFormData(prev => ({
      ...prev,
      quizzes: updatedQuizzes,
      quiz: newQuiz // Also update backward compatibility quiz field
    }))

    toast.success(`Generated ${finalQuestions.length} quiz questions from lessons!`)
  }

  // Helper function to generate question from content
  const generateQuestionFromContent = (content) => {
    // Extract key concepts and create a question
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    if (sentences.length === 0) return 'what is the main topic covered?'
    
    // Look for key phrases
    if (content.toLowerCase().includes('important') || content.toLowerCase().includes('essential')) {
      return 'what is an important concept discussed?'
    }
    if (content.toLowerCase().includes('should') || content.toLowerCase().includes('must')) {
      return 'what should you remember from this lesson?'
    }
    if (content.toLowerCase().includes('best') || content.toLowerCase().includes('recommended')) {
      return 'what is the best practice mentioned?'
    }
    
    return 'what is the main concept covered in this lesson?'
  }

  // Helper function to generate options from content
  const generateOptionsFromContent = (content, points) => {
    const options = []
    
    // Extract key terms/phrases
    const keyTerms = extractKeyTerms(content, points)
    
    // Create correct answer (first option)
    if (keyTerms.length > 0) {
      options.push(keyTerms[0])
    } else {
      options.push('The concepts discussed in the lesson')
    }
    
    // Add plausible distractors
    options.push('Information not covered in the lesson')
    options.push('Advanced topics beyond this lesson')
    options.push('Basic concepts unrelated to this lesson')
    
    return options.slice(0, 4)
  }

  // Helper function to generate question from point
  const generateQuestionFromPoint = (point) => {
    // Remove emoji and extract meaningful content
    const cleanPoint = point.replace(/[🌱🌿🌾💡🔬🌱💧☀️🌡️🏠📊🧪🌿⚡🍃⏰🔄🎯📅🔍]/g, '').trim()
    
    if (cleanPoint.length < 10) return `What is mentioned in: ${cleanPoint.substring(0, 50)}?`
    
    // Extract the main concept
    const firstSentence = cleanPoint.split(':')[0] || cleanPoint.split('.')[0] || cleanPoint
    const concept = firstSentence.substring(0, 60).trim()
    
    return `According to the lesson, what is true about ${concept}?`
  }

  // Helper function to generate options from point
  const generateOptionsFromPoint = (point, allPoints) => {
    const options = []
    
    // Extract the main answer from the point
    const mainAnswer = point.split(':')[1] || point.split('.')[0] || point
    const cleanAnswer = mainAnswer.substring(0, 80).trim()
    
    if (cleanAnswer) {
      options.push(cleanAnswer)
    } else {
      options.push('The information provided in the lesson')
    }
    
    // Add distractors from other points or generic options
    if (allPoints && allPoints.length > 1) {
      const otherPoints = allPoints.filter(p => p !== point).slice(0, 2)
      otherPoints.forEach(p => {
        const distractor = p.split(':')[1] || p.split('.')[0] || p
        if (distractor && options.length < 4) {
          options.push(distractor.substring(0, 80).trim())
        }
      })
    }
    
    // Fill remaining slots with generic options
    while (options.length < 4) {
      options.push('Information not covered in this lesson')
    }
    
    return options.slice(0, 4)
  }

  // Helper function to extract key terms
  const extractKeyTerms = (content, points) => {
    const terms = []
    
    // Extract from content
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 15)
    sentences.slice(0, 2).forEach(sentence => {
      const keyPhrase = sentence.trim().substring(0, 60)
      if (keyPhrase) terms.push(keyPhrase)
    })
    
    // Extract from points
    if (points && points.length > 0) {
      points.slice(0, 2).forEach(point => {
        const cleanPoint = point.replace(/[🌱🌿🌾💡🔬🌱💧☀️🌡️🏠📊🧪🌿⚡🍃⏰🔄🎯📅🔍]/g, '').trim()
        const keyPhrase = cleanPoint.split(':')[1] || cleanPoint.split('.')[0] || cleanPoint
        if (keyPhrase && keyPhrase.length > 10) {
          terms.push(keyPhrase.substring(0, 60).trim())
        }
      })
    }
    
    return terms.filter(t => t && t.length > 5).slice(0, 4)
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
    // Validate question has content
    if (!questionFormData.question.trim()) {
      toast.error('Please enter a question')
      return
    }
    
    // Validate at least 2 options
    const validOptions = questionFormData.options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }
    
    // Validate correct answer is selected
    if (questionFormData.correct === null || questionFormData.correct === undefined) {
      toast.error('Please select the correct answer')
      return
    }
    
    // Validate explanation is provided
    if (!questionFormData.explanation || !questionFormData.explanation.trim()) {
      toast.error('Please provide an explanation for the correct answer')
      return
    }
    
    const newQuestion = {
      id: Date.now(),
      question: questionFormData.question.trim(),
      options: validOptions,
      correct: questionFormData.correct,
      explanation: questionFormData.explanation.trim(),
      required: questionFormData.required !== undefined ? questionFormData.required : true,
      image: questionFormData.image || null,
      video: questionFormData.video || null
    }

    setQuizFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))

    toast.success('Question added successfully!')
    resetQuestionForm()
  }

  // Add question directly to module quiz (for inline editing in module edit modal)
  const handleAddQuestionToModule = () => {
    // Validate question has content
    if (!questionFormData.question.trim()) {
      toast.error('Please enter a question')
      return
    }
    
    // Validate at least 2 options
    const validOptions = questionFormData.options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options')
      return
    }
    
    // Validate correct answer is selected
    if (questionFormData.correct === null || questionFormData.correct === undefined) {
      toast.error('Please select the correct answer')
      return
    }
    
    // Validate explanation is provided
    if (!questionFormData.explanation || !questionFormData.explanation.trim()) {
      toast.error('Please provide an explanation for the correct answer')
      return
    }
    
    const newQuestion = {
      id: Date.now(),
      question: questionFormData.question.trim(),
      options: validOptions,
      correct: questionFormData.correct,
      explanation: questionFormData.explanation.trim(),
      required: questionFormData.required !== undefined ? questionFormData.required : true,
      image: questionFormData.image || null,
      video: questionFormData.video || null
    }

    setModuleFormData(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        questions: [...(prev.quiz.questions || []), newQuestion]
      }
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
      quizzes: [],
      images: [],
      videos: []
    })
    setFilesToDelete({ images: [], videos: [] })
  }

  const resetLessonForm = () => {
    setLessonFormData({
      title: '',
      content: '',
      points: [''],
      images: [],
      videos: []
    })
  }

  const resetQuizForm = () => {
    setQuizFormData({
      title: '',
      questions: [],
      images: [],
      videos: []
    })
  }

  const resetQuestionForm = () => {
    setQuestionFormData({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      image: null,
      video: null
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

  const removeImage = (imageId) => {
    const imageToRemove = moduleFormData.images.find(img => img.id === imageId)
    if (!imageToRemove) return

    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${imageToRemove.name}"? The file will be removed when you save the module.`)) {
      return
    }

    // Mark file for deletion (will be deleted from server when module is saved)
    if (imageToRemove.url) {
      setFilesToDelete(prev => ({
        ...prev,
        images: [...prev.images, imageToRemove.url]
      }))
    }
    
    // Remove from UI immediately (but don't delete from server yet)
    setModuleFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
    
    toast.success('Image marked for deletion. Click "Update Module" to save changes.')
  }

  const removeVideo = (videoId) => {
    const videoToRemove = moduleFormData.videos.find(vid => vid.id === videoId)
    if (!videoToRemove) return

    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${videoToRemove.name}"? The file will be removed when you save the module.`)) {
      return
    }

    // Mark file for deletion (will be deleted from server when module is saved)
    if (videoToRemove.url) {
      setFilesToDelete(prev => ({
        ...prev,
        videos: [...prev.videos, videoToRemove.url]
      }))
    }
    
    // Remove from UI immediately (but don't delete from server yet)
    setModuleFormData(prev => ({
      ...prev,
      videos: prev.videos.filter(vid => vid.id !== videoId)
    }))
    
    toast.success('Video marked for deletion. Click "Update Module" to save changes.')
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

  // Quiz Video Upload Function
  const handleQuizVideoUpload = async (file, questionNumber) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'video')
      formData.append('learning_path', 'true')
      formData.append('path_difficulty', 'Beginner')
      formData.append('module_id', 'plant-basics')
      formData.append('content_type', 'quiz_question')
      formData.append('content_id', questionNumber)
      formData.append('question_number', questionNumber)
      formData.append('title', `Quiz Question ${questionNumber}`)
      formData.append('description', `Video for quiz question ${questionNumber}`)
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setQuizFormData(prev => ({
        ...prev,
        videos: [...prev.videos, {
          id: response.data.id,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
          type: file.type,
          questionNumber: questionNumber
        }]
      }))
      
      toast.success(`Video uploaded successfully for Question ${questionNumber}!`)
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  const removeQuizVideo = async (videoId) => {
    try {
      const videoToRemove = quizFormData.videos.find(vid => vid.id === videoId)
      if (videoToRemove) {
        // Delete file from server
        await axios.post('/api/admin/delete-file', {
          fileUrl: videoToRemove.url
        })
      }
      
      setQuizFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed!')
    } catch (error) {
      console.error('Error removing video:', error)
      // Still remove from UI even if server deletion fails
      setQuizFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(vid => vid.id !== videoId)
      }))
      toast.success('Video removed from quiz!')
    }
  }

  // Quiz-level video upload (not question-specific)
  const handleQuizLevelVideoUpload = async (file) => {
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
      
      setQuizFormData(prev => ({
        ...prev,
        videos: [...prev.videos, {
          id: response.data.id || `video-${Date.now()}`,
          url: response.data.fileUrl,
          name: file.name,
          size: response.data.size || file.size,
          type: file.type,
          isQuizLevel: true // Mark as quiz-level video
        }]
      }))
      
      toast.success('Quiz video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading quiz video:', error)
      toast.error('Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  // Handle question image upload (directly to question)
  const handleQuestionImageUpload = async (file, questionIndex) => {
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
      
      setQuizFormData(prev => ({
        ...prev,
        questions: prev.questions.map((q, idx) => 
          idx === questionIndex ? { ...q, image: response.data.fileUrl, imageDescription: file.name } : q
        )
      }))
      
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Handle question video upload (directly to question)
  const handleQuestionVideoUpload = async (file, questionIndex) => {
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
      
      setQuizFormData(prev => ({
        ...prev,
        questions: prev.questions.map((q, idx) => 
          idx === questionIndex ? { ...q, video: response.data.fileUrl } : q
        )
      }))
      
      toast.success('Video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Failed to upload video')
    } finally {
      setUploading(false)
    }
  }

  // Handle question image upload inline (in module edit modal)
  const handleQuestionImageUploadInline = async (file, questionId) => {
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
      
      const imageUrl = response.data.fileUrl
      
      // Update moduleFormData
      setModuleFormData(prev => ({
        ...prev,
        quiz: {
          ...prev.quiz,
          questions: prev.quiz.questions.map(q => 
            q.id === questionId ? { ...q, image: imageUrl, imageDescription: file.name } : q
          )
        }
      }))
      
      // Update questionFormData if this question is being edited or is new
      if (editingQuestionInline === questionId || questionId === 'new') {
        setQuestionFormData(prev => ({
          ...prev,
          image: imageUrl
        }))
      }
      
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Handle question video upload inline (in module edit modal)
  const handleQuestionVideoUploadInline = async (file, questionId) => {
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
      
      const videoUrl = response.data.fileUrl
      
      // Update moduleFormData
      setModuleFormData(prev => ({
        ...prev,
        quiz: {
          ...prev.quiz,
          questions: prev.quiz.questions.map(q => 
            q.id === questionId ? { ...q, video: videoUrl } : q
          )
        }
      }))
      
      // Update questionFormData if this question is being edited or is new
      if (editingQuestionInline === questionId || questionId === 'new') {
        setQuestionFormData(prev => ({
          ...prev,
          video: videoUrl
        }))
      }
      
      toast.success('Video uploaded successfully!')
    } catch (error) {
      console.error('Error uploading video:', error)
      toast.error('Failed to upload video')
    } finally {
      setUploading(false)
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
      case 'intermediate': return 'bg-green-100 text-green-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading learning paths...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <AdminHeader
        title="Manage Learning Paths"
        subtitle="Edit modules, lessons, and quizzes for the 3 learning paths users see in their dashboard"
        icon={BookOpen}
        iconColor="from-green-600 to-emerald-600"
        showBackButton={true}
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
                  className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
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
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-sm opacity-75"></div>
                      <div className="relative p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
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
                            <span className="text-sm text-slate-500 bg-green-100 px-3 py-1 rounded-full">
                              {selectedPath.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} lessons
                          </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Add Module Button */}
                        <button
                          onClick={() => openAddModuleModal(selectedPath)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                          title="Add New Module"
                        >
                          <Plus className="h-5 w-5" />
                          <span className="font-semibold">Add Module</span>
                        </button>
                        {/* Enhanced View Mode Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white text-green-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Grid View"
                          >
                            <Grid className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-green-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
                            title="List View"
                          >
                            <List className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Modules Display */}
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {selectedPath.modules.map((module) => (
                          <div 
                            key={module.id} 
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            {/* Simplified Module Header */}
                            <div className="p-5 border-b border-gray-200">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <BookOpen className="h-5 w-5 text-green-600" />
                                    <h6 className="font-semibold text-lg text-gray-900">{module.title}</h6>
                                    </div>
                                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{module.description}</p>
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                        {module.estimatedTime}
                                      </div>
                                    <div className="flex items-center">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      {module.lessons?.length || 0} lessons
                                    </div>
                                    <div className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {module.quiz?.questions?.length || 0} quiz
                                  </div>
                                  </div>
                                </div>
                                
                                {/* Edit and Delete Buttons - Single set only */}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditModuleModal(module)
                                      }}
                                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                                      title="Edit Module"
                                    >
                                    <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteModule(module.id)
                                      }}
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                                      title="Delete Module"
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                              </div>
                            </div>
                            
                            {/* Simplified Module Content - Display Only */}
                            <div className="p-5">
                              {/* Lessons Section */}
                              <div className="mb-4">
                                <div className="mb-3">
                                  <h7 className="text-sm font-semibold text-gray-700">Lessons ({module.lessons.length})</h7>
                                </div>
                                {expandedModules[module.id] ? (
                                  <div className="space-y-2">
                                    {module.lessons.map((lesson, index) => (
                                      <div key={lesson.id} className="flex items-center bg-gray-50 rounded p-3">
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                          <span className="text-xs font-medium text-gray-500 w-6">{index + 1}.</span>
                                          <div className="flex-1 min-w-0">
                                            <span className="text-sm font-medium text-gray-900 block truncate">{lesson.title}</span>
                                        </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                                    {module.lessons.slice(0, 2).map(lesson => lesson.title).join(', ')}
                                    {module.lessons.length > 2 && ` +${module.lessons.length - 2} more`}
                                  </div>
                                )}
                              </div>
                              
                              {/* Quiz Section */}
                              <div className="border-t border-gray-200 pt-4">
                                <div className="mb-3">
                                  <h7 className="text-sm font-semibold text-gray-700">Quiz</h7>
                                    </div>
                                <div className="bg-gray-50 rounded p-3">
                                  <div className="text-sm font-medium text-gray-900 mb-1">
                                  {module.quiz.title || 'No quiz added'}
                                </div>
                                {module.quiz.questions && module.quiz.questions.length > 0 && (
                                    <div className="text-xs text-gray-500">
                                    {module.quiz.questions.length} questions
                                      </div>
                                  )}
                                      </div>
                                  </div>
                              
                              {/* Expand/Collapse Button */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => toggleModuleExpansion(module.id)}
                                  className="w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center justify-center"
                                >
                                  {expandedModules[module.id] ? (
                                    <>
                                      <ChevronUp className="h-4 w-4 mr-1" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-4 w-4 mr-1" />
                                      Show More
                                    </>
                                )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedPath.modules.map((module) => (
                          <div 
                            key={module.id} 
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1 pr-4">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                    <h6 className="font-semibold text-gray-900">{module.title}</h6>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">{module.description}</p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {module.estimatedTime}
                                  </div>
                                    <div className="flex items-center">
                                      <BookOpen className="h-3 w-3 mr-1" />
                                      {module.lessons.length} lessons
                                    </div>
                                    <div className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {module.quiz.questions ? module.quiz.questions.length : 0} quiz
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Edit and Delete Buttons - Single set only */}
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openEditModuleModal(module)
                                      }}
                                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                                    title="Edit Module"
                                    >
                                    <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteModule(module.id)
                                      }}
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                                    title="Delete Module"
                                    >
                                    <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
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
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
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
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                          placeholder="Enter module title..."
                        required
                      />
                    </div>
                    
                    <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Estimated Time</label>
                      <select
                        value={moduleFormData.estimatedTime}
                        onChange={(e) => setModuleFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
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
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                        placeholder="Describe what students will learn in this module..."
                      required
                    />
                    </div>
                  </div>

                  {/* Enhanced Content Management Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                    {activeModuleTab === 'basic' && (
                      <div className="space-y-6">
                        <h5 className="text-lg font-semibold text-slate-900">Module Basic Information</h5>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                            <p className="text-base text-gray-900">{moduleFormData.title || 'Not set'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <p className="text-base text-gray-900 whitespace-pre-wrap">{moduleFormData.description || 'Not set'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                              <p className="text-base text-gray-900">{moduleFormData.estimatedTime || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                              <p className="text-base text-gray-900">{moduleFormData.difficulty || 'Not set'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeModuleTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Lessons</h5>
                          <button
                            type="button"
                            onClick={openAddLessonModal}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
                                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
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
                                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
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
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={generateQuizFromLessons}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                              title="Generate quiz questions based on lesson content"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate from Lessons
                            </button>
                            <button
                              type="button"
                              onClick={openAddQuizModal}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Quiz
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-slate-900 mb-2">
                                {moduleFormData.quiz.title || 'No quiz added'}
                              </div>
                              {moduleFormData.quiz.questions && moduleFormData.quiz.questions.length > 0 && (
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-slate-500 bg-green-100 px-3 py-1 rounded-full">
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
                                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
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
                          
                          {/* Add Question Button */}
                          <div className="mt-4 mb-4">
                            <button
                              type="button"
                              onClick={() => {
                                resetQuestionForm()
                                setEditingQuestionInline('new')
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Question
                            </button>
                        </div>

                          {/* New Question Form */}
                          {editingQuestionInline === 'new' && (
                            <div className="mt-4 mb-4 bg-green-50 rounded-lg p-4 border-2 border-green-200">
                              <h6 className="text-sm font-semibold text-slate-700 mb-3">New Question</h6>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                  <input
                                    type="text"
                                    value={questionFormData.question}
                                    onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter question"
                                  />
                      </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Options <span className="text-red-500">*</span>
                                    <span className="ml-2 text-xs text-gray-500 font-normal">(Select the correct answer)</span>
                                  </label>
                                  {questionFormData.options.map((option, optIndex) => (
                                    <div key={optIndex} className={`flex items-center space-x-2 mb-2 p-2 rounded-lg border-2 transition-all ${
                                      questionFormData.correct === optIndex 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-gray-200 bg-white'
                                    }`}>
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="radio"
                                          name="new-question-correct"
                                          checked={questionFormData.correct === optIndex}
                                          onChange={() => setQuestionFormData(prev => ({ ...prev, correct: optIndex }))}
                                          className="w-5 h-5 text-green-600 focus:ring-green-500"
                                        />
                                        <span className={`text-xs font-medium ${
                                          questionFormData.correct === optIndex 
                                            ? 'text-green-700' 
                                            : 'text-gray-500'
                                        }`}>
                                          {questionFormData.correct === optIndex ? '✓ Correct Answer' : 'Option'}
                                        </span>
                                      </div>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...questionFormData.options]
                                          newOptions[optIndex] = e.target.value
                                          setQuestionFormData(prev => ({ ...prev, options: newOptions }))
                                        }}
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder={`Option ${optIndex + 1}`}
                                      />
                                      {questionFormData.options.length > 2 && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newOptions = questionFormData.options.filter((_, i) => i !== optIndex)
                                            setQuestionFormData(prev => ({
                                              ...prev,
                                              options: newOptions,
                                              correct: prev.correct >= optIndex ? Math.max(0, prev.correct - 1) : prev.correct
                                            }))
                                          }}
                                          className="p-1 text-red-400 hover:text-red-600"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuestionFormData(prev => ({
                                        ...prev,
                                        options: [...prev.options, '']
                                      }))
                                    }}
                                    className="text-sm text-green-600 hover:text-green-700 flex items-center mt-2"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add option
                                  </button>
                                  {questionFormData.correct === null || questionFormData.correct === undefined ? (
                                    <p className="mt-2 text-xs text-red-600">⚠️ Please select the correct answer</p>
                                  ) : null}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Explanation <span className="text-red-500">*</span>
                                    <span className="ml-2 text-xs text-gray-500 font-normal">(Shown to users after answering)</span>
                                  </label>
                                  <textarea
                                    value={questionFormData.explanation}
                                    onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Explain why this answer is correct. This helps users understand the concept better..."
                                    rows="3"
                                    required
                                  />
                                  {!questionFormData.explanation.trim() && (
                                    <p className="mt-1 text-xs text-amber-600">💡 Adding an explanation helps users learn from their mistakes</p>
                                  )}
                                </div>

                                {/* Image/Video Upload */}
                                <div className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        if (e.target.files[0]) {
                                          handleQuestionImageUploadInline(e.target.files[0], 'new')
                                          e.target.value = ''
                                        }
                                      }}
                                      className="hidden"
                                      id="new-question-image"
                                    />
                                    <label
                                      htmlFor="new-question-image"
                                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center text-sm"
                                    >
                                      <Image className="h-4 w-4 mr-1" />
                                      Add Image
                                    </label>
                                    
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => {
                                        if (e.target.files[0]) {
                                          handleQuestionVideoUploadInline(e.target.files[0], 'new')
                                          e.target.value = ''
                                        }
                                      }}
                                      className="hidden"
                                      id="new-question-video"
                                    />
                                    <label
                                      htmlFor="new-question-video"
                                      className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer flex items-center text-sm"
                                    >
                                      <Video className="h-4 w-4 mr-1" />
                                      Add Video
                                    </label>
                                  </div>

                                  {/* Display current media */}
                                  {questionFormData.image && (
                                    <div className="relative inline-block mt-2">
                                      <img 
                                        src={questionFormData.image} 
                                        alt="Question" 
                                        className="max-w-xs rounded-lg border border-gray-300" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setQuestionFormData(prev => ({ ...prev, image: null }))}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                  {questionFormData.video && (
                                    <div className="relative inline-block mt-2">
                                      <video 
                                        src={questionFormData.video} 
                                        controls 
                                        className="max-w-xs rounded-lg border border-gray-300" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setQuestionFormData(prev => ({ ...prev, video: null }))}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                  <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={questionFormData.required !== undefined ? questionFormData.required : true}
                                      onChange={(e) => setQuestionFormData(prev => ({ ...prev, required: e.target.checked }))}
                                      className="w-4 h-4 text-green-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Required</span>
                                  </label>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2 border-t">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleAddQuestionToModule()
                                      setEditingQuestionInline(null)
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                  >
                                    Add Question
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingQuestionInline(null)
                                      resetQuestionForm()
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Display Quiz Questions */}
                          {moduleFormData.quiz.questions && moduleFormData.quiz.questions.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <h6 className="text-sm font-semibold text-slate-700 mb-2">Questions ({moduleFormData.quiz.questions.length}):</h6>
                              {moduleFormData.quiz.questions.map((question, index) => (
                                <div key={question.id || index} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  {editingQuestionInline === question.id ? (
                                    // Inline Edit Form
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                                        <input
                                          type="text"
                                          value={questionFormData.question}
                                          onChange={(e) => setQuestionFormData(prev => ({ ...prev, question: e.target.value }))}
                                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                          placeholder="Enter question"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                          Options <span className="text-red-500">*</span>
                                          <span className="ml-2 text-xs text-gray-500 font-normal">(Select the correct answer)</span>
                                        </label>
                                        {questionFormData.options.map((option, optIndex) => (
                                          <div key={optIndex} className={`flex items-center space-x-2 mb-2 p-2 rounded-lg border-2 transition-all ${
                                            questionFormData.correct === optIndex 
                                              ? 'border-green-500 bg-green-50' 
                                              : 'border-gray-200 bg-white'
                                          }`}>
                                            <div className="flex items-center space-x-2">
                                              <input
                                                type="radio"
                                                name={`edit-question-${question.id}`}
                                                checked={questionFormData.correct === optIndex}
                                                onChange={() => setQuestionFormData(prev => ({ ...prev, correct: optIndex }))}
                                                className="w-5 h-5 text-green-600 focus:ring-green-500"
                                              />
                                              <span className={`text-xs font-medium ${
                                                questionFormData.correct === optIndex 
                                                  ? 'text-green-700' 
                                                  : 'text-gray-500'
                                              }`}>
                                                {questionFormData.correct === optIndex ? '✓ Correct Answer' : 'Option'}
                                              </span>
                                            </div>
                                            <input
                                              type="text"
                                              value={option}
                                              onChange={(e) => {
                                                const newOptions = [...questionFormData.options]
                                                newOptions[optIndex] = e.target.value
                                                setQuestionFormData(prev => ({ ...prev, options: newOptions }))
                                              }}
                                              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                              placeholder={`Option ${optIndex + 1}`}
                                            />
                                            {questionFormData.options.length > 2 && (
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  const newOptions = questionFormData.options.filter((_, i) => i !== optIndex)
                                                  setQuestionFormData(prev => ({
                                                    ...prev,
                                                    options: newOptions,
                                                    correct: prev.correct >= optIndex ? Math.max(0, prev.correct - 1) : prev.correct
                                                  }))
                                                }}
                                                className="p-1 text-red-400 hover:text-red-600"
                                              >
                                                <X className="h-4 w-4" />
                                              </button>
                                            )}
                                          </div>
                                        ))}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setQuestionFormData(prev => ({
                                              ...prev,
                                              options: [...prev.options, '']
                                            }))
                                          }}
                                          className="text-sm text-green-600 hover:text-green-700 flex items-center mt-2"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add option
                                        </button>
                                        {questionFormData.correct === null || questionFormData.correct === undefined ? (
                                          <p className="mt-2 text-xs text-red-600">⚠️ Please select the correct answer</p>
                                        ) : null}
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Explanation <span className="text-red-500">*</span>
                                          <span className="ml-2 text-xs text-gray-500 font-normal">(Shown to users after answering)</span>
                                        </label>
                                        <textarea
                                          value={questionFormData.explanation}
                                          onChange={(e) => setQuestionFormData(prev => ({ ...prev, explanation: e.target.value }))}
                                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                          placeholder="Explain why this answer is correct. This helps users understand the concept better..."
                                          rows="3"
                                          required
                                        />
                                        {!questionFormData.explanation.trim() && (
                                          <p className="mt-1 text-xs text-amber-600">💡 Adding an explanation helps users learn from their mistakes</p>
                                        )}
                                      </div>

                                      {/* Image/Video Upload */}
                                      <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Media</label>
                                        <div className="flex items-center space-x-2">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              if (e.target.files[0]) {
                                                handleQuestionImageUploadInline(e.target.files[0], question.id)
                                                e.target.value = ''
                                              }
                                            }}
                                            className="hidden"
                                            id={`edit-question-image-${question.id}`}
                                          />
                                          <label
                                            htmlFor={`edit-question-image-${question.id}`}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center text-sm"
                                          >
                                            <Image className="h-4 w-4 mr-1" />
                                            {question.image ? 'Change Image' : 'Add Image'}
                                          </label>
                                          
                                          <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => {
                                              if (e.target.files[0]) {
                                                handleQuestionVideoUploadInline(e.target.files[0], question.id)
                                                e.target.value = ''
                                              }
                                            }}
                                            className="hidden"
                                            id={`edit-question-video-${question.id}`}
                                          />
                                          <label
                                            htmlFor={`edit-question-video-${question.id}`}
                                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer flex items-center text-sm"
                                          >
                                            <Video className="h-4 w-4 mr-1" />
                                            {question.video ? 'Change Video' : 'Add Video'}
                                          </label>
                                        </div>

                                        {/* Display current media */}
                                        {(question.image || questionFormData.image) && (
                                          <div className="relative inline-block mt-2">
                                            <img 
                                              src={question.image || questionFormData.image} 
                                              alt="Question" 
                                              className="max-w-xs rounded-lg border border-gray-300" 
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setModuleFormData(prev => ({
                                                  ...prev,
                                                  quiz: {
                                                    ...prev.quiz,
                                                    questions: prev.quiz.questions.map(q => 
                                                      q.id === question.id ? { ...q, image: null } : q
                                                    )
                                                  }
                                                }))
                                                setQuestionFormData(prev => ({ ...prev, image: null }))
                                              }}
                                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        )}
                                        {(question.video || questionFormData.video) && (
                                          <div className="relative inline-block mt-2">
                                            <video 
                                              src={question.video || questionFormData.video} 
                                              controls 
                                              className="max-w-xs rounded-lg border border-gray-300" 
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setModuleFormData(prev => ({
                                                  ...prev,
                                                  quiz: {
                                                    ...prev.quiz,
                                                    questions: prev.quiz.questions.map(q => 
                                                      q.id === question.id ? { ...q, video: null } : q
                                                    )
                                                  }
                                                }))
                                                setQuestionFormData(prev => ({ ...prev, video: null }))
                                              }}
                                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center space-x-2 pt-2">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={questionFormData.required !== undefined ? questionFormData.required : true}
                                            onChange={(e) => setQuestionFormData(prev => ({ ...prev, required: e.target.checked }))}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-blue-500"
                                          />
                                          <span className="text-sm text-gray-600">Required</span>
                                        </label>
                                      </div>

                                      <div className="flex justify-end space-x-2 pt-2 border-t">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setModuleFormData(prev => ({
                                              ...prev,
                                              quiz: {
                                                ...prev.quiz,
                                                questions: prev.quiz.questions.map(q => 
                                                  q.id === question.id ? {
                                                    ...q,
                                                    question: questionFormData.question,
                                                    options: questionFormData.options.filter(opt => opt.trim() !== ''),
                                                    correct: questionFormData.correct,
                                                    explanation: questionFormData.explanation,
                                                    required: questionFormData.required !== undefined ? questionFormData.required : true,
                                                    image: questionFormData.image || q.image,
                                                    video: questionFormData.video || q.video
                                                  } : q
                                                )
                                              }
                                            }))
                                            setEditingQuestionInline(null)
                                            resetQuestionForm()
                                            toast.success('Question updated!')
                                          }}
                                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingQuestionInline(null)
                                            resetQuestionForm()
                                          }}
                                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    // Display Mode
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingQuestionInline(question.id)
                                              setQuestionFormData({
                                                question: question.question || '',
                                                options: question.options || ['', '', '', ''],
                                                correct: question.correct || 0,
                                                explanation: question.explanation || '',
                                                required: question.required !== undefined ? question.required : true,
                                                image: question.image || null
                                              })
                                            }}
                                            className="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer"
                                          >
                                            Q{index + 1}:
                                          </button>
                                          <span className="text-sm text-slate-900">{question.question}</span>
                                        </div>
                                        {question.options && question.options.length > 0 && (
                                          <div className="ml-6 space-y-1">
                                            {question.options.map((option, optIndex) => (
                                              <div key={optIndex} className="text-xs text-slate-600">
                                                {optIndex === question.correct ? (
                                                  <span className="text-green-600 font-medium">✓ {option} (Correct)</span>
                                                ) : (
                                                  <span>{option}</span>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        {question.explanation && (
                                          <div className="ml-6 mt-2 text-xs text-slate-500 italic">
                                            Explanation: {question.explanation}
                                          </div>
                                        )}
                                        {(question.image || question.video) && (
                                          <div className="ml-6 mt-2">
                                            {question.image && (
                                              <img src={question.image} alt="Question" className="max-w-xs rounded-lg border border-gray-300" />
                                            )}
                                            {question.video && (
                                              <video src={question.video} controls className="max-w-xs rounded-lg border border-gray-300" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingQuestionInline(question.id)
                                            setQuestionFormData({
                                              question: question.question || '',
                                              options: question.options || ['', '', '', ''],
                                              correct: question.correct || 0,
                                              explanation: question.explanation || '',
                                              required: question.required !== undefined ? question.required : true,
                                              image: question.image || null
                                            })
                                          }}
                                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
                                          title="Edit Question"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this question?')) {
                                              setModuleFormData(prev => ({
                                                ...prev,
                                                quiz: {
                                                  ...prev.quiz,
                                                  questions: prev.quiz.questions.filter(q => q.id !== question.id)
                                                }
                                              }))
                                              toast.success('Question deleted!')
                                            }
                                          }}
                                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200"
                                          title="Delete Question"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-sm opacity-75"></div>
                      <div className="relative p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl">
                        <Edit className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">Edit Module</h3>
                      <p className="text-slate-600 mt-1">Update module information and content</p>
                      {(filesToDelete.images.length > 0 || filesToDelete.videos.length > 0) && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                            {filesToDelete.images.length + filesToDelete.videos.length} file(s) marked for deletion
                          </span>
                          <span className="text-sm text-slate-500">Click "Update Module" to save changes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModuleModal(false)
                      setEditingModule(null)
                      setEditingLessonInline(null)
                      setIsEditingQuizInline(false)
                      setEditingQuestionInline(null)
                      resetModuleForm()
                    }}
                    className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditModule} className="space-y-8">
                  {/* Enhanced Basic Information */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
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
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                          placeholder="Enter module title..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-lg font-semibold text-slate-700 mb-3">Estimated Time</label>
                        <select
                          value={moduleFormData.estimatedTime}
                          onChange={(e) => setModuleFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                          className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
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
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/50 backdrop-blur-sm transition-all duration-200 text-lg"
                        placeholder="Describe what students will learn in this module..."
                        required
                      />
                    </div>
                  </div>

                  {/* Enhanced Content Management Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
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
                    {activeModuleTab === 'basic' && (
                      <div className="space-y-6">
                        <h5 className="text-lg font-semibold text-slate-900">Module Basic Information</h5>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                            <p className="text-base text-gray-900">{moduleFormData.title || 'Not set'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <p className="text-base text-gray-900 whitespace-pre-wrap">{moduleFormData.description || 'Not set'}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time</label>
                              <p className="text-base text-gray-900">{moduleFormData.estimatedTime || 'Not set'}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                              <p className="text-base text-gray-900">{moduleFormData.difficulty || 'Not set'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeModuleTab === 'lessons' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Lessons</h5>
                          <button
                            type="button"
                            onClick={openAddLessonModal}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lesson
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {moduleFormData.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="bg-white rounded-lg p-4 border border-gray-200">
                              {editingLessonInline === lesson.id ? (
                                // Inline Edit Form
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                                    <input
                                      type="text"
                                      value={lessonFormData.title}
                                      onChange={(e) => setLessonFormData(prev => ({ ...prev, title: e.target.value }))}
                                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                      placeholder="Enter lesson title"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                      value={lessonFormData.content}
                                      onChange={(e) => setLessonFormData(prev => ({ ...prev, content: e.target.value }))}
                                      rows="4"
                                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                      placeholder="Enter lesson content"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={saveLessonInline}
                                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelLessonInline}
                                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                // Display Mode
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                    <div className="flex-1">
                                      <span className="text-base font-semibold text-gray-900 block">{lesson.title}</span>
                                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{lesson.content}</p>
                                  </div>
                                </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                  <button
                                    type="button"
                                      onClick={() => startEditingLessonInline(lesson)}
                                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
                                    title="Edit Lesson"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeModuleTab === 'quizzes' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-semibold text-slate-900">Module Quizzes ({(moduleFormData.quizzes || []).length})</h5>
                          <button
                            type="button"
                            onClick={openAddQuizModal}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quiz
                          </button>
                        </div>
                        
                        {/* Display All Quizzes */}
                        {(moduleFormData.quizzes || []).length > 0 ? (
                          <div className="space-y-4">
                            {(moduleFormData.quizzes || []).map((quiz, index) => (
                              <div key={quiz.id || `quiz-${index}-${quiz.title}`} className="bg-white rounded-lg p-6 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="text-base font-semibold text-gray-900 mb-2">
                                      {quiz.title || `Quiz ${index + 1}`}
                                    </div>
                                    {quiz.questions && quiz.questions.length > 0 && (
                                      <div className="text-sm text-gray-500">
                                        {quiz.questions.length} questions
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Quiz Action Buttons */}
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      type="button"
                                      onClick={() => openEditQuizModal(quiz)}
                                      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
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
                                            quizzes: (prev.quizzes || []).filter(q => (q.id || `quiz-${index}`) !== (quiz.id || `quiz-${index}`))
                                          }))
                                          toast.success('Quiz deleted successfully!')
                                        }
                                      }}
                                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                                      title="Delete Quiz"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">No quizzes added yet. Click "Add Quiz" to create your first quiz.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModuleModal(false)
                        setEditingModule(null)
                        setEditingLessonInline(null)
                        setIsEditingQuizInline(false)
                        setEditingQuestionInline(null)
                        resetModuleForm()
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center ${
                        (filesToDelete.images.length > 0 || filesToDelete.videos.length > 0)
                          ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white animate-pulse'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      }`}
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Update Module
                      {(filesToDelete.images.length > 0 || filesToDelete.videos.length > 0) && (
                        <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                          {filesToDelete.images.length + filesToDelete.videos.length}
                        </span>
                      )}
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
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
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
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
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
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
                        images: [],
                        videos: []
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

                  {/* Questions Builder - Google Forms Style */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-lg">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">Questions</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newQuestion = {
                            id: Date.now(),
                            question: '',
                            type: 'multiple_choice',
                            options: ['', ''],
                            correct: 0,
                            required: false,
                            image: null
                          }
                          setQuizFormData(prev => ({
                            ...prev,
                            questions: [...prev.questions, newQuestion]
                          }))
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </button>
                    </div>

                    <div className="space-y-4">
                      {quizFormData.questions.map((question, qIndex) => (
                        <div key={question.id} className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
                          {/* Question Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2 flex-1">
                              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded text-sm font-medium text-gray-600">
                                {qIndex + 1}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={question.question}
                                  onChange={(e) => {
                                    setQuizFormData(prev => ({
                                      ...prev,
                                      questions: prev.questions.map((q, idx) => 
                                        idx === qIndex ? { ...q, question: e.target.value } : q
                                      )
                                    }))
                                  }}
                                  className="w-full border-b-2 border-transparent focus:border-blue-500 px-2 py-2 text-lg font-semibold focus:outline-none"
                                  placeholder="Question"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select
                                value={question.type || 'multiple_choice'}
                                onChange={(e) => {
                                  setQuizFormData(prev => ({
                                    ...prev,
                                    questions: prev.questions.map((q, idx) => 
                                      idx === qIndex ? { ...q, type: e.target.value } : q
                                    )
                                  }))
                                }}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              >
                                <option value="multiple_choice">Multiple choice</option>
                              </select>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files[0]) {
                                    handleQuestionImageUpload(e.target.files[0], qIndex)
                                    e.target.value = ''
                                  }
                                }}
                                className="hidden"
                                id={`question-image-${qIndex}`}
                              />
                              <label
                                htmlFor={`question-image-${qIndex}`}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                                title="Add image to question"
                              >
                                <Image className="h-5 w-5" />
                              </label>
                            </div>
                          </div>

                          {/* Question Options */}
                          {question.type === 'multiple_choice' && (
                            <div className="ml-10 space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center space-x-3">
                                  <input
                                    type="radio"
                                    name={`question-${qIndex}`}
                                    checked={question.correct === optIndex}
                                    onChange={() => {
                                      setQuizFormData(prev => ({
                                        ...prev,
                                        questions: prev.questions.map((q, idx) => 
                                          idx === qIndex ? { ...q, correct: optIndex } : q
                                        )
                                      }))
                                    }}
                                    className="w-4 h-4 text-green-600"
                                  />
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...question.options]
                                      newOptions[optIndex] = e.target.value
                                      setQuizFormData(prev => ({
                                        ...prev,
                                        questions: prev.questions.map((q, idx) => 
                                          idx === qIndex ? { ...q, options: newOptions } : q
                                        )
                                      }))
                                    }}
                                    className="flex-1 border-b border-transparent focus:border-blue-500 px-2 py-1 focus:outline-none"
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  <button
                                    type="button"
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                    title="Add image to option"
                                  >
                                    <Image className="h-4 w-4" />
                                  </button>
                                  {question.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions = question.options.filter((_, idx) => idx !== optIndex)
                                        setQuizFormData(prev => ({
                                          ...prev,
                                          questions: prev.questions.map((q, idx) => 
                                            idx === qIndex ? { 
                                              ...q, 
                                              options: newOptions,
                                              correct: q.correct >= optIndex ? Math.max(0, q.correct - 1) : q.correct
                                            } : q
                                          )
                                        }))
                                      }}
                                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                      title="Delete option"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [...question.options, '']
                                  setQuizFormData(prev => ({
                                    ...prev,
                                    questions: prev.questions.map((q, idx) => 
                                      idx === qIndex ? { ...q, options: newOptions } : q
                                    )
                                  }))
                                }}
                                className="ml-7 text-sm text-green-600 hover:text-green-700 flex items-center"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add option
                              </button>
                            </div>
                          )}

                          {/* Question Media Display */}
                          {(question.image || question.video) && (
                            <div className="ml-10 mt-4 space-y-2">
                              {question.image && (
                                <div className="relative inline-block">
                                  <img 
                                    src={question.image} 
                                    alt="Question" 
                                    className="max-w-xs rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuizFormData(prev => ({
                                        ...prev,
                                        questions: prev.questions.map((q, idx) => 
                                          idx === qIndex ? { ...q, image: null } : q
                                        )
                                      }))
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                              {question.video && (
                                <div className="relative inline-block">
                                  <video 
                                    src={question.video} 
                                    controls
                                    className="max-w-xs rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuizFormData(prev => ({
                                        ...prev,
                                        questions: prev.questions.map((q, idx) => 
                                          idx === qIndex ? { ...q, video: null } : q
                                        )
                                      }))
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Explanation Field */}
                          <div className="ml-10 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (shown after answer)</label>
                            <textarea
                              value={question.explanation || ''}
                              onChange={(e) => {
                                setQuizFormData(prev => ({
                                  ...prev,
                                  questions: prev.questions.map((q, idx) => 
                                    idx === qIndex ? { ...q, explanation: e.target.value } : q
                                  )
                                }))
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Explain why this answer is correct..."
                              rows="2"
                            />
                          </div>

                          {/* Question Footer */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                onClick={() => {
                                  const duplicatedQuestion = {
                                    ...question,
                                    id: Date.now(),
                                    question: `${question.question} (Copy)`
                                  }
                                  const newQuestions = [...quizFormData.questions]
                                  newQuestions.splice(qIndex + 1, 0, duplicatedQuestion)
                                  setQuizFormData(prev => ({
                                    ...prev,
                                    questions: newQuestions
                                  }))
                                  toast.success('Question duplicated!')
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                title="Duplicate question"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this question?')) {
                                    setQuizFormData(prev => ({
                                      ...prev,
                                      questions: prev.questions.filter((_, idx) => idx !== qIndex)
                                    }))
                                  }
                                }}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete question"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <span className="text-sm text-gray-600">Required</span>
                                <input
                                  type="checkbox"
                                  checked={question.required || false}
                                  onChange={(e) => {
                                    setQuizFormData(prev => ({
                                      ...prev,
                                      questions: prev.questions.map((q, idx) => 
                                        idx === qIndex ? { ...q, required: e.target.checked } : q
                                      )
                                    }))
                                  }}
                                  className="w-4 h-4 text-green-600 rounded focus:ring-blue-500"
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {quizFormData.questions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No questions added yet. Click "Add Question" to get started.</p>
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
                              <span className="text-sm font-medium text-green-600">{index + 1}</span>
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

