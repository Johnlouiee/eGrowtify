import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity, ArrowLeft, Search, Filter, RefreshCw, Download, 
  Eye, Calendar, Clock, User, Shield, Database, AlertCircle,
  CheckCircle, XCircle, Edit, Trash2, Plus, Settings, 
  TrendingUp, BarChart3, Users, Crown, Bell, FileText,
  ChevronDown, ChevronUp, MoreVertical, Filter as FilterIcon
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'
import AdminFilters from '../../components/AdminFilters'

const ActivityLogs = () => {
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterUser, setFilterUser] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedLog, setSelectedLog] = useState(null)
  const [showLogDetails, setShowLogDetails] = useState(false)
  const [viewMode, setViewMode] = useState('table') // table, cards, timeline
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedLogs, setExpandedLogs] = useState({})
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    errors: 0,
    userActions: 0,
    systemActions: 0,
    adminActions: 0
  })

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  const fetchActivityLogs = async () => {
    try {
      setLoading(true)
      
      // Mock data for demonstration - replace with actual API call
      const mockLogs = [
        {
          id: 1,
          type: 'user_login',
          action: 'User Login',
          description: 'User successfully logged in',
          user_id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          metadata: {
            login_method: 'email',
            session_duration: null
          }
        },
        {
          id: 2,
          type: 'plant_care',
          action: 'Plant Watering',
          description: 'User watered tomato plant in Backyard Garden',
          user_id: 2,
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          metadata: {
            plant_name: 'Tomato Plant',
            garden_name: 'Backyard Garden',
            grid_position: '2,3',
            care_type: 'watering'
          }
        },
        {
          id: 3,
          type: 'subscription_upgrade',
          action: 'Subscription Upgrade',
          description: 'User upgraded to Premium subscription',
          user_id: 3,
          user_name: 'Bob Wilson',
          user_email: 'bob@example.com',
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          metadata: {
            plan_type: 'premium',
            payment_method: 'demo',
            amount: 150.00,
            currency: 'PHP'
          }
        },
        {
          id: 4,
          type: 'admin_action',
          action: 'User Management',
          description: 'Admin created new user account',
          user_id: null,
          user_name: 'Admin User',
          user_email: 'admin@egrowtify.com',
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          metadata: {
            target_user: 'New User',
            action_type: 'create_user'
          }
        },
        {
          id: 5,
          type: 'system_error',
          action: 'API Error',
          description: 'Failed to process plant recognition request',
          user_id: 4,
          user_name: 'Alice Brown',
          user_email: 'alice@example.com',
          ip_address: '192.168.1.103',
          user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
          status: 'error',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          metadata: {
            error_code: 'AI_RECOGNITION_FAILED',
            error_message: 'Unable to process image',
            endpoint: '/ai-recognition'
          }
        },
        {
          id: 6,
          type: 'garden_creation',
          action: 'Garden Creation',
          description: 'User created new garden: Herb Collection',
          user_id: 5,
          user_name: 'Charlie Davis',
          user_email: 'charlie@example.com',
          ip_address: '192.168.1.104',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          metadata: {
            garden_name: 'Herb Collection',
            garden_type: 'herb',
            location: 'Quezon City, Philippines'
          }
        },
        {
          id: 7,
          type: 'alert_completion',
          action: 'Alert Completion',
          description: 'User marked watering alert as completed',
          user_id: 2,
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          metadata: {
            alert_type: 'watering',
            plant_name: 'Basil',
            garden_name: 'Herb Collection',
            alert_id: 'grid_water_123'
          }
        },
        {
          id: 8,
          type: 'payment_processing',
          action: 'Payment Processing',
          description: 'Demo payment processed for additional grid spaces',
          user_id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          metadata: {
            payment_type: 'grid_spaces',
            amount: 20.00,
            currency: 'PHP',
            spaces_purchased: 1
          }
        }
      ]
      
      setActivityLogs(mockLogs)
      
      // Calculate stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const thisWeek = new Date()
      thisWeek.setDate(thisWeek.getDate() - 7)
      
      const stats = {
        total: mockLogs.length,
        today: mockLogs.filter(log => log.timestamp >= today).length,
        thisWeek: mockLogs.filter(log => log.timestamp >= thisWeek).length,
        errors: mockLogs.filter(log => log.status === 'error').length,
        userActions: mockLogs.filter(log => log.type.includes('user_') || log.type.includes('plant_') || log.type.includes('garden_')).length,
        systemActions: mockLogs.filter(log => log.type.includes('system_')).length,
        adminActions: mockLogs.filter(log => log.type.includes('admin_')).length
      }
      
      setStats(stats)
      
    } catch (error) {
      console.error('Error fetching activity logs:', error)
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const iconMap = {
      'user_login': User,
      'plant_care': Activity,
      'subscription_upgrade': Crown,
      'admin_action': Shield,
      'system_error': AlertCircle,
      'garden_creation': Database,
      'alert_completion': CheckCircle,
      'payment_processing': TrendingUp
    }
    return iconMap[type] || Activity
  }

  const getActivityColor = (type, status) => {
    if (status === 'error') return 'text-red-600'
    
    const colorMap = {
      'user_login': 'text-blue-600',
      'plant_care': 'text-green-600',
      'subscription_upgrade': 'text-yellow-600',
      'admin_action': 'text-purple-600',
      'system_error': 'text-red-600',
      'garden_creation': 'text-indigo-600',
      'alert_completion': 'text-green-600',
      'payment_processing': 'text-emerald-600'
    }
    return colorMap[type] || 'text-gray-600'
  }

  const getStatusIcon = (status) => {
    return status === 'success' ? CheckCircle : status === 'error' ? XCircle : AlertCircle
  }

  const getStatusColor = (status) => {
    return status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-yellow-600'
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || log.type === filterType
    const matchesUser = filterUser === 'all' || log.user_id?.toString() === filterUser
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus
    
    return matchesSearch && matchesType && matchesUser && matchesStatus
  })

  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Action', 'Description', 'User', 'Status', 'IP Address'],
      ...sortedLogs.map(log => [
        log.timestamp.toISOString(),
        log.type,
        log.action,
        log.description,
        log.user_name || 'System',
        log.status,
        log.ip_address
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Activity logs exported successfully')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Activity className="w-8 h-8 mr-3 text-blue-600" />
                  Activity Logs
                </h1>
                <p className="text-gray-600 mt-1">Monitor system activities and user actions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchActivityLogs}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportLogs}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Activities"
            value={stats.total}
            icon={Activity}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            trend="+12%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="Today"
            value={stats.today}
            icon={Calendar}
            iconColor="text-green-600"
            bgColor="bg-green-50"
            trend="+5%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="This Week"
            value={stats.thisWeek}
            icon={BarChart3}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            trend="+8%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="Errors"
            value={stats.errors}
            icon={AlertCircle}
            iconColor="text-red-600"
            bgColor="bg-red-50"
            trend="-2%"
            trendColor="text-green-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search activities..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="user_login">User Login</option>
                <option value="plant_care">Plant Care</option>
                <option value="subscription_upgrade">Subscription</option>
                <option value="admin_action">Admin Action</option>
                <option value="system_error">System Error</option>
                <option value="garden_creation">Garden Creation</option>
                <option value="alert_completion">Alert Completion</option>
                <option value="payment_processing">Payment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="timestamp">Timestamp</option>
                <option value="action">Action</option>
                <option value="user_name">User</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activity Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activity Logs ({sortedLogs.length})</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading activity logs...</p>
            </div>
          ) : sortedLogs.length === 0 ? (
            <div className="p-8 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activity logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLogs.map((log) => {
                    const ActivityIcon = getActivityIcon(log.type)
                    const StatusIcon = getStatusIcon(log.status)
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <ActivityIcon className={`w-5 h-5 mr-3 ${getActivityColor(log.type, log.status)}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.action}</div>
                              <div className="text-sm text-gray-500">{log.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.user_name || 'System'}</div>
                              <div className="text-sm text-gray-500">{log.user_email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <StatusIcon className={`w-4 h-4 mr-2 ${getStatusColor(log.status)}`} />
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' :
                              log.status === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{log.ip_address}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatTimestamp(log.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedLog(log)
                                setShowLogDetails(true)
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Log Details Modal */}
        {showLogDetails && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
                  <button
                    onClick={() => setShowLogDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Action</label>
                    <p className="text-sm text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900">{selectedLog.type}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedLog.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900">{selectedLog.user_name || 'System'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">{selectedLog.status}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="text-sm text-gray-900">{selectedLog.ip_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{selectedLog.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLogs
