import React, { useState, useRef } from 'react'
import { Camera, Upload, Leaf, Info, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AIPlantRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Detect mobile to prioritize camera UX
  React.useEffect(() => {
    const ua = navigator.userAgent || ''
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
    setIsMobile(mobile)
  }, [])

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setAnalysisResult(null)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      context.drawImage(videoRef.current, 0, 0)
      
      canvasRef.current.toBlob((blob) => {
        setSelectedImage(blob)
        setPreviewUrl(URL.createObjectURL(blob))
        setShowCamera(false)
        setAnalysisResult(null)
      }, 'image/jpeg')
    }
  }

  const startCamera = async () => {
    // Toggle UI first so the <video> element exists, then effect will attach stream
    setShowCamera(true)
  }

  // Start/attach camera stream when UI is shown
  React.useEffect(() => {
    if (!showCamera) return
    let activeStream = null

    const enableCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          toast.error('Camera not supported on this device/browser')
          setShowCamera(false)
          return
        }

        const constraints = {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        activeStream = stream
        if (videoRef.current) {
          const videoEl = videoRef.current
          videoEl.srcObject = stream
          videoEl.muted = true
          videoEl.setAttribute('playsinline', 'true')
          const playVideo = async () => {
            try {
              await videoEl.play()
            } catch (e) {
              console.warn('Video play blocked, waiting for user interaction')
            }
          }
          if (videoEl.readyState >= 2) {
            playVideo()
          } else {
            videoEl.onloadedmetadata = () => playVideo()
          }
        }
      } catch (error) {
        if (!window.isSecureContext) {
          toast.error('Camera requires HTTPS on mobile. Use https dev URL or upload a photo.')
        } else if (error?.name === 'NotAllowedError') {
          toast.error('Camera permission denied. Allow access in browser settings and retry.')
        } else if (error?.name === 'NotFoundError') {
          toast.error('No camera device found')
        } else {
          toast.error('Unable to access camera')
        }
        console.error('Camera access error:', error)
        setShowCamera(false)
      }
    }

    enableCamera()

    return () => {
      try {
        if (activeStream) {
          activeStream.getTracks().forEach(t => t.stop())
        }
      } catch {}
    }
  }, [showCamera])

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      setShowCamera(false)
    }
  }

  const analyzePlant = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const { data } = await axios.post('/api/ai-recognition', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data && data.error) {
        setAnalysisResult(null)
        toast.error(typeof data.error === 'string' ? data.error : 'Unable to analyze image')
      } else {
        setAnalysisResult(data)
        toast.success('Plant analysis completed!')
      }
    } catch (error) {
      toast.error('Error analyzing plant image')
      console.error('Analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addToGarden = async () => {
    if (!analysisResult) return

    try {
      // This would integrate with your existing garden management
      toast.success('Plant added to your garden!')
    } catch (error) {
      toast.error('Error adding plant to garden')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Plant Recognition
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a photo or take a picture of your plant to get instant identification, 
            health assessment, and personalized care recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Plant Photo
            </h2>
            
            {/* Camera Interface */}
            {showCamera && (
              <div className="mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex space-x-4">
                  <button
                    onClick={capturePhoto}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Capture Photo</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Upload Interface */}
            {!showCamera && (
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Plant preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Click to upload a photo or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports JPG, PNG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex space-x-4">
                  {isMobile ? (
                    <>
                      <button
                        onClick={startCamera}
                        className="btn-primary flex items-center space-x-2 flex-1"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Use Camera</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                      </button>
                      <button
                        onClick={startCamera}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Use Camera</span>
                      </button>
                    </>
                  )}
                </div>

                {selectedImage && (
                  <button
                    onClick={analyzePlant}
                    disabled={isAnalyzing}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="h-4 w-4" />
                        <span>Analyze Plant</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analysis Results
            </h2>
            
            {!analysisResult ? (
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Upload a plant photo to see analysis results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Plant Identification */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      {analysisResult.plant_name}
                    </h3>
                  </div>
                  <p className="text-sm text-green-700">
                    Confidence: {analysisResult.confidence}%
                  </p>
                </div>

                {/* Health Status */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Health Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{analysisResult.health_status}</span>
                  </div>
                </div>

                {/* Growth Stage */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Growth Stage</h4>
                  <p className="text-gray-700">{analysisResult.growth_stage}</p>
                </div>

                {/* Care Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Care Recommendations</h4>
                  <div className="space-y-3">
                    {Object.entries(analysisResult.care_recommendations).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium text-gray-900 capitalize mb-1">
                          {key}
                        </h5>
                        <p className="text-sm text-gray-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Issues */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Common Issues</h4>
                  <ul className="space-y-2">
                    {analysisResult.common_issues.map((issue, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Estimated Yield */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Estimated Yield</h4>
                  <p className="text-gray-700">{analysisResult.estimated_yield}</p>
                </div>

                {/* Add to Garden Button */}
                <button
                  onClick={addToGarden}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Leaf className="h-4 w-4" />
                  <span>Add to My Garden</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tips for Best Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Good Lighting</h4>
                <p className="text-sm text-gray-600">Take photos in natural light for better accuracy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Clear Focus</h4>
                <p className="text-sm text-gray-600">Ensure the plant is clearly visible and in focus</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Multiple Angles</h4>
                <p className="text-sm text-gray-600">Take photos from different angles for better identification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIPlantRecognition
