/**
 * Cookie utility functions for storing and retrieving tokens
 * Uses httpOnly-like approach with secure cookie settings
 */
import Cookies from 'js-cookie';

const isProduction = import.meta.env.MODE === 'production';

const COOKIE_OPTIONS = {
  secure: isProduction, 
  sameSite: 'strict' as const, 
  expires: 365, // 1 year for refresh token
  path: '/', // Ensure cookies are available across all paths
} satisfies Cookies.CookieAttributes;

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

/**
 * Set access token in cookie (short-lived, 15 minutes)
 */
export const setAccessTokenCookie = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    expires: 1 / 96, // 15 minutes (1 day / 96 = 15 minutes)
  });
};

/**
 * Get access token from cookie
 */
export const getAccessTokenCookie = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_COOKIE);
};

/**
 * Set refresh token in cookie (long-lived)
 */
export const setRefreshTokenCookie = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_COOKIE, token, COOKIE_OPTIONS);
};

/**
 * Get refresh token from cookie
 */
export const getRefreshTokenCookie = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
};

/**
 * Remove access token from cookie
 */
export const removeAccessTokenCookie = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE);
};

/**
 * Remove refresh token from cookie
 */
export const removeRefreshTokenCookie = (): void => {
  Cookies.remove(REFRESH_TOKEN_COOKIE);
};

/**
 * Remove all auth tokens from cookies
 */
export const clearAuthTokens = (): void => {
  removeAccessTokenCookie();
  removeRefreshTokenCookie();
};

// Re-export with shorter names for convenience
export const getAccessToken = getAccessTokenCookie;
export const getRefreshToken = getRefreshTokenCookie;
export const setAccessToken = setAccessTokenCookie;
export const setRefreshToken = setRefreshTokenCookie;

