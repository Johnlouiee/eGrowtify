import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  BarChart3, Calendar, Download, Filter, Search, RefreshCw,
  Clock, User, Crown, TrendingUp, AlertTriangle, CheckCircle,
  Eye, FileText, Activity, History, CreditCard, Users,
  ChevronDown, ChevronUp, ArrowRight, ArrowLeft
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Reports = () => {
  const { user, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('activity')
  const [dateRange, setDateRange] = useState('7d')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Data states
  const [activityLogs, setActivityLogs] = useState([])
  const [historyLogs, setHistoryLogs] = useState([])
  const [subscriptionLogs, setSubscriptionLogs] = useState([])
  const [summaryStats, setSummaryStats] = useState({
    totalActivities: 0,
    totalHistoryRecords: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    cancelledSubscriptions: 0
  })

  useEffect(() => {
    if (isAdmin) {
      fetchReportsData()
    }
  }, [isAdmin, dateRange])

  const fetchReportsData = async () => {
    try {
      setLoading(true)
      
      // Fetch activity logs
      const activityResponse = await axios.get('/api/admin/activity-logs', {
        params: { date_range: dateRange }
      })
      setActivityLogs(activityResponse.data.logs || [])

      // Fetch history logs
      const historyResponse = await axios.get('/api/admin/history-logs', {
        params: { date_range: dateRange }
      })
      setHistoryLogs(historyResponse.data.logs || [])

      // Fetch subscription logs
      const subscriptionResponse = await axios.get('/api/admin/subscription-logs', {
        params: { date_range: dateRange }
      })
      setSubscriptionLogs(subscriptionResponse.data.logs || [])

      // Fetch summary statistics
      const statsResponse = await axios.get('/api/admin/reports/summary', {
        params: { date_range: dateRange }
      })
      setSummaryStats(statsResponse.data)

    } catch (error) {
      console.error('Error fetching reports data:', error)
      toast.error('Failed to load reports data')
      
      // Mock data for demonstration
      setActivityLogs([
        {
          id: 1,
          user_id: 1,
          user_name: 'John Doe',
          action: 'user_login',
          description: 'User logged in successfully',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success'
        },
        {
          id: 2,
          user_id: 2,
          user_name: 'Jane Smith',
          action: 'subscription_upgrade',
          description: 'User upgraded to Premium plan',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'success'
        },
        {
          id: 3,
          user_id: 3,
          user_name: 'Bob Wilson',
          action: 'password_reset',
          description: 'User requested password reset',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          status: 'success'
        }
      ])

      setHistoryLogs([
        {
          id: 1,
          table_name: 'users',
          record_id: 1,
          action: 'UPDATE',
          old_values: { full_name: 'John Doe' },
          new_values: { full_name: 'John Smith' },
          changed_by: 'admin',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
          field_changes: ['full_name']
        },
        {
          id: 2,
          table_name: 'garden',
          record_id: 5,
          action: 'INSERT',
          old_values: null,
          new_values: { name: 'New Garden', garden_type: 'vegetable' },
          changed_by: 'user_2',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
          field_changes: ['name', 'garden_type']
        }
      ])

      setSubscriptionLogs([
        {
          id: 1,
          user_id: 2,
          user_name: 'Jane Smith',
          action: 'subscription_created',
          plan_name: 'Premium Plan',
          amount: 150.00,
          currency: 'PHP',
          payment_method: 'gcash',
          status: 'active',
          start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23),
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
        },
        {
          id: 2,
          user_id: 3,
          user_name: 'Bob Wilson',
          action: 'subscription_cancelled',
          plan_name: 'Premium Plan',
          amount: 150.00,
          currency: 'PHP',
          payment_method: 'gcash',
          status: 'cancelled',
          start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          end_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
        }
      ])

      setSummaryStats({
        totalActivities: 156,
        totalHistoryRecords: 89,
        totalSubscriptions: 45,
        activeSubscriptions: 42,
        cancelledSubscriptions: 3
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'activity':
        return activityLogs
      case 'history':
        return historyLogs
      case 'subscription':
        return subscriptionLogs
      default:
        return []
    }
  }

  const getFilteredData = () => {
    const data = getCurrentData()
    if (!searchTerm) return data
    
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase()
      return (
        item.user_name?.toLowerCase().includes(searchLower) ||
        item.action?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.table_name?.toLowerCase().includes(searchLower) ||
        item.plan_name?.toLowerCase().includes(searchLower)
      )
    })
  }

  const getPaginatedData = () => {
    const filtered = getFilteredData()
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filtered.slice(startIndex, endIndex)
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - new Date(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'error':
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'user_login':
      case 'user_logout':
      case 'LOGIN':
      case 'LOGOUT':
        return User
      case 'subscription_upgrade':
      case 'subscription_created':
      case 'subscription_cancelled':
        return Crown
      case 'password_reset':
        return AlertTriangle
      case 'UPDATE':
      case 'INSERT':
      case 'DELETE':
        return History
      default:
        return Activity
    }
  }

  const exportData = () => {
    const data = getFilteredData()
    const csvContent = convertToCSV(data, activeTab)
    downloadCSV(csvContent, `${activeTab}_logs_${new Date().toISOString().split('T')[0]}.csv`)
    toast.success('Data exported successfully')
  }

  const convertToCSV = (data, type) => {
    if (data.length === 0) return ''
    
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'object' ? JSON.stringify(value) : value
      ).join(',')
    )
    
    return [headers, ...rows].join('\n')
  }

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'activity', label: 'Activity Logs', icon: Activity, count: activityLogs.length },
    { id: 'history', label: 'History Logs', icon: History, count: historyLogs.length },
    { id: 'subscription', label: 'Subscription Logs', icon: CreditCard, count: subscriptionLogs.length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600">System logs, activity tracking, and subscription analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalActivities}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">History Records</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalHistoryRecords}</p>
              </div>
              <History className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.totalSubscriptions}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.activeSubscriptions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.cancelledSubscriptions}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.label}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>
              <button
                onClick={fetchReportsData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-50/50">
                <tr>
                  {activeTab === 'activity' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </>
                  )}
                  {activeTab === 'history' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changed By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </>
                  )}
                  {activeTab === 'subscription' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-gray-200">
                {getPaginatedData().map((item, index) => {
                  const ActionIcon = getActionIcon(item.action)
                  return (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      {activeTab === 'activity' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <ActionIcon className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.user_name}</div>
                                <div className="text-sm text-gray-500">ID: {item.user_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{item.action}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{item.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{item.ip_address}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatTimestamp(item.timestamp)}</div>
                            <div className="text-sm text-gray-500">{formatTimeAgo(item.timestamp)}</div>
                          </td>
                        </>
                      )}
                      {activeTab === 'history' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">{item.table_name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                              item.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{item.record_id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {item.field_changes?.join(', ') || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">{item.changed_by}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatTimestamp(item.timestamp)}</div>
                            <div className="text-sm text-gray-500">{formatTimeAgo(item.timestamp)}</div>
                          </td>
                        </>
                      )}
                      {activeTab === 'subscription' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-2 bg-green-100 rounded-lg mr-3">
                                <Crown className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{item.user_name}</div>
                                <div className="text-sm text-gray-500">ID: {item.user_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{item.action}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{item.plan_name}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {item.currency} {item.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatTimestamp(item.timestamp)}</div>
                            <div className="text-sm text-gray-500">{formatTimeAgo(item.timestamp)}</div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={getPaginatedData().length < itemsPerPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, getFilteredData().length)}
                  </span>{' '}
                  of <span className="font-medium">{getFilteredData().length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={getPaginatedData().length < itemsPerPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports