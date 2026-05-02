import { useSelector } from 'react-redux'
import { selectUser } from '@/features/auth/authSlice'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, Calendar, MapPin, LogOut } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function AccountPage() {
  const user = useSelector(selectUser)

  if (!user) {
    return (
      <div className="min-h-screen bg-frill-50 py-12">
        <div className="section-inner max-w-2xl">
          <h1 className="font-head text-3xl font-black text-frill-900 mb-6">My Account</h1>
          <div className="bg-white rounded-frill-lg border border-frill-200 p-8 text-center">
            <p className="text-frill-600 mb-4">Please log in to view your account information.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-purple text-white font-semibold rounded-frill hover:bg-purple/90 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-frill-50 py-12">
      <div className="section-inner max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm">
          <Link to="/" className="text-purple hover:text-magenta transition-colors">Home</Link>
          <span className="text-frill-400">/</span>
          <span className="text-frill-600">Account</span>
        </div>

        <h1 className="font-head text-3xl sm:text-4xl font-black text-frill-900 mb-8">
          My Account
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-frill-lg border border-frill-200 p-6 sticky top-20">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple to-magenta flex items-center justify-center mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h2 className="font-head text-xl font-black text-frill-900">
                  {user.firstName} {user.lastName}
                </h2>
                {user.role === 'admin' && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    👑 Admin
                  </span>
                )}
              </div>
              <nav className="space-y-2">
                <button className="w-full text-left px-4 py-2 bg-purple text-white rounded-frill font-semibold transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-frill-600 hover:bg-frill-100 rounded-frill transition-colors">
                  Orders
                </button>
                <button className="w-full text-left px-4 py-2 text-frill-600 hover:bg-frill-100 rounded-frill transition-colors">
                  Addresses
                </button>
                <button className="w-full text-left px-4 py-2 text-frill-600 hover:bg-frill-100 rounded-frill transition-colors">
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-frill-lg border border-frill-200 p-8">
              <h3 className="font-head text-xl font-black text-frill-900 mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider">Name</p>
                    <p className="text-lg font-semibold text-frill-900">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-magenta/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-magenta" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider">Email</p>
                    <p className="text-lg font-semibold text-frill-900">{user.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {user.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <Phone size={24} className="text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider">Phone</p>
                      <p className="text-lg font-semibold text-frill-900">{user.phone}</p>
                    </div>
                  </div>
                )}

                {/* Role */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-purple" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider">Account Type</p>
                    <p className="text-lg font-semibold text-frill-900 capitalize">
                      {user.role === 'admin' ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full px-6 py-3 bg-frill-100 text-purple font-semibold rounded-frill hover:bg-frill-200 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-frill-lg border border-frill-200 p-6">
                <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider mb-2">Total Orders</p>
                <p className="font-head text-3xl font-black text-purple">0</p>
              </div>
              <div className="bg-white rounded-frill-lg border border-frill-200 p-6">
                <p className="text-xs text-frill-500 uppercase font-semibold tracking-wider mb-2">Rewards Points</p>
                <p className="font-head text-3xl font-black text-magenta">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
