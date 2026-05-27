import type { LabTestCatalogItem } from "@/types/catalog";
import type { PaymentIntent, PaymentStatus } from "@/types/payments";

export type LaboratoryOrderStatus =
  | "issued"
  | "partially_completed"
  | "fully_completed"
  | "expired"
  | "cancelled"
  | string;

export type LaboratoryOrderItemStatus = "pending" | "completed" | "cancelled" | string;

export type LaboratoryResultStatus =
  | "submitted"
  | "corrected"
  | "reviewed"
  | "released"
  | string;

export type LaboratoryResultValueType =
  | "numeric"
  | "text"
  | "blood_group"
  | "positive_negative"
  | "file_only";

export type LaboratoryResultFlag =
  | "low"
  | "normal"
  | "high"
  | "critical"
  | "abnormal"
  | string;

export interface LaboratorySafeUser {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export interface LaboratoryTestCatalogItem extends LabTestCatalogItem {
  default_instructions?: string | null;
  display_order?: number;
  description?: string;
}

export interface LaboratoryOrderItem {
  id: string;
  test?: string | null;
  test_name?: string;
  category?: string;
  sample_type?: string | null;
  instructions?: string | null;
  status?: LaboratoryOrderItemStatus;
  completed_at?: string | null;
  cancelled_at?: string | null;
  created_at?: string;
  result_id?: string | null;
  lab_result_id?: string | null;
  lab_result?: { id?: string } | null;
}

export interface LaboratoryOrderDetail {
  id: string;
  qr_token?: string;
  status?: LaboratoryOrderStatus;
  locked?: boolean;
  patient?: LaboratorySafeUser | null;
  doctor?: LaboratorySafeUser | null;
  consultation?: string | { id?: string } | null;
  items?: LaboratoryOrderItem[];
  remaining_items?: LaboratoryOrderItem[];
  completed_items?: LaboratoryOrderItem[];
  expires_at?: string | null;
  created_at?: string;
  payment_status?: PaymentStatus | string;
  payment_intent?: string | PaymentIntent | null;
  paid_at?: string | null;
  payment_failed_at?: string | null;
  refunded_at?: string | null;
}

export interface LaboratoryOrderScanResponse {
  lab_order: LaboratoryOrderDetail;
  remaining_items: LaboratoryOrderItem[];
  completed_items?: LaboratoryOrderItem[];
  locked: boolean;
  message?: string | null;
}

export interface ScanLabOrderRequest {
  qr_token: string;
}

export interface CompleteLabOrderItemRequest {
  lab_order_item_id: string;
  status: "completed";
  note?: string;
}

export interface CompleteLabOrderRequest {
  items: CompleteLabOrderItemRequest[];
}

export interface LaboratoryCompletionResult {
  lab_order?: LaboratoryOrderDetail;
  completed_items?: LaboratoryOrderItem[];
  remaining_items?: LaboratoryOrderItem[];
  locked?: boolean;
  message?: string | null;
}

export interface CreateLaboratoryResultRequest {
  value_type: LaboratoryResultValueType;
  numeric_value?: string | number;
  text_value?: string;
  blood_group_value?: string;
  unit?: string;
  reference_range?: string;
  flag?: LaboratoryResultFlag;
  laboratorian_notes?: string;
  result_file?: File;
}

export type LaboratoryResultCreateRequest = CreateLaboratoryResultRequest;

export interface CorrectLaboratoryResultRequest {
  reason: string;
  value_type?: LaboratoryResultValueType;
  numeric_value?: string | number;
  text_value?: string;
  blood_group_value?: string;
  unit?: string;
  reference_range?: string;
  flag?: LaboratoryResultFlag;
  laboratorian_notes?: string;
}

export interface LaboratoryResultDetail {
  id: string;
  lab_order?: string | { id?: string } | null;
  lab_order_item?: LaboratoryOrderItem | string | unknown | null;
  test_label?: string;
  patient?: LaboratorySafeUser | null;
  doctor?: LaboratorySafeUser | null;
  laboratorian?: LaboratorySafeUser | null;
  status?: LaboratoryResultStatus;
  value_type?: LaboratoryResultValueType;
  text_value?: string | null;
  numeric_value?: string | number | null;
  blood_group_value?: string | null;
  unit?: string | null;
  reference_range?: string | null;
  flag?: LaboratoryResultFlag | null;
  result_file?: string | null;
  doctor_notes?: string | null;
  laboratorian_notes?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  released_at?: string | null;
  corrected_at?: string | null;
  is_linked_to_medical_record?: boolean;
  linked_entry?: string | null;
  linked_blood_group_record?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LabOfferingItem {
  id: string;
  lab_test?: string | LabTestCatalogItem | null;
  custom_test_name?: string | null;
  local_name?: string | null;
  display_name?: string | null;
  sample_type_override?: string | null;
  preparation_notes?: string | null;
  estimated_turnaround_time?: string | null;
  price: string;
  currency?: string;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LabOfferingCreateRequest {
  lab_test?: string;
  custom_test_name?: string;
  local_name?: string;
  sample_type_override?: string;
  preparation_notes?: string;
  estimated_turnaround_time?: string;
  price: string | number;
  currency?: string;
  is_available?: boolean;
}

export type LabOfferingUpdateRequest = Partial<LabOfferingCreateRequest>;

export interface LabQuoteItemPayload {
  lab_order_item: string;
  offering?: string;
  availability_status: string;
  quoted_name?: string;
  quantity?: string | number;
  unit_price?: string | number;
  lab_note?: string;
  substitution_note?: string;
}

export interface LabQuotePayload {
  items: LabQuoteItemPayload[];
  note?: string;
}

export interface LabServiceRequest {
  id: string;
  patient?: LaboratorySafeUser | null;
  doctor?: LaboratorySafeUser | null;
  consultation?: string | null;
  lab_order?: string | LaboratoryOrderDetail | null;
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

export interface LabServiceRequestCreate {
  lab_order?: string;
  target_laboratory?: string;
  notes?: string;
}