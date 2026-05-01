import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { X, LogOut, User } from 'lucide-react'
import { NAV_ITEMS } from '@/constants/navigation'
import { selectUser, logout } from '@/features/auth/authSlice'
import { cn } from '@/utils/cn'

export default function MobileDrawer({ open, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleLogout = () => {
    dispatch(logout())
    onClose()
    navigate('/login')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-purple/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Drawer panel */}
          <motion.aside
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-70 bg-white z-50
                        flex flex-col shadow-frill-xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <span className="font-head text-xl font-black text-purple">
                Fr<span className="text-magenta">i</span>ll
              </span>
              <button onClick={onClose} className="text-frill-400 hover:text-purple">
                <X size={22} />
              </button>
            </div>

            {/* User Info Section */}
            {user && (
              <div className="border-b border-frill-200 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-purple" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-frill-900 text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-frill-500 truncate">{user.email}</p>
                  </div>
                </div>
                {user.role === 'admin' && (
                  <span className="inline-block px-2 py-1 bg-purple text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    👑 Admin
                  </span>
                )}
              </div>
            )}

            <nav className="flex-1 p-4 flex flex-col gap-1">
              {NAV_ITEMS.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-frill-lg font-head
                     text-[.85rem] font-semibold transition-colors
                     ${isActive ? 'bg-frill-100 text-purple' : 'text-frill-600 hover:bg-frill-50'}`
                  }
                >
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-magenta text-white text-[.62rem]
                                      font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Auth Actions */}
            {user ? (
              <div className="border-t border-frill-200 p-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/account')
                    onClose()
                  }}
                  className="w-full px-4 py-3 bg-frill-100 text-purple font-semibold rounded-frill
                              hover:bg-frill-200 transition-colors text-sm uppercase tracking-wider"
                >
                  My Account
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-frill
                              transition-colors text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-frill-200 p-4">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-purple text-white font-semibold rounded-frill
                              hover:bg-purple/90 transition-colors text-sm uppercase tracking-wider block text-center"
                >
                  Sign In
                </NavLink>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}