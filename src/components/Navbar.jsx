import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, LogOut, Calendar, Star, Info, Settings, Heart, ChevronDown, Bell } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">eGrowtify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/features" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
              </>
            )}
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/users" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Manage Users
                    </Link>
                    <Link to="/admin/notifications" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      Manage Notifications
                    </Link>
                    <Link to="/admin/subscription" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Manage Subscription
                    </Link>
                    <Link to="/admin/seasonal-content" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Manage Seasonal Content
                    </Link>
                    <Link to="/admin/learning-paths" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Manage Learning Paths
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/garden" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      My Plants
                    </Link>
                    <Link to="/ai-recognition" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      AI Recognition
                    </Link>
                    <Link to="/smart-alerts" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      Alerts
                    </Link>
                    <Link to="/seasonal-planning" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Seasonal Planning
                    </Link>
                  </>
                )}
                
                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      {user.role === 'admin' ? (
                        // Admin Profile Menu
                        <>
                          <Link
                            to="/admin/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Admin Profile</span>
                          </Link>
                          <Link
                            to="/about"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Info className="h-4 w-4" />
                            <span>About</span>
                          </Link>
                          <Link
                            to="/admin/subscription"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Star className="h-4 w-4" />
                            <span>Managing Subscription</span>
                          </Link>
                        </>
                      ) : (
                        // Regular User Profile Menu
                        <>
                          <Link
                            to="/seasonal-planning"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Planning</span>
                          </Link>
                          <Link
                            to="/subscription"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Star className="h-4 w-4" />
                            <span>Subscription</span>
                          </Link>
                          <Link
                            to="/about"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Info className="h-4 w-4" />
                            <span>About</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/feedback"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="h-4 w-4" />
                            <span>Feedback</span>
                          </Link>
                        </>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsUserMenuOpen(false)
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {!user && (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
              </>
            )}
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/garden"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Plants
                </Link>
                <Link
                  to="/ai-recognition"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Recognition
                </Link>
                <Link
                  to="/smart-alerts"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Smart Alerts
                </Link>
                <Link
                  to="/seasonal-planning"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Seasonal Planning
                </Link>
                
                {/* Mobile Menu Items */}
                <div className="border-t pt-2 mt-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                    Menu
                  </div>
                  <Link
                    to="/seasonal-planning"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Planning</span>
                  </Link>
                  <Link
                    to="/subscription"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star className="h-4 w-4" />
                    <span>Subscription</span>
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Manage Account</span>
                  </Link>
                  <Link
                    to="/feedback"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Feedback</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
