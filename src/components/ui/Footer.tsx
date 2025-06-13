import { TicketIcon } from '@heroicons/react/24/outline'
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Company Info */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <TicketIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">BookMyTicket</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              The ultimate movie experience. Book, watch, and enjoy cinema like never before.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h4>
            <nav className="space-y-3">
              <Link to="/movies" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Movies
              </Link>
              <Link to="/showtimes" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Showtimes
              </Link>
              <Link to="/cinemas" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Our Cinemas
              </Link>
              <Link to="/membership" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Membership
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                Legal Notices
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h4>
            <address className="not-italic space-y-3">
              <p className="text-sm text-neutral-400">123 Cinema Street</p>
              <p className="text-sm text-neutral-400">Movie City, MC 10001</p>
              <a href="mailto:info@bookmyticket.com" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                info@bookmyticket.com
              </a>
              <a href="tel:+11234567890" className="block text-sm text-neutral-400 hover:text-white transition-colors">
                +1 (123) 456-7890
              </a>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} BookMyTicket, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Sales and Refunds
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Legal
              </a>
              <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Site Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}