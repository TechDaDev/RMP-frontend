export type BackendUserType =
  | "patient"
  | "doctor"
  | "pharmacist"
  | "laboratorian";

export type VerificationStatus = "pending" | "approved" | "rejected" | "suspended";

export interface BackendUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  user_type: BackendUserType;
  is_active: boolean;
  date_joined?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access: string;
  refresh: string;
  user: BackendUser;
}

export interface LoginResponseDataWithNestedTokens {
  tokens: {
    access: string;
    refresh: string;
  };
  user: BackendUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  user_type: BackendUserType;
}

export interface ActivateAccountRequest {
  email: string;
  code: string;
}

export interface ResendActivationOtpRequest {
  email: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  email: string;
  code: string;
  new_password: string;
  new_password_confirm: string;
}

export interface ProfileSummary {
  completion_status?: "incomplete" | "complete";
  verification_status?: VerificationStatus;
}

export interface UserProfile {
  id: string;
  phone_number: string;
  profile_image: string | null;
  gender: string;
  date_of_birth: string | null;
  governorate: string;
  district: string;
  address: string;
  national_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileCompletion {
  shared_profile_complete: boolean;
  role_profile_complete: boolean;
  overall_complete: boolean;
  missing_shared_fields: string[];
  missing_role_fields: string[];
}

export interface ProfileVerification {
  required: boolean;
  status: VerificationStatus | null;
  is_approved: boolean | null;
}

export interface ProfilesMeResponse {
  user: BackendUser;
  user_profile: UserProfile;
  role_profile: Record<string, unknown>;
  completion: ProfileCompletion;
  verification: ProfileVerification;
}
