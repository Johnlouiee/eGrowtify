import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, Eye, Reply, Trash2, Filter, Search,
  ArrowLeft, Star, Calendar, User, Mail, AlertCircle,
  TrendingUp, Clock, CheckCircle, XCircle, BarChart3,
  Download, MoreHorizontal, Tag, Users, MessageCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDateRange, setFilterDateRange] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/admin/feedbacks')
      
      // Handle both response formats
      const feedbackData = response.data.feedbacks || response.data.feedback_list || response.data || []
      setFeedback(Array.isArray(feedbackData) ? feedbackData : [])
    } catch (error) {
      console.error('Error fetching feedback:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load feedback'
      toast.error(errorMessage)
      // Set empty array on error to prevent UI crashes
      setFeedback([])
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (feedbackId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message')
      return
    }

    try {
      await axios.post(`/admin/feedback/${feedbackId}/update`, {
        status: 'resolved',
        admin_response: replyText
      })
      toast.success('Reply sent successfully')
      setReplyText('')
      setShowFeedbackDetails(false)
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Failed to send reply')
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/admin/feedback/${feedbackId}`)
      toast.success('Feedback deleted successfully')
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error('Failed to delete feedback')
    }
  }

  const handleMarkAsRead = async (feedbackId) => {
    try {
      await axios.post(`/admin/feedback/${feedbackId}/update`, {
        status: 'in_progress'
      })
      toast.success('Feedback marked as read')
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error('Error updating feedback status:', error)
      toast.error('Failed to update feedback status')
    }
  }

  // Calculate feedback statistics
  const getFeedbackStats = () => {
    const total = feedback.length
    const pending = feedback.filter(f => f.status === 'pending').length
    const inProgress = feedback.filter(f => f.status === 'in_progress').length
    const resolved = feedback.filter(f => f.status === 'resolved').length
    const closed = feedback.filter(f => f.status === 'closed').length
    const avgRating = feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : 0
    
    return { total, pending, inProgress, resolved, closed, avgRating }
  }

  const getCategoryStats = () => {
    const categories = feedback.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1
      return acc
    }, {})
    return categories
  }

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    
    // Date filtering
    let matchesDate = true
    if (filterDateRange !== 'all') {
      const itemDate = new Date(item.created_at)
      const now = new Date()
      const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24))
      
      switch (filterDateRange) {
        case 'today':
          matchesDate = daysDiff === 0
          break
        case 'week':
          matchesDate = daysDiff <= 7
          break
        case 'month':
          matchesDate = daysDiff <= 30
          break
        default:
          matchesDate = true
      }
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-green-100 text-green-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-green-100 text-green-800',
      bug: 'bg-red-100 text-red-800',
      feature: 'bg-green-100 text-green-800',
      improvement: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category] || colors.other
  }

  const getCategoryLabel = (category) => {
    const labels = {
      general: 'General',
      bug: 'Bug Report',
      feature: 'Feature Request',
      improvement: 'Improvement',
      other: 'Other'
    }
    return labels[category] || 'Other'
  }

  // Bulk actions
  const handleSelectFeedback = (feedbackId) => {
    setSelectedFeedbacks(prev => 
      prev.includes(feedbackId) 
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFeedbacks.length === filteredFeedback.length) {
      setSelectedFeedbacks([])
    } else {
      setSelectedFeedbacks(filteredFeedback.map(f => f.id))
    }
  }

  const handleBulkStatusUpdate = async (status) => {
    if (selectedFeedbacks.length === 0) {
      toast.error('Please select feedback to update')
      return
    }

    try {
      const promises = selectedFeedbacks.map(id => 
        axios.post(`/admin/feedback/${id}/update`, { status })
      )
      await Promise.all(promises)
      toast.success(`${selectedFeedbacks.length} feedback updated successfully`)
      setSelectedFeedbacks([])
      fetchFeedback()
    } catch (error) {
      toast.error('Failed to update feedback')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFeedbacks.length === 0) {
      toast.error('Please select feedback to delete')
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedFeedbacks.length} feedback? This action cannot be undone.`)) {
      return
    }

    try {
      const promises = selectedFeedbacks.map(id => 
        axios.delete(`/admin/feedback/${id}`)
      )
      await Promise.all(promises)
      toast.success(`${selectedFeedbacks.length} feedback deleted successfully`)
      setSelectedFeedbacks([])
      fetchFeedback()
    } catch (error) {
      toast.error('Failed to delete feedback')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <AdminHeader
        title="Feedback Management"
        subtitle="Review and respond to user feedback"
        icon={MessageSquare}
        iconColor="from-green-600 to-emerald-600"
        showBackButton={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Dashboard */}
        {(() => {
          const stats = getFeedbackStats()
          const categoryStats = getCategoryStats()
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Category Statistics */}
        {(() => {
          const categoryStats = getCategoryStats()
          return (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="text-center">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(category)}`}>
                      {getCategoryLabel(category)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}

        {/* Enhanced Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback by subject, message, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex items-center">
                <Tag className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="general">General</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="improvement">Improvement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFeedbacks.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-green-900">
                  {selectedFeedbacks.length} feedback selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('in_progress')}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Mark as In Progress
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('resolved')}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Mark as Resolved
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('closed')}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Mark as Closed
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedFeedbacks([])}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Feedback ({filteredFeedback.length})
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-green-600 hover:text-green-900 font-medium"
                >
                  {selectedFeedbacks.length === filteredFeedback.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div key={item.id} className={`p-6 hover:bg-gray-50 ${selectedFeedbacks.includes(item.id) ? 'bg-green-50' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedFeedbacks.includes(item.id)}
                      onChange={() => handleSelectFeedback(item.id)}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-700">
                            {item.user_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.user_name}</h4>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {item.user_email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2 space-x-2">
                          <div className="flex items-center">
                            {getRatingStars(item.rating)}
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">{item.subject}</h5>
                        <p className="text-sm text-gray-700 line-clamp-2">{item.message}</p>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(item.created_at).toLocaleString()}
                        {item.admin_response && (
                          <span className="ml-4 text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Admin Replied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedFeedback(item)
                        setShowFeedbackDetails(true)
                      }}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md text-sm font-medium"
                    >
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">View</span>
                    </button>
                    {item.status === 'pending' && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md text-sm font-medium"
                      >
                        Mark as In Progress
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md text-sm font-medium"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredFeedback.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Feedback Details Modal */}
        {showFeedbackDetails && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
                  <button
                    onClick={() => setShowFeedbackDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-lg font-medium text-gray-700">
                        {selectedFeedback.user_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedFeedback.user_name}</h4>
                      <p className="text-gray-600">{selectedFeedback.user_email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">Rating:</span>
                      <div className="flex items-center">
                        {getRatingStars(selectedFeedback.rating)}
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFeedback.status)}`}>
                      {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-medium text-gray-900">{selectedFeedback.subject}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="mb-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedFeedback.category)}`}>
                        {getCategoryLabel(selectedFeedback.category)}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
                    </div>
                  </div>
                  
                  {selectedFeedback.admin_response && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Previous Admin Response</label>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedFeedback.admin_response}</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all"
                      rows="4"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowFeedbackDetails(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReply(selectedFeedback.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Send Reply
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

export default FeedbackManagement
