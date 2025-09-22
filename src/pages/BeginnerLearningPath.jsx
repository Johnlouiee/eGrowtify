import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Droplets, Sun, Leaf, Sprout, Thermometer, AlertCircle, CheckCircle } from 'lucide-react'

const BeginnerLearningPath = () => {
  const modules = [
    {
      id: 'intro',
      title: 'Introduction to Planting',
      icon: BookOpen,
      points: [
        'Understand annuals, perennials, and biennials',
        'Choose beginner-friendly plants (basil, mint, lettuce, marigold, pothos)',
        'Start small: 3–5 plants, learn routine, then scale'
      ]
    },
    {
      id: 'light',
      title: 'Light Basics',
      icon: Sun,
      points: [
        'Most edibles need 6–8 hours of direct sun',
        'Indoor: place near south/east windows; rotate weekly',
        'Low-light options: pothos, snake plant, ZZ plant'
      ]
    },
    {
      id: 'soil',
      title: 'Soil & Containers',
      icon: Leaf,
      points: [
        'Use quality potting mix for containers; avoid heavy garden soil',
        'Ensure drainage holes; add saucers indoors',
        'Amend with compost for nutrients and structure'
      ]
    },
    {
      id: 'water',
      title: 'Watering Fundamentals',
      icon: Droplets,
      points: [
        'Water deeply, less often; let top 2–5 cm dry for most houseplants',
        'Morning watering reduces disease and evaporation',
        'Finger test: if dry to first knuckle, it’s time to water'
      ]
    },
    {
      id: 'climate',
      title: 'Temperature & Humidity',
      icon: Thermometer,
      points: [
        'Most plants thrive at 18–27°C; avoid drafts and heat vents',
        'Tropical plants like higher humidity (40–60%)',
        'Harden off seedlings before moving outdoors'
      ]
    },
    {
      id: 'starter',
      title: 'Starter Plants & Easy Wins',
      icon: Sprout,
      points: [
        'Herbs: basil, mint, parsley; Greens: lettuce, spinach',
        'Flowers: marigold, calendula; Houseplants: pothos, spider plant',
        'Buy healthy starts: green growth, no pests, not root-bound'
      ]
    },
    {
      id: 'problems',
      title: 'Common Problems & Quick Checks',
      icon: AlertCircle,
      points: [
        'Yellow leaves: overwatering or poor drainage',
        'Leggy growth: insufficient light',
        'Brown tips: low humidity or fertilizer burn'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Beginner Learning Path</h1>
          <p className="text-gray-600 mt-2">Start with the basics of planting and everyday plant care.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-green-100 text-green-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{m.title}</h2>
                      <ul className="list-disc pl-6 space-y-1 text-gray-700">
                        {m.points.map((p, i) => (
                          <li key={i} className="leading-relaxed">{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">← Back to Dashboard</Link>
          <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Mark modules complete from the dashboard as you progress</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeginnerLearningPath


