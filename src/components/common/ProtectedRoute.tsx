import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { RootState } from '../../state/store';
import type { AppDispatch } from '../../state/store';
import type { Role } from '../../types/general';
import { initializeAuth, getAccessToken, getRefreshToken } from '../../state/Store/authSlice';

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
  const { isLoggedIn, user, _initialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Ensure auth is initialized (runs after PersistGate completes)
  useEffect(() => {
    if (!_initialized) {
      // Call initializeAuth to sync cookies with Redux state
      // This is a fallback in case onBeforeLift didn't run
      dispatch(initializeAuth());
    }
  }, [dispatch, _initialized]);

  // Wait for initialization before checking auth
  // This prevents premature redirects during rehydration
  if (!_initialized) {
    return null; // Wait for initialization to complete
  }

  // Check cookies directly as source of truth
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const hasTokens = !!(accessToken || refreshToken);

  // User must have both tokens (in cookies) and user data (in Redux)
  const isAuthenticated = hasTokens && isLoggedIn && !!user;
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole || allowedRoles) {
    const userRole = user?.role  || "owner";

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

