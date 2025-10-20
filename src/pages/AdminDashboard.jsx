import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, BookOpen, Bell, Calendar, BarChart3, 
  ArrowLeft, Shield, TrendingUp, CheckCircle, CreditCard,
  Settings, Database, FileText, Mail, AlertTriangle, 
  Activity, Clock, DollarSign, UserPlus, Eye, Edit,
  RefreshCw, Download, Upload, Filter, Search, MoreVertical,
  Crown, Star, Target, Globe, Lock, Unlock, MessageSquare,
  History
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
      id: 'manage-feedback',
      title: 'Feedback Management',
      description: 'Review and respond to user feedback',
      icon: MessageSquare,
      color: 'bg-pink-500',
      path: '/admin/feedback'
    },
    {
      id: 'activity-logs',
      title: 'Activity Logs',
      description: 'Monitor system activities and user actions',
      icon: Activity,
      color: 'bg-blue-600',
      path: '/admin/activity-logs'
    },
    {
      id: 'history-logs',
      title: 'History Logs',
      description: 'Track data changes and system modifications',
      icon: History,
      color: 'bg-purple-600',
      path: '/admin/history-logs'
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      description: 'View system reports, activity logs, and analytics',
      icon: BarChart3,
      color: 'bg-indigo-500',
      path: '/admin/reports'
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
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome {user?.full_name || 'Admin'}</h1>
                <p className="text-gray-600">System management & analytics dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/profile')}
              className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-lg border border-pink-200 transition-all duration-200 hover:shadow-md"
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
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
                      className="group p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors">
                          <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Today's Weather</h3>
              </div>
              <WeatherCard />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

            {/* System Alerts */}
            {systemAlerts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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