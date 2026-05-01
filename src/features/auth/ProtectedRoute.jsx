import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectIsAdmin } from './authSlice'

/**
 * ProtectedRoute — Route guard component.
 *
 * Usage in App.jsx:
 *   <ProtectedRoute>               — just requires login
 *   <ProtectedRoute requiredRole="admin"> — requires admin role
 *
 * Saves the attempted URL so we can redirect back after login.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin         = useSelector(selectIsAdmin)
  const location        = useLocation()

  if (!isAuthenticated) {
    // Redirect to login, saving the attempted path in state
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole === 'admin' && !isAdmin) {
    // Authenticated but not admin — redirect to home
    return <Navigate to="/" replace />
  }

  return children
}