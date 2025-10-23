import React, { useState, useEffect } from 'react'
import { Bell, Droplets, Scissors, Leaf, Calendar, Settings, CheckCircle, AlertCircle, Clock, BarChart3, TrendingUp, Eye, Download, FileText, Sun, Cloud, Thermometer, Wind, Droplets as WaterDrop, Zap, Shield, Bug, Heart, X, ArrowRight } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SmartAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, completed
  const [showSettings, setShowSettings] = useState(false)
  const [showProgressReports, setShowProgressReports] = useState(false)
  const [progressReports, setProgressReports] = useState([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    watering: true,
    fertilizing: true,
    pruning: true,
    general: true,
    weather: true,
    pest: true,
    growth: true
  })

  useEffect(() => {
    fetchAlerts()
    fetchProgressReports()
  }, [])

  // Helper functions for alert formatting
  const getAlertIcon = (type) => {
    const iconMap = {
      'watering': WaterDrop,
      'fertilizing': Leaf,
      'pruning': Scissors,
      'pest': Bug,
      'weather': Thermometer,
      'growth': TrendingUp
    }
    return iconMap[type] || Bell
  }

  const getAlertColor = (priority, status) => {
    if (status === 'completed') return 'gray'
    if (status === 'overdue') return 'red'
    if (priority === 'high') return 'red'
    if (priority === 'medium') return 'yellow'
    return 'blue'
  }

  const getAlertDetails = (type, plantName) => {
    const detailsMap = {
      'watering': `Water your ${plantName} thoroughly. Check soil moisture before watering.`,
      'fertilizing': `Feed your ${plantName} with appropriate fertilizer. Follow package instructions.`,
      'pruning': `Prune your ${plantName} to maintain shape and encourage growth.`,
      'pest': `Check your ${plantName} for signs of pests. Use organic treatments when possible.`,
      'weather': `Monitor weather conditions and adjust care for your ${plantName}.`,
      'growth': `Your ${plantName} is showing good growth. Continue current care routine.`
    }
    return detailsMap[type] || `Care reminder for your ${plantName}.`
  }

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      
      // Call the real backend alerts endpoint
      const response = await axios.get('/api/smart-alerts')
      const alerts = response.data.alerts || []
      const completedActions = response.data.completed_actions || []
      
      // Transform backend alerts to frontend format
      const transformedAlerts = alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        plant_name: alert.plant_name,
        garden_name: alert.garden_name,
        message: alert.message,
        due_date: new Date(alert.due_date),
        priority: alert.priority,
        status: alert.status,
        icon: getAlertIcon(alert.type),
        color: getAlertColor(alert.priority, alert.status),
        details: getAlertDetails(alert.type, alert.plant_name)
      }))
      
      // Transform completed actions to frontend format
      const transformedCompletedActions = completedActions.map(action => ({
        id: action.id,
        type: action.type,
        plant_name: action.plant_name,
        garden_name: action.garden_name,
        message: `${action.plant_name} ${action.type}ed successfully`,
        due_date: new Date(action.action_date),
        priority: 'low',
        status: 'completed',
        icon: getAlertIcon(action.type),
        color: 'gray',
        details: `Completed ${action.type}ing for ${action.plant_name} on ${new Date(action.action_date).toLocaleDateString()}`
      }))
      
      // Combine alerts and completed actions
      const allAlerts = [...transformedAlerts, ...transformedCompletedActions]
      setAlerts(allAlerts)
      
      // Show success message if we have real alerts
      if (alerts.length > 0) {
        console.log(`Loaded ${alerts.length} real alerts from backend`)
      }
      
      if (completedActions.length > 0) {
        console.log(`Loaded ${completedActions.length} completed actions from backend`)
      }
      
      // Show empty state if no alerts
      if (alerts.length === 0) {
        console.log('No alerts found - showing empty state')
        // Remove mock data fallback
      } else {
        // Keep the mock data for now but don't use it
        const mockAlerts = [
        {
          id: 1,
          type: 'watering',
          plant_name: 'Tomato Plant',
          garden_name: 'Backyard Garden',
          message: 'Time to water your tomato plant - soil moisture is at 20%',
          due_date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          priority: 'high',
          status: 'pending',
          icon: WaterDrop,
          color: 'blue',
          details: 'Optimal watering time: early morning. Use 1-2 inches of water.'
        },
        {
          id: 2,
          type: 'fertilizing',
          plant_name: 'Basil',
          garden_name: 'Herb Garden',
          message: 'Your basil plant needs fertilizer - last fed 3 weeks ago',
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          priority: 'medium',
          status: 'pending',
          icon: Leaf,
          color: 'green',
          details: 'Use balanced liquid fertilizer diluted to half strength.'
        },
        {
          id: 3,
          type: 'pruning',
          plant_name: 'Rose Bush',
          garden_name: 'Flower Garden',
          message: 'Time to prune your rose bush - deadheading needed',
          due_date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          priority: 'high',
          status: 'overdue',
          icon: Scissors,
          color: 'red',
          details: 'Remove spent blooms to encourage new growth. Cut at 45-degree angle.'
        },
        {
          id: 4,
          type: 'pest',
          plant_name: 'Lettuce',
          garden_name: 'Vegetable Garden',
          message: 'Potential aphid activity detected on lettuce plants',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          priority: 'medium',
          status: 'pending',
          icon: Bug,
          color: 'yellow',
          details: 'Check undersides of leaves. Use neem oil spray if confirmed.'
        },
        {
          id: 5,
          type: 'weather',
          plant_name: 'All Plants',
          garden_name: 'All Gardens',
          message: 'High temperature warning - 95°F expected tomorrow',
          due_date: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
          priority: 'high',
          status: 'pending',
          icon: Thermometer,
          color: 'red',
          details: 'Provide extra shade and increase watering frequency.'
        },
        {
          id: 6,
          type: 'growth',
          plant_name: 'Pepper Plant',
          garden_name: 'Vegetable Garden',
          message: 'Pepper plant showing excellent growth - 15% increase this week',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          priority: 'low',
          status: 'pending',
          icon: TrendingUp,
          color: 'green',
          details: 'Continue current care routine. Consider staking if needed.'
        },
        {
          id: 7,
          type: 'watering',
          plant_name: 'Succulent',
          garden_name: 'Indoor Garden',
          message: 'Water your succulent plant',
          due_date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          priority: 'medium',
          status: 'completed',
          icon: WaterDrop,
          color: 'gray',
          details: 'Watered with 1/4 cup of water as recommended.'
        }
      ]
      
      // setAlerts(mockAlerts) // Disabled mock data
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Error loading alerts')
      setLoading(false)
    }
  }

  const fetchProgressReports = async () => {
    try {
      setReportsLoading(true)
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock progress reports data
      const mockProgressReports = [
        {
          id: 1,
          title: 'Weekly Garden Health Report',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          type: 'weekly',
          summary: 'Overall garden health improved by 12% this week',
          metrics: {
            plantsHealthy: 15,
            plantsNeedingAttention: 3,
            tasksCompleted: 8,
            growthRate: 12
          },
          insights: [
            'Tomato plants showing excellent growth',
            'Basil needs more frequent watering',
            'Rose bush requires pruning'
          ],
          recommendations: [
            'Increase watering frequency for herbs',
            'Apply fertilizer to flowering plants',
            'Check for pest activity on lettuce'
          ]
        },
        {
          id: 2,
          title: 'Monthly Growth Analysis',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          type: 'monthly',
          summary: 'Significant growth across all plant categories',
          metrics: {
            plantsHealthy: 18,
            plantsNeedingAttention: 2,
            tasksCompleted: 35,
            growthRate: 25
          },
          insights: [
            'Pepper plants doubled in size',
            'Herb garden thriving with new additions',
            'Vegetable yield increased by 30%'
          ],
          recommendations: [
            'Consider expanding vegetable garden',
            'Add more herbs to maximize space',
            'Plan for fall planting season'
          ]
        },
        {
          id: 3,
          title: 'Seasonal Planning Report',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          type: 'seasonal',
          summary: 'Spring planting season preparation complete',
          metrics: {
            plantsHealthy: 20,
            plantsNeedingAttention: 1,
            tasksCompleted: 12,
            growthRate: 18
          },
          insights: [
            'Soil preparation successful',
            'Seed starting on schedule',
            'Weather conditions optimal'
          ],
          recommendations: [
            'Begin hardening off seedlings',
            'Prepare garden beds for transplanting',
            'Monitor for late frost warnings'
          ]
        }
      ]
      
      setProgressReports(mockProgressReports)
    } catch (error) {
      console.error('Error fetching progress reports:', error)
      toast.error('Error loading progress reports')
    } finally {
      setReportsLoading(false)
    }
  }

  const markAsCompleted = async (alertId) => {
    try {
      // Find the alert to get its type
      const alert = alerts.find(a => a.id === alertId)
      if (!alert) {
        toast.error('Alert not found')
        return
      }
      
      // Map alert type to action
      const actionMap = {
        'watering': 'water',
        'fertilizing': 'fertilize', 
        'pruning': 'prune'
      }
      
      const action = actionMap[alert.type]
      if (!action) {
        toast.error('Cannot mark this type of alert as completed')
        return
      }
      
      // Call backend to mark alert as completed
      const response = await axios.post('/api/alerts/mark-completed', {
        alert_id: alertId,
        action: action
      })
      
      if (response.data.success) {
        // Update local state
        setAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: 'completed' }
              : alert
          )
        )
        
        toast.success(response.data.message)
      } else {
        throw new Error(response.data.error || 'Failed to mark alert as completed')
      }
    } catch (error) {
      console.error('Error marking alert as completed:', error)
      toast.error('Failed to mark alert as completed')
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

  const downloadProgressReport = async (reportId) => {
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Progress report downloaded successfully!')
    } catch (error) {
      toast.error('Error downloading report')
    }
  }

  const viewReportDetails = (report) => {
    // For now, just show an alert with report details
    // In a real app, this would open a detailed view or navigate to a report page
    const details = `
Title: ${report.title}
Date: ${new Date(report.date).toLocaleDateString()}
Type: ${report.type}
Summary: ${report.summary}

Metrics:
- Healthy Plants: ${report.metrics.plantsHealthy}
- Plants Needing Attention: ${report.metrics.plantsNeedingAttention}
- Tasks Completed: ${report.metrics.tasksCompleted}
- Growth Rate: ${report.metrics.growthRate}%

Key Insights:
${report.insights.map(insight => `• ${insight}`).join('\n')}

Recommendations:
${report.recommendations.map(rec => `• ${rec}`).join('\n')}
    `
    
    // Create a temporary textarea to copy the details
    const textarea = document.createElement('textarea')
    textarea.value = details
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    
    toast.success('Report details copied to clipboard!')
  }

  const generateNewReport = async () => {
    try {
      setReportsLoading(true)
      // Simulate generating a new report
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newReport = {
        id: Date.now(),
        title: 'Latest Garden Health Report',
        date: new Date(),
        type: 'weekly',
        summary: 'Fresh analysis of your garden\'s current status and growth patterns',
        metrics: {
          plantsHealthy: Math.floor(Math.random() * 10) + 15,
          plantsNeedingAttention: Math.floor(Math.random() * 5) + 1,
          tasksCompleted: Math.floor(Math.random() * 10) + 8,
          growthRate: Math.floor(Math.random() * 20) + 10
        },
        insights: [
          'Recent weather conditions have been optimal for growth',
          'Watering schedule adjustments showing positive results',
          'New plant additions are adapting well to garden environment'
        ],
        recommendations: [
          'Continue current watering routine',
          'Consider adding more companion plants',
          'Monitor soil pH levels for optimal nutrition'
        ]
      }
      
      setProgressReports(prev => [newReport, ...prev])
      toast.success('New progress report generated!')
    } catch (error) {
      toast.error('Error generating new report')
    } finally {
      setReportsLoading(false)
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
              Smart Alerts & Reports
            </h1>
            <p className="text-gray-600">
              Stay on top of your garden care with intelligent reminders and progress tracking
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowProgressReports(true)
                if (progressReports.length === 0) {
                  fetchProgressReports()
                }
              }}
              className="btn-secondary flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>View Reports</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          </div>
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
                      
                      {alert.details && (
                        <p className="text-sm text-gray-500 mb-2 italic">{alert.details}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatTimeRemaining(alert.due_date)}</span>
                        </span>
                        <span>{alert.garden_name}</span>
                        <span className="capitalize">{alert.type}</span>
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

        {/* Progress Reports Modal */}
        {showProgressReports && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Progress Reports</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={generateNewReport}
                      disabled={reportsLoading}
                      className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reportsLoading ? 'Generating...' : 'Generate New'}
                    </button>
                    <button
                      onClick={fetchProgressReports}
                      disabled={reportsLoading}
                      className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Refresh Reports"
                    >
                      <Clock className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowProgressReports(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">Track your garden's progress and performance</p>
              </div>
              
              <div className="p-6 space-y-6">
                {reportsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading progress reports...</p>
                  </div>
                ) : progressReports.length > 0 ? (
                  progressReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(report.date).toLocaleDateString()} • {report.type}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => downloadProgressReport(report.id)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                          title="Download Report"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => viewReportDetails(report)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{report.summary}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{report.metrics.plantsHealthy}</div>
                        <div className="text-sm text-gray-600">Healthy Plants</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{report.metrics.plantsNeedingAttention}</div>
                        <div className="text-sm text-gray-600">Need Attention</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{report.metrics.tasksCompleted}</div>
                        <div className="text-sm text-gray-600">Tasks Done</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{report.metrics.growthRate}%</div>
                        <div className="text-sm text-gray-600">Growth Rate</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Key Insights
                        </h5>
                        <ul className="space-y-1">
                          {report.insights.map((insight, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Recommendations
                        </h5>
                        <ul className="space-y-1">
                          {report.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <ArrowRight className="h-3 w-3 text-primary-500 mt-0.5 mr-2 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No progress reports available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                    {['watering', 'fertilizing', 'pruning', 'general', 'weather', 'pest', 'growth'].map((type) => (
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
