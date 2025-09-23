import React, { useMemo, useState, useEffect } from 'react'
import { Check, X, Star, Leaf, Droplets, Zap, Crown, ArrowRight, CreditCard, Wallet, Smartphone, MoreHorizontal, Calendar, Download, Eye, Settings, AlertTriangle, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Subscription = () => {
  const { isPremium } = useAuth()

  const [showCheckout, setShowCheckout] = useState(false)
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState(null)
  const [billingHistory, setBillingHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const priceDisplay = useMemo(() => ({ amount: '9.99', currency: 'USD', plan: 'Premium Monthly' }), [])

  useEffect(() => {
    if (isPremium) {
      fetchSubscriptionDetails()
    }
  }, [isPremium])

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true)
      // Mock subscription details - replace with actual API call
      const mockSubscriptionDetails = {
        plan: 'Premium Monthly',
        status: 'active',
        startDate: '2024-01-15',
        nextBillingDate: '2024-02-15',
        amount: 9.99,
        currency: 'USD',
        paymentMethod: '**** **** **** 4242',
        autoRenew: true,
        features: {
          unlimitedAnalyses: true,
          advancedPlantId: true,
          detailedSoilAnalysis: true,
          personalizedRecommendations: true,
          prioritySupport: true,
          progressReports: true,
          gardeningNotifications: true
        }
      }

      const mockBillingHistory = [
        {
          id: 1,
          date: '2024-01-15',
          amount: 9.99,
          status: 'paid',
          description: 'Premium Monthly Subscription',
          invoiceUrl: '#'
        },
        {
          id: 2,
          date: '2023-12-15',
          amount: 9.99,
          status: 'paid',
          description: 'Premium Monthly Subscription',
          invoiceUrl: '#'
        },
        {
          id: 3,
          date: '2023-11-15',
          amount: 9.99,
          status: 'paid',
          description: 'Premium Monthly Subscription',
          invoiceUrl: '#'
        }
      ]

      setSubscriptionDetails(mockSubscriptionDetails)
      setBillingHistory(mockBillingHistory)
    } catch (error) {
      console.error('Error fetching subscription details:', error)
      toast.error('Failed to load subscription details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true)
      setError('')
      // Mock upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Successfully upgraded to Premium!')
      setShowUpgradeModal(false)
      // Refresh subscription details
      fetchSubscriptionDetails()
    } catch (error) {
      setError('Failed to upgrade subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDowngrade = async () => {
    try {
      setIsProcessing(true)
      // Mock downgrade process
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Subscription downgraded. You will retain Premium access until the end of your billing period.')
      setShowSubscriptionDetails(false)
      // Refresh subscription details
      fetchSubscriptionDetails()
    } catch (error) {
      toast.error('Failed to downgrade subscription. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to Premium features at the end of your billing period.')) {
      try {
        setIsProcessing(true)
        // Mock cancellation process
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Subscription cancelled. You will retain Premium access until the end of your billing period.')
        setShowSubscriptionDetails(false)
        // Refresh subscription details
        fetchSubscriptionDetails()
      } catch (error) {
        toast.error('Failed to cancel subscription. Please try again.')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const freeFeatures = {
    plants: [
      "Plant name identification",
      "Basic light reference",
      "General watering guidelines"
    ],
    soil: [
      "Current moisture level (e.g., 'Your soil is too dry')",
      "Basic texture indication (e.g., 'Appears to be sandy loam')",
      "Simple tips (e.g., 'If dry, water it')"
    ]
  }

  const premiumFeatures = {
    plants: [
      "Common pest identification and treatment",
      "Ideal placement recommendations",
      "Detailed improvement suggestions with step-by-step guides"
    ],
    soil: [
      "Detailed texture breakdown (e.g., 'Soil is 70% sand, 20% silt, 10% clay')",
      "Recommended plants with scientific names (e.g., 'Snake Plant (Sansevieria trifasciata)')",
      "Specific fertilizer recommendations (e.g., 'Wait 2 weeks before fertilizing')"
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

        {/* Feature Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Plant Recognition Features */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Plant Recognition</h2>
                <p className="text-gray-600">AI-powered plant identification and care</p>
              </div>
            </div>

            {/* Free Features */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">FREE</span>
                </div>
                <h3 className="font-semibold text-gray-900">Basic Features</h3>
              </div>
              <div className="space-y-3">
                {freeFeatures.plants.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Premium Features</h3>
              </div>
              <div className="space-y-3">
                {premiumFeatures.plants.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {isPremium ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isPremium ? 'text-gray-700' : 'text-gray-500'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soil Analysis Features */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Droplets className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Soil Analysis</h2>
                <p className="text-gray-600">Comprehensive soil health assessment</p>
              </div>
            </div>

            {/* Free Features */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">FREE</span>
                </div>
                <h3 className="font-semibold text-gray-900">Basic Analysis</h3>
              </div>
              <div className="space-y-3">
                {freeFeatures.soil.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Features */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-3 w-3 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Advanced Analysis</h3>
              </div>
              <div className="space-y-3">
                {premiumFeatures.soil.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {isPremium ? (
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isPremium ? 'text-gray-700' : 'text-gray-500'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Perfect for getting started with basic plant care</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">10 free image analyses per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Basic plant identification</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Simple soil moisture check</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Basic care guidelines</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="card relative border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-white">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-gray-900 mb-4">$9.99<span className="text-lg text-gray-500">/month</span></div>
              <p className="text-gray-600 mb-6">Unlimited access to all advanced features</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Unlimited image analyses</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Advanced plant identification with pest detection</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Detailed soil composition analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Personalized plant recommendations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Specific fertilizer recommendations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">Priority customer support</span>
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
                          <span className="font-medium">${subscriptionDetails.amount}/{subscriptionDetails.plan.includes('Monthly') ? 'month' : 'year'}</span>
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
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setShowUpgradeModal(false)}></div>
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
                  onClick={() => setShowUpgradeModal(false)} 
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
                <p className="text-sm text-gray-600 mt-1">${priceDisplay.amount} per month, cancel anytime</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Payment Method Selector */}
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-3">Select payment method</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={() => setPaymentMethod('card')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm ${paymentMethod === 'card' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 bg-white'}`}>
                      <CreditCard className="h-4 w-4" />
                      <span>Card</span>
                    </button>
                    <button onClick={() => setPaymentMethod('gcash')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm ${paymentMethod === 'gcash' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 bg-white'}`}>
                      <Wallet className="h-4 w-4" />
                      <span>GCash</span>
                    </button>
                    <button onClick={() => setPaymentMethod('paymaya')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm ${paymentMethod === 'paymaya' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 bg-white'}`}>
                      <Smartphone className="h-4 w-4" />
                      <span>PayMaya</span>
                    </button>
                    <button onClick={() => setPaymentMethod('other')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm ${paymentMethod === 'other' ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 bg-white'}`}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span>Others</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Payment Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input type="text" placeholder="Jane D. Doe" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input type="text" placeholder="4242 4242 4242 4242" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                          <input type="text" placeholder="MM/YY" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                          <input type="text" placeholder="123" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'gcash' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GCash Mobile Number</label>
                      <input type="tel" placeholder="09XX XXX XXXX" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                    </div>
                    <p className="text-xs text-gray-500">Youll be redirected to GCash to authorize the payment.</p>
                  </div>
                )}

                {paymentMethod === 'paymaya' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PayMaya Mobile Number</label>
                      <input type="tel" placeholder="09XX XXX XXXX" className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400" />
                    </div>
                    <p className="text-xs text-gray-500">Youll be redirected to PayMaya to authorize the payment.</p>
                  </div>
                )}

                {paymentMethod === 'other' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Provider</label>
                      <select className="w-full rounded-lg border-gray-300 focus:border-primary-400 focus:ring-primary-400">
                        <option value="maya-bank">Maya Bank</option>
                        <option value="grabpay">GrabPay</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank-transfer">Bank Transfer</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">Well show the right steps after you choose a provider.</p>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}
                {success && (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">Payment successful! Your premium will be activated shortly.</div>
                )}
              </div>
              <div className="p-6 border-t flex items-center justify-end gap-3">
                <button disabled={isProcessing} onClick={() => setShowCheckout(false)} className="btn-secondary">Cancel</button>
                <button disabled={isProcessing} onClick={async () => {
                  try {
                    setIsProcessing(true)
                    setError('')
                    setSuccess(false)
                    // Mock checkout call
                    await new Promise(r => setTimeout(r, 1200))
                    setSuccess(true)
                  } catch (e) {
                    setError('Something went wrong. Please try again.')
                  } finally {
                    setIsProcessing(false)
                  }
                }} className={`btn-primary ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isProcessing ? 'Processing…' : `Pay $${priceDisplay.amount}`}
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
              <p className="text-sm text-gray-600">You get 10 free image analyses per month. Once you use them up, you'll need to wait until next month or upgrade to premium for unlimited access.</p>
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

