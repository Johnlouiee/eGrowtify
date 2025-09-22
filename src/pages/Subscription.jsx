import React, { useMemo, useState } from 'react'
import { Check, X, Star, Leaf, Droplets, Zap, Crown, ArrowRight, CreditCard, Wallet, Smartphone, MoreHorizontal } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Subscription = () => {
  const { isPremium } = useAuth()

  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const priceDisplay = useMemo(() => ({ amount: '9.99', currency: 'USD', plan: 'Premium Monthly' }), [])

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
                      <p className="text-sm text-gray-600">You have access to all advanced features</p>
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
              {!isPremium && (
                <button onClick={() => setShowCheckout(true)} className="btn-primary flex items-center space-x-2">
                  <span>Upgrade Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
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

