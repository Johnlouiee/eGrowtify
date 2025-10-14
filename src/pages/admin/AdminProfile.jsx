import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  User, Mail, Phone, Eye, EyeOff, Lock, Save, Edit, Upload, 
  Shield, ArrowLeft, Settings, Crown, Calendar, CheckCircle,
  AlertTriangle, Database, Activity, TrendingUp
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminCard, { AdminCardGrid, AdminCardSection } from '../../components/AdminCard'
import AdminForm, { AdminFormField, AdminFormGroup, AdminFormActions } from '../../components/AdminForm'

const AdminProfile = () => {
  const { user, updateProfile, isAdmin } = useAuth()
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
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalModules: 0,
    systemUptime: '99.9%',
    lastLogin: new Date()
  })

  // Redirect if not admin
  useEffect(() => {
    if (!user || !isAdmin) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/dashboard')
      return
    }
  }, [user, isAdmin, navigate])

  useEffect(() => {
    loadProfile()
    loadAdminStats()
  }, [])

  const loadProfile = async () => {
    try {
      setProfileData({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.contact || ''
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile data')
    }
  }

  const loadAdminStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats')
      setAdminStats({
        totalUsers: response.data.totalUsers || 0,
        totalModules: response.data.totalModules || 0,
        systemUptime: '99.9%',
        lastLogin: new Date()
      })
    } catch (error) {
      console.error('Error loading admin stats:', error)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateProfile(profileData)
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
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
    
    setLoading(true)
    
    try {
      await axios.post('/api/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      setShowPasswordChange(false)
      toast.success('Password changed successfully!')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <AdminHeader
        title="Admin Profile"
        subtitle="Manage your administrator account"
        icon={Shield}
        iconColor="from-blue-600 to-purple-600"
        showBackButton={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <AdminCardSection
              title="Profile Information"
              actions={[
                {
                  text: isEditing ? 'Cancel' : 'Edit Profile',
                  icon: Edit,
                  onClick: () => setIsEditing(!isEditing),
                  className: 'bg-blue-600 text-white hover:bg-blue-700'
                }
              ]}
            >

              {/* Profile Photo */}
              <div className="flex items-center mb-8">
                <div className="relative">
                  <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {user?.full_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900">{user?.full_name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2">
                    <Shield className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-600">Administrator</span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <AdminForm onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminFormField
                    label="Full Name"
                    name="full_name"
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    disabled={!isEditing}
                    required
                    icon={User}
                  />

                  <AdminFormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    required
                    icon={Mail}
                  />

                  <AdminFormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    icon={Phone}
                  />
                </div>

                {isEditing && (
                  <AdminFormActions
                    onCancel={() => setIsEditing(false)}
                    onSave={handleProfileUpdate}
                    loading={loading}
                    saveText="Save Changes"
                  />
                )}
              </AdminForm>

              {/* Password Change Section */}
              <AdminFormGroup
                title="Security Settings"
                actions={[
                  {
                    text: showPasswordChange ? 'Cancel' : 'Change Password',
                    icon: Lock,
                    onClick: () => setShowPasswordChange(!showPasswordChange),
                    className: 'bg-red-600 text-white hover:bg-red-700'
                  }
                ]}
              >
                {showPasswordChange && (
                  <AdminForm onSubmit={handlePasswordChange}>
                    <AdminFormField
                      label="Current Password"
                      name="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      required
                      icon={Lock}
                      showPasswordToggle={true}
                      showPassword={showCurrentPassword}
                      onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
                    />

                    <AdminFormField
                      label="New Password"
                      name="new_password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                      icon={Lock}
                      showPasswordToggle={true}
                      showPassword={showNewPassword}
                      onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                    />

                    <AdminFormField
                      label="Confirm New Password"
                      name="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      required
                      icon={Lock}
                      showPasswordToggle={true}
                      showPassword={showConfirmPassword}
                      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />

                    <AdminFormActions
                      onCancel={() => setShowPasswordChange(false)}
                      onSave={handlePasswordChange}
                      loading={loading}
                      saveText="Update Password"
                      saveVariant="error"
                    />
                  </AdminForm>
                )}
              </AdminFormGroup>
            </AdminCardSection>
          </div>

          {/* Admin Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Status */}
            <AdminCardSection
              title="Account Status"
              icon={CheckCircle}
              iconColor="text-green-600"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Role</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Administrator
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since</span>
                  <span className="text-sm font-medium text-slate-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Login</span>
                  <span className="text-sm font-medium text-slate-900">
                    {adminStats.lastLogin.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </AdminCardSection>

            {/* Admin Statistics */}
            <AdminCardGrid columns={1}>
              <AdminCard
                title="Total Users"
                value={adminStats.totalUsers}
                subtitle="Registered"
                icon={User}
                iconColor="from-blue-500 to-blue-600"
                status="info"
              />
              <AdminCard
                title="Learning Modules"
                value={adminStats.totalModules}
                subtitle="Available"
                icon={Database}
                iconColor="from-green-500 to-green-600"
                status="success"
              />
              <AdminCard
                title="System Uptime"
                value={adminStats.systemUptime}
                subtitle="Reliability"
                icon={Activity}
                iconColor="from-purple-500 to-purple-600"
                status="success"
              />
            </AdminCardGrid>

            {/* Quick Actions */}
            <AdminCardSection
              title="Quick Actions"
              icon={Settings}
              iconColor="text-slate-600"
            >
              <div className="space-y-3">
                <Link
                  to="/admin"
                  className="flex items-center p-3 text-left rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Shield className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Admin Dashboard</p>
                    <p className="text-xs text-slate-500">View system overview</p>
                  </div>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center p-3 text-left rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <User className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Manage Users</p>
                    <p className="text-xs text-slate-500">User management</p>
                  </div>
                </Link>
                <Link
                  to="/admin/subscription"
                  className="flex items-center p-3 text-left rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Crown className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Subscriptions</p>
                    <p className="text-xs text-slate-500">Manage subscriptions</p>
                  </div>
                </Link>
              </div>
            </AdminCardSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfile
