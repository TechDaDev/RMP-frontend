import type { Translations } from "@/types/i18n";

/**
 * Maps known backend error/status messages to frontend i18n keys.
 * Handles backend-origin messages that may appear in English when UI is Arabic/Kurdish.
 *
 * Backend messages that need localization:
 * - "This lab order is no longer available for completion." (locked order)
 * - (other common lab messages as they emerge)
 */

export function mapBackendLabMessage(
  backendMessage: string | null | undefined,
  t: Translations,
): string {
  if (!backendMessage || typeof backendMessage !== "string") {
    return "";
  }

  const trimmed = backendMessage.trim();

  // Map known backend English messages to i18n keys
  if (trimmed === "This lab order is no longer available for completion.") {
    return t.laboratory.ordersCannotBeModified;
  }

  if (trimmed === "Invalid QR token.") {
    return t.laboratory.scanFailed;
  }

  if (trimmed === "Lab order expired.") {
    return t.laboratory.orderExpired;
  }

  if (trimmed === "Lab order cancelled.") {
    return t.laboratory.orderCancelled;
  }

  // Fallback: return original message if no mapping found
  return backendMessage;
}

/**
 * Localize the message field from lab order scan response.
 * If message is a known backend message, maps it to i18n.
 * Otherwise, returns the message as-is.
 */
export function localizeLaboratoryMessage(
  message: string | null | undefined,
  t: Translations,
): string | null {
  if (!message) {
    return null;
  }

  const localized = mapBackendLabMessage(message, t);
  return localized || null;
}
