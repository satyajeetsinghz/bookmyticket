import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { register } from '../../services/auth';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(email, password, name)
      toast.success('Registration successful!')
      navigate('/')
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
      className="min-h-screen bg-background-DEFAULT bg-apple-dark flex"
    >
      {/* Graphic Area (Left Side) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 to-neutral-900 items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex justify-center mb-8">
            {/* Website logo  */}
            {/* <svg className="h-16 w-16 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg> */}
            <h2>Website logo</h2>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Welcome to MoviePass</h2>
          <p className="text-neutral-300 text-lg text-center">
            Join millions enjoying premium movie experiences. Your ticket to unlimited entertainment starts here.
          </p>
        </div>
      </div>

      {/* Form Area (Right Side) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="flex justify-center mb-6 lg:hidden">
            {/* <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg> */}
            <h2>Website logo</h2>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white">Create Account</h1>
            <p className="mt-2 text-neutral-400 text-sm">Join to access your personalized experience</p>
          </div>

          {/* Form Elements */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-neutral-500 absolute left-4 top-3.5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Username"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 text-neutral-500 absolute left-4 top-3.5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Email Address"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <LockClosedIcon className="h-5 w-5 text-neutral-500 absolute left-4 top-3.5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-neutral-800/50 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Password"
                    minLength={6}
                  />
                </div>
                <p className="mt-1.5 text-xs text-neutral-500">Must be at least 6 characters</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-colors"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-neutral-400">
            <p>Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 text-xs text-neutral-500 text-center">
            <p>By creating an account, you agree to our</p>
            <p className="mt-1">
              <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;