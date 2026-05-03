import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, ShoppingBag, Package, Palette,
         Users, Settings, LogOut, ArrowLeft, Menu } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logout } from '@/features/auth/authSlice'
import { cn } from '@/utils/cn'

const ADMIN_NAV = [
  { label: 'Dashboard',  href: '/admin',          icon: LayoutDashboard, end: true },
  { label: 'Orders',     href: '/admin/orders',    icon: ShoppingBag },
  { label: 'Products',   href: '/admin/products',  icon: Package },
  { label: 'Designs',    href: '/admin/designs',   icon: Palette },
  { label: 'Customers',  href: '/admin/customers', icon: Users },
  { label: 'Settings',   href: '/admin/settings',  icon: Settings },
]

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleSignOut() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-frill-50 overflow-hidden">

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 w-64 bg-purple flex flex-col shrink-0 z-50',
          'transform transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-5 border-b border-white/10">
          <div className="font-head text-2xl font-black text-white">
            Fr<span className="text-magenta">i</span>ll
            <span className="text-xs text-white/40 font-medium ml-2">Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {ADMIN_NAV.map(({ label, href, icon: Icon, end }) => (
            <NavLink
              key={href} to={href} end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-frill',
                'text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-magenta text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 flex flex-col gap-1">
          <Link to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm
                        text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={16} /> View Store
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 text-sm
                        text-white/50 hover:text-white transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-brand-border">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-frill border border-brand-border text-frill-600"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>
          <span className="font-head text-sm font-bold text-purple">Admin Panel</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-xs font-bold uppercase tracking-widest text-frill-500"
          >
            Sign Out
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}