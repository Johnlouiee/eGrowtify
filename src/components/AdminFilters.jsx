import React from 'react'
import { Search, Filter, RefreshCw, Download, Upload, Grid, List, BarChart3 } from 'lucide-react'

const AdminFilters = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  viewModes = [],
  currentViewMode,
  onViewModeChange,
  onRefresh,
  actions = [],
  showBulkActions = false,
  bulkActionsCount = 0,
  onBulkAction,
  bulkActionOptions = []
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 mb-8 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index === 0 && <Filter className="h-5 w-5 text-slate-500" />}
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200/60">
        <div className="flex items-center space-x-6">
          {viewModes.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
              {viewModes.map((mode) => {
                const IconComponent = mode.icon
                return (
                  <button
                    key={mode.id}
                    onClick={() => onViewModeChange(mode.id)}
                    className={`p-2 rounded-lg transition-all duration-200 ${currentViewMode === mode.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    title={mode.title}
                  >
                    <IconComponent className="h-4 w-4" />
                  </button>
                )
              })}
            </div>
          )}
          
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${action.className || 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'}`}
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              <span className="text-sm font-medium">{action.text}</span>
            </button>
          ))}
          
          {showBulkActions && bulkActionsCount > 0 && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center px-3 py-2 bg-blue-50 rounded-xl">
                <span className="text-sm font-medium text-blue-700">{bulkActionsCount} selected</span>
              </div>
              <div className="flex items-center space-x-2">
                {bulkActionOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onBulkAction(option.action)}
                    className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${option.className || 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'}`}
                  >
                    {option.icon && <option.icon className="h-4 w-4 mr-2" />}
                    <span className="text-sm font-medium">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminFilters
