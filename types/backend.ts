export type BackendUserType =
  | "patient"
  | "doctor"
  | "pharmacist"
  | "laboratorian";

export type VerificationStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected"
  | "incomplete"
  | "suspended"
  | "unknown";

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

export interface UserProfileData {
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

export interface PatientProfileData {
  id: string;
  social_security_id: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfileData {
  id: string;
  medical_license_number: string;
  medical_license_image: string | null;
  specialty: string;
  specialty_other: string;
  subspecialty: string;
  professional_title: string;
  years_of_experience: number | null;
  bio: string;
  work_address: string;
  verification_status: string;
  verified_at: string | null;
  verification_notes: string;
  created_at: string;
  updated_at: string;
}

export interface PharmacistProfileData {
  id: string;
  pharmacist_license_number: string;
  pharmacist_license_image: string | null;
  pharmacy_name: string;
  pharmacy_license_number: string;
  pharmacy_license_image: string | null;
  pharmacy_address: string;
  working_hours: string;
  verification_status: string;
  verified_at: string | null;
  verification_notes: string;
  created_at: string;
  updated_at: string;
}

export interface LaboratorianProfileData {
  id: string;
  laboratorian_license_number: string;
  laboratorian_license_image: string | null;
  laboratory_name: string;
  laboratory_license_number: string;
  laboratory_license_image: string | null;
  laboratory_address: string;
  specialization: string;
  working_hours: string;
  verification_status: string;
  verified_at: string | null;
  verification_notes: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileCompletion {
  overall_complete?: boolean;
  missing_fields?: string[];
  percentage?: number;
  user_profile_complete?: boolean;
  role_profile_complete?: boolean;
  shared_profile_complete?: boolean;
  missing_shared_fields?: string[];
  missing_role_fields?: string[];
}

export interface ProfileVerification {
  required?: boolean;
  status?: VerificationStatus | string | null;
  is_approved?: boolean | null;
  message?: string;
  rejection_reason?: string | null;
}

export interface UpdateUserProfileRequest {
  phone_number?: string;
  profile_image?: File | null;
  gender?: string;
  date_of_birth?: string | null;
  governorate?: string;
  district?: string;
  address?: string;
  national_id?: string;
}

export interface UpdatePatientProfileRequest {
  social_security_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface UpdateDoctorProfileRequest {
  medical_license_number?: string;
  medical_license_image?: File | null;
  specialty?: string;
  specialty_other?: string;
  subspecialty?: string;
  professional_title?: string;
  years_of_experience?: number | null;
  bio?: string;
  work_address?: string;
}

export interface UpdatePharmacistProfileRequest {
  pharmacist_license_number?: string;
  pharmacist_license_image?: File | null;
  pharmacy_name?: string;
  pharmacy_license_number?: string;
  pharmacy_license_image?: File | null;
  pharmacy_address?: string;
  working_hours?: string;
}

export interface UpdateLaboratorianProfileRequest {
  laboratorian_license_number?: string;
  laboratorian_license_image?: File | null;
  laboratory_name?: string;
  laboratory_license_number?: string;
  laboratory_license_image?: File | null;
  laboratory_address?: string;
  specialization?: string;
  working_hours?: string;
}

export interface ProfilesMeResponse {
  user: BackendUser;
  user_profile: UserProfileData | null;
  role_profile:
    | PatientProfileData
    | DoctorProfileData
    | PharmacistProfileData
    | LaboratorianProfileData
    | null;
  completion: ProfileCompletion;
  verification: ProfileVerification;
}

export type UserProfile = UserProfileData;
