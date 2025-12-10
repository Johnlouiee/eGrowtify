import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, LogOut, Calendar, Star, Info, Settings, Heart, ChevronDown, Bell, Users, BookOpen, BarChart3, MessageSquare, Share2 } from 'lucide-react'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const profileMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
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
    <nav className="bg-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-white">eGrowtify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <Link to="/" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
                <Link to="/features" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </>
            )}
            
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link to="/admin" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 relative group">
                      <Settings className="h-4 w-4" />
                      Admin Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <div className="relative" ref={userMenuRef}>
                      <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                      >
                        <Users className="h-4 w-4" />
                        Management
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {isUserMenuOpen && (
                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-[9999] border">
                          <Link 
                            to="/admin/users" 
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Users className="h-4 w-4" />
                            <span>User Management</span>
                          </Link>
                          <Link 
                            to="/admin/notifications" 
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Bell className="h-4 w-4" />
                            <span>Notifications</span>
                          </Link>
                          <Link 
                            to="/admin/subscription" 
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Star className="h-4 w-4" />
                            <span>Subscriptions</span>
                          </Link>
                          <Link 
                            to="/admin/learning-paths" 
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BookOpen className="h-4 w-4" />
                            <span>Learning Paths</span>
                          </Link>
                          <Link 
                            to="/admin/feedback" 
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Feedback Management</span>
                          </Link>
                        </div>
                      )}
                    </div>
                    <Link to="/admin/reports" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 relative group">
                      <BarChart3 className="h-4 w-4" />
                      Reports
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                      Dashboard
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link to="/garden" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                      My Plants
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link to="/ai-recognition" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                      AI Recognition
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link to="/smart-alerts" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 relative group">
                      <Bell className="h-4 w-4" />
                      Alerts
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link to="/seasonal-planning" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                      Seasonal Planning
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link to="/community/concepts" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 relative group">
                      <Share2 className="h-4 w-4" />
                      Community Hub
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                    </Link>
                  </>
                )}
                
                 {/* User Menu Dropdown */}
                 <div className="relative" ref={profileMenuRef}>
                   <button
                     onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                     className="flex items-center space-x-1 text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium"
                   >
                     <User className="h-4 w-4" />
                     <span>Profile</span>
                     <ChevronDown className="h-4 w-4" />
                   </button>
                   
                   {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999] border">
                      {isAdmin ? (
                        // Admin Profile Menu
                        <>
                          <Link
                            to="/admin/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Admin Profile</span>
                          </Link>
                          <Link
                            to="/about"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Info className="h-4 w-4" />
                            <span>About</span>
                          </Link>
                          <Link
                            to="/admin/subscription"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
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
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Calendar className="h-4 w-4" />
                            <span>Planning</span>
                          </Link>
                          <Link
                            to="/subscription"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Star className="h-4 w-4" />
                            <span>Subscription</span>
                          </Link>
                          <Link
                            to="/about"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Info className="h-4 w-4" />
                            <span>About</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/feedback"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
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
                          setIsProfileMenuOpen(false)
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
                <Link to="/login" className="text-white hover:text-green-100 px-3 py-2 rounded-md text-sm font-medium relative group">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
                <Link to="/register" className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-100 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-600 border-t border-green-700">
            {!user && (
              <>
                <Link
                  to="/"
                  className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                  <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                </Link>
                <Link
                  to="/features"
                  className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                  <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                </Link>
              </>
            )}
            
            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      User Management
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/notifications"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Notifications
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/subscription"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Subscriptions
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/learning-paths"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Learning Paths
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/feedback"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Feedback Management
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Reports
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    {/* Mobile Menu Items for Admin */}
                    <div className="border-t pt-2 mt-2">
                      <div className="text-xs font-semibold text-green-100 uppercase tracking-wider px-3 py-2">
                        Menu
                      </div>
                      <Link
                        to="/admin/profile"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Admin Profile</span>
                      </Link>
                      <Link
                        to="/about"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Info className="h-4 w-4" />
                        <span>About</span>
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
                      to="/dashboard"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/garden"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Plants
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/ai-recognition"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      AI Recognition
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/smart-alerts"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Smart Alerts
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/seasonal-planning"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Seasonal Planning
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    <Link
                      to="/community/concepts"
                      className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Community Hub
                      <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
                    </Link>
                    
                    {/* Mobile Menu Items */}
                    <div className="border-t pt-2 mt-2">
                      <div className="text-xs font-semibold text-green-100 uppercase tracking-wider px-3 py-2">
                        Menu
                      </div>
                      <Link
                        to="/seasonal-planning"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Planning</span>
                      </Link>
                      <Link
                        to="/subscription"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Star className="h-4 w-4" />
                        <span>Subscription</span>
                      </Link>
                      <Link
                        to="/about"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Info className="h-4 w-4" />
                        <span>About</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Manage Account</span>
                      </Link>
                      <Link
                        to="/feedback"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>Feedback</span>
                      </Link>
                      <Link
                        to="/community/concepts"
                        className="flex items-center space-x-2 text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Community Hub</span>
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
                )}
              </>
            ) : (
              <>
                  <Link
                    to="/login"
                    className="text-white hover:text-green-100 block px-3 py-2 rounded-md text-base font-medium relative group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                    <span className="absolute bottom-2 left-3 w-0 h-0.5 bg-white group-hover:w-[calc(100%-1.5rem)] transition-all duration-300 ease-in-out"></span>
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
