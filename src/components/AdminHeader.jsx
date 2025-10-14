import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RefreshCw } from 'lucide-react'

const AdminHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor = 'from-blue-600 to-indigo-600',
  onRefresh,
  showBackButton = true,
  backTo = '/admin',
  backText = 'Back to Dashboard',
  actions = []
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link 
                to={backTo} 
                className="flex items-center px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{backText}</span>
              </Link>
            )}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${iconColor} rounded-2xl blur-sm opacity-75`}></div>
                <div className={`relative p-3 bg-gradient-to-r ${iconColor} rounded-2xl`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <p className="text-sm text-slate-600">{subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            )}
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${action.className || 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
              >
                {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                <span className="text-sm font-medium">{action.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader
