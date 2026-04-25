import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, Search, Heart, Menu } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useScrolled } from '@/hooks/useScrolled'
import { selectCartCount } from '@/features/cart/cartSlice'
import MobileDrawer from './MobileDrawer'
import { NAV_ITEMS } from '@/constants/navigation'

export default function SiteHeader() {
  const scrolled = useScrolled()
  const cartCount = useSelector(selectCartCount)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 bg-white border-b border-brand-border',
          'transition-shadow duration-200',
          scrolled && 'shadow-frill-sm'
        )}
      >
        <div className="section-inner flex items-center justify-between h-16 gap-6">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-head text-[1.75rem] font-black text-purple tracking-tight">
              Fr<span className="text-magenta">i</span>ll
            </span>
            <span className="text-[.58rem] font-semibold tracking-[.18em] uppercase text-frill-400 mt-0.5">
              Wear Your Imagination
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  'font-head text-[.78rem] font-semibold tracking-[.04em] uppercase',
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
            <button className="header-icon-btn hidden sm:flex" aria-label="Wishlist">
              <Heart size={20} />
            </button>
            <Link to="/cart" className="header-icon-btn relative" aria-label="Cart">
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 bg-magenta text-white text-[.6rem] font-bold font-head min-w-4 h-4 rounded-full flex items-center justify-center px-0.75">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            </Link>
            <Link
              to="/login"
              className="hidden sm:flex font-head text-[.72rem] font-bold tracking-[.06em] uppercase bg-purple text-white px-[1.2rem] py-[.55rem] rounded-frill transition-colors hover:bg-magenta ml-1"
            >
              Account
            </Link>
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