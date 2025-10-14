import React from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const AdminModal = ({
  isOpen = false,
  onClose,
  title = 'Modal Title',
  subtitle = '',
  icon: Icon,
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-100',
  children,
  size = 'md', // sm, md, lg, xl, full
  type = 'default', // default, success, warning, error, info
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200'
        }
      case 'error':
        return {
          icon: AlertCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200'
        }
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200'
        }
      default:
        return {
          icon: Icon,
          iconColor,
          bgColor,
          borderColor: 'border-slate-200'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md'
      case 'md':
        return 'max-w-2xl'
      case 'lg':
        return 'max-w-4xl'
      case 'xl':
        return 'max-w-6xl'
      case 'full':
        return 'max-w-full mx-4'
      default:
        return 'max-w-2xl'
    }
  }

  const typeStyles = getTypeStyles()
  const TypeIcon = typeStyles.icon

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
      <div
        className="bg-white/90 backdrop-blur-sm rounded-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200/50 shadow-2xl"
        onClick={handleOverlayClick}
      >
        <div className={`${getSizeStyles()} mx-auto`}>
          {/* Header */}
          <div className={`p-6 border-b border-slate-200/60 ${typeStyles.borderColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${typeStyles.bgColor}`}>
                  <TypeIcon className={`h-5 w-5 ${typeStyles.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                  {subtitle && (
                    <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className={`p-6 ${className}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal Footer Component
export const AdminModalFooter = ({
  children,
  className = '',
  align = 'right' // left, center, right
}) => {
  const getAlignment = () => {
    switch (align) {
      case 'left':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-end'
    }
  }

  return (
    <div className={`flex items-center space-x-3 pt-4 border-t border-slate-200 ${getAlignment()} ${className}`}>
      {children}
    </div>
  )
}

// Modal Actions Component
export const AdminModalActions = ({
  onCancel,
  onConfirm,
  onSave,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  saveText = 'Save',
  showCancel = true,
  showConfirm = false,
  showSave = false,
  confirmVariant = 'primary', // primary, success, warning, error
  saveVariant = 'primary',
  loading = false,
  disabled = false,
  className = ''
}) => {
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700'
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700'
      case 'primary':
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
    }
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showCancel && onCancel && (
        <button
          onClick={onCancel}
          disabled={loading || disabled}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      )}
      {showSave && onSave && (
        <button
          onClick={onSave}
          disabled={loading || disabled}
          className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles(saveVariant)}`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            saveText
          )}
        </button>
      )}
      {showConfirm && onConfirm && (
        <button
          onClick={onConfirm}
          disabled={loading || disabled}
          className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles(confirmVariant)}`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Confirming...
            </div>
          ) : (
            confirmText
          )}
        </button>
      )}
    </div>
  )
}

// Modal Content Sections
export const AdminModalSection = ({
  title,
  children,
  className = '',
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  if (collapsible) {
    return (
      <div className={`border-t border-slate-200 pt-6 ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <X className="h-5 w-5 text-slate-400" />
          </div>
        </button>
        {isExpanded && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`border-t border-slate-200 pt-6 ${className}`}>
      {title && (
        <h4 className="text-lg font-semibold text-slate-900 mb-4">{title}</h4>
      )}
      {children}
    </div>
  )
}

export default AdminModal
