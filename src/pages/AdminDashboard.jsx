import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, BookOpen, Bell, BarChart3, 
  ArrowLeft, Shield, TrendingUp, CheckCircle, CreditCard,
  Settings, Database, FileText, Mail, AlertTriangle, 
  Activity, Clock, DollarSign, UserPlus, Eye, Edit,
  RefreshCw, Download, Upload, Filter, Search, MoreVertical,
  Crown, Star, Target, Globe, Lock, Unlock, MessageSquare,
  Zap
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import WeatherCard from '../components/WeatherCard'
import AdminHeader from '../components/AdminHeader'
import AdminStatsCard from '../components/AdminStatsCard'

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    subscribedUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    newUsersThisMonth: 0,
    systemHealth: 'good'
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])
  const [systemAlerts, setSystemAlerts] = useState([])
  const [notifications, setNotifications] = useState([])

  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/dashboard')
      return
    }
  }, [user, isAdmin, navigate])

  useEffect(() => {
    fetchAdminStats()
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/admin/notifications')
      // Get only active notifications, sorted by priority and date
      const activeNotifications = (response.data || [])
        .filter(n => n.is_active)
        .sort((a, b) => {
          // Sort by priority first (High > Medium > Low)
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          }
          // Then by date (newest first)
          return new Date(b.created_at) - new Date(a.created_at)
        })
        .slice(0, 5) // Show only top 5
      setNotifications(activeNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      // Fetch admin statistics
      const response = await axios.get('/api/admin/stats')
      setStats(response.data)
      
      // Mock data for demonstration - replace with actual API calls
      setRecentActivity([
        {
          id: 1,
          type: 'user_registration',
          message: 'New user John Doe registered',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          icon: UserPlus,
          color: 'text-green-600'
        },
        {
          id: 2,
          type: 'module_update',
          message: 'Module "Plant Basics" was updated',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          icon: Edit,
          color: 'text-blue-600'
        },
        {
          id: 3,
          type: 'subscription',
          message: 'User upgraded to Premium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          icon: Crown,
          color: 'text-yellow-600'
        }
      ])
      
      
      setSystemAlerts([
        {
          id: 1,
          type: 'warning',
          message: 'Database backup is due in 2 days',
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        },
        {
          id: 2,
          type: 'info',
          message: 'System maintenance scheduled for Sunday',
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        }
      ])
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      toast.error('Failed to load admin statistics')
    } finally {
      setLoading(false)
    }
  }

  const adminFeatures = [
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'Create, update, view, and delete user accounts',
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/users',
      stats: stats.totalUsers
    },
    {
      id: 'manage-learning-paths',
      title: 'Manage Learning Paths',
      description: 'Edit learning modules, quizzes, and educational content',
      icon: BookOpen,
      color: 'bg-green-500',
      path: '/admin/learning-paths',
      stats: stats.totalModules
    },
    {
      id: 'manage-notifications',
      title: 'Manage Notifications',
      description: 'Send notifications and manage system alerts',
      icon: Bell,
      color: 'bg-purple-500',
      path: '/admin/notifications'
    },
    {
      id: 'manage-subscriptions',
      title: 'Manage Subscriptions',
      description: 'Handle premium subscriptions and billing',
      icon: CreditCard,
      color: 'bg-yellow-500',
      path: '/admin/subscription',
      stats: stats.subscribedUsers
    },
    {
      id: 'manage-feedback',
      title: 'Feedback Management',
      description: 'Review and respond to user feedback',
      icon: MessageSquare,
      color: 'bg-pink-500',
      path: '/admin/feedback'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View system reports, activity logs, and analytics',
      icon: BarChart3,
      color: 'bg-indigo-500',
      path: '/admin/reports'
    }
  ]


  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome {user?.full_name || 'Admin'}</h1>
                <p className="text-gray-600">System management & analytics dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/profile')}
              className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+12% this month</span>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active</span>
            </div>
          </div>

          {/* Premium Users Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.subscribedUsers}</p>
                <p className="text-sm text-gray-500">Premium Users</p>
              </div>
            </div>
            <div className="flex items-center text-yellow-600">
              <Star className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Premium subscribers</span>
            </div>
          </div>

          {/* Learning Content Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{stats.totalModules}</p>
                <p className="text-sm text-gray-500">Learning Modules</p>
              </div>
            </div>
            <div className="flex items-center text-purple-600">
              <Target className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Educational content</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Tools - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Management Tools</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminFeatures.map((feature) => {
                  const IconComponent = feature.icon
                  return (
                    <Link
                      key={feature.id}
                      to={feature.path}
                      className="group p-4 bg-white/70 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg group-hover:bg-green-100 transition-colors">
                          <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-500">{feature.description}</p>
                        </div>
                        {feature.stats && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{feature.stats}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Weather Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Today's Weather</h3>
              </div>
              <WeatherCard />
            </div>

            {/* Recent Activity */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-1.5 bg-white rounded-lg">
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Admin Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bell className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Active Notifications</h3>
                  </div>
                  <Link
                    to="/admin/notifications"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Manage
                  </Link>
                </div>
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const getPriorityColor = (priority) => {
                      switch (priority) {
                        case 'High': return 'border-red-500 bg-red-50'
                        case 'Medium': return 'border-yellow-500 bg-yellow-50'
                        case 'Low': return 'border-blue-500 bg-blue-50'
                        default: return 'border-gray-500 bg-gray-50'
                      }
                    }

                    const getTypeIcon = (type) => {
                      switch (type) {
                        case 'Maintenance': return AlertTriangle
                        case 'Update': return Bell
                        case 'Feature': return Zap
                        case 'System': return Settings
                        default: return Bell
                      }
                    }

                    const IconComponent = getTypeIcon(notification.type)

                    return (
                      <div
                        key={notification.id}
                        className={`border-l-4 rounded-lg p-3 ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start space-x-2">
                          <IconComponent className={`h-4 w-4 mt-0.5 ${
                            notification.priority === 'High' ? 'text-red-600' :
                            notification.priority === 'Medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                                notification.priority === 'High' ? 'bg-red-200 text-red-800' :
                                notification.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-blue-200 text-blue-800'
                              }`}>
                                {notification.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 line-clamp-2 mb-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {notifications.length >= 5 && (
                  <Link
                    to="/admin/notifications"
                    className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all notifications →
                  </Link>
                )}
              </div>
            )}

            {/* System Alerts */}
            {systemAlerts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">System Alerts</h3>
                </div>
                <div className="space-y-3">
                  {systemAlerts.map((alert) => {
                    const IconComponent = alert.icon
                    return (
                      <div key={alert.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <IconComponent className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-amber-800 flex-1">{alert.message}</p>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard