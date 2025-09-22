import React from 'react'
import { Leaf, Users, Target, Heart, Award, Globe } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About eGrowtify
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering gardeners worldwide with AI-powered plant care, smart alerts, 
            and personalized guidance to help you grow thriving gardens.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that everyone should have access to the knowledge and tools 
                needed to grow healthy, thriving plants. eGrowtify combines cutting-edge 
                AI technology with expert gardening knowledge to make plant care accessible, 
                enjoyable, and successful for gardeners of all levels.
              </p>
              <p className="text-lg text-gray-600">
                From beginners taking their first steps into gardening to expert horticulturists 
                managing complex ecosystems, eGrowtify provides personalized guidance that 
                adapts to your unique environment and goals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8">
              <Leaf className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Growing Together
              </h3>
              <p className="text-gray-600 text-center">
                Join thousands of gardeners who are transforming their spaces 
                with the help of eGrowtify's intelligent plant care system.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Makes eGrowtify Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Plant Recognition</h3>
              <p className="text-gray-600">
                Identify plants instantly with our advanced AI camera technology. 
                Get detailed care instructions and health assessments.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Alerts</h3>
              <p className="text-gray-600">
                Never miss a watering or care task with intelligent reminders 
                tailored to your plants' specific needs.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learning Paths</h3>
              <p className="text-gray-600">
                Progress from beginner to expert with structured learning paths 
                designed for every skill level.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seasonal Planning</h3>
              <p className="text-gray-600">
                Plan your garden year-round with location-based seasonal 
                recommendations and planting calendars.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h3>
              <p className="text-gray-600">
                Connect with fellow gardeners, share experiences, and get 
                expert advice from our growing community.
              </p>
            </div>

            <div className="card text-center">
              <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Access professional horticulturist knowledge and personalized 
                recommendations for your specific growing conditions.
              </p>
            </div>
          </div>
        </div>

        

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Justin Morales</h3>
              <p className="text-primary-600 mb-3">Project Manager</p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Louie N. Purisima</h3>
              <p className="text-primary-600 mb-3">Database Manager</p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">John Aries Rizada</h3>
              <p className="text-primary-600 mb-3">Developer</p>
            </div>

            <div className="card text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nathaniel Ron Singco</h3>
              <p className="text-primary-600 mb-3">UI/UX Designer</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions, feedback, or want to join our community? 
            We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@egrowtify.com"
              className="btn-primary inline-flex items-center justify-center"
            >
              Contact Us
            </a>
            <a
              href="/feedback"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Share Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
