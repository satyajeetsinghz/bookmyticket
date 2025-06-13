import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neutral-900 flex"
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
          <h2 className="text-4xl font-bold text-white mb-4 text-center">Welcome Back</h2>
          <p className="text-neutral-300 text-lg text-center">
            Sign in to continue your cinematic journey with personalized recommendations.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-black/50 backdrop-blur-lg rounded-3xl shadow-xl border border-neutral-800">
        <div className="w-full max-w-md text-white">

          {/* Website Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            {/* <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg> */}
            <h2>Company Logo</h2>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-8">Sign In</h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-neutral-900 text-white text-sm font-semibold px-10 py-3 rounded-xl border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-neutral-900 text-white text-sm font-semibold px-10 py-3 rounded-xl border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-neutral-400 space-x-2">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-500 bg-neutral-800 border-neutral-700 rounded focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:underline hover:text-blue-300 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-sm text-center text-neutral-400">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:underline hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="mt-8 text-xs text-neutral-500 text-center">
            <p>By signing in, you agree to our</p>
            <p>
              <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}