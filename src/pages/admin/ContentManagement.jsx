import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Settings, BookOpen, Database, Bell, Calendar, RotateCcw,
  ArrowLeft, Edit, Save, Eye, Trash2, Plus, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('learning-paths')
  const [learningPaths, setLearningPaths] = useState([])
  const [aiData, setAiData] = useState([])
  const [notifications, setNotifications] = useState([])
  const [seasonalContent, setSeasonalContent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContentData()
  }, [])

  const fetchContentData = async () => {
    try {
      setLoading(true)
      // Fetch all content data
      const [pathsRes, aiRes, notifRes, seasonalRes] = await Promise.all([
        axios.get('/api/admin/learning-paths'),
        axios.get('/api/admin/ai-data'),
        axios.get('/api/admin/notifications'),
        axios.get('/api/admin/seasonal-content')
      ])
      
      setLearningPaths(pathsRes.data)
      setAiData(aiRes.data)
      setNotifications(notifRes.data)
      setSeasonalContent(seasonalRes.data)
    } catch (error) {
      console.error('Error fetching content data:', error)
      toast.error('Failed to load content data')
    } finally {
      setLoading(false)
    }
  }

  const handleRollback = async (contentType, contentId) => {
    if (!window.confirm('Are you sure you want to rollback this content? This action cannot be undone.')) {
      return
    }

    try {
      await axios.post(`/api/admin/rollback/${contentType}/${contentId}`)
      toast.success('Content rolled back successfully')
      fetchContentData() // Refresh data
    } catch (error) {
      console.error('Error rolling back content:', error)
      toast.error('Failed to rollback content')
    }
  }

  const tabs = [
    { id: 'learning-paths', name: 'Learning Paths', icon: BookOpen },
    { id: 'ai-data', name: 'AI Data', icon: Database },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'seasonal', name: 'Seasonal Content', icon: Calendar }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <AdminHeader
        title="Content Management"
        subtitle="Manage system content and configurations"
        icon={Settings}
        iconColor="from-green-600 to-emerald-600"
        showBackButton={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'learning-paths' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Learning Paths</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Learning Path
                </button>
              </div>
              
              <div className="space-y-4">
                {learningPaths.map((path) => (
                  <div key={path.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{path.title}</h4>
                        <p className="text-sm text-gray-600">{path.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Modules: {path.modules_count}</span>
                          <span>Difficulty: {path.difficulty}</span>
                          <span>Status: {path.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRollback('learning-path', path.id)}
                          className="text-orange-600 hover:text-orange-900 flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Rollback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai-data' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">AI Recognition Data</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Data
                </button>
              </div>
              
              <div className="space-y-4">
                {aiData.map((data) => (
                  <div key={data.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{data.name}</h4>
                        <p className="text-sm text-gray-600">{data.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {data.type}</span>
                          <span>Accuracy: {data.accuracy}%</span>
                          <span>Last Updated: {new Date(data.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRollback('ai-data', data.id)}
                          className="text-orange-600 hover:text-orange-900 flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Rollback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">System Notifications</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Notification
                </button>
              </div>
              
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {notification.type}</span>
                          <span>Priority: {notification.priority}</span>
                          <span>Status: {notification.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRollback('notification', notification.id)}
                          className="text-orange-600 hover:text-orange-900 flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Rollback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seasonal' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Seasonal Planning Content</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Seasonal Content
                </button>
              </div>
              
              <div className="space-y-4">
                {seasonalContent.map((content) => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{content.season}</h4>
                        <p className="text-sm text-gray-600">{content.description}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Month: {content.month}</span>
                          <span>Region: {content.region}</span>
                          <span>Last Updated: {new Date(content.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 flex items-center">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRollback('seasonal', content.id)}
                          className="text-orange-600 hover:text-orange-900 flex items-center"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Rollback
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContentManagement
