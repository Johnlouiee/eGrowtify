import React, { useState, useEffect } from 'react'
import { Bell, Droplets, Scissors, Leaf, Calendar, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SmartAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed
  const [showSettings, setShowSettings] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    watering: true,
    fertilizing: true,
    pruning: true,
    general: true
  })

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - replace with actual API response
      const mockAlerts = [
        {
          id: 1,
          type: 'watering',
          plant_name: 'Tomato Plant',
          garden_name: 'Backyard Garden',
          message: 'Time to water your tomato plant',
          due_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          priority: 'high',
          status: 'pending',
          icon: Droplets,
          color: 'blue'
        },
        {
          id: 2,
          type: 'fertilizing',
          plant_name: 'Basil',
          garden_name: 'Herb Garden',
          message: 'Your basil plant needs fertilizer',
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          priority: 'medium',
          status: 'pending',
          icon: Leaf,
          color: 'green'
        },
        {
          id: 3,
          type: 'pruning',
          plant_name: 'Rose Bush',
          garden_name: 'Flower Garden',
          message: 'Time to prune your rose bush',
          due_date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          priority: 'high',
          status: 'overdue',
          icon: Scissors,
          color: 'red'
        },
        {
          id: 4,
          type: 'general',
          plant_name: 'Lettuce',
          garden_name: 'Vegetable Garden',
          message: 'Check for pests on your lettuce plants',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          priority: 'low',
          status: 'pending',
          icon: Bell,
          color: 'yellow'
        },
        {
          id: 5,
          type: 'watering',
          plant_name: 'Succulent',
          garden_name: 'Indoor Garden',
          message: 'Water your succulent plant',
          due_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          priority: 'medium',
          status: 'completed',
          icon: Droplets,
          color: 'gray'
        }
      ]
      
      setAlerts(mockAlerts)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Error loading alerts')
      setLoading(false)
    }
  }

  const markAsCompleted = async (alertId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'completed' }
            : alert
        )
      )
      
      toast.success('Task marked as completed!')
    } catch (error) {
      toast.error('Error updating task')
    }
  }

  const snoozeAlert = async (alertId, hours = 24) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newDueDate = new Date(Date.now() + hours * 60 * 60 * 1000)
      
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, due_date: newDueDate }
            : alert
        )
      )
      
      toast.success(`Alert snoozed for ${hours} hours`)
    } catch (error) {
      toast.error('Error snoozing alert')
    }
  }

  const updateNotificationSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('Notification settings updated!')
      setShowSettings(false)
    } catch (error) {
      toast.error('Error updating settings')
    }
  }

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'pending':
        return alerts.filter(alert => alert.status === 'pending')
      case 'completed':
        return alerts.filter(alert => alert.status === 'completed')
      case 'overdue':
        return alerts.filter(alert => alert.status === 'overdue')
      default:
        return alerts
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'overdue': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatTimeRemaining = (dueDate) => {
    const now = new Date()
    const diff = dueDate - now
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (diff < 0) {
      const absHours = Math.abs(hours)
      const absDays = Math.abs(days)
      if (absDays > 0) return `${absDays} day${absDays > 1 ? 's' : ''} ago`
      return `${absHours} hour${absHours > 1 ? 's' : ''} ago`
    }
    
    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`
    return 'Due now'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Alerts
            </h1>
            <p className="text-gray-600">
              Stay on top of your garden care with intelligent reminders
            </p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {alerts.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: 'all', label: 'All Alerts', count: alerts.length },
            { key: 'pending', label: 'Pending', count: alerts.filter(a => a.status === 'pending').length },
            { key: 'overdue', label: 'Overdue', count: alerts.filter(a => a.status === 'overdue').length },
            { key: 'completed', label: 'Completed', count: alerts.filter(a => a.status === 'completed').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {getFilteredAlerts().map((alert) => {
            const IconComponent = alert.icon
            return (
              <div key={alert.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg bg-${alert.color}-100`}>
                      <IconComponent className={`h-6 w-6 text-${alert.color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {alert.plant_name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatTimeRemaining(alert.due_date)}</span>
                        </span>
                        <span>{alert.garden_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {alert.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => markAsCompleted(alert.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as completed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => snoozeAlert(alert.id, 24)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Snooze for 24 hours"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {getFilteredAlerts().length === 0 && (
            <div className="card text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No alerts found. Your garden is well-maintained!'
                  : `No ${filter} alerts found.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Notification Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notification Methods</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, push: e.target.checked }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-gray-700">Push notifications</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Alert Types</h4>
                  <div className="space-y-2">
                    {['watering', 'fertilizing', 'pruning', 'general'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={notificationSettings[type]}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, [type]: e.target.checked }))}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700 capitalize">{type} alerts</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={updateNotificationSettings}
                  className="btn-primary flex-1"
                >
                  Save Settings
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SmartAlerts
