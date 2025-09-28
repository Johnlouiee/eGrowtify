import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageSquare, Eye, Reply, Trash2, Filter, Search,
  ArrowLeft, Star, Calendar, User, Mail, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFeedbackDetails, setShowFeedbackDetails] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/feedback')
      setFeedback(response.data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast.error('Failed to load feedback')
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
      await axios.post(`/api/admin/feedback/${feedbackId}/reply`, {
        reply: replyText
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
      await axios.delete(`/api/admin/feedback/${feedbackId}`)
      toast.success('Feedback deleted successfully')
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error('Error deleting feedback:', error)
      toast.error('Failed to delete feedback')
    }
  }

  const handleMarkAsRead = async (feedbackId) => {
    try {
      await axios.patch(`/api/admin/feedback/${feedbackId}/status`, {
        status: 'read'
      })
      toast.success('Feedback marked as read')
      fetchFeedback() // Refresh the list
    } catch (error) {
      console.error('Error updating feedback status:', error)
      toast.error('Failed to update feedback status')
    }
  }

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-green-100 text-green-800'
      case 'replied': return 'bg-purple-100 text-purple-800'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
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
              <Link 
                to="/admin" 
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Admin Dashboard
              </Link>
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
                  <p className="text-sm text-gray-600">Review and respond to user feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback by message or user..."
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
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Feedback ({filteredFeedback.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
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
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-4">
                          {getRatingStars(item.rating)}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.message}</p>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        setSelectedFeedback(item)
                        setShowFeedbackDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {item.status !== 'replied' && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900">{selectedFeedback.message}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reply</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
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
