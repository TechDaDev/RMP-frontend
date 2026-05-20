import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  DoctorProfileData,
  LaboratorianProfileData,
  PatientProfileData,
  PharmacistProfileData,
  ProfilesMeResponse,
  UpdateDoctorProfileRequest,
  UpdateLaboratorianProfileRequest,
  UpdatePatientProfileRequest,
  UpdatePharmacistProfileRequest,
  UpdateUserProfileRequest,
  UserProfileData,
} from "@/types/backend";

type Envelope<T> = {
  success?: boolean;
  status?: "success" | "error";
  data?: T;
};

const PROFILE_FILE_FIELD_KEYS = new Set([
  "profile_image",
  "medical_license_image",
  "pharmacist_license_image",
  "pharmacy_license_image",
  "laboratorian_license_image",
  "laboratory_license_image",
]);

function unwrapData<T>(value: T | Envelope<T>): T {
  if (value && typeof value === "object" && "data" in (value as Envelope<T>)) {
    const maybeEnvelope = value as Envelope<T>;
    if (maybeEnvelope.data !== undefined) {
      return maybeEnvelope.data;
    }
  }
  return value as T;
}

function hasFileValue(payload: Record<string, unknown>): boolean {
  return Object.values(payload).some((value) => value instanceof File);
}

function normalizeImageMimeType(file: File): File {
  const normalized = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (normalized === "image/jpeg" || normalized === "image/png" || normalized === "image/webp") {
    return file;
  }

  if (normalized === "image/jpg" || normalized === "image/pjpeg" || (!normalized && (name.endsWith(".jpg") || name.endsWith(".jpeg")))) {
    return new File([file], file.name, {
      type: "image/jpeg",
      lastModified: file.lastModified,
    });
  }

  if (!normalized && name.endsWith(".png")) {
    return new File([file], file.name, {
      type: "image/png",
      lastModified: file.lastModified,
    });
  }

  if (!normalized && name.endsWith(".webp")) {
    return new File([file], file.name, {
      type: "image/webp",
      lastModified: file.lastModified,
    });
  }

  return file;
}

function toFormData(payload: Record<string, unknown>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (value instanceof File) {
      formData.append(key, normalizeImageMimeType(value));
      continue;
    }
    formData.append(key, String(value));
  }
  return formData;
}

function sanitizeProfilePatchPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) {
      continue;
    }

    // Keep existing files untouched unless a real File is selected.
    if (PROFILE_FILE_FIELD_KEYS.has(key) && (value === null || value === "")) {
      continue;
    }

    sanitized[key] = value;
  }
  return sanitized;
}

async function patchProfile<T>(path: string, payload: object): Promise<T> {
  const payloadRecord = sanitizeProfilePatchPayload(payload as Record<string, unknown>);
  const requestBody = hasFileValue(payloadRecord) ? toFormData(payloadRecord) : payloadRecord;
  const response = await apiRequest<T | Envelope<T>>(path, {
    auth: true,
    method: "PATCH",
    body: requestBody,
  });
  return unwrapData(response);
}

export async function getMyProfile(): Promise<ProfilesMeResponse> {
  const response = await apiRequest<ProfilesMeResponse | Envelope<ProfilesMeResponse>>(
    API_ENDPOINTS.profiles.me,
    { auth: true },
  );
  return unwrapData(response);
}

export function updateUserProfile(payload: UpdateUserProfileRequest): Promise<UserProfileData> {
  return patchProfile<UserProfileData>(API_ENDPOINTS.profiles.userProfile, payload);
}

export function updatePatientProfile(payload: UpdatePatientProfileRequest): Promise<PatientProfileData> {
  return patchProfile<PatientProfileData>(API_ENDPOINTS.profiles.patient, payload);
}

export function updateDoctorProfile(payload: UpdateDoctorProfileRequest): Promise<DoctorProfileData> {
  return patchProfile<DoctorProfileData>(API_ENDPOINTS.profiles.doctor, payload);
}

export function updatePharmacistProfile(
  payload: UpdatePharmacistProfileRequest,
): Promise<PharmacistProfileData> {
  return patchProfile<PharmacistProfileData>(API_ENDPOINTS.profiles.pharmacist, payload);
}

export function updateLaboratorianProfile(
  payload: UpdateLaboratorianProfileRequest,
): Promise<LaboratorianProfileData> {
  return patchProfile<LaboratorianProfileData>(API_ENDPOINTS.profiles.laboratorian, payload);
}
