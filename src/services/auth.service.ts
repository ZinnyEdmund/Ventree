import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  AuthResponse, 
  LoginResponse, 
  RegisterRequest, 
  LoginRequest,
  VerifyOtpRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/general';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Base query for auth endpoints (no auth required)
const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/auth`,
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginMutation,
  useVerifyOtpMutation,
  useRefreshTokenMutation,
} = authApi;