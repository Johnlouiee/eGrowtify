import React, { useState, useRef } from 'react'
import { Camera, Upload, Leaf, Info, AlertCircle, CheckCircle, Droplets, Beaker, Thermometer, Image as ImageIcon, ChevronDown, ChevronRight, Shield, Calendar, X, MapPin, Sun, Home } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Plant image mapping for soil analysis recommendations - UNIQUE PLANT IMAGES
const plantImages = {
  // Vegetables - Unique plant photos
  'tomato': 'https://images.unsplash.com/photo-1546470427-5c1d0b0b0b0b?w=300&h=300&fit=crop&crop=center',
  'carrot': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center',
  'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300&h=300&fit=crop&crop=center',
  'spinach': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&h=300&fit=crop&crop=center',
  'eggplant': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'onion': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop&crop=center',
  'garlic': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop&crop=center',
  'potato': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop&crop=center',
  'cabbage': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'broccoli': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'cauliflower': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'radish': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center',
  'beetroot': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=300&fit=crop&crop=center',
  'green bean': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'pea': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  'zucchini': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
  'pumpkin': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
  'turnip': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=300&fit=crop&crop=center',
  'celery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
  
  // Fruits - Unique fruit photos
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
  'orange': 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=300&h=300&fit=crop&crop=center',
  'lemon': 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=300&h=300&fit=crop&crop=center',
  'grape': 'https://images.unsplash.com/photo-1537640538966-79f369143b8f?w=300&h=300&fit=crop&crop=center',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop&crop=center',
  'mango': 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=300&h=300&fit=crop&crop=center',
  'watermelon': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
  'cantaloupe': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=300&h=300&fit=crop&crop=center',
  'pineapple': 'https://images.unsplash.com/photo-1557800634-7bf3c73be389?w=300&h=300&fit=crop&crop=center',
  'peach': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
  'cherry': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
  'raspberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center',
  'blueberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center',
  
  // Herbs - Unique herb photos
  'basil': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'mint': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'rosemary': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'thyme': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'oregano': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'parsley': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'cilantro': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'chives': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'sage': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'lavender': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'ginger': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  'turmeric': 'https://images.unsplash.com/photo-1615485925534-f28a7b4a82c3?w=300&h=300&fit=crop&crop=center',
  
  // Flowers - Unique flower photos
  'rose': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'sunflower': 'https://images.unsplash.com/photo-1597848212624-e17eb04ad490?w=300&h=300&fit=crop&crop=center',
  'marigold': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'petunia': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'tulip': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'lily': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'chrysanthemum': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'gerbera daisy': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'impatiens': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'begonia': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'zinnia': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'california poppy': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'cosmos': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'daylilies': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  'black-eyed susans': 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop&crop=center',
  
  // Trees - Unique tree photos
  'oak': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'maple': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'birch': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'pine': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'spruce': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'cedar': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'magnolia': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  'japanese maple': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop&crop=center',
  
  // Succulents - Unique succulent photos
  'aloe vera': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'echeveria': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'jade plant': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'sedum': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'kalanchoe': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'haworthia': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'agave': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'cactus': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center',
  'succulent': 'https://images.unsplash.com/photo-1509423350716-97f2360af5e0?w=300&h=300&fit=crop&crop=center'
}

// Function to get plant image
const getPlantImage = (plantName) => {
  const normalizedName = plantName.toLowerCase().trim()
  return plantImages[normalizedName] || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center' // Default plant image
}

const AIPlantRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [soilResult, setSoilResult] = useState(null)
  const [analysisMode, setAnalysisMode] = useState('plant') // 'plant' | 'soil'
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showPlantModal, setShowPlantModal] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    care: false,
    seasonal: false,
    pests: false,
    issues: false
  })
  const [showAddToGardenModal, setShowAddToGardenModal] = useState(false)
  const [gardens, setGardens] = useState([])
  const [addToGardenForm, setAddToGardenForm] = useState({
    garden_id: '',
    environment: 'outdoor',
    planting_date: new Date().toISOString().split('T')[0]
  })
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Toggle collapsible sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Fetch gardens for the dropdown
  const fetchGardens = async () => {
    try {
      const response = await axios.get('/garden')
      setGardens(response.data.gardens || [])
    } catch (error) {
      console.error('Error fetching gardens:', error)
      toast.error('Failed to load gardens')
    }
  }

  // Handle add to garden form submission
  const handleAddToGarden = async (e) => {
    e.preventDefault()
    
    if (!addToGardenForm.garden_id) {
      toast.error('Please select a garden')
      return
    }

    try {
      // Create FormData to include the image
      const formData = new FormData()
      formData.append('name', analysisResult.plant_name)
      formData.append('type', analysisResult.plant_type || 'unknown')
      formData.append('environment', addToGardenForm.environment)
      formData.append('care_guide', analysisResult.care_guide)
      formData.append('ideal_soil_type', analysisResult.care_recommendations?.soil || 'Well-draining soil')
      formData.append('watering_frequency', '7')
      formData.append('fertilizing_frequency', '30')
      formData.append('pruning_frequency', '60')
      formData.append('garden_id', addToGardenForm.garden_id)
      formData.append('planting_date', addToGardenForm.planting_date)
      
      // Add the original uploaded image if available
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      const response = await axios.post('/plant/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast.success('Plant added to garden successfully!')
      setShowAddToGardenModal(false)
      setAddToGardenForm({
        garden_id: '',
        environment: 'outdoor',
        planting_date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error adding plant to garden:', error)
      toast.error('Failed to add plant to garden')
    }
  }

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
      setSoilResult(null)
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
        setSoilResult(null)
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

  const analyzeSoil = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const { data } = await axios.post('/api/soil-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data && data.error) {
        setSoilResult(null)
        toast.error(typeof data.error === 'string' ? data.error : 'Unable to analyze soil image')
      } else {
        setSoilResult(data)
        toast.success('Soil analysis completed!')
      }
    } catch (error) {
      toast.error('Error analyzing soil image')
      console.error('Soil analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI Plant & Soil Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Identify plants and analyze soil from a photo. Get identification, health status, moisture, texture, pH, and care suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Photo
            </h2>

            {/* Mode Toggle */}
            <div className="mb-4 inline-flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => { setAnalysisMode('plant'); setSoilResult(null) }}
                className={`px-4 py-2 text-sm font-medium ${analysisMode === 'plant' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Plant
              </button>
              <button
                onClick={() => { setAnalysisMode('soil'); setAnalysisResult(null) }}
                className={`px-4 py-2 text-sm font-medium border-l border-gray-200 ${analysisMode === 'soil' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Soil
              </button>
            </div>
            
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
                    onClick={analysisMode === 'plant' ? analyzePlant : analyzeSoil}
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
                        {analysisMode === 'plant' ? <Leaf className="h-4 w-4" /> : <Droplets className="h-4 w-4" />}
                        <span>{analysisMode === 'plant' ? 'Analyze Plant' : 'Analyze Soil'}</span>
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
              {analysisMode === 'plant' ? 'Plant Results' : 'Soil Results'}
            </h2>
            
            {analysisMode === 'plant' ? (
              !analysisResult ? (
                <div className="text-center py-12">
                  <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Upload a plant photo to see analysis results
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                {/* Plant Identification - Ultra Compact Header */}
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold text-green-900 text-lg">
                        {analysisResult.plant_name}
                      </h3>
                      <span className="text-sm text-green-700">
                        ({analysisResult.confidence}% confidence)
                      </span>
                    </div>
                    {analysisResult.ai_enriched && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        AI Enhanced
                      </span>
                    )}
                  </div>
                </div>

                {/* Health Status and Growth Stage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Health Status */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Health Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{analysisResult.health_status}</span>
                    </div>
                  </div>

                  {/* Growth Stage */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Growth Stage</h4>
                    <p className="text-sm text-gray-700">{analysisResult.growth_stage}</p>
                  </div>
                </div>

                {/* Collapsible Care Recommendations */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleSection('care')}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Care Recommendations</span>
                      <span className="text-xs text-gray-500">({Object.keys(analysisResult.care_recommendations).length} items)</span>
                    </div>
                    {expandedSections.care ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  {expandedSections.care && (
                    <div className="px-3 pb-3 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {Object.entries(analysisResult.care_recommendations).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 capitalize mb-2 text-sm">
                              {key}
                            </h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Collapsible Seasonal Notes */}
                {analysisResult.seasonal_notes && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection('seasonal')}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">Seasonal Care Notes</span>
                      </div>
                      {expandedSections.seasonal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {expandedSections.seasonal && (
                      <div className="px-3 pb-3 border-t border-gray-100">
                        <div className="text-gray-700 text-sm mt-3">
                          {typeof analysisResult.seasonal_notes === 'string' ? (
                            <p>{analysisResult.seasonal_notes}</p>
                          ) : typeof analysisResult.seasonal_notes === 'object' ? (
                            <div className="space-y-2">
                              {Object.entries(analysisResult.seasonal_notes).map(([season, notes]) => (
                                <div key={season}>
                                  <strong className="capitalize text-sm">{season}:</strong>
                                  <p className="text-sm ml-1 mt-1">{notes}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>{String(analysisResult.seasonal_notes)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsible Pest & Disease Information */}
                {analysisResult.pest_diseases && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection('pests')}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Pest & Disease Prevention</span>
                      </div>
                      {expandedSections.pests ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {expandedSections.pests && (
                      <div className="px-3 pb-3 border-t border-gray-100">
                        <div className="text-gray-700 text-sm mt-3">
                          {typeof analysisResult.pest_diseases === 'string' ? (
                            <p>{analysisResult.pest_diseases}</p>
                          ) : typeof analysisResult.pest_diseases === 'object' ? (
                            <div className="space-y-2">
                              {analysisResult.pest_diseases.common_threats && (
                                <div>
                                  <strong className="text-sm">Common Threats:</strong>
                                  <p className="text-sm ml-1 mt-1">
                                    {Array.isArray(analysisResult.pest_diseases.common_threats) ? 
                                      analysisResult.pest_diseases.common_threats.join(', ') : 
                                      analysisResult.pest_diseases.common_threats
                                    }
                                  </p>
                                </div>
                              )}
                              {analysisResult.pest_diseases.prevention && (
                                <div>
                                  <strong className="text-sm">Prevention:</strong>
                                  <p className="text-sm ml-1 mt-1">
                                    {Array.isArray(analysisResult.pest_diseases.prevention) ? 
                                      analysisResult.pest_diseases.prevention.join(', ') : 
                                      analysisResult.pest_diseases.prevention
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p>{String(analysisResult.pest_diseases)}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Collapsible Common Issues */}
                {analysisResult.common_issues && analysisResult.common_issues.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection('issues')}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-gray-900">Common Issues</span>
                        <span className="text-xs text-gray-500">({analysisResult.common_issues.length} issues)</span>
                      </div>
                      {expandedSections.issues ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {expandedSections.issues && (
                      <div className="px-3 pb-3 border-t border-gray-100">
                        <div className="space-y-2 mt-3">
                          {Array.isArray(analysisResult.common_issues) ? analysisResult.common_issues.map((issue, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-gray-700">
                                {typeof issue === 'string' ? (
                                  <span>{issue}</span>
                                ) : typeof issue === 'object' && issue.issue ? (
                                  <div>
                                    <div className="font-medium text-sm">{issue.issue}</div>
                                    {issue.solution && (
                                      <div className="text-sm text-gray-600 mt-1">
                                        <strong>Solution:</strong> {issue.solution}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span>{String(issue)}</span>
                                )}
                              </div>
                            </div>
                          )) : (
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-gray-700">{String(analysisResult.common_issues || 'No issues identified')}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ultra Compact Footer with Action */}
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                  <div className="flex items-center space-x-4">
                    {analysisResult.ai_enriched && (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-700">AI Enhanced</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Add to Garden button clicked')
                      fetchGardens()
                      setShowAddToGardenModal(true)
                      console.log('Modal should be opening')
                    }}
                    className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm"
                  >
                    <Leaf className="h-4 w-4" />
                    <span>Add to Garden</span>
                  </button>
                </div>
                </div>
              )
            ) : (
              !soilResult ? (
                <div className="text-center py-12">
                  <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload a soil photo to see analysis results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Moisture */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-1">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Moisture</h3>
                    </div>
                    <p className="text-sm text-blue-800">{soilResult.moisture_level}</p>
                  </div>

                  {/* Texture & pH */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Beaker className="h-5 w-5 text-amber-700" />
                        <h3 className="font-semibold text-amber-900">Texture</h3>
                      </div>
                      <p className="text-sm text-amber-800">{soilResult.texture}</p>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Thermometer className="h-5 w-5 text-violet-700" />
                        <h3 className="font-semibold text-violet-900">pH</h3>
                      </div>
                      <p className="text-sm text-violet-800">{soilResult.ph}</p>
                    </div>
                  </div>

                  {/* Organic Matter & Drainage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Organic Matter</h3>
                      </div>
                      <p className="text-sm text-green-800">{soilResult.organic_matter}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Drainage</h3>
                      </div>
                      <p className="text-sm text-blue-800">{soilResult.drainage}</p>
                    </div>
                  </div>

                  {/* Soil Health Score */}
                  {soilResult.soil_health_score && (
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <h3 className="font-semibold text-emerald-900">Soil Health Score</h3>
                      </div>
                      <p className="text-sm text-emerald-800">{soilResult.soil_health_score}</p>
                    </div>
                  )}

                  {/* Nutrient Indicators & Compaction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Beaker className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-purple-900">Nutrient Indicators</h3>
                      </div>
                      <p className="text-sm text-purple-800">{soilResult.nutrient_indicators}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Thermometer className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold text-orange-900">Compaction</h3>
                      </div>
                      <p className="text-sm text-orange-800">{soilResult.compaction_assessment}</p>
                    </div>
                  </div>

                  {/* Water Retention & Root Development */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Water Retention</h3>
                      </div>
                      <p className="text-sm text-blue-800">{soilResult.water_retention}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Leaf className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Root Development</h3>
                      </div>
                      <p className="text-sm text-green-800">{soilResult.root_development}</p>
                    </div>
                  </div>

                  {/* Seasonal Considerations */}
                  {soilResult.seasonal_considerations && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Thermometer className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold text-yellow-900">Seasonal Considerations</h3>
                      </div>
                      <p className="text-sm text-yellow-800">{soilResult.seasonal_considerations}</p>
                    </div>
                  )}

                  {/* Soil Amendments */}
                  {soilResult.soil_amendments && (
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-1">
                        <Beaker className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-indigo-900">Recommended Soil Amendments</h3>
                      </div>
                      <p className="text-sm text-indigo-800">{soilResult.soil_amendments}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {Array.isArray(soilResult.recommendations) && soilResult.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {soilResult.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Enhanced Suitable Plants */}
                  {soilResult.suitable_plants && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">Recommended Plants for This Soil</h4>
                        <button
                          onClick={() => setShowPlantModal(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <ImageIcon className="w-4 h-4" />
                          View Plant Recommendations
                        </button>
                      </div>
                      {/* Plant Categories Preview */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Click the button above to view detailed plant recommendations with images for each category.
                        </p>
                        {typeof soilResult.suitable_plants === 'object' ? (
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(soilResult.suitable_plants).map((category) => (
                              <span key={category} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">
                                {category}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            {Array.isArray(soilResult.suitable_plants) 
                              ? `${soilResult.suitable_plants.length} plants recommended`
                              : 'Plant recommendations available'
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Enhancement Indicator */}
                  {soilResult.ai_analyzed && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Enhanced with AI Vision Analysis</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        This soil analysis has been enhanced using advanced AI vision to analyze your specific soil image and provide personalized plant recommendations based on the actual soil conditions visible in your photo.
                      </p>
                    </div>
                  )}
                </div>
              )
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

      {/* Plant Recommendations Modal */}
      {showPlantModal && soilResult.suitable_plants && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Recommended Plants for Your Soil</h3>
              <button
                onClick={() => setShowPlantModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {typeof soilResult.suitable_plants === 'object' ? (
                <div className="space-y-6">
                  {Object.entries(soilResult.suitable_plants).map(([category, plants]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 capitalize mb-4 text-lg">{category}</h4>
                      {Array.isArray(plants) ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {plants.map((plant, index) => {
                            const plantName = typeof plant === 'string' ? plant : plant.name || plant
                            return (
                              <div key={index} className="bg-white rounded-lg p-3 border border-green-200 hover:border-green-300 transition-colors">
                                <div className="flex flex-col items-center text-center">
                                  <img 
                                    src={getPlantImage(plantName)} 
                                    alt={plantName}
                                    className="w-20 h-20 rounded-lg object-cover mb-3"
                                    onError={(e) => {
                                      e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center'
                                    }}
                                  />
                                  <span className="text-sm font-medium text-green-800">{plantName}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : typeof plants === 'object' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.entries(plants).map(([plantName, description]) => (
                            <div key={plantName} className="bg-white rounded-lg p-4 border border-green-200 hover:border-green-300 transition-colors">
                              <div className="flex items-start space-x-4">
                                <img 
                                  src={getPlantImage(plantName)} 
                                  alt={plantName}
                                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                  onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center'
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-green-800 text-base">{plantName}</div>
                                  <div className="text-sm text-gray-700 mt-1">{description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <div className="flex flex-col items-center text-center">
                            <img 
                              src={getPlantImage(String(plants))} 
                              alt={String(plants)}
                              className="w-20 h-20 rounded-lg object-cover mb-3"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center'
                              }}
                            />
                            <span className="text-sm font-medium text-green-800">{String(plants)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : Array.isArray(soilResult.suitable_plants) ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {soilResult.suitable_plants.map((p, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-green-200 hover:border-green-300 transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <img 
                          src={getPlantImage(p)} 
                          alt={p}
                          className="w-20 h-20 rounded-lg object-cover mb-3"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center'
                          }}
                        />
                        <span className="text-sm font-medium text-green-800">{p}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={getPlantImage(String(soilResult.suitable_plants))} 
                      alt={String(soilResult.suitable_plants)}
                      className="w-20 h-20 rounded-lg object-cover mb-3"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop&crop=center'
                      }}
                    />
                    <span className="text-sm font-medium text-green-800">{String(soilResult.suitable_plants)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPlantModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Garden Modal */}
      {showAddToGardenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Plant to Garden</h3>
              <button
                onClick={() => setShowAddToGardenModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddToGarden} className="p-4 space-y-4">
              {/* Plant Info Display */}
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-900">{analysisResult.plant_name}</span>
                  <span className="text-sm text-green-700">({analysisResult.confidence}% confidence)</span>
                </div>
                <p className="text-sm text-green-700">{analysisResult.plant_type}</p>
              </div>

              {/* Garden Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Select Garden
                </label>
                <select
                  value={addToGardenForm.garden_id}
                  onChange={(e) => setAddToGardenForm(prev => ({ ...prev, garden_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Choose a garden...</option>
                  {gardens.map((garden) => (
                    <option key={garden.id} value={garden.id}>
                      {garden.name} ({garden.garden_type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Environment Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddToGardenForm(prev => ({ ...prev, environment: 'outdoor' }))}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      addToGardenForm.environment === 'outdoor'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    <span className="font-medium">Outdoor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddToGardenForm(prev => ({ ...prev, environment: 'indoor' }))}
                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      addToGardenForm.environment === 'indoor'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Indoor</span>
                  </button>
                </div>
              </div>

              {/* Planting Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Planting Date
                </label>
                <input
                  type="date"
                  value={addToGardenForm.planting_date}
                  onChange={(e) => setAddToGardenForm(prev => ({ ...prev, planting_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddToGardenModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Leaf className="h-4 w-4" />
                  <span>Add to Garden</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPlantRecognition
