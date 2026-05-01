import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight, X, Globe, CircleUserRound, Sparkles, Eye, EyeOff } from 'lucide-react'
import { loginUser, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '@/features/auth/authSlice'
import { loginSchema } from '@/utils/validators'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Smart redirect: sends them back to where they came from (e.g., Checkout) or Home
  const from = location.state?.from?.pathname || '/'

  useEffect(() => { 
    if (isAuthenticated) navigate(from, { replace: true }) 
  }, [isAuthenticated, navigate, from])

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user?.role
      navigate(role === 'admin' ? '/admin' : from, { replace: true })
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Image with Dark Gradient Overlay for readability */}
      <img
        src="https://images.unsplash.com/photo-1621446511130-0ed6519bfeb6?q=80&w=1170&auto=format&fit=crop"
        alt="Fashion editorial"
        className="absolute inset-0 h-screen w-full object-cover opacity-80 mix-blend-lighten"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="relative z-10 min-h-screen flex flex-col lg:block">
        <div
          className="mt-auto w-full lg:absolute lg:right-0 lg:top-0 lg:h-full transition-all duration-500 animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8"
          style={{ width: 'min(100%, 440px)' }}
        >
          {/* Deep Frosted Glass Panel */}
          <div className="h-full w-full bg-[#1a1525]/70 backdrop-blur-xl border border-white/10 rounded-t-[32px] lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l lg:rounded-l-[32px] px-6 py-10 sm:px-8 lg:px-12 flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <Link to="/" className="inline-block font-head text-4xl font-black text-white mb-1 hover:scale-105 transition-transform origin-left tracking-wide">
                  Fr<span className="text-magenta">i</span>ll
                </Link>
                <p className="text-white/60 text-sm font-medium">Welcome back to your style.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/')}
                aria-label="Close"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in fade-in">
                <p className="text-rose-200 font-semibold text-sm text-center">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
              
              {/* Email Input */}
              <div>
                <label className="block text-[0.65rem] font-bold text-white/50 tracking-widest uppercase mb-2 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-magenta transition-colors" size={18} />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent text-white placeholder-white/30 pl-8 pr-2 py-3 border-b border-white/20
                               focus:outline-none focus:border-magenta focus:bg-white/5 transition-all rounded-t-md"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-rose-300 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[0.65rem] font-bold text-white/50 tracking-widest uppercase">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-magenta hover:text-magenta-hot transition-colors hover:underline underline-offset-4"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-magenta transition-colors" size={18} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-white placeholder-white/30 pl-8 pr-10 py-3 border-b border-white/20
                               focus:outline-none focus:border-magenta focus:bg-white/5 transition-all rounded-t-md"
                  />
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-rose-300 font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 px-5 py-4 bg-white text-black rounded-full font-head text-sm font-black tracking-widest uppercase
                           flex items-center justify-center gap-2 hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Dividers */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-[0.65rem] text-white/50 font-bold tracking-widest uppercase">Or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-4">
              {[Globe, CircleUserRound, Sparkles].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="h-12 w-12 flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            {/* Footer / Signup Route */}
            <div className="mt-10 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/60 mb-3">New to Frill?</p>
              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center rounded-full bg-magenta/10 border border-magenta/50 py-3.5 text-xs font-head font-bold tracking-widest uppercase text-magenta hover:bg-magenta hover:text-white transition-all active:scale-[0.98]"
              >
                Create Account
              </Link>
            </div>

            <p className="text-center text-[10px] text-white/40 mt-6 font-medium leading-relaxed">
              By signing in, you agree to our <br className="sm:hidden" /> Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}