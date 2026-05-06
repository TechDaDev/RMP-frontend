/**
 * API configuration derived from environment variables.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Build a full URL from a path that already starts with "/api/...".
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
