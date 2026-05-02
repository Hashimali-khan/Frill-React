import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import PageLoader from '@/components/atoms/PageLoader'

// Code-split: each page loads only when navigated to
const HomePage          = lazy(() => import('@/pages/storefront/HomePage'))
const CollectionPage    = lazy(() => import('@/pages/storefront/CollectionPage'))
const ProductDetailPage = lazy(() => import('@/pages/storefront/ProductDetailPage'))
const CartPage          = lazy(() => import('@/pages/storefront/CartPage'))
const CheckoutPage      = lazy(() => import('@/pages/storefront/CheckoutPage'))
const AccountPage       = lazy(() => import('@/pages/storefront/AccountPage'))
const ContactPage       = lazy(() => import('@/pages/ContactPage'))
const PrivacyPage       = lazy(() => import('@/pages/PrivacyPage'))
const TermsPage         = lazy(() => import('@/pages/TermsPage'))
const DesignStudioPage  = lazy(() => import('@/pages/studio/DesignStudioPage'))
const LoginPage         = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage        = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminOrders       = lazy(() => import('@/pages/admin/AdminOrdersPage'))
const AdminProducts     = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminDesigns      = lazy(() => import('@/pages/admin/AdminDesignsPage'))
const AdminCustomers    = lazy(() => import('@/pages/admin/AdminCustomersPage'))
const AdminSettings     = lazy(() => import('@/pages/admin/AdminSettingsPage'))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'))

const router = createBrowserRouter([
  // ── Storefront Routes (inside MainLayout) ──
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'collections',  element: <CollectionPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'cart',          element: <CartPage /> },
      { path: 'account',       element: <AccountPage /> },
      { path: 'contact',       element: <ContactPage /> },
      { path: 'privacy',       element: <PrivacyPage /> },
      { path: 'terms',         element: <TermsPage /> },
      // 🔥 FIX: Wrapped CheckoutPage in the ProtectedRoute guard
      { 
        path: 'checkout',      
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  // ── Design Studio (full-screen, minimal chrome) ──
  { path: 'studio/:productId', element: <DesignStudioPage /> },
  
  // ── Auth (no layout) ──
  { path: 'login',           element: <LoginPage /> },
  { path: 'signup',          element: <SignupPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  
  // ── Admin Routes (Protected + AdminLayout) ──
  {
    path: 'admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,       element: <AdminDashboard /> },
      { path: 'orders',    element: <AdminOrders /> },
      { path: 'products',  element: <AdminProducts /> },
      { path: 'designs',   element: <AdminDesigns /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'settings',  element: <AdminSettings /> },
    ],
  },

  // ── 404 Catch-all ──
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}