export type DoctorConsultationStatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const ACTIVE_DOCTOR_STATUS = new Set(["accepted", "doctor_responded"]);

export function canDoctorAccept(status: string): boolean {
  return status === "submitted";
}

export function canDoctorMessage(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status);
}

export function canDoctorReadMessages(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status) || status === "closed";
}

export function canDoctorRespond(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status);
}

export function canDoctorClose(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status);
}

export function canDoctorCreatePrescription(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status);
}

export function canDoctorCreateLabOrder(status: string): boolean {
  return ACTIVE_DOCTOR_STATUS.has(status);
}

const PATIENT_RECORD_ACCESS_STATUS = new Set(["accepted", "doctor_responded", "closed"]);

export function canDoctorAccessPatientRecord(status: string): boolean {
  return PATIENT_RECORD_ACCESS_STATUS.has(status);
}

export function getDoctorConsultationStatusLabelKey(status: string):
  | "statusSubmitted"
  | "statusAccepted"
  | "statusDoctorResponded"
  | "statusClosed"
  | "statusCancelled"
  | "statusRejected" {
  switch (status) {
    case "submitted":
      return "statusSubmitted";
    case "accepted":
      return "statusAccepted";
    case "doctor_responded":
      return "statusDoctorResponded";
    case "closed":
      return "statusClosed";
    case "cancelled":
      return "statusCancelled";
    case "rejected":
      return "statusRejected";
    default:
      return "statusSubmitted";
  }
}

export function getDoctorConsultationStatusTone(status: string): DoctorConsultationStatusTone {
  switch (status) {
    case "submitted":
      return "info";
    case "accepted":
    case "doctor_responded":
      return "success";
    case "closed":
      return "neutral";
    case "cancelled":
    case "rejected":
      return "danger";
    default:
      return "neutral";
  }
}
