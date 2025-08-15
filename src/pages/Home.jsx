import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Leaf, 
  Camera, 
  Brain, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Star,
  Play
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Camera className="h-8 w-8" />,
      title: "AI Plant Recognition",
      description: "Identify plants instantly with our advanced AI camera technology and Analyze soil conditions. "
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Smart Care Guides",
      description: "Never forget to water, fertilize, or prune your plants. Our AI learns your garden's needs and sends personalized reminders."
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Expert Gardening Tips",
      description: "Access a vast library of gardening knowledge, seasonal advice, and expert tips tailored to your climate and plants."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Smart Alerts",
      description: "Automate your garden care with smart scheduling, weather integration, and IoT device compatibility."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Seasonal Planning",
      description: "Personalized planting calendars that match your local climate and seasonal changes, helping you plan the best time to plant and harvest."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Urban Gardener",
      content: "eGrowtify transformed my tiny balcony into a thriving garden. The AI recognition feature is incredible!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Professional Landscaper",
      content: "As a professional, I use eGrowtify to manage multiple client gardens. The automation features save me hours every week.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Rodriguez",
      role: "Garden Enthusiast",
      content: "The community features are amazing. I've learned so much from other gardeners and the expert tips are always spot-on.",
      rating: 5,
      avatar: "ER"
    }
  ]



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8">
              <Leaf className="h-4 w-4 mr-2" />
              Revolutionizing Garden Management
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Grow Smarter with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> eGrowtify</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your gardening experience with AI-powered plant recognition, smart care reminders, 
              and expert guidance. Whether you're a beginner or expert, eGrowtify helps you grow better.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Growing Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Demo Video Button */}
            <div className="flex items-center justify-center space-x-4">
              <button className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <Play className="h-5 w-5 mr-2 text-green-600" />
                Watch Demo
              </button>
              <span className="text-sm text-gray-500">2 min video</span>
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Grow Successfully
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools combines cutting-edge AI technology with proven gardening wisdom 
              to give you the best possible gardening experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How eGrowtify Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Snap a Photo</h3>
              <p className="text-gray-600">Take a picture of your plant with our mobile app</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">Our AI identifies the plant and analyzes its health</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Care Plan</h3>
              <p className="text-gray-600">Receive personalized care instructions and reminders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Gardeners Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their gardening experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-green-600 font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Garden?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of gardeners who are already growing smarter with eGrowtify
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          ) : (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'}
              className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-green-400 mr-3" />
                <span className="text-2xl font-bold">eGrowtify</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionizing garden management with AI-powered technology. 
                Grow smarter, not harder with eGrowtify.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">📱</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">💻</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-sm">📧</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/garden" className="hover:text-white transition-colors">Garden Management</Link></li>
                <li><Link to="/learning-paths" className="hover:text-white transition-colors">Learning Paths</Link></li>
                <li><Link to="/gardening-tips" className="hover:text-white transition-colors">Gardening Tips</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 eGrowtify. All rights reserved. Growing the future, one plant at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

