import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, BookOpen, Bell, Calendar, BarChart3, 
  ArrowLeft, Shield, TrendingUp, CheckCircle, CreditCard
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
    subscribedUsers: 0
  })
  const [loading, setLoading] = useState(true)

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
      path: '/admin/users'
    },
    {
      id: 'manage-learning-paths',
      title: 'Manage Learning Paths',
      description: 'Edit learning modules, quizzes, and educational content',
      icon: BookOpen,
      color: 'bg-green-500',
      path: '/admin/learning-paths'
    }
  ]

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">System Administration & Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscribed Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.subscribedUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Features */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <div key={feature.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`p-3 ${feature.color} text-white rounded-lg mr-4`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      
                      <Link
                        to={feature.path}
                        className={`w-full ${feature.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center`}
                      >
                        <span>Access {feature.title}</span>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weather Card */}
          <div className="lg:col-span-1">
            <WeatherCard />
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard