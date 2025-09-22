import React from 'react'
import { Link } from 'react-router-dom'
import { Beaker, Bug, LayoutGrid, CalendarDays, Droplets, Leaf, Sun, CheckCircle } from 'lucide-react'

const IntermediateLearningPath = () => {
  const modules = [
    {
      id: 'nutrition',
      title: 'Advanced Plant Nutrition',
      icon: Beaker,
      points: [
        'Macro vs micro nutrients: N–P–K and trace elements',
        'Organic vs synthetic feeding; slow vs fast release',
        'Reading fertilizer labels and schedules'
      ]
    },
    {
      id: 'pests',
      title: 'Pest & Disease Management',
      icon: Bug,
      points: [
        'Preventative care: airflow, sanitation, quarantine',
        'Identify aphids, mites, mildew; use IPM strategies',
        'Safe treatments: neem, soaps, beneficial insects'
      ]
    },
    {
      id: 'seasonal',
      title: 'Seasonal Planning',
      icon: CalendarDays,
      points: [
        'Succession planting and crop rotation basics',
        'Plan around frost dates and heat waves',
        'Staggered sowing for continuous harvest'
      ]
    },
    {
      id: 'design',
      title: 'Garden Design Principles',
      icon: LayoutGrid,
      points: [
        'Sun mapping and microclimates',
        'Companion planting and spacing',
        'Vertical gardening for small spaces'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intermediate Learning Path</h1>
          <p className="text-gray-600 mt-2">Level up your skills with planning, nutrition, and pest care.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
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
          <div className="inline-flex items-center gap-2 text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Track your progress from the dashboard</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntermediateLearningPath


