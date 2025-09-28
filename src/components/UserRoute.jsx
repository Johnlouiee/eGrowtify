import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const UserRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    toast.error('Please log in to access this page')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to admin dashboard if user is admin
  if (isAdmin) {
    toast.error('Admin users should use the admin dashboard')
    return <Navigate to="/admin" replace />
  }

  // User is authenticated and is not admin
  return children
}

export default UserRoute
