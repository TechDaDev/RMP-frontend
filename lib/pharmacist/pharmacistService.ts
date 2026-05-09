/**
 * Pharmacist Service Layer (Skeleton)
 *
 * Service functions for pharmacist prescription scanning and dispensing workflows.
 * Phase 7.0B: Service skeleton only, not wired to UI components yet.
 * Phase 7.1+: Will be integrated with React components.
 *
 * Based on PHARMACIST_WORKFLOW_CONTRACT.md
 */

import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope } from "@/types/api";
import type {
  PharmacistPrescriptionScanRequest,
  PharmacistScanResponse,
  PharmacistDispensePrescriptionRequest,
  PharmacistDispenseResponse,
} from "@/types/pharmacist";

/**
 * Unwrap envelope response from API
 *
 * Backend returns either bare response or {data, success} envelope.
 * This helper extracts the inner data if present.
 */
function unwrapData<T>(value: T | ApiEnvelope<T>): T {
  if (value && typeof value === "object" && "data" in value) {
    const maybeEnvelope = value as ApiEnvelope<T>;
    if (maybeEnvelope.data !== undefined) {
      return maybeEnvelope.data;
    }
  }

  return value as T;
}

/**
 * Scan prescription by QR token
 *
 * POST /api/prescriptions/scan/
 *
 * @param qrToken - QR token from patient
 * @returns Prescription data with remaining items
 * @throws ApiErrorResponse if invalid token, expired, or unapproved pharmacist
 */
export async function scanPrescription(
  qrToken: string
): Promise<PharmacistScanResponse> {
  const payload: PharmacistPrescriptionScanRequest = {
    qr_token: qrToken,
  };

  const response = await apiRequest<PharmacistScanResponse | ApiEnvelope<PharmacistScanResponse>>(
    API_ENDPOINTS.pharmacistPrescriptions.scan,
    {
      auth: true,
      body: payload,
    }
  );

  return unwrapData(response);
}

/**
 * Get pharmacist prescription detail
 *
 * Note: In current backend contract, prescription detail is only available
 * through scan response. This function is a placeholder for future backend
 * endpoint if added (e.g., GET /api/prescriptions/pharmacist/{id}/).
 *
 * @param _prescriptionId - Prescription UUID (unused in phase 7.0b)
 * @returns Prescription detail
 * @throws ApiErrorResponse if not found or unauthorized
 */
export async function getPharmacistPrescriptionDetail(
  _prescriptionId: string
): Promise<PharmacistScanResponse> {
  // Placeholder: Currently uses scan data; future backend may add direct detail endpoint
  // Future: return apiRequest<PharmacistScanResponse>(
  //   "GET",
  //   API_ENDPOINTS.pharmacistPrescriptions.detail(_prescriptionId)
  // );

  // For now, return empty - Phase 7.2 will load via scan endpoint
  void _prescriptionId; // Acknowledged parameter for future use
  throw new Error("Not implemented: Use scanPrescription instead in Phase 7.2");
}

/**
 * Dispense prescription items
 *
 * POST /api/prescriptions/{prescription_id}/dispense/
 *
 * @param prescriptionId - Prescription UUID
 * @param items - Array of items to dispense with status (dispensed/unavailable) and optional quantity/note
 * @returns Updated prescription with remaining items
 * @throws ApiErrorResponse if invalid items, locked prescription, or unapproved pharmacist
 */
export async function dispensePrescription(
  prescriptionId: string,
  payload: PharmacistDispensePrescriptionRequest
): Promise<PharmacistDispenseResponse> {
  if (!prescriptionId) {
    throw new Error("Prescription ID is required");
  }

  if (!payload.items || payload.items.length === 0) {
    throw new Error("At least one item must be provided for dispensing");
  }

  const response = await apiRequest<PharmacistDispenseResponse | ApiEnvelope<PharmacistDispenseResponse>>(
    API_ENDPOINTS.pharmacistPrescriptions.dispense(prescriptionId),
    {
      auth: true,
      body: payload,
    }
  );

  return unwrapData(response);
}

/**
 * Get pharmacist dispensing history
 *
 * Note: Backend does not currently have a dedicated pharmacist history endpoint.
 * Dispensing records are available in doctor prescription detail.
 * This is a placeholder for future implementation if backend adds:
 * GET /api/prescriptions/pharmacist/history/
 *
 * @returns Array of past dispensing actions
 * @throws ApiErrorResponse if endpoint not available
 */
export async function getPharmacistDispensingHistory(): Promise<unknown> {
  // Placeholder: Not implemented in Phase 7.0A backend
  // Future: If backend adds GET /api/prescriptions/pharmacist/history/, implement here
  throw new Error(
    "Not implemented: Backend does not have pharmacist history endpoint in Phase 7.0A"
  );
}

/**
 * Normalize pharmacist scan/dispense response
 *
 * Handles both status-based and success-based envelope formats
 * Extracts data from response wrapper
 *
 * @param response - Raw API response
 * @returns Normalized data
 */
export function normalizePharmacistResponse<T>(response: { data?: T; success?: boolean }): T | undefined {
  return response?.data;
}
