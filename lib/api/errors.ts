/**
 * Normalised API error class.
 *
 * The backend produces two different error envelope shapes:
 *   Shape A (login / most endpoints):
 *     { success: false, message: string, errors?: { field: string[] … } }
 *   Shape B (activate / password-reset / validate endpoints):
 *     { error: { code: string, message: string, details?: object }, request_id?: string }
 *
 * `ApiError` unifies both into a single throw-able object.
 */
export class ApiError extends Error {
  /** HTTP status code from the response, or 0 for network errors */
  readonly status: number;
  /** Field-level validation errors, if present */
  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/**
 * Parse any response body and throw an `ApiError` when appropriate.
 * Call after `!response.ok`.
 */
export async function throwApiError(response: Response): Promise<never> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
    );
  }

  // Shape B: { error: { code, message, details } }
  if (body && typeof body === "object" && "error" in body) {
    const b = body as { error: { code?: string; message?: string; details?: Record<string, string[]> }; request_id?: string };
    const msg = b.error?.message ?? `HTTP ${response.status}`;
    throw new ApiError(msg, response.status, b.error?.details);
  }

  // Shape A: { success: false, message, errors }
  if (body && typeof body === "object" && "success" in body) {
    const b = body as { success: boolean; message?: string; errors?: Record<string, string[]> };
    // Promote non_field_errors into the message when no dedicated message is set
    const nonFieldErrors = b.errors?.non_field_errors?.join(" ");
    const msg = b.message ?? nonFieldErrors ?? `HTTP ${response.status}`;
    throw new ApiError(msg, response.status, b.errors);
  }

  throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
}
