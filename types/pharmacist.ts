/**
 * Pharmacist Portal Types
 *
 * Based on PHARMACIST_WORKFLOW_CONTRACT.md from backend Phase 7.0A
 * Defines request/response models for prescription scanning, detail display,
 * and dispensing preparation.
 */

/** Prescription status lifecycle */
export type PharmacistPrescriptionStatus =
  | "issued"
  | "partially_dispensed"
  | "fully_dispensed"
  | "expired"
  | "cancelled"
  | string;

/** Individual prescription item status */
export type PharmacistPrescriptionItemStatus =
  | "pending"
  | "dispensed"
  | "cancelled"
  | string;

/** Item dispensing action status */
export type DispensePrescriptionItemStatus =
  | "dispensed"
  | "unavailable"
  | string;

export interface PharmacistPersonSummary {
  id?: string;
  email?: string;
  full_name?: string;
}

/**
 * Request: Scan prescription by QR token
 * POST /api/prescriptions/scan/
 */
export interface PharmacistPrescriptionScanRequest {
  qr_token: string;
}

/**
 * Pharmacist-safe prescription item payload.
 */
export interface PharmacistPrescriptionItem {
  id: string;
  medication_name?: string;
  strength?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  route?: string | null;
  quantity?: string | null;
  quantity_dispensed?: string | null;
  instructions?: string | null;
  status?: PharmacistPrescriptionItemStatus;
  dispensed_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Pharmacist-safe prescription detail payload from scan endpoint.
 */
export interface PharmacistPrescriptionDetail {
  id?: string;
  consultation_id?: string;
  patient?: PharmacistPersonSummary;
  pharmacist?: PharmacistPersonSummary;
  doctor?: PharmacistPersonSummary;
  status?: PharmacistPrescriptionStatus;
  items?: PharmacistPrescriptionItem[];
  issued_at?: string;
  expires_at?: string;
  dispensed_at?: string | null;
  fully_dispensed_at?: string | null;
  cancelled_at?: string | null;
  qr_token?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Scan endpoint result payload.
 */
export interface PharmacistPrescriptionScanResult {
  prescription: PharmacistPrescriptionDetail;
  remaining_items?: PharmacistPrescriptionItem[];
  locked?: boolean;
  message?: string | null;
}

/**
 * Scan response consumed by frontend service/UI.
 */
export type PharmacistScanResponse = PharmacistPrescriptionScanResult;

/**
 * Single item to be dispensed in dispense request
 */
export interface DispensePrescriptionItem {
  prescription_item_id: string;
  status: DispensePrescriptionItemStatus;
  dispensed_quantity?: string;
  note?: string;
}

/**
 * Request: Dispense prescription items
 * POST /api/prescriptions/{id}/dispense/
 */
export interface PharmacistDispensePrescriptionRequest {
  items: DispensePrescriptionItem[];
}

/**
 * Response: Dispense prescription items (success)
 * POST /api/prescriptions/{id}/dispense/ → 200 OK
 */
export interface PharmacistDispensePrescriptionResult {
  prescription?: PharmacistPrescriptionDetail;
  remaining_items?: PharmacistPrescriptionItem[];
  locked?: boolean;
  message?: string | null;
}

/**
 * Service response wrapper for dispense
 */
export interface PharmacistDispenseResponse {
  success?: boolean;
  data?: PharmacistDispensePrescriptionResult;
  message?: string;
}

/**
 * Dispensing record (visible only to doctor in prescription detail)
 * Included in doctor prescription detail response, not returned to pharmacist
 */
export interface DispensingRecord {
  id?: string;
  prescription_item_id?: string;
  pharmacist?: {
    id?: string;
    email?: string;
    full_name?: string;
  };
  status?: DispensePrescriptionItemStatus;
  dispensed_quantity?: string | null;
  note?: string | null;
  created_at?: string;
}

/**
 * Pharmacist profile data (from /api/profiles/me/pharmacist/)
 * Used for verification status checking
 */
export interface PharmacistProfileData {
  id?: string;
  pharmacist_license_number?: string;
  pharmacist_license_image?: string | null;
  pharmacy_name?: string;
  pharmacy_license_number?: string;
  pharmacy_license_image?: string | null;
  pharmacy_address?: string;
  working_hours?: string | null;
  verification_status?: "pending" | "approved" | "rejected" | "suspended" | "unknown";
  completion_status?: "incomplete" | "complete";
  created_at?: string;
  updated_at?: string;
}

/**
 * UI state for prescription detail/dispensing workflow
 */
export interface PharmacistPrescriptionUIState {
  prescriptionId: string;
  status: PharmacistPrescriptionStatus;
  isLocked: boolean;
  lockReason?: string;
  remainingItems: PharmacistPrescriptionItem[];
  dispensedItems?: PharmacistPrescriptionItem[];
  isExpired: boolean;
  expiresAt?: string;
  doctor?: PharmacistPersonSummary;
  patient?: PharmacistPersonSummary;
}

/**
 * Selected item for dispensing (UI model)
 */
export interface SelectedDispenseItem {
  id: string;
  medicationName?: string;
  selectedStatus: "dispensed" | "unavailable";
  dispensedQuantity?: string;
  note?: string;
}
