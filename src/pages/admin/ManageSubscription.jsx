import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  CreditCard, Users, TrendingUp, DollarSign, Calendar,
  ArrowLeft, Eye, Edit, CheckCircle, XCircle, AlertCircle,
  Crown, Star, Zap, Settings, Filter, Search, Download,
  RefreshCw, Plus, Trash2, MoreVertical, BarChart3,
  Activity, Target, Globe, Lock, Unlock, Clock,
  ChevronDown, ChevronUp, Grid, List, Mail, Phone
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageSubscription = () => {
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalSubscribers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    subscriptionRate: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    newSubscribersThisMonth: 0,
    totalRevenue: 0
  })
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedSubscribers, setSelectedSubscribers] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [recentActivity, setRecentActivity] = useState([])
  const [subscriptionPlans, setSubscriptionPlans] = useState([])

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      // Fetch subscription statistics
      const [statsRes, subscribersRes] = await Promise.all([
        axios.get('/api/admin/subscription/stats'),
        axios.get('/api/admin/subscription/subscribers')
      ])
      
      setSubscriptionStats(statsRes.data)
      setSubscribers(subscribersRes.data)
      
      // Mock data for demonstration - replace with actual API calls
      setRecentActivity([
        {
          id: 1,
          type: 'subscription_created',
          message: 'New Premium subscription activated',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          icon: Crown,
          color: 'text-yellow-600'
        },
        {
          id: 2,
          type: 'subscription_cancelled',
          message: 'Subscription cancelled by user',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          icon: XCircle,
          color: 'text-red-600'
        },
        {
          id: 3,
          type: 'payment_failed',
          message: 'Payment failed for subscription',
          user: 'Bob Johnson',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          icon: AlertCircle,
          color: 'text-orange-600'
        }
      ])
      
      setSubscriptionPlans([
        {
          id: 'basic',
          name: 'Basic Plan',
          price: 0,
          features: ['Basic plant tracking', 'Limited AI recognition', 'Community access', 'Basic garden planning'],
          color: 'bg-gray-500',
          borderColor: 'border-gray-200',
          bgColor: 'bg-gray-50',
          subscribers: 150
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          price: 9.99,
          features: ['Unlimited plant tracking', 'Advanced AI recognition', 'Priority support', 'Exclusive content', 'Expert consultations', 'Custom garden plans'],
          color: 'bg-purple-500',
          borderColor: 'border-purple-200',
          bgColor: 'bg-purple-50',
          subscribers: 45,
          popular: true
        }
      ])
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      toast.error('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSubscription = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/subscription/${userId}/toggle`, {
        subscribed: !currentStatus
      })
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchSubscriptionData() // Refresh the data
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
    }
  }

  // Utility Functions
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleBulkAction = async (action) => {
    if (selectedSubscribers.length === 0) {
      toast.error('Please select subscribers first')
      return
    }

    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedSubscribers.map(id => 
            axios.patch(`/api/admin/subscription/${id}/toggle`, { subscribed: true })
          ))
          toast.success(`${selectedSubscribers.length} subscriptions activated`)
          break
        case 'deactivate':
          await Promise.all(selectedSubscribers.map(id => 
            axios.patch(`/api/admin/subscription/${id}/toggle`, { subscribed: false })
          ))
          toast.success(`${selectedSubscribers.length} subscriptions deactivated`)
          break
        case 'export':
          exportSubscribers()
          break
      }
      setSelectedSubscribers([])
      setShowBulkActions(false)
      fetchSubscriptionData()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      toast.error('Failed to perform bulk action')
    }
  }

  const exportSubscribers = () => {
    const csvContent = [
      ['Name', 'Email', 'Status', 'Plan', 'Start Date'].join(','),
      ...filteredSubscribers.map(subscriber => [
        subscriber.full_name,
        subscriber.email,
        subscriber.subscribed ? 'Subscribed' : 'Not Subscribed',
        subscriber.subscribed ? 'Premium' : 'Basic',
        new Date(subscriber.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Subscribers exported successfully')
  }

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

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'subscribed' && subscriber.subscribed) ||
                         (filterStatus === 'not_subscribed' && !subscriber.subscribed)
    const matchesPlan = filterPlan === 'all' ||
                       (filterPlan === 'premium' && subscriber.subscribed) ||
                       (filterPlan === 'basic' && !subscriber.subscribed)
    return matchesSearch && matchesStatus && matchesPlan
  }).sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'created_at') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                to="/admin" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Admin Dashboard
              </Link>
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mr-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Subscription Management
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">Monitor and manage user subscriptions & billing</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSubscriptionData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={exportSubscribers}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Subscription Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-3xl font-bold text-gray-900">{subscriptionStats.totalSubscribers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{subscriptionStats.newSubscribersThisMonth} this month
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
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900">{subscriptionStats.activeSubscriptions}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {Math.round((subscriptionStats.activeSubscriptions / subscriptionStats.totalSubscribers) * 100)}% active rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${subscriptionStats.monthlyRevenue}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${subscriptionStats.averageRevenuePerUser} ARPU
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subscription Rate</p>
                <p className="text-3xl font-bold text-gray-900">{subscriptionStats.subscriptionRate}%</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {subscriptionStats.churnRate}% churn rate
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subscribers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="not_subscribed">Not Subscribed</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Plans</option>
                  <option value="premium">Premium</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedSubscribers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedSubscribers.length} selected</span>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Bulk Actions
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Bulk Actions Panel */}
          {showBulkActions && selectedSubscribers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedSubscribers.length} subscribers selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubscribers([])
                      setShowBulkActions(false)
                    }}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subscribers Display */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Subscribers ({filteredSubscribers.length})
              </h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id))
                    } else {
                      setSelectedSubscribers([])
                    }
                  }}
                  checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>
          </div>
          
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('full_name')}
                    >
                      <div className="flex items-center">
                        User
                        {sortBy === 'full_name' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('subscribed')}
                    >
                      <div className="flex items-center">
                        Subscription Status
                        {sortBy === 'subscribed' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Start Date
                        {sortBy === 'created_at' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscribers([...selectedSubscribers, subscriber.id])
                            } else {
                              setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id))
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {subscriber.full_name?.charAt(0) || subscriber.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {subscriber.full_name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {subscriber.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.subscribed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.subscribed ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Not Subscribed
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          {subscriber.subscribed ? (
                            <>
                              <Crown className="h-4 w-4 text-yellow-600 mr-2" />
                              Premium Plan
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 text-gray-400 mr-2" />
                              Basic Plan
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleSubscription(subscriber.id, subscriber.subscribed)}
                            className={`p-2 rounded-lg transition-colors ${
                              subscriber.subscribed 
                                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200'
                            }`}
                            title={subscriber.subscribed ? 'Cancel Subscription' : 'Activate Subscription'}
                          >
                            {subscriber.subscribed ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </button>
                          <button
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscribers.map((subscriber) => (
                  <div key={subscriber.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {subscriber.full_name?.charAt(0) || subscriber.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-lg font-semibold text-gray-900">{subscriber.full_name || 'No Name'}</h4>
                          <p className="text-sm text-gray-500">{subscriber.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([...selectedSubscribers, subscriber.id])
                          } else {
                            setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.subscribed ? 'Subscribed' : 'Not Subscribed'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Plan</span>
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.subscribed ? 'Premium' : 'Basic'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Start Date</span>
                        <span className="text-sm text-gray-500">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleSubscription(subscriber.id, subscriber.subscribed)}
                          className={`p-2 rounded-lg transition-colors ${
                            subscriber.subscribed 
                              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={subscriber.subscribed ? 'Cancel Subscription' : 'Activate Subscription'}
                        >
                          {subscriber.subscribed ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="divide-y divide-gray-200">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers([...selectedSubscribers, subscriber.id])
                          } else {
                            setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id))
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {subscriber.full_name?.charAt(0) || subscriber.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{subscriber.full_name || 'No Name'}</h4>
                        <p className="text-sm text-gray-500">{subscriber.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          subscriber.subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.subscribed ? 'Subscribed' : 'Not Subscribed'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {subscriber.subscribed ? 'Premium' : 'Basic'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleSubscription(subscriber.id, subscriber.subscribed)}
                          className={`p-2 rounded-lg transition-colors ${
                            subscriber.subscribed 
                              ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={subscriber.subscribed ? 'Cancel Subscription' : 'Activate Subscription'}
                        >
                          {subscriber.subscribed ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        <button
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Subscription Plans Management */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Subscription Plans</h3>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Plan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className={`border-2 ${plan.borderColor} rounded-xl p-6 ${plan.bgColor} relative`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{plan.name}</h4>
                      <div className={`p-2 ${plan.color} rounded-lg`}>
                        {plan.id === 'basic' ? <Star className="h-5 w-5 text-white" /> : 
                         <Crown className="h-5 w-5 text-white" />}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      ${plan.price}<span className="text-sm text-gray-500">/month</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">{plan.subscribers} subscribers</p>
                    <ul className="text-sm text-gray-600 space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      <button className={`w-full px-4 py-2 rounded-lg transition-colors ${
                        plan.id === 'premium' 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}>
                        Edit Plan
                      </button>
                      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        View Analytics
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
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
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All Activity
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-semibold text-green-600">12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. Revenue/User</span>
                  <span className="text-sm font-semibold text-blue-600">$8.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Churn Rate</span>
                  <span className="text-sm font-semibold text-orange-600">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lifetime Value</span>
                  <span className="text-sm font-semibold text-purple-600">$127</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageSubscription
