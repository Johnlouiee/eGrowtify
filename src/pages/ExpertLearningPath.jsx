import React from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, Factory, LeafyGreen, Recycle, Beaker, Sprout, CheckCircle } from 'lucide-react'

const ExpertLearningPath = () => {
  const modules = [
    {
      id: 'propagation',
      title: 'Advanced Propagation Techniques',
      icon: Sprout,
      points: [
        'Stem, leaf, and root cuttings; layering and division',
        'Seed saving, stratification, and scarification',
        'Rooting hormones and sterile technique'
      ]
    },
    {
      id: 'greenhouse',
      title: 'Greenhouse & Controlled Environments',
      icon: Factory,
      points: [
        'Ventilation, humidity, and temperature control strategies',
        'Lighting spectra and DLI targeting for growth stages',
        'Irrigation automation and monitoring'
      ]
    },
    {
      id: 'sustainability',
      title: 'Sustainable, Regenerative Gardening',
      icon: Recycle,
      points: [
        'Composting systems and soil food web',
        'Water-wise practices and mulching',
        'Polycultures and habitat building'
      ]
    },
    {
      id: 'breeding',
      title: 'Plant Breeding Basics',
      icon: Beaker,
      points: [
        'Pollination control and isolation',
        'Selecting traits and maintaining lines',
        'Recordkeeping and legal considerations'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Learning Path</h1>
          <p className="text-gray-600 mt-2">Master advanced techniques and systems for high performance gardens.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-purple-100 text-purple-700">
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
          <div className="inline-flex items-center gap-2 text-purple-700 bg-purple-100 px-3 py-2 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span>Track your progress from the dashboard</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpertLearningPath


