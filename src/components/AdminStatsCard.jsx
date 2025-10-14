import React from 'react'

const AdminStatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = 'from-blue-500 to-blue-600',
  bgColor = 'from-blue-500/5 to-indigo-500/5',
  borderColor = 'hover:border-blue-300/50',
  shadowColor = 'hover:shadow-blue-500/10',
  trend,
  trendIcon: TrendIcon,
  trendText,
  trendColor = 'text-blue-600'
}) => {
  return (
    <div className={`group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 ${borderColor} transition-all duration-300 hover:shadow-xl ${shadowColor}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${iconColor} rounded-xl shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">{title}</p>
          {trend && (
            <p className={`text-xs ${trendColor} flex items-center`}>
              {TrendIcon && <TrendIcon className="h-3 w-3 mr-1" />}
              {trendText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminStatsCard
