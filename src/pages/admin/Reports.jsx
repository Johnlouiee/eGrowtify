import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Download, BarChart3, Users, TrendingUp, Calendar,
  ArrowLeft, FileText, PieChart, Activity, AlertCircle,
  DollarSign, Crown, Star, Eye, Clock, Target,
  CheckCircle, XCircle, Zap, Globe, RefreshCw
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'

const Reports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [userActivity, setUserActivity] = useState([])
  const [incomeStats, setIncomeStats] = useState({
    monthlyIncome: 0,
    dailyIncome: 0,
    totalRevenue: 0,
    subscriptionRevenue: 0,
    conversionRate: 0,
    churnRate: 0,
    averageRevenuePerUser: 0,
    newSubscribersToday: 0,
    newSubscribersThisMonth: 0
  })
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    premiumUsers: 0,
    basicUsers: 0,
    subscriptionRate: 0
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [reportsRes, activityRes, incomeRes, subscriptionRes] = await Promise.all([
        axios.get('/api/admin/reports'),
        axios.get('/api/admin/user-activity'),
        axios.get('/api/admin/income-stats'),
        axios.get('/api/admin/subscription-stats')
      ])
      
      setReports(reportsRes.data)
      setUserActivity(activityRes.data)
      setIncomeStats(incomeRes.data)
      setSubscriptionStats(subscriptionRes.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Mock data for demonstration
      setUserActivity([
        {
          id: 1,
          user: 'John Doe',
          email: 'john@example.com',
          activity: 'Logged in',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          subscription: 'Premium',
          isActive: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: 2,
          user: 'Jane Smith',
          email: 'jane@example.com',
          activity: 'Completed lesson',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          subscription: 'Basic',
          isActive: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: 3,
          user: 'Bob Johnson',
          email: 'bob@example.com',
          activity: 'Upgraded to Premium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          subscription: 'Premium',
          isActive: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4)
        }
      ])
      
      setIncomeStats({
        monthlyIncome: 2450.00,
        dailyIncome: 81.67,
        totalRevenue: 12500.00,
        subscriptionRevenue: 2450.00,
        conversionRate: 12.5,
        churnRate: 3.2,
        averageRevenuePerUser: 8.50,
        newSubscribersToday: 3,
        newSubscribersThisMonth: 45
      })
      
      setSubscriptionStats({
        totalSubscribers: 195,
        activeSubscribers: 180,
        premiumUsers: 45,
        basicUsers: 150,
        subscriptionRate: 23.1
      })
      
      toast.error('Failed to load reports - showing mock data')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <AdminHeader
        title="Reports & Analytics"
        subtitle="Generate and download system reports"
        icon={Download}
        iconColor="from-orange-600 to-red-600"
        showBackButton={true}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Income & Subscription Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AdminStatsCard
              title="Monthly Income"
              value={`$${incomeStats.monthlyIncome.toLocaleString()}`}
              subtitle="This Month"
              icon={DollarSign}
              iconColor="from-green-500 to-green-600"
              bgColor="from-green-500/5 to-emerald-500/5"
              borderColor="hover:border-green-300/50"
              shadowColor="hover:shadow-green-500/10"
              trend={true}
              trendIcon={TrendingUp}
              trendText={`+${incomeStats.newSubscribersThisMonth} new subscribers`}
              trendColor="text-green-600"
            />
            
            <AdminStatsCard
              title="Daily Income"
              value={`$${incomeStats.dailyIncome.toFixed(2)}`}
              subtitle="Today"
              icon={Clock}
              iconColor="from-blue-500 to-blue-600"
              bgColor="from-blue-500/5 to-indigo-500/5"
              borderColor="hover:border-blue-300/50"
              shadowColor="hover:shadow-blue-500/10"
              trend={true}
              trendIcon={Target}
              trendText={`${incomeStats.newSubscribersToday} new today`}
              trendColor="text-blue-600"
            />
            
            <AdminStatsCard
              title="Total Revenue"
              value={`$${incomeStats.totalRevenue.toLocaleString()}`}
              subtitle="All Time"
              icon={Crown}
              iconColor="from-purple-500 to-purple-600"
              bgColor="from-purple-500/5 to-violet-500/5"
              borderColor="hover:border-purple-300/50"
              shadowColor="hover:shadow-purple-500/10"
              trend={true}
              trendIcon={Star}
              trendText={`$${incomeStats.averageRevenuePerUser} ARPU`}
              trendColor="text-purple-600"
            />
            
            <AdminStatsCard
              title="Conversion Rate"
              value={`${incomeStats.conversionRate}%`}
              subtitle="Premium"
              icon={Target}
              iconColor="from-orange-500 to-orange-600"
              bgColor="from-orange-500/5 to-amber-500/5"
              borderColor="hover:border-orange-300/50"
              shadowColor="hover:shadow-orange-500/10"
              trend={true}
              trendIcon={CheckCircle}
              trendText={`${incomeStats.churnRate}% churn rate`}
              trendColor="text-orange-600"
            />
          </div>

          {/* User Activity & Subscription Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Recent User Activity</h3>
                  </div>
                  <button
                    onClick={fetchReports}
                    className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Refresh</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {userActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          activity.subscription === 'Premium' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-r from-blue-400 to-blue-500'
                        }`}>
                          {activity.subscription === 'Premium' ? (
                            <Crown className="h-5 w-5 text-white" />
                          ) : (
                            <Users className="h-5 w-5 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900 truncate">{activity.user}</p>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            activity.subscription === 'Premium' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {activity.subscription}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{activity.activity}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.isActive ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <PieChart className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Subscription Overview</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Total Users</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{subscriptionStats.totalSubscribers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Active Users</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{subscriptionStats.activeSubscribers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Crown className="h-4 w-4 text-yellow-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Premium Users</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{subscriptionStats.premiumUsers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Basic Users</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{subscriptionStats.basicUsers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Subscription Rate</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{subscriptionStats.subscriptionRate}%</span>
                </div>
              </div>
            </div>
          </div>

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
