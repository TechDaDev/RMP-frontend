export type DoctorConsultationStatus =
  | "submitted"
  | "accepted"
  | "doctor_responded"
  | "closed"
  | "cancelled"
  | "rejected";

export const DOCTOR_RECOMMENDATION_TYPES = [
  "general_advice",
  "specialist_referral",
  "follow_up",
  "medication",
  "lab_test",
  "emergency",
  "no_action",
] as const;

export type DoctorRecommendationType = (typeof DOCTOR_RECOMMENDATION_TYPES)[number];

export interface DoctorPatientUser {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  user_type?: string;
}

export interface DoctorConsultationSymptomCategory {
  id?: string;
  name?: string;
  description?: string;
}

export interface DoctorConsultationSymptom {
  id: string;
  name: string;
  is_red_flag?: boolean;
  category?: DoctorConsultationSymptomCategory | null;
}

export interface DoctorConsultationResponseRecord {
  id: string;
  doctor?: DoctorPatientUser;
  response_text?: string;
  recommendation_type?: string;
  created_at?: string;
  updated_at?: string;
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
  patient?: DoctorPatientUser | null;
  symptoms?: DoctorConsultationSymptom[];
}

export interface DoctorConsultationDetail extends DoctorConsultationListItem {
  selected_specialty_other?: string | null;
  recommended_specialty?: string | null;
  has_breathing_difficulty?: boolean;
  has_emergency_warning?: boolean;
  previous_visit_for_same_issue?: boolean;
  current_medications_related?: string | null;
  additional_notes?: string | null;
  accepted_at?: string | null;
  closed_at?: string | null;
  assigned_doctor?: DoctorPatientUser | null;
  responses?: DoctorConsultationResponseRecord[];
  attachments?: unknown[];
}

export interface DoctorMessage {
  id: string;
  consultation?: string;
  body?: string;
  sender?: DoctorPatientUser;
  sender_role?: string;
  message_type?: string;
  is_read?: boolean;
  read_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DoctorResponseRequest {
  response_text: string;
  recommendation_type?: string;
}

export interface DoctorMessageRequest {
  body: string;
}

export interface CreatePrescriptionRequest {
  [key: string]: unknown;
}

export interface CreateLabOrderRequest {
  [key: string]: unknown;
}
