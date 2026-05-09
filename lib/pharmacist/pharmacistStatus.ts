/**
 * Pharmacist Status and Action Helpers
 *
 * Deterministic functions based on PHARMACIST_WORKFLOW_CONTRACT.md
 * Determines what actions are allowed based on prescription and item statuses
 */

import type { PharmacistPrescriptionStatus, PharmacistPrescriptionItemStatus } from "@/types/pharmacist";

/**
 * Check if pharmacist can scan prescriptions
 * Requires approval status
 */
export function canPharmacistScan(isApproved: boolean): boolean {
  return isApproved;
}

/**
 * Check if prescription can be viewed
 * All non-locked statuses are viewable
 */
export function canViewPrescription(status: PharmacistPrescriptionStatus | undefined): boolean {
  if (!status) return false;
  // Expired, cancelled, and fully_dispensed are still viewable but locked
  return ["issued", "partially_dispensed", "fully_dispensed", "expired", "cancelled"].includes(status);
}

/**
 * Check if prescription can be dispensed
 * Only issued and partially_dispensed prescriptions can have items dispensed
 */
export function canDispensePrescription(status: PharmacistPrescriptionStatus | undefined): boolean {
  if (!status) return false;
  return ["issued", "partially_dispensed"].includes(status);
}

/**
 * Check if a single prescription item can be dispensed
 * Only pending items in non-locked prescriptions can be dispensed
 */
export function canDispensePrescriptionItem(
  itemStatus: PharmacistPrescriptionItemStatus | undefined,
  prescriptionStatus?: PharmacistPrescriptionStatus
): boolean {
  if (!itemStatus) return false;
  // Item must be pending
  if (itemStatus !== "pending") return false;
  // Prescription must be dispensable
  if (prescriptionStatus && !canDispensePrescription(prescriptionStatus)) return false;
  return true;
}

/**
 * Check if prescription is locked (no further changes allowed)
 * Locked statuses: fully_dispensed, cancelled, expired
 */
export function isPrescriptionLocked(status: PharmacistPrescriptionStatus | undefined): boolean {
  if (!status) return false;
  return ["fully_dispensed", "cancelled", "expired"].includes(status);
}

/**
 * Get color/tone for prescription status badge
 * Used for UI styling
 */
export function getPrescriptionStatusTone(
  status: PharmacistPrescriptionStatus | undefined
): "neutral" | "info" | "success" | "warning" | "danger" {
  switch (status) {
    case "issued":
      return "info";
    case "partially_dispensed":
      return "warning";
    case "fully_dispensed":
      return "success";
    case "expired":
      return "danger";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

/**
 * Get color/tone for prescription item status badge
 * Used for UI styling
 */
export function getPrescriptionItemStatusTone(
  status: PharmacistPrescriptionItemStatus | undefined
): "neutral" | "info" | "success" | "warning" | "danger" {
  switch (status) {
    case "pending":
      return "info";
    case "dispensed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

/**
 * Get lock reason message key for UI
 * Used with i18n to display appropriate message
 */
export function getPrescriptionLockReasonKey(
  status: PharmacistPrescriptionStatus | undefined
): string | null {
  switch (status) {
    case "fully_dispensed":
      return "pharmacist.prescriptionFullyDispensed";
    case "expired":
      return "pharmacist.prescriptionExpired";
    case "cancelled":
      return "pharmacist.prescriptionCancelled";
    default:
      return null;
  }
}

/**
 * Check if prescription is close to expiry (< 24 hours)
 */
export function isExpiryNear(expiresAt: string | undefined): boolean {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  const now = new Date();
  const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilExpiry < 24 && hoursUntilExpiry > 0;
}

/**
 * Check if prescription is already expired
 */
export function isPrescriptionExpired(expiresAt: string | undefined): boolean {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  const now = new Date();
  return expiry <= now;
}

/**
 * Count remaining pending items in prescription
 */
export function countPendingItems(items: Array<{ status?: string }> | undefined): number {
  if (!items) return 0;
  return items.filter((item) => item.status === "pending").length;
}

/**
 * Count dispensed items in prescription
 */
export function countDispensedItems(items: Array<{ status?: string }> | undefined): number {
  if (!items) return 0;
  return items.filter((item) => item.status === "dispensed").length;
}

/**
 * Check if all items are pending (no dispensing started)
 */
export function areAllItemsPending(items: Array<{ status?: string }> | undefined): boolean {
  if (!items || items.length === 0) return false;
  return items.every((item) => item.status === "pending");
}

/**
 * Check if all items are dispensed or cancelled
 */
export function areAllItemsCompleted(items: Array<{ status?: string }> | undefined): boolean {
  if (!items || items.length === 0) return false;
  return items.every((item) => ["dispensed", "cancelled"].includes(item.status ?? ""));
}
