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

export interface LaboratoryTestCatalogItem {
  id: string;
  name: string;
  category?: string;
  code?: string;
  description?: string;
  default_sample_type?: string | null;
  default_instructions?: string | null;
  display_order?: number;
  is_active?: boolean;
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
}

export interface LaboratoryOrderDetail {
  id: string;
  qr_token?: string;
  status?: LaboratoryOrderStatus;
  patient?: LaboratorySafeUser | null;
  doctor?: LaboratorySafeUser | null;
  consultation?: string | { id?: string } | null;
  items?: LaboratoryOrderItem[];
  remaining_items?: LaboratoryOrderItem[];
  completed_items?: LaboratoryOrderItem[];
  expires_at?: string | null;
  created_at?: string;
}

export interface LaboratoryOrderScanResponse {
  lab_order: LaboratoryOrderDetail;
  remaining_items: LaboratoryOrderItem[];
  locked: boolean;
  message?: string | null;
}

export interface ScanLabOrderRequest {
  qr_token: string;
}

export type LaboratoryCompleteLabOrderItemStatus = "completed" | "unavailable";

export interface CompleteLabOrderItemRequest {
  lab_order_item_id: string;
  status: LaboratoryCompleteLabOrderItemStatus;
  note?: string;
}

export interface CompleteLabOrderRequest {
  items: CompleteLabOrderItemRequest[];
}

export interface LaboratoryResultCreateRequest {
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
  lab_order_item?: string | { id?: string; test_name?: string; category?: string } | null;
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