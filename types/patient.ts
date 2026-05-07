import type { PaginatedResponse } from "@/types/api";

export type ConsultationStatus =
  | "submitted"
  | "accepted"
  | "doctor_responded"
  | "closed"
  | "cancelled"
  | "rejected";

export type ConsultationSeverity = "mild" | "moderate" | "severe" | "very_severe";

export type ConsultationDuration =
  | "less_than_24_hours"
  | "one_to_three_days"
  | "four_to_seven_days"
  | "one_to_two_weeks"
  | "more_than_two_weeks"
  | "chronic_recurring";

export type PatientPrescriptionStatus =
  | "issued"
  | "partially_dispensed"
  | "fully_dispensed"
  | "expired"
  | "cancelled";

export type PatientLabOrderStatus =
  | "issued"
  | "partially_completed"
  | "fully_completed"
  | "expired"
  | "cancelled";

export type PatientLabResultStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "released"
  | "corrected"
  | "cancelled";

export type MedicalRecordEntryCategory =
  | "blood_group"
  | "allergy"
  | "chronic_condition"
  | "current_medication"
  | "past_surgery"
  | "family_history"
  | "smoking_status"
  | "pregnancy_status"
  | "general_note";

export type MedicalRecordVerificationStatus =
  | "pending"
  | "doctor_confirmed"
  | "laboratory_confirmed"
  | "rejected";

export type BloodGroup =
  | "a_positive"
  | "a_negative"
  | "b_positive"
  | "b_negative"
  | "ab_positive"
  | "ab_negative"
  | "o_positive"
  | "o_negative"
  | "unknown";

export interface SafeUserSummary {
  id: string;
  full_name: string;
  email: string;
}

export interface SymptomCategory {
  id: string;
  name: string;
  description?: string;
  display_order?: number;
}

export interface Symptom {
  id: string;
  category?: SymptomCategory;
  category_id?: string;
  name: string;
  description?: string;
  is_red_flag?: boolean;
  display_order?: number;
}

export interface ConsultationListItem {
  id: string;
  status: ConsultationStatus;
  duration: ConsultationDuration;
  severity: ConsultationSeverity;
  selected_specialty?: string | null;
  selected_specialty_other?: string;
  recommended_specialty?: string | null;
  assigned_doctor?: string | null;
  has_fever?: boolean;
  has_pain?: boolean;
  has_breathing_difficulty?: boolean;
  previous_visit_for_same_issue?: boolean;
  current_medications_related?: string;
  additional_notes?: string;
  has_emergency_warning?: boolean;
  created_at?: string;
  updated_at?: string;
  accepted_at?: string | null;
  closed_at?: string | null;
}

export interface ConsultationResponse {
  id: string;
  response_text: string;
  recommendation_type?: string;
  doctor?: SafeUserSummary;
  created_at?: string;
}

export interface ConsultationAttachment {
  id?: string;
  file?: string;
  file_name?: string;
  uploaded_at?: string;
}

export interface ConsultationDetail extends ConsultationListItem {
  patient?: SafeUserSummary;
  doctor?: SafeUserSummary | null;
  symptoms?: Symptom[];
  responses?: ConsultationResponse[];
  attachments?: ConsultationAttachment[];
}

export interface ConsultationCreateRequest {
  duration: ConsultationDuration;
  severity: ConsultationSeverity;
  has_fever: boolean;
  has_pain: boolean;
  additional_notes?: string;
  symptom_ids: string[];
}

export interface ConsultationMessageAttachment {
  id?: string;
  file?: string;
  file_name?: string;
}

export interface ConsultationMessage {
  id: string;
  body: string;
  sender?: SafeUserSummary;
  created_at?: string;
  attachments?: ConsultationMessageAttachment[];
}

export interface ConsultationMessageCreateRequest {
  body: string;
}

export interface PatientPrescriptionListItem {
  id: string;
  consultation_id: string;
  doctor: SafeUserSummary;
  status?: PatientPrescriptionStatus;
  qr_token?: string;
  issued_at?: string;
  expires_at?: string | null;
  fully_dispensed_at?: string | null;
}

export type PatientPrescriptionDetail = PatientPrescriptionListItem;

export interface PatientLabOrderListItem {
  id: string;
  consultation_id: string;
  doctor: SafeUserSummary;
  status?: PatientLabOrderStatus;
  qr_token?: string;
  qr_url?: string;
  test_count?: string;
  issued_at?: string;
  expires_at?: string | null;
  fully_completed_at?: string | null;
  guidance?: string;
}

export type PatientLabOrderDetail = PatientLabOrderListItem;

export interface PatientLabResultListItem {
  id: string;
  lab_order: string;
  lab_order_item: string;
  test_label: string;
  status?: PatientLabResultStatus;
  value_type: string;
  text_value?: string;
  numeric_value?: string | null;
  blood_group_value?: BloodGroup | "" | null;
  unit?: string;
  reference_range?: string;
  flag?: string;
  result_file?: string | null;
  released_at?: string | null;
  created_at?: string;
}

export type PatientLabResultDetail = PatientLabResultListItem;

export interface MedicalRecordBloodGroup {
  blood_group?: BloodGroup;
  verification_status?: MedicalRecordVerificationStatus | string;
  verified_at?: string | null;
  notes?: string;
}

export interface MedicalRecordEntry {
  id: string;
  category: MedicalRecordEntryCategory | string;
  title: string;
  value: string;
  notes?: string;
  verification_status?: MedicalRecordVerificationStatus | string;
  source_user?: SafeUserSummary | null;
  verified_by?: SafeUserSummary | null;
  verified_at?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PatientMedicalRecord {
  id: string;
  patient?: SafeUserSummary;
  blood_group?: MedicalRecordBloodGroup | BloodGroup | null;
  entries: MedicalRecordEntry[];
  created_at?: string;
  updated_at?: string;
}

export interface PatientDashboardSummary {
  consultationsCount: number;
  prescriptionsCount: number;
  labOrdersCount: number;
  labResultsCount: number;
  medicalRecord: PatientMedicalRecord | null;
}

export interface SymptomsQueryParams {
  categoryId?: string;
  search?: string;
}

export type PatientListResponse<T> = T[] | PaginatedResponse<T>;