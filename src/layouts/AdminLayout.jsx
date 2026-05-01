import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, Palette,
         Users, Settings, LogOut, ArrowLeft } from 'lucide-react'
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

  function handleSignOut() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-frill-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-purple flex flex-col shrink-0">
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
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}