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
import { logout, setAccessToken, getRefreshToken } from '../state/Store/authSlice';
import type { RootState } from '../state/store';
import type { RefreshTokenResponse } from '../types/general';
import { STORAGE_KEYS } from '../constants/storage';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}`,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).auth?.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

export const baseQueryWithLogout: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as RefreshTokenResponse;
        
        // Update the access token in Redux
        if (data.responseObject?.accessToken) {
          api.dispatch(setAccessToken(data.responseObject.accessToken));
        }
        
        // Update refresh token in localStorage if a new one is provided
        if (data.responseObject?.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.responseObject.refreshToken);
        }

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout the user
        api.dispatch(logout());
        return result;
      }
    } else {
      // No refresh token, logout the user
      api.dispatch(logout());
    }
  }

  return result;
};