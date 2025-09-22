import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [resending, setResending] = useState(false)
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setVerificationStatus('error')
      setMessage('No verification token provided.')
    }
  }, [token])

  const verifyEmail = async (verificationToken) => {
    try {
      // Primary: POST body
      const { data } = await axios.post('/api/verify-email', { token: verificationToken })
      if (data?.success) {
        setVerificationStatus('success')
        setMessage(data.message)
        toast.success('Email verified successfully!')
        return
      }
      // Fallback: GET with query param (some proxies prefer GET)
      const resp = await axios.get('/api/verify-email', { params: { token: verificationToken } })
      if (resp.data?.success) {
        setVerificationStatus('success')
        setMessage(resp.data.message)
        toast.success('Email verified successfully!')
        return
      }
      const msg = data?.message || resp.data?.message || 'Failed to verify email'
      setVerificationStatus('error')
      setMessage(msg)
      toast.error(msg)
    } catch (error) {
      try {
        // Last attempt with GET if POST failed due to CORS/body parsing
        const resp = await axios.get('/api/verify-email', { params: { token: verificationToken } })
        if (resp.data?.success) {
          setVerificationStatus('success')
          setMessage(resp.data.message)
          toast.success('Email verified successfully!')
          return
        }
        const msg = resp.data?.message || 'Failed to verify email'
        setVerificationStatus('error')
        setMessage(msg)
        toast.error(msg)
      } catch (e2) {
        setVerificationStatus('error')
        const errorMessage = e2.response?.data?.message || error.response?.data?.message || 'Failed to verify email'
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    }
  }

  const resendVerification = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setResending(true)
    try {
      const { data } = await axios.post('/api/resend-verification', {
        email: email
      })

      if (data.success) {
        toast.success('Verification email sent! Please check your inbox.')
        setMessage('Verification email sent! Please check your inbox.')
      } else {
        toast.error(data.message)
        setMessage(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email'
      toast.error(errorMessage)
      setMessage(errorMessage)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Verify your email address to complete your registration
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {verificationStatus === 'verifying' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                to="/login"
                className="btn-primary w-full py-3 text-base font-medium"
              >
                Continue to Login
              </Link>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verification Failed
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              
              {/* Resend verification form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button
                  onClick={resendVerification}
                  disabled={resending}
                  className="btn-primary w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Resend Verification Email</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already verified?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help section */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Need Help?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your spam/junk folder for the verification email</li>
            <li>• Make sure you're using the correct email address</li>
            <li>• Verification links expire after 24 hours</li>
            <li>• Contact support if you continue having issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
