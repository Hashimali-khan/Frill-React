import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { NAV_ITEMS } from '@/constants/navigation'

export default function MobileDrawer({ open, onClose }) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}