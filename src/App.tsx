import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/common/Layout'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'))
const MovieList = lazy(() => import('./pages/movies/MovieList'))
const MovieDetail = lazy(() => import('./pages/movies/MovieDetails'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const UserBookings = lazy(() => import('./pages/user/UserBookings'))
const UserProfile = lazy(() => import('./pages/user/UserProfile'))

// Admin routes
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminMovies = lazy(() => import('./pages/admin/Movies'))
const AdminMovieEdit = lazy(() => import('./pages/admin/MovieEdit'))
const AdminMovieCreate = lazy(() => import('./pages/admin/MovieCreate'))
const AdminBookings = lazy(() => import('./pages/admin/Bookings'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))

function App() {
  const { currentUser, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="movies/:id" element={<MovieDetail />} />
          <Route path="login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          <Route path="register" element={!currentUser ? <Register /> : <Navigate to="/" />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          
          {/* Protected user routes */}
          <Route path="my-bookings" element={currentUser ? <UserBookings /> : <Navigate to="/login" />} />
          <Route path="profile" element={currentUser ? <UserProfile /> : <Navigate to="/login" />} />
        </Route>

        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={currentUser && isAdmin ? <AdminLayout /> : <Navigate to="/" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="movies/new" element={<AdminMovieCreate />} />
          <Route path="movies/edit/:id" element={<AdminMovieEdit />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )
}

export default App