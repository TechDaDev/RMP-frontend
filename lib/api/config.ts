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

/**
 * Build a full URL for backend-served media paths such as "/media/...".
 */
export function mediaUrl(path: string): string {
  if (!path) {
    return path;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}
