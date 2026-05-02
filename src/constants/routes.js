
/** Route constants —  */
export const ROUTES = {
  HOME:            '/',
  COLLECTION:      '/collections',
  PRODUCT:         '/products/:slug',        // /products/classic-frill-hoodie
  STUDIO:          '/studio/:productId',
  CART:            '/cart',
  ACCOUNT:         '/account',
  CONTACT:         '/contact',
  CHECKOUT:        '/checkout',
  LOGIN:           '/login',
  SIGNUP:          '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  TERMS:           '/terms',
  PRIVACY:         '/privacy',
  // Admin (protected)
  ADMIN:           '/admin',
  ADMIN_ORDERS:    '/admin/orders',
  ADMIN_PRODUCTS:  '/admin/products',
  ADMIN_DESIGNS:   '/admin/designs',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SETTINGS:  '/admin/settings',
}