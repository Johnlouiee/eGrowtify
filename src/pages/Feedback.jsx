import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MessageSquare, Star, Send, ThumbsUp, ThumbsDown, Clock, User } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Feedback = () => {
  const { user } = useAuth()
  const [feedbackForm, setFeedbackForm] = useState({
    subject: '',
    message: '',
    rating: 5,
    category: 'general'
  })
  const [userFeedbacks, setUserFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserFeedbacks()
    }
  }, [user])

  const fetchUserFeedbacks = async () => {
    try {
      const response = await axios.get('/feedback/user')
      setUserFeedbacks(response.data.feedbacks || [])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setSubmitting(true)
    
    try {
      const response = await axios.post('/feedback/submit', feedbackForm)
      
      if (response.data.success) {
        toast.success('Feedback submitted successfully!')
        setFeedbackForm({
          subject: '',
          message: '',
          rating: 5,
          category: 'general'
        })
        fetchUserFeedbacks()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting feedback'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRatingChange = (rating) => {
    setFeedbackForm({ ...feedbackForm, rating })
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      bug: 'bg-red-100 text-red-800',
      feature: 'bg-green-100 text-green-800',
      improvement: 'bg-purple-100 text-purple-800',
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    }
    return labels[status] || 'Pending'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback & Support</h1>
          <p className="text-gray-600 mt-2">
            Share your thoughts, report issues, or request new features to help us improve eGrowtify
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">Submit Feedback</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.subject}
                    onChange={(e) => setFeedbackForm({...feedbackForm, subject: e.target.value})}
                    className="input-field"
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={feedbackForm.category}
                    onChange={(e) => setFeedbackForm({...feedbackForm, category: e.target.value})}
                    className="input-field"
                  >
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="improvement">Improvement Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center space-x-2">
                    {getRatingStars(feedbackForm.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {feedbackForm.rating} out of 5
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingChange(rating)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            rating <= feedbackForm.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                    className="input-field"
                    rows="6"
                    placeholder="Please provide detailed feedback, suggestions, or describe any issues you've encountered..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    * Required fields
                  </div>
                </div>
              </form>
            </div>

            {/* Feedback Guidelines */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific and descriptive in your feedback</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include steps to reproduce if reporting a bug</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Suggest improvements or alternatives when possible</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>We review all feedback and respond within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Feedback</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Submitted:</span>
                  <span className="text-lg font-semibold text-gray-900">{userFeedbacks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {userFeedbacks.filter(f => f.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resolved:</span>
                  <span className="text-sm font-medium text-green-600">
                    {userFeedbacks.filter(f => f.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Immediate Help?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>For urgent issues or technical support:</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-900">Email Support</p>
                  <p className="text-blue-700">support@egrowtify.com</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-green-900">Live Chat</p>
                  <p className="text-green-700">Available 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Previous Feedback */}
        {userFeedbacks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Previous Feedback</h2>
            <div className="space-y-4">
              {userFeedbacks.map((feedback) => (
                <div key={feedback.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{feedback.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                          {getCategoryLabel(feedback.category)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                          {getStatusLabel(feedback.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{feedback.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{feedback.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {feedback.admin_response && (
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-primary-600" />
                        <span className="text-sm font-medium text-gray-900">Admin Response</span>
                      </div>
                      <p className="text-gray-700 text-sm">{feedback.admin_response}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feedback

