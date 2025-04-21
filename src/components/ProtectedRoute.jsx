import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

/**
 * ProtectedRoute component for role-based access control
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} [props.allowedRoles] - Roles that are allowed to access this route
 * @returns {React.ReactNode} The protected component or a redirect
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow access if no specific roles are required or user has required role
  if (allowedRoles.length === 0 || allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to dashboard if user doesn't have required role
  return <Navigate to="/dashboard" replace />;
} 