import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Leaf, BarChart3, Camera, Settings, Plus, Bell, Calendar, 
  BookOpen, TrendingUp, Users, Star, MapPin, Droplets, 
  Scissors, Sun, Thermometer, AlertCircle, CheckCircle,
  Play, Award, Target, Clock, Heart, Zap, Lock, Crown
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const { user, isPremium } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [plants, setPlants] = useState([])
  const [gardens, setGardens] = useState([])
  const [learningProgress, setLearningProgress] = useState({})
  const [seasonalTips, setSeasonalTips] = useState([])
  const [loading, setLoading] = useState(true)

  // Learning paths data with access control
  const learningPaths = [
    {
      id: 'beginner',
      title: 'Beginner Gardener',
      description: 'Start your gardening journey with the basics',
      icon: Play,
      color: 'bg-green-500',
      progress: learningProgress.beginner || 0,
      modules: [
        'Understanding Soil Types',
        'Basic Plant Care',
        'Watering Fundamentals',
        'Common Plant Problems'
      ],
      isAccessible: true, // Always accessible
      isLocked: false
    },
    {
      id: 'intermediate',
      title: 'Intermediate Gardener',
      description: 'Expand your knowledge and skills',
      icon: TrendingUp,
      color: 'bg-blue-500',
      progress: learningProgress.intermediate || 0,
      modules: [
        'Advanced Plant Nutrition',
        'Pest and Disease Management',
        'Seasonal Planning',
        'Garden Design Principles'
      ],
      isAccessible: isPremium || (learningProgress.beginner >= 100), // Accessible if premium OR beginner completed
      isLocked: !isPremium && (learningProgress.beginner < 100)
    },
    {
      id: 'expert',
      title: 'Expert Gardener',
      description: 'Master advanced gardening techniques',
      icon: Award,
      color: 'bg-purple-500',
      progress: learningProgress.expert || 0,
      modules: [
        'Advanced Propagation',
        'Greenhouse Management',
        'Sustainable Gardening',
        'Plant Breeding Basics'
      ],
      isAccessible: isPremium || (learningProgress.intermediate >= 100), // Accessible if premium OR intermediate completed
      isLocked: !isPremium && (learningProgress.intermediate < 100)
    }
  ]

  const quickActions = [
    {
      title: 'AI Plant Recognition',
      description: 'Identify plants and analyze soil',
      icon: Camera,
      path: '/ai-recognition',
      color: 'bg-purple-500'
    },
    {
      title: 'My Garden',
      description: 'Manage your plants and gardens',
      icon: Leaf,
      path: '/garden',
      color: 'bg-green-500'
    },
    {
      title: 'Smart Alerts',
      description: 'View care reminders and notifications',
      icon: Bell,
      path: '/smart-alerts',
      color: 'bg-blue-500'
    },
    {
      title: 'Seasonal Planning',
      description: 'Plan your garden year-round',
      icon: Calendar,
      path: '/seasonal-planning',
      color: 'bg-orange-500'
    }
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleLearningPathClick = (path) => {
    if (!path.isAccessible) {
      if (path.isLocked) {
        toast.error('Complete the previous level or upgrade to Premium to access this learning path!')
      } else {
        toast.error('This learning path is not available!')
      }
      return
    }
    
    // Navigate to learning path or show learning content
    toast.success(`Starting ${path.title} learning path!`)
    // Here you would navigate to the actual learning content
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Fetch notifications
      const notificationsResponse = await axios.get('/api/notifications')
      setNotifications(notificationsResponse.data || [])
      
      // Fetch plants and gardens
      const gardenResponse = await axios.get('/garden')
      setPlants(gardenResponse.data.plants || [])
      setGardens(gardenResponse.data.gardens || [])
      
      // Fetch learning progress
      const progressResponse = await axios.get('/api/learning-progress')
      setLearningProgress(progressResponse.data || {})
      
      // Fetch seasonal tips
      const tipsResponse = await axios.get('/api/seasonal-tips')
      setSeasonalTips(tipsResponse.data || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set mock data for demonstration
      setNotifications([
        { id: 1, message: 'Time to water your tomato plants', type: 'watering', urgent: true },
        { id: 2, message: 'Your basil needs fertilizer', type: 'fertilizing', urgent: false },
        { id: 3, message: 'New seasonal tip available!', type: 'tip', urgent: false }
      ])
      setSeasonalTips([
        { id: 1, title: 'Spring Planting Tips', description: 'Best time to start your vegetable garden', icon: Sun },
        { id: 2, title: 'Watering Schedule', description: 'Adjust watering frequency for warmer weather', icon: Droplets },
        { id: 3, title: 'Pest Prevention', description: 'Natural ways to keep pests away', icon: AlertCircle }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getUrgentNotifications = () => {
    return notifications.filter(n => n.urgent).length
  }

  const getTotalPlants = () => {
    return plants.length
  }

  const getHealthyPlants = () => {
    return plants.filter(p => p.health_status === 'healthy').length
  }

  const getNeedsAttention = () => {
    return plants.filter(p => p.health_status === 'needs_attention').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header with Notifications */}
        <div className="flex justify-between items-start mb-8">
          <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your garden today.
          </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/smart-alerts"
              className="relative p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              {getUrgentNotifications() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUrgentNotifications()}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Settings className="h-6 w-6 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Plants</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalPlants()}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Healthy Plants</p>
                <p className="text-2xl font-bold text-gray-900">{getHealthyPlants()}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <p className="text-2xl font-bold text-gray-900">{getNeedsAttention()}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Learning Paths */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Learning Paths</h2>
                <span className="text-sm text-gray-500">Choose your journey</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {learningPaths.map((path) => {
                  const IconComponent = path.icon
                  return (
                    <div 
                      key={path.id} 
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                        path.isAccessible 
                          ? 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-primary-300 hover:shadow-xl cursor-pointer' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 cursor-not-allowed opacity-75'
                      }`}
                      onClick={() => handleLearningPathClick(path)}
                    >
                      {/* Lock overlay for locked paths */}
                      {!path.isAccessible && (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
                          <div className="bg-white rounded-full p-3 shadow-lg">
                            <Lock className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                      )}
                      
                      {/* Premium badge for locked paths */}
                      {path.isLocked && (
                        <div className="absolute top-3 right-3 z-20">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                            <Crown className="h-3 w-3" />
                            <span>Premium</span>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 ${path.color} text-white rounded-xl shadow-lg ${!path.isAccessible ? 'opacity-60' : ''}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${path.isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                              {path.progress}%
                            </div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                </div>
                        <h3 className={`text-lg font-bold mb-2 transition-colors ${
                          path.isAccessible 
                            ? 'text-gray-900 group-hover:text-primary-600' 
                            : 'text-gray-500'
                        }`}>
                          {path.title}
                </h3>
                        <p className={`text-sm mb-4 ${path.isAccessible ? 'text-gray-600' : 'text-gray-500'}`}>
                          {path.description}
                        </p>
                        
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className={path.isAccessible ? 'text-gray-700' : 'text-gray-500'}>Progress</span>
                            <span className={path.isAccessible ? 'text-gray-700' : 'text-gray-500'}>{path.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 ${path.color} rounded-full transition-all duration-500 ${!path.isAccessible ? 'opacity-60' : ''}`}
                              style={{ width: `${path.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Modules */}
                        <div className="mt-4">
                          <div className={`text-xs font-medium mb-2 ${path.isAccessible ? 'text-gray-700' : 'text-gray-500'}`}>
                            Modules:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {path.modules.slice(0, 2).map((module, index) => (
                              <span 
                                key={index} 
                                className={`px-2 py-1 text-xs rounded-md ${
                                  path.isAccessible 
                                    ? 'bg-gray-100 text-gray-600' 
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {module}
                              </span>
                            ))}
                            {path.modules.length > 2 && (
                              <span className={`px-2 py-1 text-xs rounded-md ${
                                path.isAccessible 
                                  ? 'bg-primary-100 text-primary-600' 
                                  : 'bg-gray-200 text-gray-500'
                              }`}>
                                +{path.modules.length - 2} more
                              </span>
                            )}
          </div>
        </div>

                        {/* Lock message for free users */}
                        {path.isLocked && !isPremium && (
                          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Lock className="h-4 w-4 text-yellow-600" />
                              <span className="text-xs text-yellow-800">
                                Complete Beginner level or upgrade to Premium to unlock
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats & Notifications */}
          <div className="space-y-6">
            {/* Notifications Summary */}
        <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <Link to="/smart-alerts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.urgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
              <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.type}</p>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-4">
                    <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Weather & Seasonal Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Garden</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature</span>
                  <span className="font-semibold text-gray-900">72°F</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Humidity</span>
                  <span className="font-semibold text-gray-900">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Season</span>
                  <span className="font-semibold text-gray-900 capitalize">Spring</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">Perfect weather for outdoor planting</p>
                </div>
              </div>
            </div>
              </div>
            </div>
            
        {/* Plant Tracking and Seasonal Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plant Tracking */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Plants</h2>
                <p className="text-sm text-gray-500 mt-1">Track your garden's progress</p>
              </div>
              <Link
                to="/garden"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Plant
              </Link>
            </div>
            <div className="space-y-4">
              {plants.slice(0, 4).map((plantData, index) => (
                <div key={index} className="group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                          <Leaf className="h-7 w-7 text-green-600" />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          plantData.plant?.health_status === 'healthy' 
                            ? 'bg-green-500' 
                            : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{plantData.plant?.name || 'Plant'}</h3>
                        <p className="text-sm text-gray-600 capitalize">{plantData.plant?.type || 'Unknown'}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-gray-500">
                              {plantData.plant?.watering_frequency || 'N/A'} days
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {new Date(plantData.tracking?.planting_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          plantData.plant?.health_status === 'healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {plantData.plant?.health_status || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {plants.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No plants yet</h3>
                  <p className="text-gray-600 mb-4">Start your gardening journey by adding your first plant</p>
                  <Link
                    to="/garden"
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Plant
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Seasonal Gardening Tips */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seasonal Tips</h2>
                <p className="text-sm text-gray-500 mt-1">Expert advice for this season</p>
              </div>
              <Link
                to="/seasonal-planning"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {seasonalTips.map((tip, index) => {
                const IconComponent = tip.icon
                return (
                  <div key={tip.id} className="group relative overflow-hidden bg-gradient-to-r from-white to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <div className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                            {tip.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">{tip.description}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {seasonalTips.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sun className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tips available</h3>
                  <p className="text-gray-600 mb-4">Get personalized seasonal advice for your garden</p>
                  <Link
                    to="/seasonal-planning"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Get Seasonal Advice
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserDashboard

