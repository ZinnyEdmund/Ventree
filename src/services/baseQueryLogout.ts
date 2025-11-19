/**
 * Base query with automatic token refresh and logout on 401 errors
 * 
 * This base query:
 * - Automatically adds the access token to request headers
 * - Handles 401 errors by attempting to refresh the token
 * - Logs out the user if token refresh fails
 * - Retries the original request after successful token refresh
 */
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { logout, setAccessToken, getRefreshToken, getAccessToken } from '../state/Store/authSlice';
import type { RefreshTokenResponse } from '../types/general';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../lib/cookies';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

// Base query with authentication headers
const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}`,
  prepareHeaders: (headers) => {
    // Get access token from cookie (not Redux state)
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Base query without authentication (for refresh token endpoint)
const baseQueryWithoutAuth = fetchBaseQuery({
  baseUrl: `${baseUrl}`,
});

export const baseQueryWithLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    // Prevent infinite loop: if this is already a refresh token request, don't try again
    const requestUrl = typeof args === 'string' ? args : args.url;
    if (requestUrl?.includes('/auth/refresh')) {
      // Refresh token request itself failed, logout
      console.error('Refresh token request failed, logging out');
      api.dispatch(logout());
      return result;
    }

    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      console.log('Attempting to refresh token...');
      
      // Try to refresh the token (without auth header)
      const refreshResult = await baseQueryWithoutAuth(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data && !refreshResult.error) {
        console.log('Token refresh response received:', refreshResult.data);
        
        // Handle different response structures
        const data = refreshResult.data as 
          | RefreshTokenResponse 
          | { success?: boolean; data?: { accessToken?: string; refreshToken?: string; message?: string } }
          | { accessToken?: string; refreshToken?: string };
        
        // Check if response indicates failure
        if ('success' in data && data.success === false) {
          console.error('Token refresh returned success: false');
          api.dispatch(logout());
          return result;
        }
        
        let newAccessToken: string | undefined;
        let newRefreshToken: string | undefined;

        // Check if it's BaseResponse format (responseObject)
        if ('responseObject' in data && data.responseObject) {
          newAccessToken = data.responseObject.accessToken;
          newRefreshToken = data.responseObject.refreshToken;
        }
        // Check if it's data format (like LoginResponse)
        else if ('data' in data && data.data) {
          newAccessToken = data.data.accessToken;
          newRefreshToken = data.data.refreshToken;
        }
        // Fallback: check if tokens are at root level
        else if ('accessToken' in data) {
          newAccessToken = data.accessToken;
          newRefreshToken = data.refreshToken;
        }

        if (newAccessToken) {
          // Update the access token in cookie and Redux
          setAccessTokenCookie(newAccessToken);
          api.dispatch(setAccessToken(newAccessToken));
          
          // Update refresh token in cookie if a new one is provided
          if (newRefreshToken) {
            setRefreshTokenCookie(newRefreshToken);
          }

          console.log('Retrying original request with new token...');
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.error('Token refresh response missing accessToken');
          api.dispatch(logout());
          return result;
        }
      } else {
        // Refresh failed, logout the user
        console.error('Token refresh failed:', refreshResult.error);
        api.dispatch(logout());
        return result;
      }
    } else {
      // No refresh token, logout the user
      console.error('No refresh token found');
      api.dispatch(logout());
    }
  }

  return result;
};