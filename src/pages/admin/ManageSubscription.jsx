import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  CreditCard, Users, TrendingUp, DollarSign, Calendar,
  ArrowLeft, Eye, Edit, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ManageSubscription = () => {
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalSubscribers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    subscriptionRate: 0
  })
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      // Fetch subscription statistics
      const [statsRes, subscribersRes] = await Promise.all([
        axios.get('/api/admin/subscription/stats'),
        axios.get('/api/admin/subscription/subscribers')
      ])
      
      setSubscriptionStats(statsRes.data)
      setSubscribers(subscribersRes.data)
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      toast.error('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSubscription = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/subscription/${userId}/toggle`, {
        subscribed: !currentStatus
      })
      toast.success(`Subscription ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchSubscriptionData() // Refresh the data
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription data...</p>
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
                <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Manage Subscriptions</h1>
                  <p className="text-sm text-gray-600">Monitor and manage user subscriptions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.totalSubscribers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.activeSubscriptions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${subscriptionStats.monthlyRevenue}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subscription Rate</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.subscriptionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Subscribers ({subscribers.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {subscriber.firstname.charAt(0)}{subscriber.lastname.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subscriber.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {subscriber.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        subscriber.subscribed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.subscribed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Subscribed
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Subscribed
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscriber.subscribed ? 'Premium Plan' : 'Free Plan'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleSubscription(subscriber.id, subscriber.subscribed)}
                          className={`flex items-center ${
                            subscriber.subscribed 
                              ? 'text-orange-600 hover:text-orange-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {subscriber.subscribed ? 'Cancel Subscription' : 'Activate Subscription'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Plans Management */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Free Plan</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-sm text-gray-500">/month</span></p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Basic plant tracking</li>
                <li>• Limited AI recognition</li>
                <li>• Community access</li>
              </ul>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Edit Plan
              </button>
            </div>
            
            <div className="border border-purple-200 rounded-lg p-6 bg-purple-50">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Plan</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">$9.99<span className="text-sm text-gray-500">/month</span></p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Unlimited plant tracking</li>
                <li>• Advanced AI recognition</li>
                <li>• Priority support</li>
                <li>• Exclusive content</li>
              </ul>
              <button className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Edit Plan
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan</h4>
              <p className="text-3xl font-bold text-gray-900 mb-4">$19.99<span className="text-sm text-gray-500">/month</span></p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Everything in Premium</li>
                <li>• Expert consultations</li>
                <li>• Custom garden plans</li>
                <li>• API access</li>
              </ul>
              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Edit Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageSubscription
