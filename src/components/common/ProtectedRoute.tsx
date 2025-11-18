import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/store';
import type { Role } from '../../types/general';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  allowedRoles?: Role[];
}

/**
 * ProtectedRoute component that handles authentication and role-based access control
 * 
 * @param children - The component to render if access is granted
 * @param requiredRole - Single role required (mutually exclusive with allowedRoles)
 * @param allowedRoles - Array of roles allowed (mutually exclusive with requiredRole)
 */
export default function ProtectedRoute({ 
  children, 
  requiredRole,
  allowedRoles 
}: ProtectedRouteProps) {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole || allowedRoles) {
    const userRole = user.role;
    
    if (requiredRole) {
      // Single role required
      if (userRole !== requiredRole) {
        // Staff can only access record-sales, redirect them there
        if (userRole === 'staff') {
          return <Navigate to="/record-sales" replace />;
        }
        // Owner trying to access staff-only route (shouldn't happen, but handle it)
        return <Navigate to="/home" replace />;
      }
    } else if (allowedRoles) {
      // Multiple roles allowed
      if (!allowedRoles.includes(userRole)) {
        // Staff can only access record-sales, redirect them there
        if (userRole === 'staff') {
          return <Navigate to="/record-sales" replace />;
        }
        return <Navigate to="/home" replace />;
      }
    }
  }

  return <>{children}</>;
}

