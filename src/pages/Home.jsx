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
      {/* Hero Section - Camera themed */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50" />
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(#94a3b8 1px, transparent 1px)',backgroundSize:'20px 20px'}} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                <Camera className="h-4 w-4 mr-2" />
                Capture. Identify. Grow.
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
                Capture.
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Identify.</span>
                Grow.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                eGrowtify recognizes plants and analyzes soil in seconds. Snap a photo to get instant insights and a personalized care plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link
                  to="/ai-recognition"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Open AI Camera
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Get Started Free
                  </Link>
                )}
              </div>

              {/* Small camera status bar */}
              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Ready for plant ID and soil analysis
              </div>
            </div>

            {/* Camera Viewfinder Mock (no external image) */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-black">
                <div className="aspect-[4/3] relative">
                  {/* subtle grid */}
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(#ffffff 1px, transparent 1px)',backgroundSize:'18px 18px'}} />
                  {/* scanning line */}
                  <div className="absolute inset-x-0 top-1/3 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" />
                  {/* reticle */}
                  <div className="absolute inset-8 rounded-xl border-2 border-white/40" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/60" />
                  {/* mode pill */}
                  <div className="absolute top-4 left-4 flex items-center bg-white/10 backdrop-blur px-2 py-1 rounded-lg text-white text-xs gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/80"><Leaf className="h-3 w-3" /> Plant</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/60"><Camera className="h-3 w-3" /> Soil</span>
                  </div>
                  {/* bottom controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent text-white">
                    <div className="text-[10px] px-2 py-1 rounded bg-white/10">ISO AUTO • f/1.8 • 1/120s</div>
                    <div className="w-16 h-16 rounded-full bg-white/90 border-4 border-white shadow-inner" />
                  </div>
                </div>
              </div>
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

      {/* Testimonials Section removed as requested */}

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

      {/* Footer removed as requested */}
    </div>
  )
}

export default Home

