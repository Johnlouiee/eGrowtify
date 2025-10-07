import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, BookOpen, Bell, Calendar, BarChart3, 
  ArrowLeft, Shield, TrendingUp, CheckCircle, CreditCard,
  Settings, Database, FileText, Mail, AlertTriangle, 
  Activity, Clock, DollarSign, UserPlus, Eye, Edit,
  RefreshCw, Download, Upload, Filter, Search, MoreVertical,
  Crown, Star, Target, Zap, Globe, Lock, Unlock
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import WeatherCard from '../components/WeatherCard'

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
  }, [])

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
      id: 'manage-seasonal-content',
      title: 'Seasonal Content',
      description: 'Manage seasonal tips and content',
      icon: Calendar,
      color: 'bg-indigo-500',
      path: '/admin/seasonal-content'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: Settings,
      color: 'bg-gray-500',
      path: '/admin/settings'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">System Administration & Management Center</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={fetchAdminStats}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Administrator
                  </p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Activity className="h-3 w-3 mr-1" />
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.subscribedUsers}</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium subscribers
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <CreditCard className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Modules</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalModules}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Educational content
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              System Alerts
            </h2>
            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const IconComponent = alert.icon
                return (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${alert.bgColor} border-yellow-500`}>
                    <div className="flex items-center">
                      <IconComponent className={`h-5 w-5 ${alert.color} mr-3`} />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Features - Enhanced */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Management Tools</h2>
              <p className="text-gray-600">Access all administrative functions and system controls</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Link
                    key={feature.id}
                    to={feature.path}
                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${feature.color} text-white rounded-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        {feature.stats && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{feature.stats}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Access Tool</span>
                        <ArrowLeft className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Weather */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Today's Weather
              </h3>
              <WeatherCard />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 bg-gray-100 rounded-lg`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard