// store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types/general';
import { STORAGE_KEYS } from '../../constants/storage';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null; // Stored in memory (Redux state)
}

// Initial state - Redux Persist will handle rehydration
const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      
      // Store refreshToken in localStorage (needed for token refresh in baseQueryLogout)
      // Note: user and isLoggedIn are persisted by Redux Persist automatically
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.accessToken = null;
      
      // Clear refreshToken from localStorage
      // Redux Persist will handle clearing the persisted state
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
  },
});

export const { login, logout, setAccessToken } = authSlice.actions;

// Helper to get refreshToken from localStorage
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export default authSlice.reducer;