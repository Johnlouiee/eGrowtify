import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPremium, setIsPremium] = useState(false)

  // Configure axios defaults
  axios.defaults.baseURL = '/api'
  axios.defaults.withCredentials = true

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/auth/status')
      if (response.data.authenticated) {
        setUser(response.data.user)
        setIsAdmin(response.data.is_admin)
        setIsPremium(response.data.is_premium || false)
      }
    } catch (error) {
      console.log('Not authenticated')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password })
      console.log('Login response:', response.data) // Debug log
      
      // Check if login was successful
      if (response.data.success) {
        setUser(response.data.user)
        setIsAdmin(response.data.is_admin)
        setIsPremium(response.data.is_premium || false)
        console.log('User set to:', response.data.user) // Debug log
        toast.success('Login successful!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Login failed')
        return { success: false, message: response.data.message }
      }
    } catch (error) {
      console.error('Login error details:', error) // Debug log
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData)
      // Do NOT log the user in here; require email verification first
      const data = response.data || {}
      if (data.success) {
        toast.success('Registration successful! Please verify your email.')
      } else {
        toast.error(data.message || 'Registration failed')
      }
      return { ...data, success: !!data.success }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
      setUser(null)
      setIsAdmin(false)
      setIsPremium(false)
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      // PUT to backend route: /profile (not /auth/profile)
      const putResponse = await axios.put('/profile', profileData)
      if (!putResponse.data?.success) {
        const msg = putResponse.data?.message || 'Profile update failed'
        toast.error(msg)
        return { success: false, message: msg }
      }

      // Fetch the latest user snapshot and attach avatar path from localStorage if present
      const getResponse = await axios.get('/profile')
      const updatedUser = getResponse.data?.user
      if (updatedUser) {
        try {
          const avatarPath = localStorage.getItem('profilePhotoPath')
          if (avatarPath) {
            updatedUser.avatar_path = avatarPath
          }
        } catch {}
        setUser(updatedUser)
      }
      toast.success('Profile updated successfully')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    isPremium,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

