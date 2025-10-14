import React from 'react'
import { Eye, EyeOff, Upload, X, AlertCircle, CheckCircle } from 'lucide-react'

const AdminForm = ({
  onSubmit,
  children,
  className = '',
  loading = false,
  disabled = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit && !loading && !disabled) {
      onSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
}

// Form Field Component
export const AdminFormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  icon: Icon,
  className = '',
  rows = 3,
  options = [],
  multiple = false,
  accept,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  onFileUpload,
  onFileRemove,
  uploadedFiles = [],
  maxFiles = 1,
  ...props
}) => {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500 ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            {...props}
          />
        )

      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            multiple={multiple}
            className={`w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500 ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'file':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-sm text-slate-600 mb-2">
                {maxFiles > 1 ? 'Upload files' : 'Upload a file'}
              </p>
              <input
                type="file"
                name={name}
                onChange={onFileUpload}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                className="hidden"
                id={`file-upload-${name}`}
              />
              <label
                htmlFor={`file-upload-${name}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </label>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Upload className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {onFileRemove && (
                      <button
                        type="button"
                        onClick={() => onFileRemove(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-slate-700">{label}</label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  disabled={disabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="text-sm text-slate-700">{option.label}</label>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            )}
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              className={`w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-500 ${
                Icon ? 'pl-10' : ''
              } ${
                showPasswordToggle ? 'pr-12' : ''
              } ${
                error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''
              }`}
              {...props}
            />
            {showPasswordToggle && (
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            )}
          </div>
        )
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && type !== 'checkbox' && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-slate-500">{helpText}</p>
      )}
    </div>
  )
}

// Form Group Component
export const AdminFormGroup = ({
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
      <div className={`border border-slate-200 rounded-xl p-6 ${className}`}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <div>
            <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
          <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <X className="h-5 w-5 text-slate-400" />
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
    <div className={`border border-slate-200 rounded-xl p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
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

// Form Actions Component
export const AdminFormActions = ({
  onCancel,
  onSave,
  onReset,
  cancelText = 'Cancel',
  saveText = 'Save',
  resetText = 'Reset',
  showCancel = true,
  showSave = true,
  showReset = false,
  loading = false,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-6 border-t border-slate-200 ${className}`}>
      {showReset && onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={loading || disabled}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resetText}
        </button>
      )}
      {showCancel && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || disabled}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      )}
      {showSave && onSave && (
        <button
          type="submit"
          disabled={loading || disabled}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

// Form Validation Component
export const AdminFormValidation = ({
  errors = {},
  touched = {},
  className = ''
}) => {
  const hasErrors = Object.keys(errors).length > 0

  if (!hasErrors) return null

  return (
    <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
          <ul className="mt-2 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="text-sm text-red-700">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminForm
