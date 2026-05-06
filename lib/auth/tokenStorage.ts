/**
 * Token storage using localStorage.
 *
 * TODO: Migrate to httpOnly cookies for production hardening to prevent
 *       XSS-based token theft. See OWASP Session Management Cheat Sheet.
 */

const ACCESS_KEY = "rmp-access";
const REFRESH_KEY = "rmp-refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
