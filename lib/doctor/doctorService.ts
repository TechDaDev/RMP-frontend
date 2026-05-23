import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  CancelDoctorPrescriptionRequest,
  CreateDoctorLabOrderRequest,
  DoctorAIAssistantMessage,
  CreateDoctorPrescriptionRequest,
  DoctorConsultationDetail,
  DoctorConsultationListItem,
  DoctorLabOrderDetail,
  DoctorLabResultDetail,
  DoctorPatientRecord,
  LinkLabResultToMedicalRecordRequest,
  DoctorMessage,
  DoctorMessageRequest,
  DoctorPrescriptionDetail,
  GenerateDoctorAIMessageRequest,
  MarkDoctorAIMessageReadRequest,
  ReleaseDoctorLabResultRequest,
  ReviewDoctorLabResultRequest,
  DoctorResponseRequest,
} from "@/types/doctor";

type ListResponse<T> = T[] | PaginatedResponse<T>;

function unwrapData<T>(value: T | ApiEnvelope<T>): T {
  if (value && typeof value === "object" && "data" in value) {
    const envelope = value as ApiEnvelope<T>;
    if (envelope.data !== undefined) {
      return envelope.data;
    }
  }

  return value as T;
}

function normalizeList<T>(value: ListResponse<T>): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object" && "results" in value) {
    return Array.isArray(value.results) ? value.results : [];
  }

  return [];
}

async function getListResource<T>(path: string): Promise<T[]> {
  const response = await apiRequest<ListResponse<T> | ApiEnvelope<ListResponse<T>>>(path, {
    auth: true,
  });

  return normalizeList(unwrapData(response));
}

async function getResource<T>(path: string): Promise<T> {
  const response = await apiRequest<T | ApiEnvelope<T>>(path, { auth: true });
  return unwrapData(response);
}

function toConsultationMessageBody(payload: DoctorMessageRequest): FormData | Record<string, unknown> {
  const trimmedBody = payload.body?.trim();
  const attachments = payload.attachments?.filter((file): file is File => file instanceof File) ?? [];

  if (attachments.length > 0) {
    const formData = new FormData();
    if (trimmedBody) {
      formData.append("body", trimmedBody);
    }
    attachments.forEach((file) => {
      formData.append("attachments", file);
    });
    return formData;
  }

  return trimmedBody ? { body: trimmedBody } : {};
}

export function getPendingConsultations(): Promise<DoctorConsultationListItem[]> {
  return getListResource<DoctorConsultationListItem>(API_ENDPOINTS.doctorConsultations.pending);
}

export function getAssignedConsultations(): Promise<DoctorConsultationListItem[]> {
  return getListResource<DoctorConsultationListItem>(API_ENDPOINTS.doctorConsultations.assigned);
}

export function getDoctorConsultationDetail(id: string): Promise<DoctorConsultationDetail> {
  return getResource<DoctorConsultationDetail>(API_ENDPOINTS.doctorConsultations.detail(id));
}

export async function acceptConsultation(id: string): Promise<DoctorConsultationDetail | null> {
  const response = await apiRequest<
    DoctorConsultationDetail | ApiEnvelope<DoctorConsultationDetail> | void | ApiEnvelope<void>
  >(API_ENDPOINTS.doctorConsultations.accept(id), {
    auth: true,
    body: {},
  });

  if (response && typeof response === "object" && "data" in response) {
    const envelope = response as ApiEnvelope<DoctorConsultationDetail>;
    return envelope.data ?? null;
  }

  return response && typeof response === "object"
    ? (response as DoctorConsultationDetail)
    : null;
}

export async function sendDoctorResponse(id: string, payload: DoctorResponseRequest): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorConsultations.response(id), {
    auth: true,
    body: payload,
  });
}

export async function closeConsultation(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorConsultations.close(id), {
    auth: true,
    body: {},
  });
}

export function getConsultationMessages(id: string): Promise<DoctorMessage[]> {
  return getListResource<DoctorMessage>(API_ENDPOINTS.doctorConsultations.messages(id));
}

export async function sendConsultationMessage(id: string, payload: DoctorMessageRequest): Promise<DoctorMessage> {
  const response = await apiRequest<DoctorMessage | ApiEnvelope<DoctorMessage>>(
    API_ENDPOINTS.doctorConsultations.messages(id),
    {
      auth: true,
      body: toConsultationMessageBody(payload),
    },
  );

  return unwrapData(response);
}

export async function markConsultationMessagesRead(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorConsultations.markMessagesRead(id), {
    auth: true,
    body: {},
  });
}

export function getDoctorAIAssistantMessages(consultationId: string): Promise<DoctorAIAssistantMessage[]> {
  return getListResource<DoctorAIAssistantMessage>(
    API_ENDPOINTS.ragDoctorAssistant.consultationMessages(consultationId),
  );
}

export function getDoctorAIAssistantMessageDetail(messageId: string): Promise<DoctorAIAssistantMessage> {
  return getResource<DoctorAIAssistantMessage>(API_ENDPOINTS.ragDoctorAssistant.detail(messageId));
}

export async function generateDoctorAIMessageFromReport(
  reportId: string,
  payload: GenerateDoctorAIMessageRequest = {},
): Promise<DoctorAIAssistantMessage> {
  const response = await apiRequest<DoctorAIAssistantMessage | ApiEnvelope<DoctorAIAssistantMessage>>(
    API_ENDPOINTS.ragDoctorAssistant.generateFromMedicalReport(reportId),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function markDoctorAIMessageRead(
  messageId: string,
  payload: MarkDoctorAIMessageReadRequest,
): Promise<DoctorAIAssistantMessage> {
  const response = await apiRequest<DoctorAIAssistantMessage | ApiEnvelope<DoctorAIAssistantMessage>>(
    API_ENDPOINTS.ragDoctorAssistant.markRead(messageId),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function createPrescriptionFromConsultation(
  id: string,
  payload: CreateDoctorPrescriptionRequest,
): Promise<DoctorPrescriptionDetail> {
  const response = await apiRequest<DoctorPrescriptionDetail | ApiEnvelope<DoctorPrescriptionDetail>>(
    API_ENDPOINTS.doctorPrescriptions.createFromConsultation(id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export function getDoctorPrescriptionDetail(id: string): Promise<DoctorPrescriptionDetail> {
  return getResource<DoctorPrescriptionDetail>(API_ENDPOINTS.doctorPrescriptions.detail(id));
}

export async function cancelDoctorPrescription(
  id: string,
  payload: CancelDoctorPrescriptionRequest = {},
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorPrescriptions.cancel(id), {
    auth: true,
    body: payload,
  });
}

export async function createLabOrderFromConsultation(
  id: string,
  payload: CreateDoctorLabOrderRequest,
): Promise<DoctorLabOrderDetail> {
  const response = await apiRequest<DoctorLabOrderDetail | ApiEnvelope<DoctorLabOrderDetail>>(
    API_ENDPOINTS.doctorLabOrders.createFromConsultation(id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export function getDoctorLabOrderDetail(id: string): Promise<DoctorLabOrderDetail> {
  return getResource<DoctorLabOrderDetail>(API_ENDPOINTS.doctorLabOrders.detail(id));
}

export async function cancelDoctorLabOrder(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabOrders.cancel(id), {
    auth: true,
    body: {},
  });
}

export function getDoctorLabResultDetail(id: string): Promise<DoctorLabResultDetail> {
  return getResource<DoctorLabResultDetail>(API_ENDPOINTS.doctorLabResults.detail(id));
}

export async function reviewDoctorLabResult(
  id: string,
  payload: ReviewDoctorLabResultRequest,
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.review(id), {
    auth: true,
    body: payload,
  });
}

export async function releaseDoctorLabResult(
  id: string,
  payload: ReleaseDoctorLabResultRequest = {},
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.release(id), {
    auth: true,
    body: payload,
  });
}

export async function linkLabResultToMedicalRecord(
  id: string,
  payload: LinkLabResultToMedicalRecordRequest = {},
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.linkMedicalRecord(id), {
    auth: true,
    body: payload,
  });
}

export function getAuthorizedPatientRecord(patientId: string): Promise<DoctorPatientRecord> {
  return getResource<DoctorPatientRecord>(API_ENDPOINTS.doctorPatientRecords.detail(patientId));
}
