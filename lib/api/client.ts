import { apiUrl } from "@/lib/api/config";
import { ApiError, throwApiError } from "@/lib/api/errors";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth/tokenStorage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  /** Include the stored access token in the Authorization header */
  auth?: boolean;
  body?: unknown;
  method?: HttpMethod;
}

let refreshInFlight: Promise<string | null> | null = null;

function extractTokensFromRefreshResponse(body: unknown): { access: string; refresh?: string } | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const direct = body as { access?: unknown; refresh?: unknown };
  if (typeof direct.access === "string") {
    return {
      access: direct.access,
      refresh: typeof direct.refresh === "string" ? direct.refresh : undefined,
    };
  }

  const withData = body as {
    data?: {
      access?: unknown;
      refresh?: unknown;
      tokens?: { access?: unknown; refresh?: unknown };
    };
  };
  const access =
    typeof withData.data?.access === "string"
      ? withData.data.access
      : typeof withData.data?.tokens?.access === "string"
        ? withData.data.tokens.access
        : null;

  if (!access) {
    return null;
  }

  const refresh =
    typeof withData.data?.refresh === "string"
      ? withData.data.refresh
      : typeof withData.data?.tokens?.refresh === "string"
        ? withData.data.tokens.refresh
        : undefined;

  return { access, refresh };
}

async function performTokenRefresh(): Promise<string | null> {
  const currentRefresh = getRefreshToken();
  if (!currentRefresh) {
    clearTokens();
    return null;
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(API_ENDPOINTS.accounts.tokenRefresh), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: currentRefresh }),
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    clearTokens();
    return null;
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    clearTokens();
    return null;
  }

  const tokens = extractTokensFromRefreshResponse(body);
  if (!tokens?.access) {
    clearTokens();
    return null;
  }

  // Some backends rotate refresh tokens, others return only a new access token.
  setTokens(tokens.access, tokens.refresh ?? currentRefresh);
  return tokens.access;
}

async function getRefreshedAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = performTokenRefresh().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
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
  const isFormData = body instanceof FormData;

  const sendRequest = async (tokenOverride?: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};

    if (!isFormData && body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    if (auth) {
      const token = tokenOverride ?? getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return fetch(apiUrl(path), {
      method: resolvedMethod,
      headers,
      body:
        body !== undefined
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined,
    });
  };

  let response: Response;
  try {
    response = await sendRequest();
  } catch {
    // Network failure, DNS error, backend offline, etc.
    throw new ApiError(
      "Connection failed. Please check your network and try again.",
      0,
    );
  }

  // Silent refresh for expired access tokens.
  if (auth && response.status === 401) {
    const refreshedAccess = await getRefreshedAccessToken();
    if (refreshedAccess) {
      try {
        response = await sendRequest(refreshedAccess);
      } catch {
        throw new ApiError(
          "Connection failed. Please check your network and try again.",
          0,
        );
      }
    }
  }

  if (!response.ok) {
    await throwApiError(response);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
