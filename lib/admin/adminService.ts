import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  AdminDatasetExportJsonResponse,
  AdminKnowledgeChunk,
  AdminKnowledgeDocument,
  AdminKnowledgeDocumentDetail,
  AdminRagAnalyticsSummary,
  AdminRagFeedbackItem,
  AdminRagFeedbackReviewRequest,
  AdminVerificationApproveRequest,
  AdminVerificationDetail,
  AdminVerificationListParams,
  AdminVerificationListResponse,
  AdminVerificationRejectRequest,
  AdminVerificationSuspendRequest,
} from "@/types/admin";

type ListLike<T> = T[] | PaginatedResponse<T>;

function unwrapData<T>(value: T | ApiEnvelope<T>): T {
  if (value && typeof value === "object" && "data" in value) {
    const envelope = value as ApiEnvelope<T>;
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }

  return value as T;
}

function normalizeList<T>(value: ListLike<T>): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object" && "results" in value) {
    return Array.isArray(value.results) ? value.results : [];
  }

  return [];
}

function appendQuery(path: string, params?: Record<string, string | number | boolean | undefined>) {
  if (!params) {
    return path;
  }

  const search = new URLSearchParams();
  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined || raw === "") {
      continue;
    }
    search.set(key, String(raw));
  }

  const serialized = search.toString();
  return serialized ? `${path}?${serialized}` : path;
}

async function postAction(path: string, body: Record<string, unknown> = {}) {
  await apiRequest<void | ApiEnvelope<void>>(path, {
    auth: true,
    body,
  });
}

export async function getAdminKnowledgeDocuments(params?: {
  approval_status?: string;
  processing_status?: string;
  language?: string;
  document_type?: string;
}): Promise<AdminKnowledgeDocument[]> {
  const response = await apiRequest<ListLike<AdminKnowledgeDocument> | ApiEnvelope<ListLike<AdminKnowledgeDocument>>>(
    appendQuery(API_ENDPOINTS.admin.knowledgeDocuments, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function createAdminKnowledgeDocument(payload: {
  title: string;
  document_type: string;
  language: string;
  audience: string;
  file: File;
  specialty?: string;
}): Promise<AdminKnowledgeDocument> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("document_type", payload.document_type);
  formData.append("language", payload.language);
  formData.append("audience", payload.audience);
  formData.append("file", payload.file);

  if (payload.specialty && payload.specialty.trim()) {
    formData.append("specialty", payload.specialty.trim());
  }

  const response = await apiRequest<AdminKnowledgeDocument | ApiEnvelope<AdminKnowledgeDocument>>(
    API_ENDPOINTS.admin.knowledgeDocuments,
    {
      auth: true,
      body: formData,
    },
  );

  return unwrapData(response);
}

export async function getAdminKnowledgeDocumentDetail(documentId: string): Promise<AdminKnowledgeDocumentDetail> {
  const response = await apiRequest<AdminKnowledgeDocumentDetail | ApiEnvelope<AdminKnowledgeDocumentDetail>>(
    API_ENDPOINTS.admin.knowledgeDocumentDetail(documentId),
    { auth: true },
  );

  return unwrapData(response);
}

export async function getAdminKnowledgeDocumentChunks(
  documentId: string,
  params?: { limit?: number; offset?: number },
): Promise<AdminKnowledgeChunk[]> {
  const response = await apiRequest<ListLike<AdminKnowledgeChunk> | ApiEnvelope<ListLike<AdminKnowledgeChunk>>>(
    appendQuery(API_ENDPOINTS.admin.knowledgeDocumentChunks(documentId), params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export function processAdminKnowledgeDocument(documentId: string): Promise<void> {
  return postAction(API_ENDPOINTS.admin.knowledgeDocumentProcess(documentId));
}

export function approveAdminKnowledgeDocument(documentId: string): Promise<void> {
  return postAction(API_ENDPOINTS.admin.knowledgeDocumentApprove(documentId));
}

export function rejectAdminKnowledgeDocument(documentId: string, reason: string): Promise<void> {
  return postAction(API_ENDPOINTS.admin.knowledgeDocumentReject(documentId), { reason });
}

export function archiveAdminKnowledgeDocument(documentId: string): Promise<void> {
  return postAction(API_ENDPOINTS.admin.knowledgeDocumentArchive(documentId));
}

export function embedAdminKnowledgeDocument(documentId: string): Promise<void> {
  return postAction(API_ENDPOINTS.admin.knowledgeDocumentEmbed(documentId));
}

export async function getAdminRagFeedback(params?: {
  rating?: string;
  review_status?: string;
  needs_admin_review?: boolean;
}): Promise<AdminRagFeedbackItem[]> {
  const response = await apiRequest<ListLike<AdminRagFeedbackItem> | ApiEnvelope<ListLike<AdminRagFeedbackItem>>>(
    appendQuery(API_ENDPOINTS.admin.ragFeedback, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function reviewAdminRagFeedback(
  feedbackId: string,
  payload: AdminRagFeedbackReviewRequest,
): Promise<AdminRagFeedbackItem> {
  const response = await apiRequest<AdminRagFeedbackItem | ApiEnvelope<AdminRagFeedbackItem>>(
    API_ENDPOINTS.admin.ragFeedbackReview(feedbackId),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function getAdminRagAnalyticsSummary(): Promise<AdminRagAnalyticsSummary> {
  const response = await apiRequest<AdminRagAnalyticsSummary | ApiEnvelope<AdminRagAnalyticsSummary>>(
    API_ENDPOINTS.admin.ragAnalyticsSummary,
    { auth: true },
  );

  return unwrapData(response);
}

export async function exportAdminRagDatasetJson(): Promise<AdminDatasetExportJsonResponse> {
  const response = await apiRequest<AdminDatasetExportJsonResponse | ApiEnvelope<AdminDatasetExportJsonResponse>>(
    API_ENDPOINTS.admin.ragDatasetExport,
    {
      auth: true,
      body: { format: "json" },
    },
  );

  return unwrapData(response);
}

// Admin Verification Review Methods

export async function getAdminVerifications(
  params?: AdminVerificationListParams,
): Promise<AdminVerificationListResponse> {
  const response = await apiRequest<
    AdminVerificationListResponse | ApiEnvelope<AdminVerificationListResponse>
  >(appendQuery(API_ENDPOINTS.admin.verifications, params as Record<string, string | number | boolean | undefined>), { auth: true });

  return unwrapData(response);
}

export async function getAdminVerificationDetail(
  role: string,
  id: string,
): Promise<AdminVerificationDetail> {
  const response = await apiRequest<AdminVerificationDetail | ApiEnvelope<AdminVerificationDetail>>(
    API_ENDPOINTS.admin.verificationDetail(role, id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function approveAdminVerification(
  role: string,
  id: string,
  payload: AdminVerificationApproveRequest,
): Promise<AdminVerificationDetail> {
  const response = await apiRequest<AdminVerificationDetail | ApiEnvelope<AdminVerificationDetail>>(
    API_ENDPOINTS.admin.verificationApprove(role, id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function rejectAdminVerification(
  role: string,
  id: string,
  payload: AdminVerificationRejectRequest,
): Promise<AdminVerificationDetail> {
  const response = await apiRequest<AdminVerificationDetail | ApiEnvelope<AdminVerificationDetail>>(
    API_ENDPOINTS.admin.verificationReject(role, id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function suspendAdminVerification(
  role: string,
  id: string,
  payload: AdminVerificationSuspendRequest,
): Promise<AdminVerificationDetail> {
  const response = await apiRequest<AdminVerificationDetail | ApiEnvelope<AdminVerificationDetail>>(
    API_ENDPOINTS.admin.verificationSuspend(role, id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}
