import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Download, BarChart3, Users, TrendingUp, Calendar,
  ArrowLeft, FileText, PieChart, Activity, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/reports')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (reportType) => {
    try {
      setGenerating(true)
      const response = await axios.post(`/api/admin/reports/generate`, {
        type: reportType,
        dateRange: '30d' // Default to last 30 days
      })
      
      toast.success('Report generated successfully')
      fetchReports() // Refresh the list
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = async (reportId) => {
    try {
      const response = await axios.get(`/api/admin/reports/${reportId}/download`, {
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report-${reportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Report downloaded successfully')
    } catch (error) {
      console.error('Error downloading report:', error)
      toast.error('Failed to download report')
    }
  }

  const viewReport = async (reportId) => {
    try {
      const response = await axios.get(`/api/admin/reports/${reportId}`)
      setReportData(response.data)
      setSelectedReport(reportId)
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast.error('Failed to load report data')
    }
  }

  const reportTypes = [
    {
      id: 'user-activity',
      name: 'User Activity Report',
      description: 'User registration, login activity, and engagement metrics',
      icon: Users,
      color: 'bg-blue-500',
      metrics: ['Total Users', 'Active Users', 'New Registrations', 'Login Frequency']
    },
    {
      id: 'learning-analytics',
      name: 'Learning Analytics Report',
      description: 'Learning path completion rates and user progress',
      icon: TrendingUp,
      color: 'bg-green-500',
      metrics: ['Completion Rates', 'Module Progress', 'Quiz Scores', 'Learning Time']
    },
    {
      id: 'system-performance',
      name: 'System Performance Report',
      description: 'System health, response times, and error rates',
      icon: Activity,
      color: 'bg-orange-500',
      metrics: ['Response Times', 'Error Rates', 'Uptime', 'Resource Usage']
    },
    {
      id: 'feedback-analysis',
      name: 'Feedback Analysis Report',
      description: 'User feedback trends and satisfaction scores',
      icon: PieChart,
      color: 'bg-purple-500',
      metrics: ['Satisfaction Scores', 'Feedback Volume', 'Response Times', 'Issue Categories']
    }
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
                <Download className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                  <p className="text-sm text-gray-600">Generate and download system reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportTypes.map((report) => {
            const IconComponent = report.icon
            return (
              <div key={report.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 ${report.color} text-white rounded-lg mr-4`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Metrics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {report.metrics.map((metric, index) => (
                        <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => generateReport(report.id)}
                    disabled={generating}
                    className={`w-full ${report.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50`}
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Generated Reports */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Generated Reports</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {reports.length === 0 ? (
              <div className="p-6 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reports generated yet</p>
                <p className="text-sm text-gray-400">Generate a report using the options above</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                        <span>Type: {report.type}</span>
                        <span>Size: {report.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewReport(report.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="text-green-600 hover:text-green-900 flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Report Viewer Modal */}
        {selectedReport && reportData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Report: {reportData.name}</h3>
                  <button
                    onClick={() => {
                      setSelectedReport(null)
                      setReportData(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Report Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Report Summary</h4>
                    <p className="text-sm text-gray-600">{reportData.summary}</p>
                  </div>
                  
                  {/* Key Metrics */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Key Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {reportData.metrics.map((metric, index) => (
                        <div key={index} className="bg-white border rounded-lg p-4">
                          <p className="text-sm text-gray-600">{metric.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Charts/Graphs would go here */}
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Charts and graphs would be displayed here</p>
                    <p className="text-sm text-gray-400">This would show visual representations of the data</p>
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

export default Reports
