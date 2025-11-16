import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, UserPlus, Mail, Phone, Lock, Eye, EyeOff, 
  Shield, User, AlertCircle, CheckCircle, X
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateUser = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    firstname: '',
    lastname: '',
    contact: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // 'user' or 'admin'
    
    // Admin-specific fields
    username: '',
    full_name: '',
    is_super_admin: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // If switching account type, clear irrelevant fields and errors
    if (name === 'userType') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Clear user-specific fields when switching to admin
        ...(value === 'admin' ? {
          firstname: '',
          lastname: '',
          contact: ''
        } : {}),
        // Clear admin-specific fields when switching to user
        ...(value === 'user' ? {
          username: '',
          full_name: '',
          is_super_admin: false
        } : {})
      }))
      
      // Clear all errors when switching account types
      setErrors({})
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Common validations (for both user and admin)
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 7) {
      newErrors.password = 'Password must be at least 7 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // User-specific validations
    if (formData.userType === 'user') {
      if (!formData.firstname) {
        newErrors.firstname = 'First name is required'
      }
      
      if (!formData.lastname) {
        newErrors.lastname = 'Last name is required'
      }
      
      if (!formData.contact) {
        newErrors.contact = 'Contact number is required'
      }
    }
    
    // Admin-specific validations
    if (formData.userType === 'admin') {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters'
      }
      
      if (!formData.full_name) {
        newErrors.full_name = 'Full name is required'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent double submission
    if (loading) {
      return
    }
    
    // Ensure userType is valid
    if (formData.userType !== 'user' && formData.userType !== 'admin') {
      toast.error('Please select an account type')
      return
    }
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }
    
    setLoading(true)
    
    try {
      // Ensure we're using the correct endpoint and payload based on account type
      if (formData.userType === 'admin') {
        // Create admin account only
        const endpoint = '/api/admin/create-admin'
        const payload = {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          is_super_admin: formData.is_super_admin
        }
        
        const response = await axios.post(endpoint, payload)
        
        if (response.data.success) {
          toast.success('Admin created successfully!')
          navigate('/admin/users')
        } else {
          toast.error(response.data.message || 'Failed to create admin account')
        }
      } else {
        // Create user account only
        const endpoint = '/api/admin/create-user'
        const payload = {
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          contact: formData.contact,
          password: formData.password,
          is_active: true // Admin-created users are immediately active
        }
        
        const response = await axios.post(endpoint, payload)
        
        if (response.data.success) {
          toast.success('User created successfully!')
          navigate('/admin/users')
        } else {
          toast.error(response.data.message || 'Failed to create user account')
        }
      }
    } catch (error) {
      console.error('Error creating account:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link 
                to="/admin/users" 
                className="flex items-center text-green-700 hover:text-green-800 mr-6 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to User Management
              </Link>
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Account</h1>
                  <p className="text-sm text-green-600">Create a new user or admin account</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
          <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Account Information
            </h2>
            <p className="text-sm text-green-700 mt-1">Fill in the details to create a new account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.userType === 'user' 
                    ? 'border-green-500 bg-green-50 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={formData.userType === 'user'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center w-full">
                    <div className={`p-2 rounded-lg mr-3 ${formData.userType === 'user' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <User className={`h-5 w-5 ${formData.userType === 'user' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className={`font-medium ${formData.userType === 'user' ? 'text-green-900' : 'text-gray-900'}`}>Regular User</div>
                      <div className={`text-sm ${formData.userType === 'user' ? 'text-green-700' : 'text-gray-500'}`}>Standard user account</div>
                    </div>
                  </div>
                </label>
                
                <label className={`relative flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.userType === 'admin' 
                    ? 'border-green-500 bg-green-50 shadow-md scale-105' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="admin"
                    checked={formData.userType === 'admin'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center w-full">
                    <div className={`p-2 rounded-lg mr-3 ${formData.userType === 'admin' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Shield className={`h-5 w-5 ${formData.userType === 'admin' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <div className={`font-medium ${formData.userType === 'admin' ? 'text-green-900' : 'text-gray-900'}`}>Admin User</div>
                      <div className={`text-sm ${formData.userType === 'admin' ? 'text-green-700' : 'text-gray-500'}`}>Administrator account</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Admin-specific fields */}
            {formData.userType === 'admin' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                        errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                      }`}
                      placeholder="Enter username"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.username}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                        errors.full_name ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                      }`}
                      placeholder="Enter full name"
                    />
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.full_name}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <input
                    type="checkbox"
                    name="is_super_admin"
                    checked={formData.is_super_admin}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label className="ml-2 text-sm text-gray-700 cursor-pointer">
                    Super Admin (Full system access)
                  </label>
                </div>
              </>
            )}

            {/* Common fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Contact field only for user accounts */}
              {formData.userType === 'user' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                        errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                      }`}
                      placeholder="Enter contact number"
                    />
                  </div>
                  {errors.contact && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.contact}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* User-specific fields */}
            {formData.userType === 'user' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                      errors.firstname ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.firstname}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                      errors.lastname ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.lastname}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Password fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:bg-green-50/30'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-green-100">
              <Link
                to="/admin/users"
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create {formData.userType === 'admin' ? 'Admin' : 'User'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser
