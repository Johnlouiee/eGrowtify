import React, { useMemo, useState, useEffect } from 'react'
import { Check, X, Star, Leaf, Droplets, Zap, Crown, ArrowRight, CreditCard, Wallet, Smartphone, MoreHorizontal, Calendar, Download, Eye, Settings, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import authService from '../services/authService'

const Subscription = () => {
  const { isPremium, refreshAuthStatus } = useAuth()

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('demo')
  const [gcashNumber, setGcashNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const [billingHistory, setBillingHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCancelWarning, setShowCancelWarning] = useState(false)

  const priceDisplay = useMemo(() => ({ amount: '150', currency: 'PHP', plan: 'Premium Plan' }), [])

  useEffect(() => {
    if (isPremium) {
      fetchSubscriptionDetails()
    }
  }, [isPremium])

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true)
      
      // Fetch real subscription details from backend
      const response = await axios.get('/api/subscription/details')
      
      if (response.data.success && response.data.subscription) {
        const subscription = response.data.subscription
        setSubscriptionDetails({
          plan: subscription.plan,
          status: subscription.status,
          startDate: subscription.startDate,
          nextBillingDate: subscription.nextBillingDate,
          amount: subscription.amount,
          currency: subscription.currency,
          paymentMethod: subscription.paymentMethod,
          autoRenew: subscription.autoRenew,
          features: subscription.features
        })
        
        // Mock billing history for now (can be enhanced later with real data)
        const mockBillingHistory = [
          {
            id: 1,
            date: subscription.startDate || new Date().toISOString().split('T')[0],
            amount: subscription.amount || 150.00,
            status: 'paid',
            description: `${subscription.plan || 'Premium Plan'} Subscription - GCash`,
            invoiceUrl: '#'
          }
        ]
        setBillingHistory(mockBillingHistory)
      } else {
        // No active subscription found
        setSubscriptionDetails(null)
        setBillingHistory([])
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error)
      if (error.response?.status === 404) {
        // No subscription found - this is okay for basic plan users
        setSubscriptionDetails(null)
        setBillingHistory([])
      } else {
        toast.error('Failed to load subscription details')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true)
      setError('')
      
      // Process subscription upgrade via backend
      console.log('💰 SUBSCRIPTION: Processing Premium upgrade')
      console.log('💰 SUBSCRIPTION: Amount: ₱150/month')
      
      // Show payment processing message
      toast.success('Processing subscription upgrade...')
      
      // Call backend subscription endpoint
      const response = await axios.post('/api/subscription/upgrade', {
        plan_type: 'premium',
        payment_method: paymentMethod,
        gcash_number: paymentMethod === 'gcash' ? cleanedGcashNumber : null
      })
      
      console.log('💰 SUBSCRIPTION: Backend response:', response.data)
      
      if (response.data.success) {
        toast.success('Subscription upgrade successful! You now have Premium access.')
        setShowUpgradeModal(false)
        // Reset form
        setGcashNumber('')
        setPaymentMethod('gcash')
        
        // Clear auth cache to force fresh data
        authService.clearCache()
        
        // Force refresh auth status to update isPremium (bypass debounce)
        await refreshAuthStatus(true)
        
        // Refresh subscription details to update UI
        await fetchSubscriptionDetails()
        
        // Wait a moment for state to update, then refresh page to ensure all components update
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        throw new Error(response.data.error || 'Subscription failed')
      }
    } catch (error) {
      setError('Failed to upgrade subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDowngrade = async () => {
    if (window.confirm('Are you sure you want to downgrade your subscription? You will lose access to Premium features including advanced learning paths and 6x6 garden grids at the end of your billing period.')) {
      try {
        setIsProcessing(true)
        setError('')
        
        // Call backend subscription downgrade endpoint
        const response = await axios.post('/api/subscription/downgrade')
        
        if (response.data.success) {
          toast.success('Subscription downgraded successfully. You will retain Premium access until the end of your billing period.')
          setShowSubscriptionDetails(false)
          
          // Refresh auth status to update isPremium
          await refreshAuthStatus()
          
          // Refresh subscription details
          fetchSubscriptionDetails()
        } else {
          throw new Error(response.data.error || 'Subscription downgrade failed')
        }
      } catch (error) {
        console.error('Subscription downgrade error:', error)
        toast.error('Failed to downgrade subscription. Please try again.')
        setError('Failed to downgrade subscription. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleCancelSubscription = () => {
    setShowCancelWarning(true)
  }

  const confirmCancel = async () => {
    setShowCancelWarning(false)
    try {
      setIsProcessing(true)
      setError('')
      
      // Call backend subscription cancellation endpoint
      const response = await axios.post('/api/subscription/cancel')
      
      if (response.data.success) {
        toast.success('Subscription cancelled successfully. You have been reverted to the basic plan.')
        setShowSubscriptionDetails(false)
        
        // Refresh auth status to update isPremium
        await refreshAuthStatus()
        
        // Refresh subscription details
        fetchSubscriptionDetails()
      } else {
        throw new Error(response.data.error || 'Subscription cancellation failed')
      }
    } catch (error) {
      console.error('Subscription cancellation error:', error)
      toast.error('Failed to cancel subscription. Please try again.')
      setError('Failed to cancel subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const freeFeatures = {
    plants: [
      "2 free plant analyses per month",
      "Basic plant identification",
      "General care guidelines"
    ],
    soil: [
      "2 free soil analyses per month",
      "Basic moisture level detection",
      "Simple texture indication"
    ],
    grid: [
      "3x3 grid planner",
      "Basic garden layout"
    ]
  }

  const premiumFeatures = {
    plants: [
      "10 free plant analyses per month",
      "Advanced pest identification and treatment",
      "Ideal placement recommendations",
      "Detailed improvement suggestions with step-by-step guides"
    ],
    soil: [
      "10 free soil analyses per month",
      "Detailed texture breakdown (e.g., 'Soil is 70% sand, 20% silt, 10% clay')",
      "Recommended plants with scientific names",
      "Specific fertilizer recommendations"
    ],
    grid: [
      "6x6 grid planner",
      "Advanced garden layout options",
      "Multiple garden management"
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock advanced AI features for comprehensive plant care and soil analysis
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="mb-8">
          <div className={`card ${isPremium ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isPremium ? (
                  <>
                    <Crown className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Premium Plan Active</h3>
                      <p className="text-sm text-gray-600">
                        {subscriptionDetails ? 
                          `Next billing: ${new Date(subscriptionDetails.nextBillingDate).toLocaleDateString()}` : 
                          'You have access to all advanced features'
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Leaf className="h-8 w-8 text-gray-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Free Plan</h3>
                      <p className="text-sm text-gray-600">Upgrade to unlock premium features</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {isPremium ? (
                  <>
                    <button 
                      onClick={() => setShowSubscriptionDetails(true)} 
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage</span>
                    </button>
                    <button 
                      onClick={() => setShowUpgradeModal(true)} 
                      className="btn-primary flex items-center space-x-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span>Upgrade</span>
                    </button>
                  </>
                ) : (
              <button onClick={() => setShowCheckout(true)} className="btn-primary flex items-center space-x-2">
                <span>Upgrade Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="card">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">₱0<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Perfect for getting started with basic plant care</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">3 free analysis only 3 plants + 3 soil</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">3x3 grid planner</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Basic plant identification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Simple soil moisture check</span>
                </li>
              </ul>
              <button 
                onClick={isPremium ? handleDowngrade : undefined}
                className={`w-full ${isPremium ? 'btn-secondary' : 'btn-secondary bg-green-600 hover:bg-green-700 text-white border-green-600'}`}
                disabled={!isPremium || isProcessing}
              >
                {isPremium ? 'Downgrade to Basic' : 'Current Plan'}
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className={`card relative ${isPremium ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-white'}`}>
            {!isPremium && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}
            {isPremium && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </div>
              </div>
            )}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">₱150<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Unlock advanced features with 20 free AI analyses</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">20 free AI analysis per month (10 plants + 10 soil)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">6x6 grid planner</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Advance plant identification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Detailed soil composition analysis</span>
                </li>
              </ul>
              <button onClick={() => setShowCheckout(true)} className="btn-primary w-full flex items-center justify-center space-x-2">
                <span>Upgrade to Premium</span>
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Details Modal */}
        {showSubscriptionDetails && subscriptionDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowSubscriptionDetails(false)}></div>
            <div className="relative bg-white w-full max-w-4xl mx-4 rounded-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Subscription Details</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your Premium subscription</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Subscription Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Plan Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Plan:</span>
                          <span className="font-medium">{subscriptionDetails.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriptionDetails.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriptionDetails.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Started:</span>
                          <span className="font-medium">{new Date(subscriptionDetails.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Billing:</span>
                          <span className="font-medium">{new Date(subscriptionDetails.nextBillingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">₱{subscriptionDetails.amount}/{subscriptionDetails.plan.includes('Monthly') ? 'month' : 'year'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card:</span>
                          <span className="font-medium">{subscriptionDetails.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Auto-renew:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriptionDetails.autoRenew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {subscriptionDetails.autoRenew ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Premium Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(subscriptionDetails.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700 capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Billing History</h4>
                  <div className="space-y-2">
                    {billingHistory.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{bill.description}</p>
                          <p className="text-sm text-gray-600">{new Date(bill.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">${bill.amount}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bill.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {bill.status}
                          </span>
                          <button className="text-primary-600 hover:text-primary-700 text-sm">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex items-center justify-between">
                <div className="flex space-x-3">
                  <button 
                    onClick={handleDowngrade}
                    disabled={isProcessing}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <TrendingUp className="h-4 w-4 rotate-180" />
                    <span>Downgrade</span>
                  </button>
                  <button 
                    onClick={handleCancelSubscription}
                    disabled={isProcessing}
                    className="btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    Cancel Subscription
                  </button>
                </div>
                <button 
                  onClick={() => setShowSubscriptionDetails(false)} 
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => {
              setShowUpgradeModal(false)
              setGcashNumber('')
              setPaymentMethod('gcash')
            }}></div>
            <div className="relative bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl border border-gray-200">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Upgrade Your Plan</h3>
                <p className="text-sm text-gray-600 mt-1">Choose a higher tier for more features</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Available Upgrades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Premium Annual</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">$99.99</div>
                        <div className="text-sm text-gray-500">per year</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Save 17% with annual billing</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• All Premium features</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics</li>
                    </ul>
                    <button 
                      onClick={handleUpgrade}
                      disabled={isProcessing}
                      className="w-full mt-4 btn-primary"
                    >
                      {isProcessing ? 'Processing...' : 'Upgrade to Annual'}
                    </button>
                  </div>
                  
                  <div className="border border-primary-300 rounded-lg p-4 bg-primary-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Premium Pro</h4>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">$19.99</div>
                        <div className="text-sm text-gray-500">per month</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">For professional gardeners</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• All Premium features</li>
                      <li>• Unlimited gardens</li>
                      <li>• API access</li>
                      <li>• White-label options</li>
                    </ul>
                    <button 
                      onClick={handleUpgrade}
                      disabled={isProcessing}
                      className="w-full mt-4 btn-primary"
                    >
                      {isProcessing ? 'Processing...' : 'Upgrade to Pro'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}
              </div>
              <div className="p-6 border-t flex items-center justify-end gap-3">
                <button 
                  onClick={() => {
                    setShowUpgradeModal(false)
                    setGcashNumber('')
                    setPaymentMethod('gcash')
                  }} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowCheckout(false)}></div>
            <div className="relative bg-white w-full max-w-xl mx-4 rounded-2xl shadow-xl border border-gray-200">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">Upgrade to {priceDisplay.plan}</h3>
                <p className="text-sm text-gray-600 mt-1">₱{priceDisplay.amount} per month, cancel anytime</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Subscription Plan Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Premium Plan</span>
                    <span className="text-lg font-bold text-green-600">₱{priceDisplay.amount}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Get unlimited AI analyses, advanced features, and priority support. Cancel anytime.
                  </p>
                </div>
                
                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-400 focus:ring-primary-400"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="demo">Demo Payment (Instant)</option>
                    <option value="gcash">GCash</option>
                    <option value="paymaya">PayMaya</option>
                  </select>
                </div>


                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">Payment successful! Your premium access has been activated.</div>
                )}
              </div>
              <div className="p-6 border-t flex items-center justify-end gap-3">
                <button disabled={isProcessing} onClick={() => setShowCheckout(false)} className="btn-secondary">Cancel</button>
                <button disabled={isProcessing} onClick={async () => {
                  try {
                    setIsProcessing(true)
                    setError('')
                    setSuccess(false)
                    
                    // Process subscription via backend
                    console.log('💰 SUBSCRIPTION: Processing Premium subscription')
                    console.log('💰 SUBSCRIPTION: Amount: ₱150/month')
                    console.log('💰 SUBSCRIPTION: Payment method: demo')
                    
                    // Show payment processing message
                    toast.success('Processing demo payment...')
                    
                    // Call backend subscription endpoint with demo payment
                    const response = await axios.post('/api/subscription/upgrade', {
                      plan_type: 'premium',
                      payment_method: 'demo' // Always use demo payment
                    })
                    
                    console.log('💰 SUBSCRIPTION: Backend response:', response.data)
                    
                    if (response.data.success) {
                      setSuccess(true)
                      toast.success('Subscription payment successful! You now have Premium access.')
                      
                      // Clear auth cache and force refresh auth status to update isPremium
                      authService.clearCache()
                      await refreshAuthStatus(true) // Force refresh, bypass debounce
                      
                      // Refresh subscription details to update UI
                      await fetchSubscriptionDetails()
                      
                      // Wait a moment for state to update, then refresh page to ensure all components update
                      setTimeout(() => {
                        window.location.reload()
                      }, 2000)
                    } else {
                      throw new Error(response.data.error || 'Subscription failed')
                    }
                  } catch (e) {
                    setError('Something went wrong. Please try again.')
                  } finally {
                    setIsProcessing(false)
                  }
                }} className={`btn-primary ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isProcessing ? 'Processing Payment…' : `Pay ₱${priceDisplay.amount}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Subscription Warning Modal */}
        {showCancelWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowCancelWarning(false)}></div>
            <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Cancel Subscription</h3>
                    <p className="text-sm text-gray-600 mt-1">This action cannot be undone</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">⚠️ Warning: You will immediately lose access to:</p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>All Premium features</li>
                    <li>6x6 garden grid planner (reduced to 3x3)</li>
                    <li>Advanced learning paths</li>
                    <li>20 AI analyses per month (reduced to 4)</li>
                    <li>Detailed plant and soil analyses</li>
                    <li>Personalized recommendations</li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  Your subscription will be cancelled immediately and you will be reverted to the Basic plan. Any excess plants in your garden beyond the 3x3 grid limit will be removed.
                </p>
              </div>
              <div className="p-6 border-t flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowCancelWarning(false)} 
                  className="btn-secondary"
                  disabled={isProcessing}
                >
                  Keep Subscription
                </button>
                <button 
                  onClick={confirmCancel}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Yes, Cancel Subscription'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens to my free analyses?</h3>
              <p className="text-sm text-gray-600">Basic plan users get 3 free AI analyses per month (3 plants + 3 soil). Premium users get 20 free analyses (10 plants + 10 soil). Additional analyses cost ₱25 each.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What's the difference in plant identification?</h3>
              <p className="text-sm text-gray-600">Free users get basic plant name and care tips. Premium users get detailed pest identification, ideal placement, and step-by-step improvement guides.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How accurate is the soil analysis?</h3>
              <p className="text-sm text-gray-600">Our AI provides basic texture and moisture analysis for free users. Premium users get detailed composition breakdowns and specific fertilizer recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscription

