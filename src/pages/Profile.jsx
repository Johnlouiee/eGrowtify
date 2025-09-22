import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Phone, Eye, EyeOff, Lock, Save, Edit, Upload } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
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
                            const normalized = data.path.startsWith('http') || data.path.startsWith('/') ? data.path : `/${data.path}`
                            setPhotoPreview(normalized)
                            // Notify other parts of the app (e.g., dashboard) that avatar changed
                            try { window.dispatchEvent(new CustomEvent('profilePhotoUpdated', { detail: { path: data.path } })) } catch {}
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
          </div>

          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-7 w-7 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.full_name || 'Not set'}</p>
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
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

