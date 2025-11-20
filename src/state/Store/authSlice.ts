// store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import type { User } from '../../types/general';
import { setAccessTokenCookie, setRefreshTokenCookie, clearAuthTokens, getAccessTokenCookie, getRefreshTokenCookie } from '../../lib/cookies';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  _initialized: boolean; // Flag to track if auth state has been initialized
  // Note: accessToken is stored in cookies, not in Redux state
  // This field is kept for backward compatibility but should not be persisted
}

// Initial state - will be updated after rehydration
// _initialized starts as false to ensure we wait for rehydration before checking auth
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  _initialized: false, // Will be set to true after rehydration completes
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state._initialized = true;
      
      // Store tokens in cookies (secure storage)
      setAccessTokenCookie(action.payload.accessToken);
      setRefreshTokenCookie(action.payload.refreshToken);
    },
    setAccessToken(_state, action: PayloadAction<string>) {
      // Update access token in cookie
      setAccessTokenCookie(action.payload);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state._initialized = false;
      
      // Clear all tokens from cookies
      clearAuthTokens();
    },
    // Initialize auth state from cookies and persisted user
    // This should be called AFTER Redux Persist rehydration completes
    initializeAuth(state) {
      const accessToken = getAccessTokenCookie();
      const refreshToken = getRefreshTokenCookie();
      const hasTokens = !!(accessToken || refreshToken);
      
      // User is logged in if they have BOTH tokens (in cookies) AND user data (in Redux)
      if (hasTokens && state.user) {
        // Both tokens and user exist - user is authenticated
        state.isLoggedIn = true;
        state._initialized = true;
      } else if (!hasTokens) {
        // No tokens - clear everything (tokens expired or were cleared)
        state.isLoggedIn = false;
        state.user = null;
        state._initialized = true;
      } else if (hasTokens && !state.user) {
        // Tokens exist but no user data - this shouldn't happen if persistence worked
        // But handle it gracefully: keep logged out
        state.isLoggedIn = false;
        // Don't clear user if it was just not persisted - keep as is
        state._initialized = true;
      } else {
        // No tokens and no user - definitely not logged in
        state.isLoggedIn = false;
        state.user = null;
        state._initialized = true;
      }
    },
    // Legacy: kept for backward compatibility
    checkAuthStatus(state) {
      const accessToken = getAccessTokenCookie();
      const refreshToken = getRefreshTokenCookie();
      const hasTokens = !!(accessToken || refreshToken);
      
      // User is logged in if they have tokens AND user data
      if (hasTokens && state.user) {
        state.isLoggedIn = true;
        state._initialized = true;
      } else if (!hasTokens) {
        // No tokens - clear everything
        state.isLoggedIn = false;
        state.user = null;
        state._initialized = true;
      } else if (hasTokens && !state.user) {
        // Tokens exist but no user - keep logged out but initialized
        state.isLoggedIn = false;
        state._initialized = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Handle rehydration from Redux Persist
    builder.addCase(REHYDRATE, (state, action: any) => {
      const persistedState = action.payload?.auth as AuthState | undefined;
      
      if (persistedState) {
        // Restore persisted user data (if it was persisted)
        // The transform ensures _initialized is not persisted, so it will be false
        state.user = persistedState.user || null;
        state.isLoggedIn = persistedState.isLoggedIn || false;
      } else {
        // No persisted state - start fresh
        state.user = null;
        state.isLoggedIn = false;
      }
      
      // _initialized remains false - will be set by initializeAuth() 
      // which is called in PersistGate's onBeforeLift callback
    });
  },
});

export const { login, logout, setAccessToken, initializeAuth, checkAuthStatus } = authSlice.actions;

// Re-export cookie helpers for convenience
export { getRefreshTokenCookie as getRefreshToken, getAccessTokenCookie as getAccessToken } from '../../lib/cookies';

export default authSlice.reducer;