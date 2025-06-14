import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FilmIcon,
  UserPlusIcon,
  UserCircleIcon,
  CogIcon,
  CalendarIcon,
  TicketIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/20/solid'
import { MdHomeFilled } from 'react-icons/md'

export default function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950 supports-backdrop-blur:bg-neutral-900/10 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <TicketIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-neutral-100 group-hover:text-blue-600 transition-colors">
              BookMyTicket
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-blue-600' : 'text-neutral-200 hover:text-blue-600'
                }`
              }
            >
              <span className="relative z-10 flex items-center">
                <MdHomeFilled className="h-4 w-4 mr-2" />
                Home
              </span>
            </NavLink>

            <NavLink
              to="/movies"
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-blue-600' : 'text-neutral-200 hover:text-blue-600'
                }`
              }
            >
              <span className="relative z-10 flex items-center">
                <FilmIcon className="h-4 w-4 mr-2" />
                Movies
              </span>
            </NavLink>

            {currentUser && (
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-blue-600' : 'text-neutral-200 hover:text-blue-600'
                  }`
                }
              >
                <span className="relative z-10 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  My Bookings
                </span>
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-blue-600' : 'text-neutral-200 hover:text-blue-600'
                  }`
                }
              >
                <span className="relative z-10 flex items-center">
                  <CogIcon className="h-4 w-4 mr-2" />
                  Admin
                </span>
              </NavLink>
            )}
          </nav>

          {/* Secondary Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-neutral-200 hover:text-blue-600 transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-900/80 rounded-md transition-colors"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-900/80 rounded-md transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  <span className="hidden md:inline">Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(true)}>
              <Bars3Icon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[999] bg-neutral-950/95 backdrop-blur-md md:hidden transition-all">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <TicketIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">BookMyTicket</span>
            </Link>

            <button onClick={() => setMenuOpen(false)}>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Combined Navigation + Auth Section */}
          <div className="flex flex-col gap-4 px-6 py-10 bg-black h-screen text-white font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto]">
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
            >
              <MdHomeFilled className="h-5 w-5" />
              Home
            </NavLink>

            <NavLink
              to="/movies"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
            >
              <FilmIcon className="h-5 w-5" />
              Movies
            </NavLink>

            {currentUser && (
              <NavLink
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
              >
                <CalendarIcon className="h-5 w-5" />
                My Bookings
              </NavLink>
            )}

            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
              >
                <CogIcon className="h-5 w-5" />
                Admin
              </NavLink>
            )}

            <div className="border-t border-neutral-800 my-4" />

            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  Profile
                </Link>

                <button
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors text-left"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 text-[20px] font-medium hover:text-blue-500 transition-colors"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      )}

    </header>
  )
}
