import { Outlet, ScrollRestoration } from 'react-router-dom'
import AnnouncementBar from '@/components/organisms/AnnouncementBar'
import SiteHeader      from '@/components/organisms/SiteHeader'
import UspStrip        from '@/components/organisms/UspStrip'
import SiteFooter      from '@/components/organisms/SiteFooter'
import CartDrawer      from '@/features/cart/CartDrawer'

/**
 * MainLayout — The storefront shell.
 * All customer-facing pages render as <Outlet> here.
 * CartDrawer lives here so it persists across page navigations.
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      { /* Restore scroll position on navigation */ }
      <ScrollRestoration />

      { /* ── Top chrome ── */}
      <AnnouncementBar />
      <SiteHeader />
      <UspStrip />

      { /* ── Page content (grows to fill available space) ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      { /* ── Bottom chrome ── */}
      <SiteFooter />

      { /* ── Cart slide-in (portalled, always mounted) ── */}
      <CartDrawer />
    </div>
  )
}