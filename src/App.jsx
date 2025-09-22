import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

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
              
              {/* Protected User Routes */}
              <Route path="/user/dashboard" element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } />
              <Route path="/garden" element={
                <PrivateRoute>
                  <Garden />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/feedback" element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              } />
              <Route path="/subscription" element={
                <PrivateRoute>
                  <Subscription />
                </PrivateRoute>
              } />
              <Route path="/ai-recognition" element={
                <PrivateRoute>
                  <AIPlantRecognition />
                </PrivateRoute>
              } />
              <Route path="/smart-alerts" element={
                <PrivateRoute>
                  <SmartAlerts />
                </PrivateRoute>
              } />
              <Route path="/seasonal-planning" element={
                <PrivateRoute>
                  <SeasonalPlanning />
                </PrivateRoute>
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

