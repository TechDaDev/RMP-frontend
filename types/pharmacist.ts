import type { DrugCatalogItem } from "@/types/catalog";
import type { PaymentIntent, PaymentStatus } from "@/types/payments";

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
  drug?: string | DrugCatalogItem | null;
  custom_drug_name?: string | null;
  display_drug_name?: string | null;
  drug_name?: string | null;
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
  locked?: boolean;
  items?: PharmacistPrescriptionItem[];
  issued_at?: string;
  expires_at?: string;
  dispensed_at?: string | null;
  fully_dispensed_at?: string | null;
  cancelled_at?: string | null;
  qr_token?: string;
  created_at?: string;
  updated_at?: string;
  payment_status?: PaymentStatus | string;
  payment_intent?: string | PaymentIntent | null;
  paid_at?: string | null;
  payment_failed_at?: string | null;
  refunded_at?: string | null;
}

/**
 * Scan endpoint result payload.
 */
export interface PharmacistPrescriptionScanResult {
  prescription: PharmacistPrescriptionDetail;
  items?: PharmacistPrescriptionItem[];
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

/**
 * Pharmacist-safe patient summary for dispensing history
 */
export interface PharmacistDispensingHistoryPatientSummary {
  id?: string;
  full_name?: string;
  gender?: string | null;
  age?: number | null;
}

/**
 * Pharmacist-safe doctor summary for dispensing history
 */
export interface PharmacistDispensingHistoryDoctorSummary {
  id?: string;
  full_name?: string;
  specialty?: string | null;
}

/**
 * Individual dispensing history record from pharmacist history endpoint
 * GET /api/prescriptions/pharmacist/history/
 */
export interface PharmacistDispensingHistoryItem {
  id: string;
  prescription_id?: string;
  prescription_status?: PharmacistPrescriptionStatus;
  item_id?: string;
  medication_name?: string;
  strength?: string | null;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  route?: string | null;
  quantity?: string | null;
  dispensed_quantity?: string | number | null;
  status?: string;
  dispensed_at?: string | null;
  patient?: PharmacistDispensingHistoryPatientSummary | null;
  doctor?: PharmacistDispensingHistoryDoctorSummary | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Paginated history response from pharmacist history endpoint
 * GET /api/prescriptions/pharmacist/history/
 */
export interface PharmacistDispensingHistoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PharmacistDispensingHistoryItem[];
}

export interface PharmacyInventoryItem {
  id: string;
  drug?: string | DrugCatalogItem | null;
  custom_drug_name?: string | null;
  display_name?: string | null;
  brand_name?: string | null;
  form?: string | null;
  strength?: string | null;
  route?: string | null;
  price: string;
  currency?: string;
  stock_status?: "in_stock" | "low_stock" | "out_of_stock" | "unavailable" | string;
  quantity?: number | null;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PharmacyInventoryCreateRequest {
  drug?: string;
  custom_drug_name?: string;
  brand_name?: string;
  form?: string;
  strength?: string;
  route?: string;
  price: string | number;
  currency?: string;
  stock_status?: "in_stock" | "low_stock" | "out_of_stock" | "unavailable" | string;
  quantity?: number;
  is_available?: boolean;
}

export type PharmacyInventoryUpdateRequest = Partial<PharmacyInventoryCreateRequest>;

export interface PharmacyQuoteItemPayload {
  prescription_item: string;
  inventory_item?: string;
  availability_status: string;
  quoted_name?: string;
  quantity?: string | number;
  unit_price?: string | number;
  pharmacy_note?: string;
  substitution_note?: string;
}

export interface PharmacyQuotePayload {
  items: PharmacyQuoteItemPayload[];
  note?: string;
}

export interface PharmacyPrescriptionRequest {
  id: string;
  patient?: PharmacistPersonSummary | null;
  doctor?: PharmacistPersonSummary | null;
  consultation?: string | null;
  prescription?: string | PharmacistPrescriptionDetail | null;
  status?: string;
  quote_status?: string;
  quoted_total?: string | null;
  currency?: string | null;
  payment_status?: PaymentStatus | string;
  payment_intent?: string | PaymentIntent | null;
  paid_at?: string | null;
  payment_failed_at?: string | null;
  refunded_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PharmacyPrescriptionRequestCreate {
  prescription?: string;
  target_pharmacy?: string;
  notes?: string;
}
