import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/10 via-white to-magenta/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-magenta/10 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="font-head text-[120px] sm:text-[160px] font-black leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-magenta">
              4
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta to-purple">
              0
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-magenta">
              4
            </span>
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="font-head text-3xl sm:text-4xl font-black text-frill-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-lg text-frill-600">
            Oops! The page you're looking for seems to have gone off-season.
            <br />
            Don't worry, let's get you back on track.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mb-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-magenta animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-purple animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-purple text-white font-head text-sm font-black uppercase tracking-[.16em] px-8 py-4 rounded-frill-lg hover:bg-purple/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center gap-2 border-2 border-purple text-purple font-head text-sm font-black uppercase tracking-[.16em] px-8 py-4 rounded-frill-lg hover:bg-purple hover:text-white transition-all duration-300 hover:scale-105"
          >
            <Search size={20} />
            Browse Shop
          </Link>
        </div>

        {/* Additional Help */}
        <div className="bg-white/60 backdrop-blur-sm border border-frill-200 rounded-frill-lg p-8 max-w-lg mx-auto">
          <h3 className="font-head text-xl font-bold text-frill-900 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-frill-600 mb-6">
            Our collection might have the perfect piece you're imagining. Start exploring our latest designs or reach out to our team for help.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/collections"
              className="text-magenta font-semibold hover:text-magenta-hot hover:underline transition-colors flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Explore Collections
            </Link>
            <Link
              to="/contact"
              className="text-purple font-semibold hover:text-purple/80 hover:underline transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="mt-12 pt-8 border-t border-frill-200">
          <Link to="/" className="inline-block font-head text-xl font-black text-purple hover:text-magenta transition-colors">
            Fr<span className="text-magenta">i</span>ll
          </Link>
          <p className="text-frill-500 text-sm mt-2">Wear Your Imagination</p>
        </div>
      </div>
    </div>
  )
}
