import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
      setEmailSent(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-l from-neutral-950 to-transparent flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-neutral-900 rounded-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-neutral-800 mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white">Reset Password</h1>
          <p className="mt-2 text-neutral-400">Enter your email to receive a reset link</p>
        </div>

        {emailSent ? (
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 text-center">
            <svg className="mx-auto h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="mt-3 text-green-400">
              We've sent password reset instructions to your email.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline"
            >
              Return to Sign In
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </>
        )}

        <div className="mt-12 text-xs text-gray-500 text-center">
          <p>Need help? <a href="#" className="text-blue-400 hover:underline">Contact Support</a></p>
        </div>
      </div>
    </motion.div>
  )
}