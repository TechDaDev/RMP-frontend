import { apiUrl } from "@/lib/api/config";
import { throwApiError } from "@/lib/api/errors";
import { getAccessToken } from "@/lib/auth/tokenStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  /** Include the stored access token in the Authorization header */
  auth?: boolean;
  body?: unknown;
  method?: HttpMethod;
}

/**
 * Typed fetch wrapper for all backend API calls.
 *
 * Throws `ApiError` on non-2xx responses.
 * Returns the parsed JSON body on success.
 */
export async function apiRequest<T>(
  path: string,
  {
    auth = false,
    body,
    method,
  }: RequestOptions = {},
): Promise<T> {
  const resolvedMethod: HttpMethod = method ?? (body !== undefined ? "POST" : "GET");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(apiUrl(path), {
    method: resolvedMethod,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
