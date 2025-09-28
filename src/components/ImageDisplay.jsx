import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle, Image as ImageIcon } from 'lucide-react'

const ImageDisplay = ({ 
  src, 
  alt, 
  description, 
  type = 'soil', 
  className = '',
  showDescription = true,
  showFallback = true 
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const getFallbackIcon = () => {
    switch (type) {
      case 'soil':
        return '🌱'
      case 'plant':
        return '🌿'
      case 'test':
        return '🧪'
      case 'analysis':
        return '🔬'
      default:
        return '📷'
    }
  }

  const getFallbackTitle = () => {
    switch (type) {
      case 'soil':
        return 'Soil Sample Image'
      case 'plant':
        return 'Plant Image'
      case 'test':
        return 'Soil Test Image'
      case 'analysis':
        return 'Analysis Image'
      default:
        return 'Learning Image'
    }
  }

  const getFallbackDescription = () => {
    switch (type) {
      case 'soil':
        return 'This would show a detailed soil sample for visual identification'
      case 'plant':
        return 'This would show plant condition or growth examples'
      case 'test':
        return 'This would show soil testing procedures and results'
      case 'analysis':
        return 'This would show professional soil analysis results'
      default:
        return 'This would show relevant learning material'
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  if (imageError || !src) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200 shadow-sm ${className}`}>
        <div className="text-center">
          <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mb-4 border-2 border-amber-200">
            <div className="text-center">
              <div className="text-6xl mb-3">{getFallbackIcon()}</div>
              <p className="text-gray-700 text-lg font-semibold">{getFallbackTitle()}</p>
              <p className="text-gray-600 text-sm">Visual Learning Material</p>
              <p className="text-gray-500 text-xs mt-2">(Image would be displayed here)</p>
            </div>
          </div>
          {showDescription && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">📋 Image Description:</h4>
              <p className="text-sm text-gray-700 italic leading-relaxed">
                {description || getFallbackDescription()}
              </p>
            </div>
          )}
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              💡 <strong>Learning Tip:</strong> Pay attention to the visual characteristics described above!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200 shadow-sm ${className}`}>
      <div className="text-center">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg mb-4 border-2 border-gray-200 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-4xl mb-2">⏳</div>
                <p className="text-gray-600 text-sm">Loading image...</p>
              </div>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {imageLoaded && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              <Eye className="h-3 w-3 inline mr-1" />
              Image
            </div>
          )}
        </div>
        {showDescription && description && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2">📋 Image Description:</h4>
            <p className="text-sm text-gray-700 italic leading-relaxed">
              {description}
            </p>
          </div>
        )}
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✅ <strong>Visual Learning:</strong> Study the image carefully to identify key characteristics!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageDisplay
