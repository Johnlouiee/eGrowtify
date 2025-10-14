import React from 'react'
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Minus } from 'lucide-react'

const AdminCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'from-blue-500 to-blue-600',
  bgColor = 'from-blue-500/5 to-indigo-500/5',
  borderColor = 'hover:border-blue-300/50',
  shadowColor = 'hover:shadow-blue-500/10',
  trend = false,
  trendIcon: TrendIcon,
  trendText,
  trendColor = 'text-green-600',
  trendValue,
  trendDirection = 'up', // up, down, neutral
  onClick,
  loading = false,
  className = '',
  children,
  actions = [],
  status = 'default', // default, success, warning, error, info
  size = 'default' // sm, default, lg
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return {
          iconColor: 'from-green-500 to-green-600',
          bgColor: 'from-green-500/5 to-emerald-500/5',
          borderColor: 'hover:border-green-300/50',
          shadowColor: 'hover:shadow-green-500/10',
          trendColor: 'text-green-600'
        }
      case 'warning':
        return {
          iconColor: 'from-yellow-500 to-yellow-600',
          bgColor: 'from-yellow-500/5 to-amber-500/5',
          borderColor: 'hover:border-yellow-300/50',
          shadowColor: 'hover:shadow-yellow-500/10',
          trendColor: 'text-yellow-600'
        }
      case 'error':
        return {
          iconColor: 'from-red-500 to-red-600',
          bgColor: 'from-red-500/5 to-pink-500/5',
          borderColor: 'hover:border-red-300/50',
          shadowColor: 'hover:shadow-red-500/10',
          trendColor: 'text-red-600'
        }
      case 'info':
        return {
          iconColor: 'from-blue-500 to-blue-600',
          bgColor: 'from-blue-500/5 to-indigo-500/5',
          borderColor: 'hover:border-blue-300/50',
          shadowColor: 'hover:shadow-blue-500/10',
          trendColor: 'text-blue-600'
        }
      default:
        return {
          iconColor,
          bgColor,
          borderColor,
          shadowColor,
          trendColor
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: 'p-4',
          iconSize: 'h-5 w-5',
          iconPadding: 'p-2',
          titleSize: 'text-sm',
          valueSize: 'text-xl',
          subtitleSize: 'text-xs'
        }
      case 'lg':
        return {
          padding: 'p-8',
          iconSize: 'h-8 w-8',
          iconPadding: 'p-4',
          titleSize: 'text-lg',
          valueSize: 'text-3xl',
          subtitleSize: 'text-sm'
        }
      default:
        return {
          padding: 'p-6',
          iconSize: 'h-6 w-6',
          iconPadding: 'p-3',
          titleSize: 'text-sm',
          valueSize: 'text-2xl',
          subtitleSize: 'text-xs'
        }
    }
  }

  const getTrendIcon = () => {
    if (trendDirection === 'up') {
      return <ArrowUp className="h-3 w-3" />
    } else if (trendDirection === 'down') {
      return <ArrowDown className="h-3 w-3" />
    } else {
      return <Minus className="h-3 w-3" />
    }
  }

  const statusStyles = getStatusStyles()
  const sizeStyles = getSizeStyles()

  if (loading) {
    return (
      <div className={`group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 transition-all duration-300 ${sizeStyles.padding} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className={`${sizeStyles.iconPadding} bg-slate-200 rounded-xl`}></div>
            <div className="text-right">
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-24"></div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 ${statusStyles.borderColor} transition-all duration-300 hover:shadow-xl ${statusStyles.shadowColor} ${sizeStyles.padding} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 ${statusStyles.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`${sizeStyles.iconPadding} bg-gradient-to-br ${statusStyles.iconColor} rounded-xl shadow-lg`}>
            {Icon && <Icon className={`${sizeStyles.iconSize} text-white`} />}
          </div>
          <div className="text-right">
            <p className={`${sizeStyles.valueSize} font-bold text-slate-900`}>{value}</p>
            <p className={`${sizeStyles.subtitleSize} text-slate-500`}>{subtitle}</p>
          </div>
        </div>
        
        <div>
          <p className={`${sizeStyles.titleSize} font-semibold text-slate-700 mb-1`}>{title}</p>
          {trend && (
            <p className={`${sizeStyles.subtitleSize} ${statusStyles.trendColor} flex items-center`}>
              {TrendIcon ? <TrendIcon className="h-3 w-3 mr-1" /> : getTrendIcon()}
              {trendText || trendValue}
            </p>
          )}
        </div>

        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {actions.length > 0 && (
          <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-slate-200/60">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  action.onClick && action.onClick()
                }}
                className={`flex items-center px-3 py-1 text-sm rounded-lg transition-all duration-200 ${action.className || 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                title={action.title}
              >
                {action.icon && <action.icon className="h-4 w-4 mr-1" />}
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Card Grid Component
export const AdminCardGrid = ({
  children,
  columns = 4,
  gap = 6,
  className = ''
}) => {
  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }
  }

  return (
    <div className={`grid ${getGridCols()} gap-${gap} ${className}`}>
      {children}
    </div>
  )
}

// Card Section Component
export const AdminCardSection = ({
  title,
  description,
  children,
  className = '',
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  if (collapsible) {
    return (
      <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ArrowDown className="h-5 w-5 text-slate-400" />
          </div>
        </button>
        {isExpanded && (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 hover:shadow-lg transition-all duration-300 ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Card List Component
export const AdminCardList = ({
  items = [],
  renderItem,
  emptyMessage = 'No items available',
  className = ''
}) => {
  if (items.length === 0) {
    return (
      <div className={`bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 text-center ${className}`}>
        <div className="text-slate-400 mb-4">
          <Minus className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No items available</h3>
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id || index}>
          {renderItem ? renderItem(item, index) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 p-4 hover:shadow-lg transition-all duration-300">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default AdminCard
