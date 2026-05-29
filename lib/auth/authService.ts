import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { setTokens, clearTokens } from "@/lib/auth/tokenStorage";
import { ApiError } from "@/lib/api/errors";
import type {
  BackendUser,
  LoginRequest,
  LoginResponseData,
  ProfileCompletion,
  ProfileVerification,
  RegisterRequest,
  ActivateAccountRequest,
  ResendActivationOtpRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  PatientProfileData,
  DoctorProfileData,
  PharmacistProfileData,
  LaboratorianProfileData,
  StaffProfileData,
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

type RoleProfile =
  | PatientProfileData
  | DoctorProfileData
  | PharmacistProfileData
  | LaboratorianProfileData
  | StaffProfileData
  | null;

interface RawProfilesMeResponse {
  user: BackendUser;
  user_profile: ProfilesMeResponse["user_profile"];
  patient_profile?: PatientProfileData | null;
  doctor_profile?: DoctorProfileData | null;
  pharmacist_profile?: PharmacistProfileData | null;
  laboratorian_profile?: LaboratorianProfileData | null;
  staff_profile?: StaffProfileData | null;
  role_profile?: RoleProfile;
  completion?: ProfileCompletion & {
    is_complete?: boolean;
    missing_fields?: string[];
  };
  verification?: ProfileVerification;
  verification_status?: BackendUser["user_type"] extends never ? never : string | null;
}

interface MessageOnlyResponse {
  success: boolean;
  message?: string;
}

function normalizeCompletion(raw?: RawProfilesMeResponse["completion"]): ProfileCompletion {
  if (!raw) {
    return {
      overall_complete: false,
      missing_fields: [],
      missing_shared_fields: [],
      missing_role_fields: [],
    };
  }

  const missingFields = raw.missing_fields ?? raw.missing_shared_fields ?? raw.missing_role_fields ?? [];
  const overallComplete = raw.overall_complete ?? raw.is_complete ?? false;

  return {
    ...raw,
    overall_complete: overallComplete,
    missing_fields: raw.missing_fields ?? missingFields,
    missing_shared_fields: raw.missing_shared_fields ?? raw.missing_fields ?? [],
    missing_role_fields: raw.missing_role_fields ?? [],
    percentage:
      typeof raw.percentage === "number"
        ? raw.percentage
        : overallComplete
          ? 100
          : missingFields.length === 0
            ? 0
            : undefined,
  };
}

function normalizeVerification(raw: RawProfilesMeResponse): ProfileVerification {
  if (raw.verification) {
    return raw.verification;
  }

  const status = raw.verification_status ?? null;
  const required = raw.user.user_type === "doctor" || raw.user.user_type === "pharmacist" || raw.user.user_type === "laboratorian";
  const isApproved = status === "approved";

  return {
    required,
    status,
    is_approved: required ? isApproved : null,
    rejection_reason:
      status === "rejected" && raw.role_profile && "verification_notes" in raw.role_profile
        ? raw.role_profile.verification_notes ?? null
        : null,
    message:
      status === "approved"
        ? "Verification approved."
        : status === "pending"
          ? "Verification pending."
          : status === "rejected"
            ? "Verification rejected."
            : status === "suspended"
              ? "Verification suspended."
              : undefined,
  };
}

function normalizeRoleProfile(raw: RawProfilesMeResponse): RoleProfile {
  if (raw.role_profile !== undefined) {
    return raw.role_profile;
  }

  switch (raw.user.user_type) {
    case "patient":
      return raw.patient_profile ?? null;
    case "doctor":
      return raw.doctor_profile ?? null;
    case "pharmacist":
      return raw.pharmacist_profile ?? null;
    case "laboratorian":
      return raw.laboratorian_profile ?? null;
    case "staff":
      return raw.staff_profile ?? null;
    default:
      return null;
  }
}

function normalizeProfilesResponse(raw: RawProfilesMeResponse): ProfilesMeResponse {
  const roleProfile = normalizeRoleProfile(raw);

  return {
    user: raw.user,
    user_profile: raw.user_profile ?? null,
    role_profile: roleProfile,
    completion: normalizeCompletion(raw.completion),
    verification: normalizeVerification({ ...raw, role_profile: roleProfile }),
  };
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
  const resp = await apiRequest<ProfilesMeApiResponse | RawProfilesMeResponse | ProfilesMeResponse>(
    API_ENDPOINTS.profiles.me,
    { auth: true },
  );
  const payload = "data" in resp ? resp.data : resp;
  if (payload && typeof payload === "object" && "role_profile" in payload && "verification" in payload) {
    return payload as ProfilesMeResponse;
  }
  return normalizeProfilesResponse(payload as RawProfilesMeResponse);
}

/**
 * Admin capability is not exposed in the auth payload for the current backend.
 * Probe a documented admin endpoint and treat a successful response as proof of
 * admin access. A 403 means the user is authenticated but not an admin.
 */
export async function hasAdminAccessService(): Promise<boolean> {
  try {
    await apiRequest(`${API_ENDPOINTS.admin.verifications}?limit=1`, { auth: true });
    return true;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 403 || err.status === 404)) {
      return false;
    }
    throw err;
  }
}

/**
 * Client-side logout: clear stored tokens.
 * The backend does not have a logout endpoint.
 */
export function logoutService(): void {
  clearTokens();
}
