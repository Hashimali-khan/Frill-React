import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ShoppingBag, Search, Menu } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useScrolled } from '@/hooks/useScrolled'
import { openCart, selectCartCount } from '@/features/cart/cartSlice'
import { selectIsAuthenticated } from '@/features/auth/authSlice'
import MobileDrawer from './MobileDrawer'
import AccountPanel from './AccountPanel'
import { NAV_ITEMS } from '@/constants/navigation'

export default function SiteHeader() {
  const scrolled = useScrolled()
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const primaryLinks = NAV_ITEMS.filter((item) => item.href !== '/')

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-white/60',
          'bg-white/80 backdrop-blur-md transition-all duration-200',
          scrolled && 'shadow-frill-sm bg-white/90'
        )}
      >
        <div className="section-inner flex items-center justify-between h-16 gap-4 lg:gap-6">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-head text-[1.75rem] font-black text-purple tracking-tight">
              Fr<span className="text-magenta">i</span>ll
            </span>
            <span className="text-[.58rem] font-semibold tracking-[.18em] uppercase text-frill-400 mt-0.5">
              Wear Your Imagination
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  'font-head text-[.78rem] font-semibold tracking-[.08em] uppercase',
                  'px-[.85rem] py-2 rounded-frill transition-all duration-200',
                  isActive
                    ? 'text-magenta bg-frill-100'
                    : 'text-frill-600 hover:text-purple hover:bg-frill-100'
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button className="header-icon-btn hidden sm:flex" aria-label="Search">
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={() => dispatch(openCart())}
              className="header-icon-btn relative"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 bg-magenta text-white text-[.6rem] font-bold font-head min-w-4 h-4 rounded-full flex items-center justify-center px-0.75">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </button>
            
            {/* Account Panel - Shows for both authenticated and guest users */}
            <AccountPanel />
            
            <button
              className="header-icon-btn md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}