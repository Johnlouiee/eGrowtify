import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  History, ArrowLeft, Search, Filter, RefreshCw, Download, 
  Eye, Calendar, Clock, User, Database, FileText, AlertCircle,
  CheckCircle, XCircle, Edit, Trash2, Plus, Settings, 
  TrendingUp, BarChart3, Users, Crown, Bell, Activity,
  ChevronDown, ChevronUp, MoreVertical, Filter as FilterIcon,
  Archive, RotateCcw, Save, Upload
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'
import AdminFilters from '../../components/AdminFilters'

const HistoryLogs = () => {
  const [historyLogs, setHistoryLogs] = useState([])
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
    thisMonth: 0,
    dataChanges: 0,
    systemChanges: 0,
    userChanges: 0
  })

  useEffect(() => {
    fetchHistoryLogs()
  }, [])

  const fetchHistoryLogs = async () => {
    try {
      setLoading(true)
      
      // Mock data for demonstration - replace with actual API call
      const mockLogs = [
        {
          id: 1,
          type: 'user_profile_update',
          action: 'Profile Update',
          description: 'User updated their profile information',
          user_id: 1,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          entity_type: 'user',
          entity_id: 1,
          changes: {
            before: {
              full_name: 'John Smith',
              location: 'Manila, Philippines'
            },
            after: {
              full_name: 'John Doe',
              location: 'Quezon City, Philippines'
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 2,
          type: 'garden_modification',
          action: 'Garden Modified',
          description: 'User modified garden settings',
          user_id: 2,
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          entity_type: 'garden',
          entity_id: 5,
          changes: {
            before: {
              name: 'My Garden',
              garden_type: 'vegetable',
              location_city: 'Manila'
            },
            after: {
              name: 'My Backyard Garden',
              garden_type: 'mixed',
              location_city: 'Quezon City'
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
          ip_address: '192.168.1.101',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: 3,
          type: 'plant_care_update',
          action: 'Plant Care Updated',
          description: 'User updated plant care information',
          user_id: 3,
          user_name: 'Bob Wilson',
          user_email: 'bob@example.com',
          entity_type: 'plant',
          entity_id: 12,
          changes: {
            before: {
              watering_frequency: 3,
              fertilizing_frequency: 14,
              pruning_frequency: 30
            },
            after: {
              watering_frequency: 2,
              fertilizing_frequency: 10,
              pruning_frequency: 21
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          ip_address: '192.168.1.102',
          user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
        },
        {
          id: 4,
          type: 'subscription_change',
          action: 'Subscription Changed',
          description: 'User subscription plan was modified',
          user_id: 4,
          user_name: 'Alice Brown',
          user_email: 'alice@example.com',
          entity_type: 'subscription',
          entity_id: 8,
          changes: {
            before: {
              plan_type: 'basic',
              status: 'active',
              end_date: '2024-02-15'
            },
            after: {
              plan_type: 'premium',
              status: 'active',
              end_date: '2024-03-15'
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          ip_address: '192.168.1.103',
          user_agent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        },
        {
          id: 5,
          type: 'admin_user_creation',
          action: 'User Created',
          description: 'Admin created a new user account',
          user_id: null,
          user_name: 'Admin User',
          user_email: 'admin@egrowtify.com',
          entity_type: 'user',
          entity_id: 15,
          changes: {
            before: null,
            after: {
              full_name: 'New User',
              email: 'newuser@example.com',
              role: 'user',
              status: 'active'
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 6,
          type: 'plant_deletion',
          action: 'Plant Deleted',
          description: 'User deleted a plant from their garden',
          user_id: 5,
          user_name: 'Charlie Davis',
          user_email: 'charlie@example.com',
          entity_type: 'plant',
          entity_id: 20,
          changes: {
            before: {
              name: 'Old Tomato Plant',
              type: 'vegetable',
              garden_id: 3,
              status: 'active'
            },
            after: null
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          ip_address: '192.168.1.104',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        {
          id: 7,
          type: 'garden_deletion',
          action: 'Garden Deleted',
          description: 'User deleted their garden',
          user_id: 6,
          user_name: 'Diana Lee',
          user_email: 'diana@example.com',
          entity_type: 'garden',
          entity_id: 7,
          changes: {
            before: {
              name: 'Test Garden',
              garden_type: 'herb',
              location_city: 'Cebu',
              status: 'active'
            },
            after: null
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          ip_address: '192.168.1.105',
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        {
          id: 8,
          type: 'system_config_update',
          action: 'System Configuration Updated',
          description: 'Admin updated system configuration',
          user_id: null,
          user_name: 'System Admin',
          user_email: 'admin@egrowtify.com',
          entity_type: 'system',
          entity_id: 1,
          changes: {
            before: {
              max_gardens_per_user: 3,
              max_plants_per_garden: 50,
              alert_frequency: 'daily'
            },
            after: {
              max_gardens_per_user: 5,
              max_plants_per_garden: 100,
              alert_frequency: 'twice_daily'
            }
          },
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      ]
      
      setHistoryLogs(mockLogs)
      
      // Calculate stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const thisWeek = new Date()
      thisWeek.setDate(thisWeek.getDate() - 7)
      
      const thisMonth = new Date()
      thisMonth.setMonth(thisMonth.getMonth() - 1)
      
      const stats = {
        total: mockLogs.length,
        today: mockLogs.filter(log => log.timestamp >= today).length,
        thisWeek: mockLogs.filter(log => log.timestamp >= thisWeek).length,
        thisMonth: mockLogs.filter(log => log.timestamp >= thisMonth).length,
        dataChanges: mockLogs.filter(log => log.type.includes('update') || log.type.includes('modification')).length,
        systemChanges: mockLogs.filter(log => log.type.includes('system_') || log.type.includes('admin_')).length,
        userChanges: mockLogs.filter(log => log.user_id !== null).length
      }
      
      setStats(stats)
      
    } catch (error) {
      console.error('Error fetching history logs:', error)
      toast.error('Failed to load history logs')
    } finally {
      setLoading(false)
    }
  }

  const getHistoryIcon = (type) => {
    const iconMap = {
      'user_profile_update': User,
      'garden_modification': Database,
      'plant_care_update': Activity,
      'subscription_change': Crown,
      'admin_user_creation': Users,
      'plant_deletion': Trash2,
      'garden_deletion': Trash2,
      'system_config_update': Settings
    }
    return iconMap[type] || History
  }

  const getHistoryColor = (type) => {
    const colorMap = {
      'user_profile_update': 'text-blue-600',
      'garden_modification': 'text-green-600',
      'plant_care_update': 'text-emerald-600',
      'subscription_change': 'text-yellow-600',
      'admin_user_creation': 'text-purple-600',
      'plant_deletion': 'text-red-600',
      'garden_deletion': 'text-red-600',
      'system_config_update': 'text-indigo-600'
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

  const getChangeType = (changes) => {
    if (!changes.before && changes.after) return 'Created'
    if (changes.before && !changes.after) return 'Deleted'
    return 'Modified'
  }

  const filteredLogs = historyLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
    
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
      ['Timestamp', 'Type', 'Action', 'Description', 'User', 'Entity Type', 'Entity ID', 'Status', 'IP Address'],
      ...sortedLogs.map(log => [
        log.timestamp.toISOString(),
        log.type,
        log.action,
        log.description,
        log.user_name || 'System',
        log.entity_type,
        log.entity_id,
        log.status,
        log.ip_address
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `history_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('History logs exported successfully')
  }

  const rollbackChange = async (logId) => {
    if (!window.confirm('Are you sure you want to rollback this change? This action cannot be undone.')) {
      return
    }

    try {
      // Mock rollback - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Change rolled back successfully')
      fetchHistoryLogs()
    } catch (error) {
      console.error('Error rolling back change:', error)
      toast.error('Failed to rollback change')
    }
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
                  <History className="w-8 h-8 mr-3 text-purple-600" />
                  History Logs
                </h1>
                <p className="text-gray-600 mt-1">Track data changes and system modifications</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchHistoryLogs}
                disabled={loading}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportLogs}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
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
            title="Total Changes"
            value={stats.total}
            icon={History}
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            trend="+15%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="Today"
            value={stats.today}
            icon={Calendar}
            iconColor="text-green-600"
            bgColor="bg-green-50"
            trend="+8%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="This Week"
            value={stats.thisWeek}
            icon={BarChart3}
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            trend="+12%"
            trendColor="text-green-600"
          />
          <AdminStatsCard
            title="This Month"
            value={stats.thisMonth}
            icon={Archive}
            iconColor="text-indigo-600"
            bgColor="bg-indigo-50"
            trend="+20%"
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
                  placeholder="Search changes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="user_profile_update">User Profile</option>
                <option value="garden_modification">Garden</option>
                <option value="plant_care_update">Plant Care</option>
                <option value="subscription_change">Subscription</option>
                <option value="admin_user_creation">User Creation</option>
                <option value="plant_deletion">Plant Deletion</option>
                <option value="garden_deletion">Garden Deletion</option>
                <option value="system_config_update">System Config</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="timestamp">Timestamp</option>
                <option value="action">Action</option>
                <option value="user_name">User</option>
                <option value="entity_type">Entity Type</option>
                <option value="status">Status</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">History Logs ({sortedLogs.length})</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading history logs...</p>
            </div>
          ) : sortedLogs.length === 0 ? (
            <div className="p-8 text-center">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No history logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedLogs.map((log) => {
                    const HistoryIcon = getHistoryIcon(log.type)
                    const StatusIcon = getStatusIcon(log.status)
                    const changeType = getChangeType(log.changes)
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <HistoryIcon className={`w-5 h-5 mr-3 ${getHistoryColor(log.type)}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.action}</div>
                              <div className="text-sm text-gray-500">{log.description}</div>
                              <div className="text-xs text-gray-400">{changeType}</div>
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
                            <Database className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 capitalize">{log.entity_type}</div>
                              <div className="text-sm text-gray-500">ID: {log.entity_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {changeType}
                          </span>
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
                              className="text-purple-600 hover:text-purple-800 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {log.changes.before && (
                              <button
                                onClick={() => rollbackChange(log.id)}
                                className="text-orange-600 hover:text-orange-800 transition-colors"
                                title="Rollback Change"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                            )}
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
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Change Details</h3>
                  <button
                    onClick={() => setShowLogDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700">Entity</label>
                    <p className="text-sm text-gray-900">{selectedLog.entity_type} (ID: {selectedLog.entity_id})</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="text-sm text-gray-900">{selectedLog.status}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{selectedLog.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedLog.changes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Changes</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedLog.changes.before && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Before</h4>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                              {JSON.stringify(selectedLog.changes.before, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                      {selectedLog.changes.after && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">After</h4>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                              {JSON.stringify(selectedLog.changes.after, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
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

export default HistoryLogs
