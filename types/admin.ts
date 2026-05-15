export interface AdminKnowledgeDocument {
  id: string;
  title: string;
  document_type?: string;
  language?: string;
  audience?: string;
  specialty?: string | null;
  approval_status?: string;
  processing_status?: string;
  security_status?: string;
  is_active?: boolean;
  uploaded_by_email?: string;
  approved_by_email?: string | null;
  original_filename?: string;
  created_at?: string;
  updated_at?: string;
}

export type AdminKnowledgeDocumentType =
  | "medical_book"
  | "laboratory_book"
  | "clinical_guideline"
  | "drug_reference"
  | "patient_education"
  | "platform_policy"
  | "other";

export type AdminKnowledgeLanguage =
  | "english"
  | "arabic"
  | "kurdish"
  | "mixed"
  | "other";

export type AdminKnowledgeAudience =
  | "doctor"
  | "pharmacist"
  | "laboratorian"
  | "patient"
  | "admin"
  | "mixed";

export interface AdminKnowledgeCreateRequest {
  title: string;
  document_type: AdminKnowledgeDocumentType;
  language: AdminKnowledgeLanguage;
  audience: AdminKnowledgeAudience;
  file: File;
  specialty?: string;
}

export interface AdminKnowledgeProcessingLog {
  id?: string;
  action?: string;
  status?: string;
  message?: string | null;
  created_at?: string;
}

export interface AdminKnowledgeChunk {
  id?: string;
  document?: string;
  chunk_index?: number;
  text?: string;
  has_embedding?: boolean;
  created_at?: string;
}

export interface AdminKnowledgeDocumentDetail extends AdminKnowledgeDocument {
  source_authority?: string | null;
  version?: string | null;
  description?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  approved_at?: string | null;
  rejected_reason?: string | null;
  chunk_count?: string | number;
  processing_logs?: AdminKnowledgeProcessingLog[];
}

export interface AdminRagFeedbackItem {
  id: string;
  rag_response_id?: string;
  doctor_email?: string;
  rating?: string;
  comment?: string | null;
  is_source_grounded?: boolean;
  is_clinically_useful?: boolean;
  is_safe?: boolean;
  needs_admin_review?: boolean;
  review_status?: "pending" | "reviewed" | "dismissed" | "escalated" | string;
  reviewed_by_email?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AdminRagFeedbackReviewRequest {
  review_status: "reviewed" | "dismissed" | "escalated";
  review_notes?: string;
}

export interface AdminRagAnalyticsSummary {
  feedback?: {
    total_responses?: number;
    responses_with_feedback?: number;
    feedback_coverage_rate?: number;
    ratings?: Record<string, number>;
    unsafe_count?: number;
    needs_admin_review_count?: number;
    review_status?: Record<string, number>;
  };
  retrieval_quality?: {
    total_retrieved_chunks?: number;
    chunks_with_feedback?: number;
    source_relevance?: Record<string, number>;
    average_score?: number;
    average_rank_of_relevant_sources?: number;
  };
  usage?: {
    total_queries?: number;
    by_service_context?: Record<string, number>;
    by_status?: Record<string, number>;
    total_token_input?: number;
    total_token_output?: number;
  };
}

export interface AdminDatasetExportJsonResponse {
  format?: "json";
  record_count?: number;
  data?: Array<Record<string, unknown>>;
}

// Admin Verification Review API Types

export type AdminVerificationRole = "doctor" | "pharmacist" | "laboratorian";
export type AdminVerificationStatus = "pending" | "approved" | "rejected" | "suspended";

export interface AdminVerificationUserSummary {
  id: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  date_joined?: string | null;
}

export interface AdminVerificationProfileSummary {
  license_number?: string | null;
  specialty?: string | null;
  workplace_name?: string | null;
  address?: string | null;
  years_of_experience?: number | null;
  phone_number?: string | null;
  pharmacy_name?: string | null;
  laboratory_name?: string | null;
}

export interface AdminVerificationListItem {
  id: string;
  role: AdminVerificationRole;
  status: AdminVerificationStatus;
  user?: AdminVerificationUserSummary;
  profile?: AdminVerificationProfileSummary;
  submitted_at?: string | null;
  updated_at?: string | null;
}

export interface AdminVerificationDetail extends AdminVerificationListItem {
  verification_notes?: string | null;
  verified_at?: string | null;
  verified_by?: AdminVerificationUserSummary | null;
}

export interface AdminVerificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminVerificationListItem[];
}

export interface AdminVerificationListParams {
  role?: AdminVerificationRole;
  status?: AdminVerificationStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface AdminVerificationApproveRequest {
  note?: string;
}

export interface AdminVerificationRejectRequest {
  reason: string;
}

export interface AdminVerificationSuspendRequest {
  reason: string;
}
