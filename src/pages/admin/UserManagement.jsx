import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, UserPlus, Eye, Edit, Trash2, Search, Filter,
  ArrowLeft, Shield, Mail, Phone, Calendar, CheckCircle, XCircle,
  MoreVertical, Download, Upload, RefreshCw, Settings, Crown,
  UserCheck, UserX, Star, AlertTriangle, TrendingUp, BarChart3,
  Grid, List, ChevronDown, ChevronUp, Lock, Unlock
} from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import AdminStatsCard from '../../components/AdminStatsCard'
import AdminFilters from '../../components/AdminFilters'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSubscription, setFilterSubscription] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [viewMode, setViewMode] = useState('table') // table, grid, list
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [expandedUsers, setExpandedUsers] = useState({})
  const [bulkActions, setBulkActions] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    premium: 0,
    newThisMonth: 0
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/users')
      const userData = response.data.users || response.data
      setUsers(userData)
      
      // Calculate stats
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const calculatedStats = {
        total: userData.length,
        active: userData.filter(user => user.is_active).length,
        premium: userData.filter(user => user.subscribed).length,
        newThisMonth: userData.filter(user => new Date(user.created_at) >= thisMonth).length
      }
      setStats(calculatedStats)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, {
        is_active: !currentStatus
      })
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleToggleSubscription = async (userId, currentSubscription) => {
    try {
      await axios.patch(`/api/admin/users/${userId}/subscription`, {
        subscribed: !currentSubscription
      })
      toast.success(`User subscription ${!currentSubscription ? 'activated' : 'deactivated'} successfully`)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast.error('Failed to update subscription')
    }
  }

  // Utility Functions
  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }))
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleBulkAction = async (action) => {
    if (bulkActions.length === 0) {
      toast.error('Please select users first')
      return
    }

    try {
      switch (action) {
        case 'activate':
          await Promise.all(bulkActions.map(id => 
            axios.patch(`/api/admin/users/${id}/status`, { is_active: true })
          ))
          toast.success(`${bulkActions.length} users activated`)
          break
        case 'deactivate':
          await Promise.all(bulkActions.map(id => 
            axios.patch(`/api/admin/users/${id}/status`, { is_active: false })
          ))
          toast.success(`${bulkActions.length} users deactivated`)
          break
        case 'delete':
          if (!window.confirm(`Are you sure you want to delete ${bulkActions.length} users?`)) return
          await Promise.all(bulkActions.map(id => 
            axios.delete(`/api/admin/users/${id}`)
          ))
          toast.success(`${bulkActions.length} users deleted`)
          break
      }
      setBulkActions([])
      setShowBulkActions(false)
      fetchUsers()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      toast.error('Failed to perform bulk action')
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Subscription', 'Created At'].join(','),
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.role,
        user.is_active ? 'Active' : 'Inactive',
        user.subscribed ? 'Premium' : 'Basic',
        new Date(user.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('Users exported successfully')
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active)
    const matchesSubscription = filterSubscription === 'all' ||
                               (filterSubscription === 'premium' && user.subscribed) ||
                               (filterSubscription === 'basic' && !user.subscribed)
    return matchesSearch && matchesRole && matchesStatus && matchesSubscription
  }).sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'created_at') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Modern Header */}
      <AdminHeader
        title="User Management"
        subtitle="Manage user accounts and permissions"
        icon={Users}
        iconColor="from-green-600 to-emerald-600"
        onRefresh={fetchUsers}
        actions={[
          {
            text: "Create User",
            icon: UserPlus,
            onClick: () => window.location.href = '/admin/users/create'
          }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={stats.total}
            subtitle="Total"
            icon={Users}
            iconColor="from-green-500 to-emerald-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={Users}
            trendText="All registered users"
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Active Users"
            value={stats.active}
            subtitle="Active"
            icon={UserCheck}
            iconColor="from-green-500 to-green-600"
            bgColor="from-green-500/5 to-emerald-500/5"
            borderColor="hover:border-green-300/50"
            shadowColor="hover:shadow-green-500/10"
            trend={true}
            trendIcon={CheckCircle}
            trendText={`${Math.round((stats.active / stats.total) * 100)}% active`}
            trendColor="text-green-600"
          />
          
          <AdminStatsCard
            title="Premium Users"
            value={stats.premium}
            subtitle="Premium"
            icon={Crown}
            iconColor="from-amber-500 to-yellow-500"
            bgColor="from-amber-500/5 to-yellow-500/5"
            borderColor="hover:border-amber-300/50"
            shadowColor="hover:shadow-amber-500/10"
            trend={true}
            trendIcon={Star}
            trendText="Premium subscribers"
            trendColor="text-amber-600"
          />
          
          <AdminStatsCard
            title="New This Month"
            value={stats.newThisMonth}
            subtitle="New"
            icon={TrendingUp}
            iconColor="from-purple-500 to-violet-500"
            bgColor="from-purple-500/5 to-violet-500/5"
            borderColor="hover:border-purple-300/50"
            shadowColor="hover:shadow-purple-500/10"
            trend={true}
            trendIcon={Calendar}
            trendText="Recent signups"
            trendColor="text-purple-600"
          />
        </div>

        {/* Modern Filters and Controls */}
        <AdminFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search users by name or email..."
          filters={[
            {
              value: filterRole,
              onChange: setFilterRole,
              options: [
                { value: 'all', label: 'All Roles' },
                { value: 'user', label: 'Users' },
                { value: 'admin', label: 'Admins' }
              ]
            },
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' }
              ]
            },
            {
              value: filterSubscription,
              onChange: setFilterSubscription,
              options: [
                { value: 'all', label: 'All Subscriptions' },
                { value: 'premium', label: 'Premium' },
                { value: 'basic', label: 'Basic' }
              ]
            }
          ]}
          viewModes={[
            { id: 'table', icon: BarChart3, title: 'Table View' },
            { id: 'grid', icon: Grid, title: 'Grid View' },
            { id: 'list', icon: List, title: 'List View' }
          ]}
          currentViewMode={viewMode}
          onViewModeChange={setViewMode}
          onRefresh={fetchUsers}
          actions={[
            {
              text: "Export",
              icon: Download,
              onClick: exportUsers,
              className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
            }
          ]}
          showBulkActions={bulkActions.length > 0}
          bulkActionsCount={bulkActions.length}
          onBulkAction={handleBulkAction}
          bulkActionOptions={[
            {
              text: "Activate",
              icon: UserCheck,
              action: 'activate',
              className: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
            },
            {
              text: "Deactivate",
              icon: UserX,
              action: 'deactivate',
              className: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700'
            },
            {
              text: "Delete",
              icon: Trash2,
              action: 'delete',
              className: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'
            }
          ]}
        />

        {/* Modern Users Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Users ({filteredUsers.length})
                </h3>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBulkActions(filteredUsers.map(user => user.id))
                    } else {
                      setBulkActions([])
                    }
                  }}
                  checked={bulkActions.length === filteredUsers.length && filteredUsers.length > 0}
                  className="rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-slate-600 font-medium">Select All</span>
              </div>
            </div>
          </div>
          
          {viewMode === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('full_name')}
                    >
                      <div className="flex items-center">
                        User
                        {sortBy === 'full_name' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center">
                        Role
                        {sortBy === 'role' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('is_active')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === 'is_active' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('subscribed')}
                    >
                      <div className="flex items-center">
                        Subscription
                        {sortBy === 'subscribed' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created
                        {sortBy === 'created_at' && (
                          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={bulkActions.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBulkActions([...bulkActions, user.id])
                            } else {
                              setBulkActions(bulkActions.filter(id => id !== user.id))
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          'User'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.subscribed 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.subscribed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Premium
                          </>
                        ) : (
                          'Basic'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserDetails(true)
                            }}
                            className="px-4 py-2.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            title="View Details"
                          >
                            <Eye className="h-5 w-5" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                          <Link
                            to={`/admin/users/${user.id}/edit`}
                            className="px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            title="Edit User"
                          >
                            <Edit className="h-5 w-5" />
                            <span className="text-sm font-medium">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
                              user.is_active 
                                ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                            title={user.is_active ? 'Deactivate User' : 'Activate User'}
                          >
                            {user.is_active ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                            <span className="text-sm font-medium">{user.is_active ? 'Lock' : 'Unlock'}</span>
                          </button>
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleSubscription(user.id, user.subscribed)}
                              className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md ${
                                user.subscribed 
                                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                              title={user.subscribed ? 'Remove Premium' : 'Add Premium'}
                            >
                              <Crown className="h-5 w-5" />
                              <span className="text-sm font-medium">{user.subscribed ? 'Premium' : 'Upgrade'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            title="Delete User"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Delete</span>
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-lg font-semibold text-gray-900">{user.full_name || 'No Name'}</h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={bulkActions.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkActions([...bulkActions, user.id])
                          } else {
                            setBulkActions(bulkActions.filter(id => id !== user.id))
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Subscription</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscribed ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscribed ? 'Premium' : 'Basic'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetails(true)
                          }}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="text-sm font-medium">View</span>
                        </button>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="Edit User"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="text-sm font-medium">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={bulkActions.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBulkActions([...bulkActions, user.id])
                          } else {
                            setBulkActions(bulkActions.filter(id => id !== user.id))
                          }
                        }}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{user.full_name || 'No Name'}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscribed ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscribed ? 'Premium' : 'Basic'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetails(true)
                          }}
                          className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                          <span className="text-sm font-medium">View</span>
                        </button>
                        <Link
                          to={`/admin/users/${user.id}/edit`}
                          className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="Edit User"
                        >
                          <Edit className="h-5 w-5" />
                          <span className="text-sm font-medium">Edit</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <span className="text-xl font-medium text-gray-700">
                        {selectedUser.firstname.charAt(0)}{selectedUser.lastname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">{selectedUser.full_name}</h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.contact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Learning Level</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedUser.learning_level}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.email_verified ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subscribed</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.subscribed ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
