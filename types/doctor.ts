export type DoctorConsultationStatus =
  | "submitted"
  | "accepted"
  | "doctor_responded"
  | "closed"
  | "cancelled"
  | "rejected";

export interface DoctorConsultationPatientSummary {
  id?: string;
  full_name?: string;
  age?: number | null;
  gender?: string | null;
}

export interface DoctorConsultationSymptom {
  id: string;
  name: string;
  is_red_flag?: boolean;
  category?: {
    id?: string;
    name?: string;
  } | null;
}

export interface DoctorConsultationListItem {
  id: string;
  status: DoctorConsultationStatus | string;
  selected_specialty?: string | null;
  selected_specialty_display?: string | null;
  severity?: string | null;
  duration?: string | null;
  has_fever?: boolean;
  has_pain?: boolean;
  created_at?: string;
  patient?: DoctorConsultationPatientSummary | null;
  symptoms?: DoctorConsultationSymptom[];
}

export interface DoctorConsultationResponse {
  id: string;
  response_text?: string;
  diagnosis_summary?: string;
  recommended_action?: string;
  recommendation_type?: string;
  created_at?: string;
}

export interface DoctorConsultationDetail extends DoctorConsultationListItem {
  additional_notes?: string | null;
  assigned_doctor?: unknown;
  responses?: DoctorConsultationResponse[];
}

export interface DoctorMessage {
  id: string;
  body?: string;
  message?: string;
  sender?: unknown;
  created_at?: string;
  is_read?: boolean;
}

export interface DoctorResponseRequest {
  response_text: string;
  diagnosis_summary?: string;
  recommended_action?: string;
  recommendation_type?: string;
}

export interface CreatePrescriptionRequest {
  [key: string]: unknown;
}

export interface CreateLabOrderRequest {
  [key: string]: unknown;
}

export interface DoctorMessageRequest {
  body: string;
}
