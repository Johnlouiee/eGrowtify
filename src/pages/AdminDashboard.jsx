import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, BookOpen, Bell, Calendar, BarChart3, 
  ArrowLeft, Shield, TrendingUp, CheckCircle, CreditCard,
  Settings, Database, FileText, Mail, AlertTriangle, 
  Activity, Clock, DollarSign, UserPlus, Eye, Edit,
  RefreshCw, Download, Upload, Filter, Search, MoreVertical,
  Crown, Star, Target, Zap, Globe, Lock, Unlock, MessageSquare
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Modern Header */}
      <AdminHeader
        title="Admin Center"
        subtitle="System management & analytics"
        icon={Shield}
        iconColor="from-blue-600 to-indigo-600"
        onRefresh={fetchAdminStats}
        showBackButton={false}
        actions={[
          {
            text: user?.full_name || 'Admin',
            icon: null,
            className: 'bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none hover:shadow-none',
            onClick: () => {}
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="Total"
            icon={Users}
            iconColor="from-blue-500 to-blue-600"
            bgColor="from-blue-500/5 to-indigo-500/5"
            borderColor="hover:border-blue-300/50"
            shadowColor="hover:shadow-blue-500/10"
            trend={true}
            trendIcon={TrendingUp}
            trendText="+12% this month"
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Active Users"
            value={stats.activeUsers}
            subtitle="Active"
            icon={Activity}
            iconColor="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={CheckCircle}
            trendText={`${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active`}
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Premium Users"
            value={stats.subscribedUsers}
            subtitle="Premium"
            icon={Crown}
            iconColor="from-amber-500 to-yellow-500"
            bgColor="from-amber-500/5 to-yellow-500/5"
            borderColor="hover:border-amber-300/50"
            shadowColor="hover:shadow-amber-500/10"
            trend={true}
            trendIcon={Star}
            trendText="Premium subscribers"
            trendColor="text-amber-600"
          />
          
          <AdminStatsCard
            title="Learning Content"
            value={stats.totalModules}
            subtitle="Modules"
            icon={BookOpen}
            iconColor="from-purple-500 to-violet-500"
            bgColor="from-purple-500/5 to-violet-500/5"
            borderColor="hover:border-purple-300/50"
            shadowColor="hover:shadow-purple-500/10"
            trend={true}
            trendIcon={Target}
            trendText="Educational modules"
            trendColor="text-purple-600"
          />
        </div>

        {/* Modern System Alerts */}
        {systemAlerts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">System Alerts</h2>
            </div>
            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const IconComponent = alert.icon
                return (
                  <div key={alert.id} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-amber-300/50 transition-all duration-200 hover:shadow-lg">
                    <div className="p-4 flex items-center space-x-3">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                        <IconComponent className="h-4 w-4 text-amber-600" />
                      </div>
                      <p className="text-sm text-slate-700 flex-1">{alert.message}</p>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Modern Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Admin Features - Modern Design */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Management Tools</h2>
                  <p className="text-slate-600">Access all administrative functions and system controls</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Link
                    key={feature.id}
                    to={feature.path}
                    className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        {feature.stats && (
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">{feature.stats}</p>
                            <p className="text-xs text-slate-500">Total</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-4">{feature.description}</p>
                      </div>
                      <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                        <span className="text-sm font-medium">Access Tool</span>
                        <ArrowLeft className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Modern Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Weather */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Today's Weather</h3>
              </div>
              <WeatherCard />
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon
                  return (
                    <div key={activity.id} className="group flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors">
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium">{activity.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left">
                  <UserPlus className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Add New User</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left">
                  <Bell className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Send Notification</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-left">
                  <BarChart3 className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-700">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard