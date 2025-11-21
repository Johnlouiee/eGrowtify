import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Eye, EyeOff, Lock, Save, Edit, Upload, Trash2, AlertTriangle, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import authService from '../services/authService'

const Profile = () => {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: ''
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const [profileUser, setProfileUser] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        // Prefer backend snapshot to ensure phone/contact is accurate
        const resp = await axios.get('/profile')
        const u = resp.data?.user || {}
        setProfileData({
          full_name: u.full_name ?? user.full_name ?? '',
          email: u.email ?? user.email ?? '',
          phone: u.phone ?? user.phone ?? ''
        })
        // Store full profile user data for summary section
        setProfileUser(u)
        // Initialize avatar preview from stored path or user data
        try {
          const stored = localStorage.getItem('profilePhotoPath')
          const candidate = stored || user.avatar_path || null
          if (candidate) {
            setPhotoPreview(candidate.startsWith('http') || candidate.startsWith('/') ? candidate : `/${candidate}`)
          }
        } catch {}
      } catch (e) {
        // Fallback to context if API fails
        setProfileData({
          full_name: user.full_name || '',
          email: user.email || '',
          phone: user.phone || ''
        })
        setProfileUser(user)
        try {
          const stored = localStorage.getItem('profilePhotoPath')
          if (stored) setPhotoPreview(stored.startsWith('http') || stored.startsWith('/') ? stored : `/${stored}`)
        } catch {}
      }
    }
    loadProfile()
  }, [user])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await axios.put('/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      
      if (response.data.success) {
        toast.success('Password changed successfully!')
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
        setShowPasswordChange(false)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error changing password'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setProfileData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || ''
    })
    setIsEditing(false)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion')
      return
    }

    if (!window.confirm('Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.')) {
      return
    }

    setLoading(true)
    try {
      const response = await axios.delete('/profile/delete')
      if (response.data.success) {
        toast.success('Your account has been deleted successfully')
        
        // Clear local storage immediately
        localStorage.clear()
        
        // Clear auth cache
        authService.clearCache()
        
        // Redirect immediately to landing page with full page reload
        // This ensures all React state is cleared and user cannot access protected routes
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error deleting account'
      toast.error(message)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
             <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={startEditing}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Photo uploader at top of form */}
                <div className="p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-white border flex items-center justify-center">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Profile Photo</div>
                        <div className="text-xs text-gray-500">PNG, JPG up to 2MB</div>
                      </div>
                    </div>
                    <label className={`btn-secondary ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={!isEditing}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setPhotoFile(file)
                          setPhotoPreview(URL.createObjectURL(file))
                        }}
                      />
                      Choose
                    </label>
                  </div>
                  {photoFile && isEditing && (
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const form = new FormData()
                            form.append('photo', photoFile)
                            const { data } = await axios.post('/profile/photo', form, { headers: { 'Content-Type': 'multipart/form-data' } })
                            if (data?.success && data?.path) {
                              localStorage.setItem('profilePhotoPath', data.path)
                              toast.success('Photo uploaded!')
                            } else {
                              toast.error(data?.message || 'Upload failed')
                            }
                          } catch (e) {
                            toast.error('Upload failed')
                          }
                        }}
                        className="btn-primary"
                      >
                        Upload Photo
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      className="input-field pl-10"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="input-field pl-10"
                      disabled={!isEditing}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="text-xs text-gray-500 mb-2">Current: {profileData.phone || 'Not set'}</div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="Enter phone number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value.replace(/[^0-9+\-\s]/g, '')})}
                      className="input-field pl-10"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Password Change Section */}
            <div className="card mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>{showPasswordChange ? 'Hide' : 'Change Password'}</span>
                </button>
              </div>

              {showPasswordChange && (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        className="input-field pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="input-field pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        className="input-field pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>{loading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordChange(false)
                        setPasswordData({
                          current_password: '',
                          new_password: '',
                          confirm_password: ''
                        })
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Delete Account Section */}
            <div className="card mt-6 border-red-200 bg-red-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-red-900 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Delete Account</span>
                  </h2>
                  <p className="text-sm text-red-700 mt-1">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                  className="btn-secondary bg-red-600 hover:bg-red-700 text-white border-red-600 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Account</span>
                </button>
              </div>

              {showDeleteConfirm && (
                <div className="border-t border-red-200 pt-6 space-y-4">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900 mb-2">Warning: This action cannot be undone</h3>
                        <p className="text-sm text-red-800 mb-2">
                          Deleting your account will permanently remove:
                        </p>
                        <ul className="text-sm text-red-800 list-disc list-inside space-y-1 mb-3">
                          <li>All your profile information</li>
                          <li>All your gardens and plant tracking data</li>
                          <li>Your subscription and payment history</li>
                          <li>Your learning path progress</li>
                          <li>All other account-related data</li>
                        </ul>
                        <p className="text-sm font-medium text-red-900">
                          This action is irreversible. Please be certain before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="input-field w-full"
                    />
                  </div>

                  <div className="flex space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirmText !== 'DELETE'}
                      className="btn-primary bg-red-600 hover:bg-red-700 text-white border-red-600 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{loading ? 'Deleting...' : 'Permanently Delete Account'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteConfirmText('')
                      }}
                      disabled={loading}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={() => photoPreview && setShowPhotoModal(true)}
                    className={`relative ${photoPreview ? 'cursor-pointer hover:opacity-90 transition-opacity' : 'cursor-default'}`}
                    disabled={!photoPreview}
                  >
                    <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center shadow-lg ring-4 ring-gray-100 hover:ring-primary-200 transition-all">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="h-16 w-16 text-gray-500" />
                      )}
                    </div>
                    {photoPreview && (
                      <div className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 shadow-lg">
                        <Eye className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                  <div className="text-center">
                    <p className="font-medium text-gray-900 text-lg">{user.full_name || 'Not set'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Account Type:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {user.role === 'admin' ? 'Administrator' : 'User'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Member Since:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {profileUser?.created_at 
                          ? new Date(profileUser.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })
                          : user?.created_at 
                            ? new Date(user.created_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${
                        (profileUser?.is_active ?? user?.is_active ?? true) ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(profileUser?.is_active ?? user?.is_active ?? true) ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {showPhotoModal && photoPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10 shadow-lg"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={photoPreview} 
                alt="Profile Photo" 
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile

