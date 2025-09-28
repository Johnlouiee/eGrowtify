import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle, 
  Lock, Play, Clock, Award, ArrowRight, ArrowLeft, Eye, FileText, HelpCircle,
  Target, TrendingUp, Star, Users, Calendar, MapPin, Zap, Video, PlayCircle, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import ImageDisplay from '../components/ImageDisplay'
import { useAuth } from '../contexts/AuthContext'

const BeginnerLearningPath = () => {
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
       id: 'intro',
       title: 'Introduction to Planting',
       icon: BookOpen,
       color: 'green',
       estimatedTime: '25 min',
       difficulty: 'Beginner',
       description: 'Master the fundamentals of plant types, life cycles, and choosing your first plants with confidence',
       lessons: [
         {
           title: 'Understanding Plant Types & Life Cycles',
           content: 'Plants are categorized into three main types based on their life cycle. Understanding these differences is crucial for planning your garden and knowing what to expect from each plant:',
           points: [
             '🌱 ANNUALS: Complete their entire life cycle in one growing season. They grow, flower, produce seeds, and die all within a year. Examples: Marigolds, lettuce, petunias, zinnias. Perfect for beginners because you get quick results and can start fresh each year.',
             '🌿 PERENNIALS: Live for multiple years, often coming back stronger each season. They may die back in winter but regrow from their roots. Examples: Roses, hostas, lavender, mint, daylilies. Great investment plants that provide long-term garden structure.',
             '🌾 BIENNIALS: Take exactly two years to complete their cycle. First year: grow leaves and roots. Second year: flower, produce seeds, then die. Examples: Carrots, parsley, foxgloves, hollyhocks. Require patience but offer unique growing experiences.',
             '💡 PLANNING TIP: Mix all three types in your garden! Annuals for quick color, perennials for structure, and biennials for variety. This creates a dynamic, ever-changing garden that stays interesting year-round.'
           ],
           type: 'lesson',
          images: [
            {
              src: '/images/learning/beginner/annual-plants.jpg',
              alt: 'Annual plants examples',
              description: 'Colorful annual plants like marigolds and petunias showing their vibrant, single-season growth',
              type: 'plant'
            },
            {
              src: '/images/learning/beginner/perennial-plants.jpg',
              alt: 'Perennial plants examples',
              description: 'Mature perennial plants like roses and hostas showing their multi-year growth and established root systems',
              type: 'plant'
            }
          ]
         },
        {
          title: 'Choosing Beginner-Friendly Plants - The Success Formula',
          content: 'Selecting the right plants for your first garden is like choosing the right training wheels for learning to ride a bike. These plants are forgiving, rewarding, and will build your confidence:',
          points: [
            '🌿 HERBS - The Perfect Starting Point: Basil (loves warmth, grows fast, great for cooking), Mint (vigorous grower, hard to kill, spreads easily), Parsley (biennial, great for garnishes), Chives (perennial, comes back every year, mild onion flavor). Herbs are forgiving because they\'re meant to be harvested regularly.',
            '🥬 VEGETABLES - Quick Rewards: Lettuce (fast-growing, can harvest multiple times, cool-season crop), Spinach (nutrient-dense, grows in cool weather), Radishes (ready in 3-4 weeks, great for kids), Cherry tomatoes (more forgiving than large tomatoes, continuous harvest). Start with leafy greens - they\'re the easiest!',
            '🌸 FLOWERS - Instant Gratification: Marigolds (pest-repellent, bright colors, easy from seed), Calendula (edible flowers, self-seeding), Sunflowers (dramatic height, attracts birds, easy to grow). Flowers provide immediate visual rewards and attract beneficial insects.',
            '🏠 HOUSEPLANTS - Year-Round Gardening: Pothos (trailing vine, tolerates neglect, purifies air), Snake Plant (nearly indestructible, low water needs), Spider Plant (produces baby plants, great for sharing). Perfect for learning plant care basics indoors.',
            '💡 SUCCESS TIP: Start with just 3-5 plants maximum. Master their care routine before adding more. It\'s better to have a few thriving plants than many struggling ones!'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/learning/beginner/beginner-herbs.jpg',
              alt: 'Beginner-friendly herbs',
              description: 'A collection of easy-to-grow herbs including basil, mint, parsley, and chives in small pots',
              type: 'plant'
            },
            {
              src: '/images/learning/beginner/beginner-vegetables.jpg',
              alt: 'Beginner-friendly vegetables',
              description: 'Fast-growing vegetables like lettuce, spinach, and radishes showing their quick development',
              type: 'plant'
            },
            {
               src: '/images/learning/beginner/beginner-houseplants.jpg',
               alt: 'Beginner-friendly houseplants',
               description: 'Low-maintenance houseplants like pothos, snake plant, and spider plant in indoor settings',
               type: 'plant'
             }
           ]
         },
        {
          title: 'Starting Small Strategy - Building Your Gardening Foundation',
          content: 'The key to gardening success is building confidence through small wins. Think of it like learning to cook - you don\'t start with a five-course meal! Here\'s your step-by-step approach:',
          points: [
            '🎯 THE 3-5 PLANT RULE: Begin with maximum 3-5 plants. This allows you to give each plant individual attention and learn their specific needs. More plants = more complexity = higher chance of failure. Quality over quantity!',
            '📅 DAILY CARE ROUTINE: Establish a simple routine: Check plants daily (2-3 minutes), water when needed, observe growth changes. Consistency is more important than perfection. Plants thrive on routine, just like pets.',
            '💧 MASTER THE BASICS FIRST: Focus on watering and light requirements before anything else. These are the two most critical factors for plant survival. Get these right, and 80% of your problems disappear.',
            '📈 GRADUAL SCALING: Once you\'ve kept 3-5 plants alive for 2-3 months, add 2-3 more. This gradual approach builds confidence and prevents overwhelm. Each success makes you more confident for the next challenge.',
            '🔍 OBSERVATION SKILLS: Learn to "read" your plants. Yellow leaves, drooping, new growth - these are your plants\' way of communicating. The more you observe, the better gardener you become.',
            '💡 CONFIDENCE BUILDING: Celebrate small wins! First new leaf, first flower, first harvest. These moments build the confidence you need to tackle more challenging plants later.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/small-garden-setup.jpg',
              alt: 'Small beginner garden setup',
              description: 'A small, manageable garden setup with 3-5 plants in containers, showing the ideal starting point for beginners',
              type: 'plant'
            },
            {
              src: '/images/daily-care-routine.jpg',
              alt: 'Daily plant care routine',
              description: 'Someone checking plants daily, showing the simple routine of observation and basic care',
              type: 'plant'
            }
          ]
        }
      ],
      quiz: {
        questions: [
        {
            question: '🔍 PLANT IDENTIFICATION: Look at this plant. It has bright, colorful flowers and appears to be growing vigorously in a single season. What type of plant is this?',
            image: '/images/quiz/quiz-annual-plant.jpg',
            imageDescription: 'A vibrant annual plant with bright flowers showing typical single-season growth characteristics',
            options: ['Annual (lives one season)', 'Perennial (lives many years)', 'Biennial (lives two years)', 'Houseplant'],
            correct: 0,
            explanation: '✅ CORRECT! This is an annual plant. Key identifying features: Bright, showy flowers typical of annuals, single-season growth pattern, and the vibrant appearance that annuals are known for. Annuals put all their energy into one spectacular growing season!'
        },
          {
            question: '🌱 BEGINNER PLANT SELECTION: This plant is known for being nearly indestructible and perfect for beginners. What is it?',
            image: '/images/quiz/quiz-snake-plant.jpg',
            imageDescription: 'A snake plant (Sansevieria) showing its characteristic upright, sword-like leaves and low-maintenance appearance',
            options: ['Orchid (needs special care)', 'Snake Plant (very forgiving)', 'Fiddle Leaf Fig (finicky)', 'Succulent (needs lots of sun)'],
            correct: 1,
            explanation: '✅ CORRECT! This is a Snake Plant (Sansevieria). Perfect for beginners because: It tolerates low light, needs minimal watering, is nearly impossible to kill, and purifies indoor air. It\'s often called "indestructible" for good reason!'
          },
          {
            question: '📊 GARDEN PLANNING: How many plants should a beginner start with for the best success rate?',
            options: ['10-15 plants', '3-5 plants', '20+ plants', 'Just one plant'],
            correct: 1,
            explanation: '✅ CORRECT! 3-5 plants is the ideal starting number. This allows you to: Give each plant individual attention, learn their specific needs, build confidence through manageable care, and avoid overwhelm. Quality over quantity when learning!'
          }
        ]
      }
    },
     {
       id: 'light',
       title: 'Light Basics - The Foundation of Plant Health',
       icon: Sun,
       color: 'yellow',
       estimatedTime: '30 min',
       difficulty: 'Beginner',
       description: 'Master the art of providing proper light for your plants - the most critical factor for plant success',
       hasVideo: true,
       videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual gardening video
       lessons: [
         {
           title: 'Understanding Light Requirements - The Plant Energy System',
           content: 'Light is to plants what food is to humans - it\'s their primary energy source. Understanding light requirements is crucial because it directly affects plant growth, flowering, and overall health:',
           points: [
             '☀️ FULL SUN (6-8+ hours direct sunlight): Most vegetables, sunflowers, roses, lavender. These plants evolved in open areas and need maximum light for photosynthesis. Signs of enough light: Strong growth, good flowering, vibrant colors.',
             '🌤️ PARTIAL SUN (3-6 hours direct sun): Many herbs, some flowers, certain vegetables. These plants prefer morning sun (gentler) over afternoon sun (harsher). Perfect for east-facing windows or filtered light areas.',
             '🌥️ PARTIAL SHADE (2-4 hours direct sun): Hostas, ferns, some flowers, cool-season crops. These plants evolved under tree canopies and prefer filtered or dappled light. Too much direct sun can burn their leaves.',
             '🌑 FULL SHADE (Less than 2 hours direct sun): Many houseplants, some ferns, certain groundcovers. These plants have adapted to low-light conditions but still need bright, indirect light to thrive.',
             '💡 LIGHT QUALITY MATTERS: Morning light is gentler and preferred by most plants. Afternoon light is harsher and can cause leaf burn. North-facing windows provide consistent, gentle light perfect for many houseplants.',
             '🔍 READING YOUR PLANTS: Leggy growth = not enough light. Yellow leaves = too much light. Healthy, compact growth = just right. Your plants will tell you if they\'re getting the right amount of light!'
           ],
           type: 'lesson',
           images: [
             {
               src: '/images/learning/beginner/full-sun-plants.jpg',
               alt: 'Full sun plants',
               description: 'Plants thriving in full sun conditions showing strong growth and vibrant colors',
               type: 'plant'
             },
             {
               src: '/images/learning/beginner/partial-sun-plants.jpg',
               alt: 'Partial sun plants',
               description: 'Plants growing well in partial sun conditions with filtered light',
               type: 'plant'
             },
             {
               src: '/images/learning/beginner/shade-plants.jpg',
               alt: 'Shade-loving plants',
               description: 'Plants thriving in shady conditions showing their adaptation to low light',
               type: 'plant'
             }
           ]
         },
        {
          title: 'Indoor Light Management - Maximizing Your Home\'s Light',
          content: 'Indoor gardening requires understanding how light behaves in your home. Here\'s how to create the perfect light environment for your plants:',
          points: [
            '🏠 WINDOW ORIENTATION MASTERY: South-facing windows = brightest light (full sun plants), East-facing windows = gentle morning light (perfect for most houseplants), West-facing windows = intense afternoon light (good for sun-loving plants), North-facing windows = consistent, gentle light (ideal for low-light plants).',
            '🔄 ROTATION STRATEGY: Rotate plants 90° weekly to prevent uneven growth. Plants naturally lean toward light sources, so rotation ensures balanced, symmetrical growth. This is especially important for houseplants that stay in one spot.',
            '💡 GROW LIGHT SOLUTIONS: When natural light is insufficient, LED grow lights are your best friend. They\'re energy-efficient, don\'t produce heat, and provide the full spectrum plants need. Use timers for 12-16 hours daily.',
            '🧽 LIGHT OPTIMIZATION: Clean windows regularly (dirty windows block 20-30% of light), use light-colored walls to reflect light, remove heavy curtains during the day, place mirrors strategically to bounce light around.',
            '📏 DISTANCE MATTERS: Place plants within 2-3 feet of windows for maximum light. Light intensity decreases dramatically with distance - a plant 6 feet from a window gets only 25% of the light it would get at 2 feet.',
            '🌡️ SEASONAL ADJUSTMENTS: Move plants closer to windows in winter when light is weaker, pull them back in summer when light is intense, consider grow lights for dark winter months.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/window-orientation.jpg',
              alt: 'Window orientation for plants',
              description: 'Diagram showing different window orientations and the types of plants suitable for each',
              type: 'plant'
            },
            {
              src: '/images/grow-lights-setup.jpg',
              alt: 'Grow lights setup',
              description: 'Indoor plants under LED grow lights showing proper setup and positioning',
              type: 'plant'
            }
          ]
        },
        {
          title: 'Low-Light Plant Champions - Thriving in Dim Conditions',
          content: 'Not every home has bright, sunny windows. These plants are champions at thriving in low-light conditions and will bring life to your darker spaces:',
          points: [
            '🌿 POTHOS (Epipremnum aureum): The ultimate low-light champion. Tolerates almost any light condition, grows quickly, purifies air, and is nearly impossible to kill. Perfect for beginners and dark corners.',
            '🐍 SNAKE PLANT (Sansevieria): The indestructible plant. Thrives in low light, needs minimal water, grows vertically to save space, and removes toxins from air. Can survive weeks without water.',
            '💎 ZZ PLANT (Zamioculcas zamiifolia): The drought-tolerant beauty. Glossy, dark green leaves, extremely low maintenance, tolerates neglect, and adds modern elegance to any space.',
            '🕊️ PEACE LILY (Spathiphyllum): The flowering low-light plant. Beautiful white flowers, indicates when it needs water (droops), purifies air, and adds elegance to any room.',
            '🌱 CHINESE EVERGREEN (Aglaonema): Colorful low-light option. Variegated leaves in various colors, very forgiving, slow-growing (less maintenance), and perfect for adding color to dark spaces.',
            '💡 LOW-LIGHT SUCCESS TIPS: Even low-light plants need some light - they won\'t grow in complete darkness. Water less frequently in low light (plants grow slower), dust leaves regularly to maximize light absorption, consider grow lights if plants show signs of light stress.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/low-light-plants-collection.jpg',
              alt: 'Collection of low-light plants',
              description: 'A collection of low-light tolerant plants including pothos, snake plant, ZZ plant, and peace lily',
              type: 'plant'
            },
            {
              src: '/images/dark-corner-garden.jpg',
              alt: 'Plants in dark corner',
              description: 'Low-light plants thriving in a dimly lit corner of a room, showing their adaptability',
              type: 'plant'
            }
          ]
        }
      ],
      quiz: {
        questions: [
          {
            question: '☀️ LIGHT REQUIREMENT IDENTIFICATION: This plant is growing tall and leggy, with leaves spaced far apart. What does this indicate about its light situation?',
            image: '/images/leggy-plant.jpg',
            imageDescription: 'A plant showing leggy growth with long stems and widely spaced leaves, indicating insufficient light',
            options: ['Too much light (needs less)', 'Not enough light (needs more)', 'Perfect light conditions', 'Too much water'],
            correct: 1,
            explanation: '✅ CORRECT! This plant is showing classic signs of insufficient light. Leggy growth with widely spaced leaves means the plant is stretching toward the light source. Move it closer to a window or add grow lights to fix this problem!'
          },
          {
            question: '🏠 WINDOW ORIENTATION: Which window direction provides the gentlest, most consistent light for most houseplants?',
            options: ['North (consistent, gentle light)', 'South (brightest light)', 'West (intense afternoon light)', 'East (morning light)'],
            correct: 0,
            explanation: '✅ CORRECT! North-facing windows provide the most consistent, gentle light throughout the day. This is perfect for most houseplants that prefer bright, indirect light without the intensity of direct sun.'
          },
          {
            question: '🌿 LOW-LIGHT PLANT IDENTIFICATION: This plant has upright, sword-like leaves and is known for being nearly indestructible in low light. What is it?',
            image: '/images/snake-plant-identification.jpg',
            imageDescription: 'A snake plant showing its characteristic upright, sword-like leaves and low-maintenance appearance',
            options: ['Pothos (trailing vine)', 'Snake Plant (upright, indestructible)', 'Peace Lily (flowering plant)', 'ZZ Plant (glossy leaves)'],
            correct: 1,
            explanation: '✅ CORRECT! This is a Snake Plant (Sansevieria). Its upright, sword-like leaves are unmistakable. It\'s perfect for low-light conditions and is often called "indestructible" because it tolerates neglect and minimal care.'
          }
        ]
      }
    },
     {
       id: 'soil',
       title: 'Soil & Containers - The Foundation of Plant Success',
       icon: Leaf,
       color: 'brown',
       estimatedTime: '25 min',
       difficulty: 'Beginner',
       description: 'Master the art of soil selection and container choice - the foundation that determines plant health and growth',
       lessons: [
         {
           title: 'Choosing the Right Soil - The Plant\'s Home',
           content: 'Soil is more than just dirt - it\'s your plant\'s home, providing nutrients, water, air, and support. Choosing the right soil is like choosing the right house for your family:',
           points: [
             '🏠 POTTING MIX vs GARDEN SOIL: Potting mix is specially formulated for containers - lightweight, well-draining, and sterile. Garden soil is too heavy and dense for pots, leading to poor drainage and root rot. Always use potting mix for container plants.',
             '💧 DRAINAGE IS CRITICAL: Good soil should drain water quickly while retaining some moisture. Look for mixes with perlite, vermiculite, or sand. Poor drainage = waterlogged roots = plant death. Your plant\'s roots need air as much as water!',
             '🌱 NUTRIENT CONTENT: Quality potting mixes contain slow-release fertilizers that feed plants for 3-6 months. Look for mixes labeled "with fertilizer" or "enriched." For edible plants, choose organic options to avoid chemical fertilizers.',
             '🔬 SOIL COMPONENTS: Peat moss (retains moisture), Perlite (improves drainage), Vermiculite (holds water and nutrients), Compost (adds nutrients and beneficial microbes). The best mixes contain a balance of these components.',
             '📊 pH LEVELS: Most plants prefer slightly acidic soil (pH 6.0-7.0). Some plants like blueberries need very acidic soil (pH 4.5-5.5). Test your soil pH if plants show nutrient deficiency symptoms.',
             '💡 SOIL SELECTION TIP: When in doubt, choose a premium potting mix. It costs more upfront but saves money in the long run by preventing plant problems and ensuring healthy growth.'
           ],
           type: 'lesson',
           images: [
             {
               src: '/images/learning/beginner/potting-mix-vs-garden-soil.jpg',
               alt: 'Potting mix vs garden soil comparison',
               description: 'Side-by-side comparison showing the difference between lightweight potting mix and heavy garden soil',
               type: 'soil'
             },
             {
               src: '/images/learning/beginner/soil-components.jpg',
               alt: 'Soil components breakdown',
               description: 'Visual breakdown of soil components including peat moss, perlite, vermiculite, and compost',
               type: 'soil'
             }
           ]
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
      id: 'plant-soil',
      title: 'Plant-Soil Compatibility',
      icon: Leaf,
      color: 'emerald',
      estimatedTime: '35 min',
      difficulty: 'Beginner',
      description: 'Master visual soil identification and learn which plants thrive in different soil types',
      lessons: [
        {
          title: 'Understanding Soil Types - Visual Identification Guide',
          content: 'Learn to identify different soil types by sight and touch. This is crucial for choosing the right plants!',
          points: [
            '🔍 CLAY SOIL: Dark brown/red color, sticky when wet, forms hard clumps when dry. Feels smooth and dense. Holds water for days after rain. Perfect for: Hostas, daylilies, astilbe, and moisture-loving plants.',
            '🔍 SANDY SOIL: Light brown/tan color, feels gritty and loose. Water drains through quickly (within minutes). Individual grains are visible. Perfect for: Lavender, rosemary, succulents, and drought-resistant plants.',
            '🔍 LOAMY SOIL: Dark brown color, feels crumbly and soft. Holds water but drains well. Has a mix of textures. Perfect for: Most vegetables, roses, and general garden plants.',
            '🔍 PEATY SOIL: Very dark brown/black color, feels spongy and light. Rich in organic matter, acidic pH. Perfect for: Azaleas, blueberries, rhododendrons, and acid-loving plants.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/soil-clay.jpg',
              alt: 'Clay soil sample',
              description: 'Clay soil showing dark brown color, smooth texture, and ability to form solid clumps',
              type: 'soil'
            },
            {
              src: '/images/soil-sandy.jpg', 
              alt: 'Sandy soil sample',
              description: 'Sandy soil showing light brown color, gritty texture, and visible individual grains',
              type: 'soil'
            },
            {
              src: '/images/soil-loamy.jpg',
              alt: 'Loamy soil sample', 
              description: 'Loamy soil showing balanced texture with mix of fine and coarse particles',
              type: 'soil'
            },
            {
              src: '/images/soil-peaty.jpg',
              alt: 'Peaty soil sample',
              description: 'Peaty soil showing very dark color and spongy texture rich in organic matter',
              type: 'soil'
            }
          ]
        },
        {
          title: 'Plant-Soil Matching - Why It Matters',
          content: 'Understanding plant-soil compatibility prevents common gardening problems and helps plants thrive naturally:',
          points: [
            '🌱 CLAY SOIL PLANTS: Hostas (large leaves love moisture), Daylilies (tough roots handle heavy soil), Astilbe (feathery flowers need constant moisture), Japanese Iris (loves wet feet). These plants have adapted to slow-draining conditions.',
            '🌱 SANDY SOIL PLANTS: Lavender (silver leaves reflect sun, deep roots find water), Rosemary (Mediterranean native, drought-adapted), Succulents (store water in leaves), Cacti (spines reduce water loss). These plants evolved for quick drainage.',
            '🌱 LOAMY SOIL PLANTS: Tomatoes (need steady moisture and nutrients), Roses (require good drainage but consistent water), Lettuce (quick-growing, needs balanced conditions), Carrots (need loose soil for straight roots). Most garden favorites prefer this balance.',
            '🌱 PEATY SOIL PLANTS: Azaleas (shallow roots need acidic conditions), Blueberries (require pH 4.5-5.5 for iron absorption), Rhododendrons (large leaves need acidic soil), Camellias (evergreen beauty in acidic conditions). These plants evolved in forest floors.'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/clay-soil-plants.jpg',
              alt: 'Plants thriving in clay soil',
              description: 'Hostas, daylilies, and astilbe thriving in clay soil conditions',
              type: 'plant'
            },
            {
              src: '/images/sandy-soil-plants.jpg',
              alt: 'Plants thriving in sandy soil', 
              description: 'Lavender, rosemary, and succulents thriving in well-drained sandy soil',
              type: 'plant'
            },
            {
              src: '/images/loamy-soil-plants.jpg',
              alt: 'Plants thriving in loamy soil',
              description: 'Tomatoes, roses, and vegetables thriving in balanced loamy soil',
              type: 'plant'
            },
            {
              src: '/images/peaty-soil-plants.jpg',
              alt: 'Plants thriving in peaty soil',
              description: 'Azaleas, blueberries, and rhododendrons thriving in acidic peaty soil',
              type: 'plant'
            }
          ]
        },
        {
          title: 'Visual Identification Guide - What to Look For',
          content: 'Master the art of identifying soil types by sight. This skill will help you choose the right plants instantly!',
          points: [
            '👀 CLAY SOIL VISUAL CLUES: Dark brown or reddish color, smooth surface when wet, cracks when dry, feels heavy and dense, water pools on surface, forms hard clumps that don\'t break apart easily.',
            '👀 SANDY SOIL VISUAL CLUES: Light brown or tan color, individual grains visible, loose and crumbly texture, water disappears quickly, feels gritty between fingers, doesn\'t hold shape when squeezed.',
            '👀 LOAMY SOIL VISUAL CLUES: Dark brown color, crumbly texture, mix of fine and coarse particles, water drains at moderate rate, feels soft and workable, holds shape briefly when squeezed.',
            '👀 PEATY SOIL VISUAL CLUES: Very dark brown or black color, spongy texture, light weight, high organic matter visible, water drains slowly, feels like compressed leaves or moss.'
          ],
          type: 'lesson'
        },
        {
          title: 'Simple Soil Tests You Can Do at Home',
          content: 'Learn these easy tests to identify your soil type and improve plant compatibility:',
          points: [
            '🧪 THE SQUEEZE TEST: Take a handful of moist soil. Clay = forms a ball that stays together, Sandy = crumbles apart, Loamy = forms a ball but breaks when poked, Peaty = feels spongy and light.',
            '💧 THE DRAINAGE TEST: Dig a 12-inch hole, fill with water. Clay = water stays for hours, Sandy = drains in minutes, Loamy = drains in 1-2 hours, Peaty = drains slowly but holds moisture.',
            '📊 THE JAR TEST: Put soil in a jar with water, shake, let settle. Clay = fine particles at bottom, Sandy = large particles settle first, Loamy = layers of different sizes, Peaty = dark organic matter floats.',
            '🔧 IMPROVEMENT TIPS: Add compost to all soils, sand to clay for drainage, organic matter to sand for water retention, lime to acidic soil, sulfur to alkaline soil. Start small and test results!'
          ],
          type: 'lesson',
          images: [
            {
              src: '/images/soil-squeeze-test.jpg',
              alt: 'Soil squeeze test demonstration',
              description: 'Demonstration of the squeeze test showing how different soil types behave when compressed',
              type: 'test'
            },
            {
              src: '/images/soil-drainage-test.jpg',
              alt: 'Soil drainage test in progress',
              description: 'Drainage test showing how quickly water moves through different soil types',
              type: 'test'
            },
            {
              src: '/images/soil-jar-test.jpg',
              alt: 'Soil jar test results',
              description: 'Jar test showing how soil particles separate and settle in water',
              type: 'test'
            }
          ]
        }
      ],
      quiz: {
        questions: [
          {
            question: '🔍 VISUAL IDENTIFICATION: Look at this soil sample. Notice the dark brown color, smooth texture, and how it forms a solid clump. Which type of soil is this?',
            image: '/images/soil-clay.jpg',
            imageDescription: 'Dark brown soil sample that appears smooth and dense, forming a solid clump when compressed',
            options: ['Clay soil', 'Sandy soil', 'Loamy soil', 'Peaty soil'],
            correct: 0,
            explanation: '✅ CORRECT! This is clay soil. Key identifying features: Dark brown/red color, smooth texture, forms solid clumps when compressed, feels dense and heavy. Clay soil holds water for days and is perfect for moisture-loving plants like hostas, daylilies, and astilbe. The smooth texture and clumping behavior are the main visual clues!'
          },
          {
            question: '🌱 PLANT-SOIL MATCHING: This soil sample is light brown, feels gritty, and water drains through it quickly. Which plant would thrive best in this soil type?',
            image: '/images/soil-sandy.jpg',
            imageDescription: 'Light brown/tan soil sample with visible individual grains, appearing loose and gritty',
            options: ['Hostas (need constant moisture)', 'Lavender (drought-tolerant)', 'Azaleas (need acidic soil)', 'Astilbe (love wet conditions)'],
            correct: 1,
            explanation: '✅ CORRECT! Lavender is the perfect match for sandy soil. Sandy soil characteristics: Light brown color, gritty texture, drains water quickly (within minutes). Lavender evolved in Mediterranean climates with well-drained, dry conditions. Its silver leaves reflect sunlight and deep roots find water deep underground. This is a perfect example of plant-soil adaptation!'
          },
          {
            question: '🚨 PROBLEM DIAGNOSIS: This plant has yellow leaves and appears stressed. The soil around it is heavy and waterlogged. What soil improvement would help most?',
            image: '/images/plant-yellow-leaves.jpg',
            imageDescription: 'Plant with yellowing leaves sitting in heavy, waterlogged soil that appears dark and dense',
            options: ['Add more clay soil', 'Add more sand only', 'Loamy soil with compost', 'Keep the same soil'],
            correct: 2,
            explanation: '✅ CORRECT! Loamy soil with compost is the best solution. Yellow leaves + waterlogged soil = poor drainage and nutrient deficiency. Loamy soil provides: Good drainage (prevents waterlogging), balanced texture (not too heavy, not too light), and compost adds nutrients and improves structure. This combination gives plants the perfect growing conditions!'
          },
          {
            question: '🧪 SOIL TEST INTERPRETATION: You did the squeeze test on this soil - it formed a ball but broke apart when you poked it. What type of soil is this?',
            image: '/images/soil-loamy.jpg',
            imageDescription: 'Dark brown soil sample that appears crumbly and soft, with a mix of fine and coarse particles',
            options: ['Clay soil (stays in ball)', 'Sandy soil (crumbles apart)', 'Loamy soil (ball breaks when poked)', 'Peaty soil (spongy)'],
            correct: 2,
            explanation: '✅ CORRECT! This is loamy soil - the "goldilocks" of soils! The squeeze test result (forms ball but breaks when poked) is the key identifier. Loamy soil has: Perfect balance of sand, silt, and clay, good drainage but holds moisture, crumbly texture, ideal for most garden plants. This is why most vegetables, roses, and general garden plants love loamy soil!'
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
    // FORCE CLEAR all old progress data first (aggressive migration)
    clearOldProgressData()
    
    // FORCE RESET - Always start with empty progress for now
    console.log('🔄 FORCE RESETTING ALL PROGRESS - Starting fresh for all users')
    setCompletedModules([])
    setModuleProgress({})
    
    // Clear any remaining progress data
    const storageKey = getStorageKey('beginnerProgress')
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
    const storageKey = getStorageKey('beginnerProgress')
    localStorage.setItem(storageKey, JSON.stringify(progress))
  }

  const resetProgress = () => {
    setCompletedModules([])
    setModuleProgress({})
    const storageKey = getStorageKey('beginnerProgress')
    localStorage.removeItem(storageKey)
    toast.success('Progress reset successfully!')
  }

  const isNewUser = () => {
    const storageKey = getStorageKey('beginnerProgress')
    const savedProgress = localStorage.getItem(storageKey)
    return !savedProgress || completedModules.length === 0
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
      'plant-soil': [
        'Look for dark brown color and smooth texture - clay soil forms solid clumps and holds water well.',
        'Light brown, gritty texture with visible grains indicates sandy soil - perfect for drought-tolerant plants.',
        'Yellow leaves + waterlogged soil = poor drainage. Loamy soil with compost provides the best solution.',
        'The squeeze test is key: clay stays in ball, sandy crumbles apart, loamy breaks when poked.'
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
              
              {/* Lesson Images */}
              {lesson.images && lesson.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Visual Learning Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lesson.images.map((image, index) => (
                      <ImageDisplay
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        description={image.description}
                        type={image.type}
                        className="h-auto"
                      />
                    ))}
                  </div>
                </div>
              )}
              
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
                    
                    {/* Question Image */}
                    {question.image && (
                      <div className="mb-6">
                        <ImageDisplay
                          src={question.image}
                          alt={question.imageDescription || 'Quiz question image'}
                          description={question.imageDescription}
                          type="soil"
                          showDescription={true}
                        />
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
                          <ImageDisplay
                            src={question.image}
                            alt={question.imageDescription || 'Quiz question image'}
                            description={question.imageDescription}
                            type="soil"
                            showDescription={true}
                          />
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
                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Award className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 text-center mb-2">
                    🎉 Path Complete! 🎉
                  </h3>
                  <p className="text-green-700 text-center mb-4">
                    Congratulations! You've successfully completed the Beginner Gardener Path! You're now ready to advance to the Intermediate level.
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                    <div className="flex justify-center space-x-6 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-700">{modules.length}</div>
                        <div className="text-xs text-green-600">Modules</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-700">
                          {Math.round(quizScore)}%
                        </div>
                        <div className="text-xs text-green-600">Final Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-700">Beginner</div>
                        <div className="text-xs text-green-600">Level</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link
                      to="/learning/intermediate"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Start Intermediate Path
                    </Link>
                    <button
                      onClick={() => {
                        setCurrentModule(null)
                        setShowQuiz(false)
                        setShowQuizResults(false)
                        setQuizAnswers({})
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Back to Modules
                    </button>
                  </div>
                  
                  <p className="text-xs text-green-600 text-center mt-3">
                    🌟 You've mastered the fundamentals! The Intermediate path awaits with advanced techniques and professional methods.
                  </p>
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

        {/* Welcome Message for New Users */}
        {isNewUser() && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Welcome to Your Gardening Journey! 🌱
                </h3>
                <p className="text-blue-800 mb-4">
                  You're starting fresh with the Beginner Gardener Path. Each user has their own personalized learning progress, so you can take your time and learn at your own pace.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">What to expect:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>11 comprehensive modules</strong> covering all the basics</li>
                    <li>• <strong>Interactive lessons</strong> with visual examples and detailed explanations</li>
                    <li>• <strong>Image-based quizzes</strong> to test your knowledge</li>
                    <li>• <strong>Your own progress tracking</strong> - no sharing with other users</li>
                    <li>• <strong>Unlock Intermediate path</strong> after completing all modules</li>
                  </ul>
                </div>
                <p className="text-sm text-blue-600 mt-3">
                  💡 <strong>Tip:</strong> Start with the first module and work your way through. Each module builds on the previous one!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Reset Notification */}
        {!isNewUser() && completedModules.length === 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 rounded-full p-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Progress Reset Complete! 🔄
                </h3>
                <p className="text-amber-800 mb-4">
                  Your learning progress has been reset to ensure a fresh start for all users. This ensures that each user has their own personalized learning journey without any interference from previous data.
                </p>
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-900 mb-2">What this means:</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• <strong>Fresh start:</strong> All modules are now available to begin</li>
                    <li>• <strong>Personal progress:</strong> Your progress is now completely separate from other users</li>
                    <li>• <strong>Clean slate:</strong> No old data or conflicts to worry about</li>
                    <li>• <strong>Better experience:</strong> Improved learning path system with user-specific tracking</li>
                  </ul>
                </div>
                <p className="text-sm text-amber-600 mt-3">
                  🎯 <strong>Ready to start:</strong> Begin with the first module below and track your progress as you learn!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Progress</h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {Math.min(100, Math.round((completedModules.length / modules.length) * 100))}% Complete
              </div>
              {!isNewUser() && (
                <button
                  onClick={resetProgress}
                  className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                  title="Reset your progress and start over"
                >
                  Reset Progress
                </button>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (completedModules.length / modules.length) * 100)}%` }}
            ></div>
          </div>
          
          {/* Next Level Unlock Progress */}
          {completedModules.length < modules.length && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-blue-900">Intermediate Path Unlock</span>
                </div>
                <span className="text-sm text-blue-700">
                  {modules.length - completedModules.length} module{modules.length - completedModules.length !== 1 ? 's' : ''} remaining
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Complete all {modules.length} modules to unlock the Intermediate Gardener Path with advanced techniques!
              </p>
            </div>
          )}
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
            
            {/* Achievement Stats */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
              <h4 className="text-lg font-semibold text-green-900 mb-4 text-center">Your Achievement Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">{modules.length}</div>
                  <div className="text-sm text-green-600">Modules Completed</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">
                    {Math.round(Object.values(moduleProgress).reduce((sum, progress) => sum + (progress.score || 0), 0) / modules.length)}%
                  </div>
                  <div className="text-sm text-green-600">Average Score</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">Beginner</div>
                  <div className="text-sm text-green-600">Level Mastered</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <Link
                to="/learning/intermediate"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 flex items-center text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <TrendingUp className="h-6 w-6 mr-3" />
                Start Intermediate Path
              </Link>
              <p className="text-sm text-green-600 font-medium text-center">
                Ready to level up your gardening skills? 🌿<br/>
                The Intermediate path will teach you advanced techniques and professional methods!
              </p>
              
              {/* Intermediate Path Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h5 className="font-semibold text-blue-900 mb-2 text-center">What's Next in Intermediate Path?</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800">
                  <div className="flex items-center">
                    <span className="mr-2">🌱</span>
                    <span>Advanced Plant Nutrition</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🔬</span>
                    <span>Professional Soil Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🌿</span>
                    <span>Pest & Disease Management</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🏗️</span>
                    <span>Garden Design & Planning</span>
                  </div>
                </div>
              </div>
              
              {/* Additional Options */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => {
                    // Scroll to top of modules
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  Review All Modules
                </button>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
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



