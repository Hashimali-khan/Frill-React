export const ROUTES = { HOME: '/' };
/** Route constants —  */
export const ROUTES = {
  HOME:          '/',
  COLLECTION:    '/collections',
  PRODUCT:       '/products/:slug',        // /products/classic-frill-hoodie
  STUDIO:        '/studio/:productId',
  CART:          '/cart',
  CHECKOUT:      '/checkout',
  LOGIN:         '/login',
  SIGNUP:        '/signup',
  // Admin (protected)
  ADMIN:         '/admin',
  ADMIN_ORDERS:  '/admin/orders',
  ADMIN_PRODUCTS:'/admin/products',
  ADMIN_DESIGNS: '/admin/designs',
}