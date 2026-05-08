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

export type DoctorPrescriptionStatus =
  | "issued"
  | "partially_dispensed"
  | "fully_dispensed"
  | "expired"
  | "cancelled"
  | string;

export type DoctorPrescriptionItemStatus = "pending" | "dispensed" | "cancelled" | string;

export type MedicationRoute =
  | "oral"
  | "topical"
  | "inhalation"
  | "injection"
  | "eye"
  | "ear"
  | "nasal"
  | "rectal"
  | "other";

export interface DoctorPrescriptionItemCreateRequest {
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: MedicationRoute;
  strength?: string;
  quantity?: string;
  instructions?: string;
}

export interface CreateDoctorPrescriptionRequest {
  items: DoctorPrescriptionItemCreateRequest[];
}

export interface DoctorPrescriptionItem {
  id: string;
  medication_name: string;
  strength?: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: MedicationRoute | string;
  quantity?: string;
  instructions?: string;
  status?: DoctorPrescriptionItemStatus;
  dispensed_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
}

export interface DoctorDispensingRecord {
  id: string;
  prescription_item_id?: string;
  pharmacist?: DoctorPatientUser;
  status?: string;
  dispensed_quantity?: string;
  note?: string;
  created_at?: string;
}

export interface DoctorPrescriptionDetail {
  id: string;
  consultation_id?: string;
  patient?: DoctorPatientUser;
  doctor?: DoctorPatientUser;
  status?: DoctorPrescriptionStatus;
  qr_token?: string;
  issued_at?: string;
  expires_at?: string | null;
  cancelled_at?: string | null;
  fully_dispensed_at?: string | null;
  items?: DoctorPrescriptionItem[];
  dispensing_records?: DoctorDispensingRecord[];
}

export type CreatePrescriptionRequest = CreateDoctorPrescriptionRequest;

export interface CancelDoctorPrescriptionRequest {
  [key: string]: never;
}

export type DoctorLabOrderStatus =
  | "issued"
  | "partially_completed"
  | "fully_completed"
  | "expired"
  | "cancelled"
  | string;

export type DoctorLabOrderItemStatus = "pending" | "completed" | "cancelled" | string;

export interface CreateDoctorLabOrderItemRequest {
  test?: string;
  test_name?: string;
  category?: string;
  sample_type?: string;
  instructions?: string;
}

export interface CreateDoctorLabOrderRequest {
  items: CreateDoctorLabOrderItemRequest[];
}

export interface DoctorLabOrderItem {
  id?: string;
  test?: string | null;
  test_name?: string;
  category?: string;
  sample_type?: string;
  instructions?: string;
  status?: DoctorLabOrderItemStatus;
  completed_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
}

export interface DoctorLabOrderCompletionRecord {
  id?: string;
  lab_order_item_id?: string;
  laboratorian?: DoctorPatientUser;
  status?: string;
  note?: string;
  created_at?: string;
}

export interface DoctorLabOrderDetail {
  id: string;
  consultation_id?: string;
  patient?: DoctorPatientUser;
  doctor?: DoctorPatientUser;
  status?: DoctorLabOrderStatus;
  qr_token?: string;
  created_at?: string;
  expires_at?: string | null;
  cancelled_at?: string | null;
  fully_completed_at?: string | null;
  items?: DoctorLabOrderItem[];
  completion_records?: DoctorLabOrderCompletionRecord[];
}
