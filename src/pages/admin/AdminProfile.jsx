import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  User, Mail, Phone, Eye, EyeOff, Lock, Save, Edit, Upload, 
  Shield, ArrowLeft, Settings, Crown, Calendar, CheckCircle,
  AlertTriangle, Database, Activity, TrendingUp, Clock, 
  Globe, Key, Bell, FileText, BarChart3, Users, BookOpen,
  MessageSquare, Star, Award, Zap, Target, Briefcase
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
    lastLogin: new Date(),
    totalFeedbacks: 0,
    activeSubscriptions: 0,
    totalNotifications: 0,
    recentActivity: []
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
      const [statsResponse, usersResponse, feedbackResponse, subscriptionResponse] = await Promise.all([
        axios.get('/api/admin/stats').catch(() => ({ data: {} })),
        axios.get('/admin/users').catch(() => ({ data: { users: [] } })),
        axios.get('/admin/feedbacks').catch(() => ({ data: { feedbacks: [] } })),
        axios.get('/admin/subscriptions').catch(() => ({ data: { subscriptions: [] } }))
      ])
      
      const totalUsers = usersResponse.data?.users?.length || usersResponse.data?.length || 0
      const totalFeedbacks = feedbackResponse.data?.feedbacks?.length || feedbackResponse.data?.feedback_list?.length || 0
      const activeSubscriptions = subscriptionResponse.data?.subscriptions?.filter(s => s.status === 'active')?.length || 0
      
      setAdminStats({
        totalUsers: statsResponse.data.totalUsers || totalUsers,
        totalModules: statsResponse.data.totalModules || 0,
        systemUptime: '99.9%',
        lastLogin: user?.last_login ? new Date(user.last_login) : new Date(),
        totalFeedbacks: totalFeedbacks,
        activeSubscriptions: activeSubscriptions,
        totalNotifications: statsResponse.data.totalNotifications || 0,
        recentActivity: []
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <AdminHeader
        title="Admin Profile"
        subtitle="Manage your administrator account and view detailed statistics"
        icon={Shield}
        iconColor="from-green-600 to-emerald-600"
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
                  className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200'
                }
              ]}
            >

              {/* Profile Photo */}
              <div className="flex items-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="relative">
                  <div className="h-32 w-32 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg ring-4 ring-green-100">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-4xl">
                        {user?.full_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full cursor-pointer hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <Upload className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.full_name || 'Administrator'}</h3>
                  <div className="flex items-center mb-2">
                    <Mail className="h-4 w-4 text-green-600 mr-2" />
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                  {user?.contact && (
                    <div className="flex items-center mb-2">
                      <Phone className="h-4 w-4 text-green-600 mr-2" />
                      <p className="text-gray-600">{user.contact}</p>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                      <Shield className="h-4 w-4 text-green-700 mr-2" />
                      <span className="text-sm font-semibold text-green-700">Administrator</span>
                    </div>
                    {user?.is_super_admin && (
                      <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full">
                        <Crown className="h-4 w-4 text-yellow-700 mr-2" />
                        <span className="text-sm font-semibold text-yellow-700">Super Admin</span>
                      </div>
                    )}
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

              {/* Additional Profile Details */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-600">Member Since</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-600">Last Login</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {adminStats.lastLogin.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-600">Account Status</span>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-600">Email Verified</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user?.email_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user?.email_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <AdminFormGroup
                title="Security Settings"
                actions={[
                  {
                    text: showPasswordChange ? 'Cancel' : 'Change Password',
                    icon: Lock,
                    onClick: () => setShowPasswordChange(!showPasswordChange),
                    className: 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200'
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
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700 font-medium">Role</span>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold rounded-full shadow-sm">
                    Administrator
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700 font-medium">Status</span>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700 font-medium">Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    }) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700 font-medium">Last Login</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {adminStats.lastLogin.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </AdminCardSection>

            {/* Admin Statistics */}
            <AdminCardGrid columns={1}>
              <AdminCard
                title="Total Users"
                value={adminStats.totalUsers}
                subtitle="Registered Users"
                icon={Users}
                iconColor="from-green-500 to-emerald-600"
                status="success"
              />
              <AdminCard
                title="Learning Modules"
                value={adminStats.totalModules}
                subtitle="Available Content"
                icon={BookOpen}
                iconColor="from-emerald-500 to-teal-600"
                status="success"
              />
              <AdminCard
                title="Active Subscriptions"
                value={adminStats.activeSubscriptions}
                subtitle="Premium Members"
                icon={Crown}
                iconColor="from-yellow-500 to-amber-600"
                status="warning"
              />
              <AdminCard
                title="Total Feedbacks"
                value={adminStats.totalFeedbacks}
                subtitle="User Reviews"
                icon={MessageSquare}
                iconColor="from-green-500 to-emerald-600"
                status="success"
              />
              <AdminCard
                title="System Uptime"
                value={adminStats.systemUptime}
                subtitle="Reliability"
                icon={Activity}
                iconColor="from-teal-500 to-cyan-600"
                status="success"
              />
            </AdminCardGrid>

            {/* Quick Actions */}
            <AdminCardSection
              title="Quick Actions"
              icon={Zap}
              iconColor="text-green-600"
            >
              <div className="space-y-2">
                <Link
                  to="/admin"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Admin Dashboard</p>
                    <p className="text-xs text-gray-600">View system overview</p>
                  </div>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Manage Users</p>
                    <p className="text-xs text-gray-600">User management</p>
                  </div>
                </Link>
                <Link
                  to="/admin/subscription"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Subscriptions</p>
                    <p className="text-xs text-gray-600">Manage subscriptions</p>
                  </div>
                </Link>
                <Link
                  to="/admin/notifications"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    <p className="text-xs text-gray-600">Manage notifications</p>
                  </div>
                </Link>
                <Link
                  to="/admin/feedback"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Feedback</p>
                    <p className="text-xs text-gray-600">View user feedback</p>
                  </div>
                </Link>
                <Link
                  to="/admin/learning-paths"
                  className="flex items-center p-4 text-left rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 transition-all duration-200 group"
                >
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Learning Paths</p>
                    <p className="text-xs text-gray-600">Manage content</p>
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
