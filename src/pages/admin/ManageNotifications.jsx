import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bell, Plus, Edit, Trash2, Search, Filter,
  ArrowLeft, Eye, AlertCircle, CheckCircle, XCircle,
  Send, Clock, Users, Zap, Settings, RefreshCw,
  TrendingUp, BarChart3, Target, Star, Shield,
  MessageSquare, Mail, Smartphone, Globe, Lock,
  Unlock, Play, Pause, Volume2, VolumeX
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'
import AdminFilters from '../../components/AdminFilters'

const ManageNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [showNotificationDetails, setShowNotificationDetails] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState('cards') // cards, table, list
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    high: 0,
    sent: 0
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/notifications')
      const notificationData = response.data || []
      setNotifications(notificationData)
      
      // Calculate stats
      const calculatedStats = {
        total: notificationData.length,
        active: notificationData.filter(n => n.is_active).length,
        high: notificationData.filter(n => n.priority === 'High').length,
        sent: notificationData.filter(n => n.status === 'sent').length
      }
      setStats(calculatedStats)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/admin/notifications/${notificationId}`)
      toast.success('Notification deleted successfully')
      fetchNotifications() // Refresh the list
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const handleToggleNotificationStatus = async (notificationId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/notifications/${notificationId}/status`, {
        is_active: !currentStatus
      })
      toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchNotifications() // Refresh the list
    } catch (error) {
      console.error('Error updating notification status:', error)
      toast.error('Failed to update notification status')
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && notification.is_active) ||
                         (filterStatus === 'inactive' && !notification.is_active)
    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Modern Header */}
      <AdminHeader
        title="Notification Center"
        subtitle="Manage system notifications and announcements"
        icon={Bell}
        iconColor="from-green-600 to-emerald-600"
        onRefresh={fetchNotifications}
        actions={[
          {
            text: "Create Notification",
            icon: Plus,
            onClick: () => setShowCreateModal(true)
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Notifications"
            value={stats.total}
            subtitle="Total"
            icon={Bell}
            iconColor="from-green-500 to-emerald-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={Bell}
            trendText="All notifications"
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Active Notifications"
            value={stats.active}
            subtitle="Active"
            icon={CheckCircle}
            iconColor="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={Play}
            trendText="Currently active"
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="High Priority"
            value={stats.high}
            subtitle="High"
            icon={AlertCircle}
            iconColor="from-red-500 to-red-600"
            bgColor="from-red-500/5 to-rose-500/5"
            borderColor="hover:border-red-300/50"
            shadowColor="hover:shadow-red-500/10"
            trend={true}
            trendIcon={AlertCircle}
            trendText="Urgent notifications"
            trendColor="text-red-600"
          />
          
          <AdminStatsCard
            title="Sent Notifications"
            value={stats.sent}
            subtitle="Sent"
            icon={Send}
            iconColor="from-green-500 to-emerald-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={Send}
            trendText="Delivered to users"
            trendColor="text-green-600"
          />
        </div>

        {/* Modern Filters and Controls */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search notifications..."
          filters={[
            {
              value: filterType,
              onChange: setFilterType,
              options: [
                { value: 'all', label: 'All Types' },
                { value: 'System', label: 'System' },
                { value: 'Feature', label: 'Feature' },
                { value: 'Maintenance', label: 'Maintenance' }
              ]
            },
            {
              value: filterPriority,
              onChange: setFilterPriority,
              options: [
                { value: 'all', label: 'All Priorities' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
              ]
            },
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]
            }
          ]}
          viewModes={[
            { id: 'cards', icon: BarChart3, title: 'Card View' },
            { id: 'table', icon: Settings, title: 'Table View' },
            { id: 'list', icon: MessageSquare, title: 'List View' }
          ]}
          currentViewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={fetchNotifications}
        />

        {/* Modern Notifications Display */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-green-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${notification.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                        {notification.is_active ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{notification.title}</h3>
                        <p className="text-sm text-slate-600 line-clamp-2">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {notification.type}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        notification.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {notification.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedNotification(notification)
                          setShowNotificationDetails(true)
                        }}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-5 w-5" />
                        <span className="text-sm font-medium">View</span>
                      </button>
                      <button className="px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                        <Edit className="h-5 w-5" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleNotificationStatus(notification.id, notification.is_active)}
                        className={`flex items-center px-3 py-2 rounded-xl transition-all duration-200 ${
                          notification.is_active 
                            ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                      >
                        {notification.is_active ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Activate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
              Notifications ({filteredNotifications.length})
            </h3>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Notification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                          <div className="text-sm font-medium text-slate-900">{notification.title}</div>
                          <div className="text-sm text-slate-500">{notification.message}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        notification.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {notification.is_active ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedNotification(notification)
                            setShowNotificationDetails(true)
                          }}
                            className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                          <button className="px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                            <Edit className="h-5 w-5" />
                            <span className="text-sm font-medium">Edit</span>
                          </button>
                        <button
                          onClick={() => handleToggleNotificationStatus(notification.id, notification.is_active)}
                            className={`flex items-center px-2 py-1 rounded-lg transition-all duration-200 ${
                            notification.is_active 
                                ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                                : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                        >
                          {notification.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-green-300/50 transition-all duration-300 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${notification.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                        {notification.is_active ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{notification.title}</h3>
                        <p className="text-slate-600 mb-3">{notification.message}</p>
                        <div className="flex items-center space-x-3">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {notification.type}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            notification.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {notification.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedNotification(notification)
                          setShowNotificationDetails(true)
                        }}
                        className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button className="flex items-center px-3 py-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleNotificationStatus(notification.id, notification.is_active)}
                        className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                          notification.is_active 
                            ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                            : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                        }`}
                      >
                        {notification.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Notification Details Modal */}
        {showNotificationDetails && selectedNotification && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Bell className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Notification Details</h3>
                  </div>
                  <button
                    onClick={() => setShowNotificationDetails(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-slate-900">{selectedNotification.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedNotification.priority)}`}>
                          {selectedNotification.priority}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          selectedNotification.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedNotification.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{selectedNotification.message}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-blue-100 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Type</label>
                  </div>
                      <p className="text-slate-900 font-medium">{selectedNotification.type}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-amber-100 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Priority</label>
                      </div>
                      <p className="text-slate-900 font-medium">{selectedNotification.priority}</p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`p-1 rounded-lg ${selectedNotification.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                          {selectedNotification.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Status</label>
                      </div>
                      <p className="text-slate-900 font-medium">
                        {selectedNotification.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 bg-blue-100 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <label className="text-sm font-semibold text-slate-700">Created</label>
                      </div>
                      <p className="text-slate-900 font-medium">
                        {selectedNotification.created_at ? new Date(selectedNotification.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setShowNotificationDetails(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                      Close
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageNotifications
