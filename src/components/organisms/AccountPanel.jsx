import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, User, Mail, Phone, LogIn } from 'lucide-react'
import { logout, selectUser, selectIsAuthenticated } from '@/features/auth/authSlice'
import { cn } from '@/utils/cn'

export default function AccountPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
    setIsOpen(false)
    navigate('/login')
  }

  const togglePanel = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Account Icon Button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); togglePanel() }}
        className="header-icon-btn relative group z-60"
        aria-label="Account menu"
        title={isAuthenticated ? `${user.firstName} ${user.lastName}` : 'Sign in to your account'}
      >
        <User size={20} />
        <span className="absolute inset-0 rounded-frill bg-frill-200 opacity-0 group-hover:opacity-100 -z-10 transition-opacity" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close account panel"
        />
      )}

      {/* Account Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-80 bg-white shadow-frill-lg z-50',
          'transform transition-transform duration-300 ease-out',
          'flex flex-col',
          isOpen
            ? 'translate-x-0 lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto'
            : 'translate-x-full lg:translate-x-full lg:opacity-0 lg:pointer-events-none',
          // On large screens position as a floating panel near the header
          'lg:top-14 lg:right-6 lg:h-auto lg:w-72 lg:rounded-frill-lg lg:shadow-frill-lg lg:bg-white'
        )}
      >
        {/* Header */}
        <div className="lg:hidden border-b border-frill-200 p-4">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-frill-600 hover:text-purple transition-colors"
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* GUEST MODE CONTENT */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col gap-4 p-6 lg:p-0 lg:w-auto lg:gap-0">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-purple/10 to-magenta/10 rounded-frill-lg p-6 border border-frill-200 mb-4">
              <div className="mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple to-magenta flex items-center justify-center mb-3">
                  <User size={28} className="text-white" />
                </div>
              </div>
              <h3 className="font-head text-lg font-black text-frill-900 mb-2">
                Welcome to Frill
              </h3>
              <p className="text-frill-600 text-sm mb-6">
                Sign in to your account to access your profile, orders, and exclusive features.
              </p>

              {/* Sign In Button */}
              <button
                onClick={() => {
                  navigate('/login')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple to-magenta text-white font-head font-black uppercase tracking-wider rounded-frill hover:from-purple/90 hover:to-magenta/90 transition-all flex items-center justify-center gap-2 mb-3 shadow-lg"
              >
                <LogIn size={18} />
                Sign In
              </button>

              {/* Sign Up Button */}
              <button
                onClick={() => {
                  navigate('/signup')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 border-2 border-purple text-purple font-head font-bold uppercase tracking-wider rounded-frill hover:bg-purple hover:text-white transition-all"
              >
                Create Account
              </button>
            </div>

            {/* Features */}
            <div className="px-2 space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-frill-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-frill-900 text-sm">Track Orders</p>
                  <p className="text-frill-500 text-xs">View and manage all your purchases</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-frill-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-magenta">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-frill-900 text-sm">Save Designs</p>
                  <p className="text-frill-500 text-xs">Keep your custom creations</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-frill-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple">
                  ✓
                </div>
                <div>
                  <p className="font-semibold text-frill-900 text-sm">Exclusive Deals</p>
                  <p className="text-frill-500 text-xs">Get special member offers</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-frill-200" />

            {/* Footer Links */}
            <div className="space-y-2 px-2 lg:hidden">
              <button
                onClick={() => {
                  navigate('/contact')
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-frill-600 hover:text-purple hover:bg-frill-50 rounded-frill transition-colors text-sm font-semibold"
              >
                Need Help?
              </button>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block text-left px-3 py-2 text-frill-600 hover:text-purple hover:bg-frill-50 rounded-frill transition-colors text-sm font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED MODE CONTENT */
          <div className="flex-1 flex flex-col gap-4 p-6 lg:p-0 lg:w-auto lg:gap-0">
            {/* User Info Card */}
            <div className="bg-frill-50 rounded-frill-lg p-4 border border-frill-200 lg:hidden">
              <p className="text-sm text-frill-600 mb-3 font-semibold">Account Details</p>

              {/* Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-purple" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-frill-500 uppercase tracking-wider">Name</p>
                  <p className="font-semibold text-frill-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-magenta/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-magenta" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-frill-500 uppercase tracking-wider">Email</p>
                  <p className="font-semibold text-frill-900 truncate text-sm">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-cyan-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-frill-500 uppercase tracking-wider">Phone</p>
                    <p className="font-semibold text-frill-900">
                      {user.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Role Badge */}
              {user.role && (
                <div className="mt-4 pt-4 border-t border-frill-200">
                  <span
                    className={cn(
                      'inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                      user.role === 'admin'
                        ? 'bg-purple text-white'
                        : 'bg-magenta/20 text-magenta'
                    )}
                  >
                    {user.role === 'admin' ? ' Admin' : 'Customer'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 lg:hidden">
              <button
                type="button"
                onClick={() => {
                  navigate('/account')
                  setIsOpen(false)
                }}
                className="w-full px-4 py-3 bg-frill-100 text-purple font-semibold rounded-frill
                            hover:bg-frill-200 transition-colors text-sm uppercase tracking-wider"
              >
                My Account
              </button>

              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/admin')
                    setIsOpen(false)
                  }}
                  className="w-full px-4 py-3 bg-purple text-white font-semibold rounded-frill
                              hover:bg-purple/90 transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                   Admin Dashboard
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="lg:hidden my-2 border-t border-frill-200" />

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full lg:w-auto px-4 py-3 lg:py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-frill
                          lg:rounded-frill transition-colors text-sm uppercase tracking-wider flex items-center justify-center lg:justify-start gap-2
                          lg:px-3 lg:text-red-600 lg:hover:text-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  )
}