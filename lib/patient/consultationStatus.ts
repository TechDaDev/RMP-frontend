import type { ConsultationStatus } from "@/types/patient";

export type ConsultationLifecycle =
  | "pending_review"
  | "accepted"
  | "in_progress"
  | "closed"
  | "cancelled"
  | "unknown";

export function getConsultationLifecycle(status: string): ConsultationLifecycle {
  switch (status as ConsultationStatus) {
    case "submitted":
      return "pending_review";
    case "accepted":
      return "accepted";
    case "doctor_responded":
      return "in_progress";
    case "closed":
      return "closed";
    case "cancelled":
    case "rejected":
      return "cancelled";
    default:
      return "unknown";
  }
}

export function canPatientUseMessages(status: string): boolean {
  const lifecycle = getConsultationLifecycle(status);
  return lifecycle === "accepted" || lifecycle === "in_progress";
}

export type ConsultationStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export function getConsultationStatusTone(status: string): ConsultationStatusTone {
  switch (getConsultationLifecycle(status)) {
    case "pending_review":
      return "info";
    case "accepted":
    case "in_progress":
      return "success";
    case "closed":
      return "neutral";
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}
