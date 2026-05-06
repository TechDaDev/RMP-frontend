import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { setTokens, clearTokens } from "@/lib/auth/tokenStorage";
import type {
  BackendUser,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  ActivateAccountRequest,
  ResendActivationOtpRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
} from "@/types/backend";
import type { ProfilesMeResponse } from "@/types/backend";

interface LoginApiResponse {
  success: boolean;
  data: LoginResponseData;
}

interface MeApiResponse {
  success: boolean;
  data: BackendUser;
}

interface ProfilesMeApiResponse {
  success: boolean;
  data: ProfilesMeResponse;
}

interface MessageOnlyResponse {
  success: boolean;
  message?: string;
}

/**
 * Login and store tokens. Returns the user from the login response.
 */
export async function loginService(credentials: LoginRequest): Promise<BackendUser> {
  const resp = await apiRequest<LoginApiResponse>(API_ENDPOINTS.accounts.login, {
    body: credentials,
  });
  const { access, refresh, user } = resp.data;
  setTokens(access, refresh);
  return user;
}

/**
 * Register a new account. Does NOT log in automatically.
 * The backend sends an OTP email; redirect to /activate.
 */
export async function registerService(data: RegisterRequest): Promise<void> {
  await apiRequest<MessageOnlyResponse>(API_ENDPOINTS.accounts.register, {
    body: data,
  });
}

/**
 * Activate account with OTP code.
 */
export async function activateAccountService(data: ActivateAccountRequest): Promise<void> {
  await apiRequest<MessageOnlyResponse>(API_ENDPOINTS.accounts.activate, {
    body: data,
  });
}

/**
 * Resend activation OTP.
 */
export async function resendActivationOtpService(data: ResendActivationOtpRequest): Promise<void> {
  await apiRequest<MessageOnlyResponse>(API_ENDPOINTS.accounts.resendActivationOtp, {
    body: data,
  });
}

/**
 * Request a password-reset OTP. Always succeeds (anti-enumeration).
 */
export async function requestPasswordResetService(data: PasswordResetRequest): Promise<void> {
  await apiRequest<MessageOnlyResponse>(API_ENDPOINTS.accounts.passwordResetRequest, {
    body: data,
  });
}

/**
 * Confirm password-reset with OTP and new password.
 */
export async function confirmPasswordResetService(data: PasswordResetConfirmRequest): Promise<void> {
  await apiRequest<MessageOnlyResponse>(API_ENDPOINTS.accounts.passwordResetConfirm, {
    body: data,
  });
}

/**
 * Fetch the current authenticated user's basic info.
 */
export async function getCurrentUserService(): Promise<BackendUser> {
  const resp = await apiRequest<MeApiResponse>(API_ENDPOINTS.accounts.me, { auth: true });
  return resp.data;
}

/**
 * Fetch the current user's full profile (includes verification info).
 */
export async function getCurrentProfileService(): Promise<ProfilesMeResponse> {
  const resp = await apiRequest<ProfilesMeApiResponse>(API_ENDPOINTS.profiles.me, { auth: true });
  return resp.data;
}

/**
 * Client-side logout: clear stored tokens.
 * The backend does not have a logout endpoint.
 */
export function logoutService(): void {
  clearTokens();
}
