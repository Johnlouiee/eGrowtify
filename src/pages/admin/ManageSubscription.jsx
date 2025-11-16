import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  CreditCard, Users, TrendingUp, DollarSign, Calendar,
  ArrowLeft, Eye, Edit, CheckCircle, XCircle, AlertCircle,
  Crown, Star, Zap, Settings, Filter, Search, Download,
  RefreshCw, Plus, Trash2, MoreVertical, BarChart3,
  Activity, Target, Globe, Lock, Unlock, Clock,
  ChevronDown, ChevronUp, Grid, List, Mail, Phone, Save
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'
import AdminFilters from '../../components/AdminFilters'

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
  const [showEditPlanModal, setShowEditPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [editingPlan, setEditingPlan] = useState({
    name: '',
    price: 0,
    features: [],
    newFeature: ''
  })

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
      
      // Fetch subscription plans from API
      try {
        const plansRes = await axios.get('/api/admin/subscription/plans')
        if (plansRes.data && plansRes.data.length > 0) {
          const plans = plansRes.data.map(plan => ({
            id: plan.id,
            name: plan.plan_name,
            price: plan.price,
            plan_type: plan.plan_type,
            features: [
              `${plan.free_ai_analyses} AI Analyses`,
              `${plan.free_plant_analyses} Plant Analyses`,
              `${plan.free_soil_analyses} Soil Analyses`,
              `${plan.grid_planner_size} Grid Planner`,
              plan.plan_type === 'premium' ? 'Priority Support' : 'Basic Support'
            ],
            color: plan.plan_type === 'premium' ? 'bg-purple-500' : 'bg-gray-500',
            borderColor: plan.plan_type === 'premium' ? 'border-purple-200' : 'border-gray-200',
            bgColor: plan.plan_type === 'premium' ? 'bg-purple-50' : 'bg-gray-50',
            subscribers: subscribers.filter(s => s.subscribed === (plan.plan_type === 'premium')).length,
            popular: plan.plan_type === 'premium',
            ...plan
          }))
          setSubscriptionPlans(plans)
        } else {
          // Fallback to default plans
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
              price: 150,
              features: ['Unlimited plant tracking', 'Advanced AI recognition', 'Priority support', 'Exclusive content', 'Expert consultations', 'Custom garden plans'],
              color: 'bg-purple-500',
              borderColor: 'border-purple-200',
              bgColor: 'bg-purple-50',
              subscribers: 45,
              popular: true
            }
          ])
        }
      } catch (error) {
        // Fallback to default plans
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
            price: 150,
            features: ['Unlimited plant tracking', 'Advanced AI recognition', 'Priority support', 'Exclusive content', 'Expert consultations', 'Custom garden plans'],
            color: 'bg-purple-500',
            borderColor: 'border-purple-200',
            bgColor: 'bg-purple-50',
            subscribers: 45,
            popular: true
          }
        ])
      }
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

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan)
    setEditingPlan({
      name: plan.name,
      price: plan.price,
      features: Array.isArray(plan.features) ? [...plan.features] : [],
      newFeature: ''
    })
    setShowEditPlanModal(true)
  }

  const handleSavePlan = async () => {
    try {
      if (selectedPlan.id && typeof selectedPlan.id === 'number') {
        // Update existing plan via API
        await axios.put(`/api/admin/subscription/plans/${selectedPlan.id}`, {
          plan_name: editingPlan.name,
          price: parseFloat(editingPlan.price),
          features: editingPlan.features
        })
        toast.success('Plan updated successfully!')
      } else {
        // For mock plans, just update local state
        setSubscriptionPlans(plans => 
          plans.map(p => 
            p.id === selectedPlan.id 
              ? { ...p, name: editingPlan.name, price: editingPlan.price, features: editingPlan.features }
              : p
          )
        )
        toast.success('Plan updated successfully!')
      }
      setShowEditPlanModal(false)
      fetchSubscriptionData()
    } catch (error) {
      console.error('Error updating plan:', error)
      toast.error('Failed to update plan')
    }
  }

  const handleAddFeature = () => {
    if (editingPlan.newFeature.trim()) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, editingPlan.newFeature.trim()],
        newFeature: ''
      })
    }
  }

  const handleRemoveFeature = (index) => {
    setEditingPlan({
      ...editingPlan,
      features: editingPlan.features.filter((_, i) => i !== index)
    })
  }

  const handleViewAnalytics = async (plan) => {
    try {
      setSelectedPlan(plan)
      // Fetch analytics data
      const response = await axios.get(`/api/admin/subscription/analytics/${plan.id || plan.plan_type}`)
      setAnalyticsData(response.data)
      setShowAnalyticsModal(true)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Show mock analytics if API fails
      setAnalyticsData({
        totalSubscribers: plan.subscribers || 0,
        monthlyRevenue: (plan.subscribers || 0) * plan.price,
        churnRate: 3.2,
        conversionRate: 12.5,
        averageRevenuePerUser: plan.price,
        growthRate: 15.3,
        recentSubscriptions: [],
        revenueByMonth: []
      })
      setShowAnalyticsModal(true)
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Enhanced Header */}
      <AdminHeader
        title="Subscription Management"
        subtitle="Monitor and manage user subscriptions & billing"
        icon={CreditCard}
        iconColor="from-green-600 to-emerald-600"
        onRefresh={fetchSubscriptionData}
        actions={[
          {
            text: "Export",
            icon: Download,
            onClick: exportSubscribers,
            className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Subscription Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Subscribers"
            value={subscriptionStats.totalSubscribers}
            subtitle="Total"
            icon={Users}
            iconColor="from-green-500 to-emerald-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={TrendingUp}
            trendText={`+${subscriptionStats.newSubscribersThisMonth} this month`}
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Active Subscriptions"
            value={subscriptionStats.activeSubscriptions}
            subtitle="Active"
            icon={CheckCircle}
            iconColor="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={CheckCircle}
            trendText={`${Math.round((subscriptionStats.activeSubscriptions / subscriptionStats.totalSubscribers) * 100)}% active rate`}
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Monthly Revenue"
            value={`$${subscriptionStats.monthlyRevenue}`}
            subtitle="Revenue"
            icon={DollarSign}
            iconColor="from-purple-500 to-purple-600"
            bgColor="from-purple-500/5 to-violet-500/5"
            borderColor="hover:border-purple-300/50"
            shadowColor="hover:shadow-purple-500/10"
            trend={true}
            trendIcon={DollarSign}
            trendText={`$${subscriptionStats.averageRevenuePerUser} ARPU`}
            trendColor="text-purple-600"
          />
          
          <AdminStatsCard
            title="Subscription Rate"
            value={`${subscriptionStats.subscriptionRate}%`}
            subtitle="Rate"
            icon={TrendingUp}
            iconColor="from-orange-500 to-orange-600"
            bgColor="from-orange-500/5 to-amber-500/5"
            borderColor="hover:border-orange-300/50"
            shadowColor="hover:shadow-orange-500/10"
            trend={true}
            trendIcon={Target}
            trendText={`${subscriptionStats.churnRate}% churn rate`}
            trendColor="text-orange-600"
          />
        </div>

        {/* Enhanced Filters and Controls */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search subscribers by name or email..."
          filters={[
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'subscribed', label: 'Subscribed' },
                { value: 'not_subscribed', label: 'Not Subscribed' }
              ]
            },
            {
              value: filterPlan,
              onChange: setFilterPlan,
              options: [
                { value: 'all', label: 'All Plans' },
                { value: 'premium', label: 'Premium' },
                { value: 'basic', label: 'Basic' }
              ]
            }
          ]}
          viewModes={[
            { id: 'table', icon: BarChart3, title: 'Table View' },
            { id: 'grid', icon: Grid, title: 'Grid View' },
            { id: 'list', icon: List, title: 'List View' }
          ]}
          currentViewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={fetchSubscriptionData}
          showBulkActions={selectedSubscribers.length > 0}
          bulkActionsCount={selectedSubscribers.length}
          onBulkAction={handleBulkAction}
          bulkActionOptions={[
            {
              text: "Activate",
              action: 'activate',
              className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
            },
            {
              text: "Deactivate",
              action: 'deactivate',
              className: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700'
            },
            {
              text: "Export",
              action: 'export',
              className: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700'
            }
          ]}
        />

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
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
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
                            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
                              subscriber.subscribed 
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            title={subscriber.subscribed ? 'Cancel Subscription' : 'Activate Subscription'}
                          >
                            {subscriber.subscribed ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            <span className="text-sm font-medium">{subscriber.subscribed ? 'Lock' : 'Unlock'}</span>
                          </button>
                          <button
                            className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                            <span className="text-sm font-medium">View</span>
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
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
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
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
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
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg">
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
                      <button 
                        onClick={() => handleEditPlan(plan)}
                        className={`w-full px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                          plan.id === 'premium' 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' 
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                        }`}
                      >
                        <Edit className="h-4 w-4 inline mr-2" />
                        Edit Plan
                      </button>
                      <button 
                        onClick={() => handleViewAnalytics(plan)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <BarChart3 className="h-4 w-4 inline mr-2" />
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
                        <p className="text-xs text-gray-500">{activity.user}</p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-sm text-green-600 hover:text-green-800 font-medium">
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

      {/* Edit Plan Modal */}
      {showEditPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Edit Subscription Plan</h3>
                <button
                  onClick={() => setShowEditPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PHP)
                </label>
                <input
                  type="number"
                  value={editingPlan.price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2 mb-3">
                  {editingPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingPlan.newFeature}
                    onChange={(e) => setEditingPlan({ ...editingPlan, newFeature: e.target.value })}
                    placeholder="Add new feature..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditPlanModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalyticsModal && analyticsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Analytics - {selectedPlan?.name || 'Plan'}
                </h3>
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Total Subscribers</span>
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.totalSubscribers || 0}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₱{analyticsData.monthlyRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Churn Rate</span>
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.churnRate || 0}%</p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.conversionRate || 0}%</p>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">ARPU</span>
                    <BarChart3 className="h-5 w-5 text-teal-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₱{analyticsData.averageRevenuePerUser?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Growth Rate</span>
                    <Activity className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.growthRate || 0}%</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Average subscription duration: 8.5 months</p>
                  <p>• Customer lifetime value: ₱{((analyticsData.averageRevenuePerUser || 0) * 8.5).toLocaleString()}</p>
                  <p>• Retention rate: {100 - (analyticsData.churnRate || 0)}%</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSubscription
