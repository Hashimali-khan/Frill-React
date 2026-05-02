import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/5 to-magenta/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-purple hover:text-magenta transition-colors font-semibold mb-8"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <div className="bg-white rounded-frill-lg border border-frill-200 shadow-frill-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple/10 to-magenta/10 flex items-center justify-center mx-auto mb-4">
              <Mail size={32} className="text-magenta" />
            </div>
            <h1 className="font-head text-2xl font-black text-frill-900 mb-2">Reset Your Password</h1>
            <p className="text-frill-600">Enter your email to receive a password reset link</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-semibold text-frill-900 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-frill-300 rounded-frill-lg focus:outline-none focus:ring-2 focus:ring-purple/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple to-magenta text-white font-head font-bold uppercase tracking-wider rounded-frill-lg hover:from-purple/90 hover:to-magenta/90 transition-all duration-300 shadow-lg"
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm text-frill-600">
              Check your email for instructions to reset your password.
            </p>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-frill-200" />
            <span className="text-xs text-frill-400 font-semibold">OR</span>
            <div className="flex-1 h-px bg-frill-200" />
          </div>

          {/* Alt Actions */}
          <div className="space-y-3">
            <p className="text-sm text-frill-600 text-center mb-4">Don't have an account?</p>
            <Link
              to="/signup"
              className="block text-center px-6 py-3 border-2 border-purple text-purple font-head font-bold uppercase tracking-wider rounded-frill-lg hover:bg-purple hover:text-white transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-frill-500 mt-8">
          Still need help?{' '}
          <Link to="/contact" className="text-magenta font-semibold hover:text-magenta-hot transition-colors">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}
