import React from 'react'
import { Leaf, Camera, BarChart3, Zap, Shield, Smartphone, Droplets, Sun } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Plant Care Guides',
      description: 'Step-by-step, easy-to-follow guides for growing vegetables, herbs, and ornamental plants — whether in pots, balconies, backyards, or community spaces.',
      details: [
        'Growth stage tracking to know when to prune, harvest, or repot',
        'Tailored care recommendations based on plant type and season',
        'Herbs, Vegetables, and Fruits',
      ]
    },
    {
      icon: Camera,
      title: 'Smart Alerts',
      description: 'Custom reminders for watering, fertilizing, pruning, and other plant care tasks, delivered through in-app and web notifications.',
      details: [
        'Timely alerts based on your chosen schedule. ',
        'Seasonal task suggestions for optimal growth.',
        'Ability to snooze or reschedule reminders.',
        'Simple alert history to track completed tasks.'
      ]
    },
    {
      icon: Droplets,
      title: 'Seasonal Planning',
      description: 'Personalized planting calendars that match your local climate and seasonal changes, helping you plan the best time to plant and harvest.',
      details: [
        'Location-based planting schedules (urban or rural)',
        'Recommendations for both indoor and outdoor planting setups',
      ]
    },
    {
      icon: Sun,
      title: 'AI Planting Advisor ',
      description: 'An AI-powered tool that analyzes soil conditions and identifies plants from photos, then recommends the best plants for your space.',
      details: [
        'Plant identification from user-uploaded images',
        'Soil analysis through visual input or manual data entry',
        'AI recommendations based on sunlight, space, and environment',
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for Smart Gardening
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            eGrowtify combines cutting-edge technology with proven gardening practices 
            to give you the most advanced garden management system available.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience Smart Gardening?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of gardeners who are already growing smarter with eGrowtify.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-3">
                Start Free Trial
              </button>
              <button className="btn-secondary text-lg px-8 py-3">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features

