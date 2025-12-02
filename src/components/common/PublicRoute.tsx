import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { RootState } from '../../state/store';
import type { AppDispatch } from '../../state/store';
import { initializeAuth, getAccessToken, getRefreshToken } from '../../state/Store/authSlice';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component that redirects authenticated users to the homepage
 * Prevents logged-in users from accessing public pages like login, register, landing page, etc.
 * 
 * @param children - The public page component to render if user is NOT authenticated
 */
export default function PublicRoute({ children }: PublicRouteProps) {
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

  // Redirect authenticated users to home page
  if (isAuthenticated) {
    const userRole = user?.role || "owner";
    
    // Redirect based on user role
    if (userRole === 'staff') {
      return <Navigate to="/record-sales" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // User is not authenticated, allow access to public page
  return <>{children}</>;
}