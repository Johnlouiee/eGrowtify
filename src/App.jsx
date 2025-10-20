import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import UserRoute from './components/UserRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Garden from './pages/Garden'
import Profile from './pages/Profile'
import Features from './pages/Features'
import Feedback from './pages/Feedback'
import Subscription from './pages/Subscription'
import AIPlantRecognition from './pages/AIPlantRecognition'
import SmartAlerts from './pages/SmartAlerts'
import SeasonalPlanning from './pages/SeasonalPlanning'
import About from './pages/About'
import BeginnerLearningPath from './pages/BeginnerLearningPath'
import IntermediateLearningPath from './pages/IntermediateLearningPath'
import ExpertLearningPath from './pages/ExpertLearningPath'

// Admin Pages
import UserManagement from './pages/admin/UserManagement'
import CreateUser from './pages/admin/CreateUser'
import ManageNotifications from './pages/admin/ManageNotifications'
import ManageSubscription from './pages/admin/ManageSubscription'
import ManageSeasonalContent from './pages/admin/ManageSeasonalContent'
import ManageLearningPaths from './pages/admin/ManageLearningPaths'
import FeedbackManagement from './pages/admin/FeedbackManagement'
import AdminProfile from './pages/admin/AdminProfile'
import ActivityLogs from './pages/admin/ActivityLogs'
import HistoryLogs from './pages/admin/HistoryLogs'
import Reports from './pages/admin/Reports'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about" element={<About />} />
              <Route path="/learning/beginner" element={
                <UserRoute>
                  <BeginnerLearningPath />
                </UserRoute>
              } />
              <Route path="/learning/intermediate" element={
                <UserRoute>
                  <IntermediateLearningPath />
                </UserRoute>
              } />
              <Route path="/learning/expert" element={
                <UserRoute>
                  <ExpertLearningPath />
                </UserRoute>
              } />
              
              {/* Protected User Routes */}
              <Route path="/user/dashboard" element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              } />
              <Route path="/dashboard" element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              } />
              <Route path="/garden" element={
                <UserRoute>
                  <Garden />
                </UserRoute>
              } />
              <Route path="/profile" element={
                <UserRoute>
                  <Profile />
                </UserRoute>
              } />
              <Route path="/feedback" element={
                <UserRoute>
                  <Feedback />
                </UserRoute>
              } />
              <Route path="/subscription" element={
                <UserRoute>
                  <Subscription />
                </UserRoute>
              } />
              <Route path="/ai-recognition" element={
                <UserRoute>
                  <AIPlantRecognition />
                </UserRoute>
              } />
              <Route path="/smart-alerts" element={
                <UserRoute>
                  <SmartAlerts />
                </UserRoute>
              } />
              <Route path="/seasonal-planning" element={
                <UserRoute>
                  <SeasonalPlanning />
                </UserRoute>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="/admin/users/create" element={
                <AdminRoute>
                  <CreateUser />
                </AdminRoute>
              } />
              <Route path="/admin/notifications" element={
                <AdminRoute>
                  <ManageNotifications />
                </AdminRoute>
              } />
              <Route path="/admin/subscription" element={
                <AdminRoute>
                  <ManageSubscription />
                </AdminRoute>
              } />
              <Route path="/admin/seasonal-content" element={
                <AdminRoute>
                  <ManageSeasonalContent />
                </AdminRoute>
              } />
              <Route path="/admin/learning-paths" element={
                <AdminRoute>
                  <ManageLearningPaths />
                </AdminRoute>
              } />
              <Route path="/admin/feedback" element={
                <AdminRoute>
                  <FeedbackManagement />
                </AdminRoute>
              } />
              <Route path="/admin/profile" element={
                <AdminRoute>
                  <AdminProfile />
                </AdminRoute>
              } />
              <Route path="/admin/activity-logs" element={
                <AdminRoute>
                  <ActivityLogs />
                </AdminRoute>
              } />
              <Route path="/admin/history-logs" element={
                <AdminRoute>
                  <HistoryLogs />
                </AdminRoute>
              } />
              <Route path="/admin/reports" element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

