import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  CancelDoctorPrescriptionRequest,
  CreateDoctorPrescriptionRequest,
  CreateLabOrderRequest,
  DoctorConsultationDetail,
  DoctorConsultationListItem,
  DoctorMessage,
  DoctorMessageRequest,
  DoctorPrescriptionDetail,
  DoctorResponseRequest,
} from "@/types/doctor";
import type { PatientMedicalRecord } from "@/types/patient";

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

export function getPendingConsultations(): Promise<DoctorConsultationListItem[]> {
  return getListResource<DoctorConsultationListItem>(API_ENDPOINTS.doctorConsultations.pending);
}

export function getAssignedConsultations(): Promise<DoctorConsultationListItem[]> {
  return getListResource<DoctorConsultationListItem>(API_ENDPOINTS.doctorConsultations.assigned);
}

export function getDoctorConsultationDetail(id: string): Promise<DoctorConsultationDetail> {
  return getResource<DoctorConsultationDetail>(API_ENDPOINTS.doctorConsultations.detail(id));
}

export async function acceptConsultation(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorConsultations.accept(id), {
    auth: true,
    body: {},
  });
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
      body: payload,
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
): Promise<DoctorPrescriptionDetail> {
  const response = await apiRequest<DoctorPrescriptionDetail | ApiEnvelope<DoctorPrescriptionDetail>>(
    API_ENDPOINTS.doctorPrescriptions.cancel(id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function createLabOrderFromConsultation(
  id: string,
  payload: CreateLabOrderRequest,
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabOrders.createFromConsultation(id), {
    auth: true,
    body: payload,
  });
}

export function getDoctorLabOrderDetail(id: string): Promise<unknown> {
  return getResource<unknown>(API_ENDPOINTS.doctorLabOrders.detail(id));
}

export async function cancelDoctorLabOrder(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabOrders.cancel(id), {
    auth: true,
    body: {},
  });
}

export function getDoctorLabResultDetail(id: string): Promise<unknown> {
  return getResource<unknown>(API_ENDPOINTS.doctorLabResults.detail(id));
}

export async function reviewDoctorLabResult(id: string, payload: Record<string, unknown>): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.review(id), {
    auth: true,
    body: payload,
  });
}

export async function releaseDoctorLabResult(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.release(id), {
    auth: true,
    body: {},
  });
}

export async function linkLabResultToMedicalRecord(
  id: string,
  payload?: Record<string, unknown>,
): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.doctorLabResults.linkMedicalRecord(id), {
    auth: true,
    body: payload ?? {},
  });
}

export function getAuthorizedPatientRecord(patientId: string): Promise<PatientMedicalRecord> {
  return getResource<PatientMedicalRecord>(API_ENDPOINTS.doctorPatientRecords.detail(patientId));
}
