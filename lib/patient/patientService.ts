import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  ConsultationCreateRequest,
  ConsultationDetail,
  ConsultationListItem,
  ConsultationMessage,
  ConsultationMessageCreateRequest,
  PatientDashboardSummary,
  PatientLabOrderDetail,
  PatientLabOrderListItem,
  PatientLabResultDetail,
  PatientLabResultListItem,
  PatientListResponse,
  PatientMedicalRecord,
  PatientPrescriptionDetail,
  PatientPrescriptionListItem,
  Symptom,
  SymptomCategory,
  SymptomsQueryParams,
} from "@/types/patient";

function unwrapData<T>(value: T | ApiEnvelope<T>): T {
  if (value && typeof value === "object" && "data" in value) {
    const maybeEnvelope = value as ApiEnvelope<T>;
    if (maybeEnvelope.data !== undefined) {
      return maybeEnvelope.data;
    }
  }

  return value as T;
}

function normalizeList<T>(value: PatientListResponse<T>): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object" && "results" in value) {
    const results = (value as PaginatedResponse<T>).results;
    return Array.isArray(results) ? results : [];
  }

  return [];
}

async function getResource<T>(path: string): Promise<T> {
  const response = await apiRequest<T | ApiEnvelope<T>>(path, { auth: true });
  return unwrapData(response);
}

async function getListResource<T>(path: string): Promise<T[]> {
  const response = await apiRequest<PatientListResponse<T> | ApiEnvelope<PatientListResponse<T>>>(
    path,
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getPatientDashboardSummary(): Promise<PatientDashboardSummary> {
  const [consultations, prescriptions, labOrders, labResults, medicalRecord] = await Promise.all([
    getMyConsultations(),
    getMyPrescriptions(),
    getMyLabOrders(),
    getMyLabResults(),
    getMyMedicalRecord(),
  ]);

  return {
    consultationsCount: consultations.length,
    prescriptionsCount: prescriptions.length,
    labOrdersCount: labOrders.length,
    labResultsCount: labResults.length,
    medicalRecord,
  };
}

export function getMyConsultations(): Promise<ConsultationListItem[]> {
  return getListResource<ConsultationListItem>(API_ENDPOINTS.consultations.my);
}

export async function createConsultation(
  payload: ConsultationCreateRequest,
): Promise<ConsultationDetail> {
  const body: ConsultationCreateRequest = {
    duration: payload.duration,
    severity: payload.severity,
    has_fever: payload.has_fever,
    has_pain: payload.has_pain,
    additional_notes: payload.additional_notes,
    symptom_ids: payload.symptom_ids,
  };

  const response = await apiRequest<ConsultationDetail | ApiEnvelope<ConsultationDetail>>(
    API_ENDPOINTS.consultations.create,
    {
      auth: true,
      body,
    },
  );

  return unwrapData(response);
}

export function getConsultationDetail(id: string): Promise<ConsultationDetail> {
  return getResource<ConsultationDetail>(API_ENDPOINTS.consultations.detail(id));
}

export function getSymptomCategories(): Promise<SymptomCategory[]> {
  return getListResource<SymptomCategory>(API_ENDPOINTS.consultations.symptomCategories);
}

export function getSymptoms(params?: SymptomsQueryParams): Promise<Symptom[]> {
  const searchParams = new URLSearchParams();

  if (params?.categoryId) {
    searchParams.set("category", params.categoryId);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const path = searchParams.size > 0
    ? `${API_ENDPOINTS.consultations.symptoms}?${searchParams.toString()}`
    : API_ENDPOINTS.consultations.symptoms;

  return getListResource<Symptom>(path);
}

export function getConsultationMessages(consultationId: string): Promise<ConsultationMessage[]> {
  return getListResource<ConsultationMessage>(API_ENDPOINTS.consultations.messages(consultationId));
}

export async function sendConsultationMessage(
  consultationId: string,
  payload: ConsultationMessageCreateRequest,
): Promise<ConsultationMessage> {
  const response = await apiRequest<ConsultationMessage | ApiEnvelope<ConsultationMessage>>(
    API_ENDPOINTS.consultations.messages(consultationId),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function markConsultationMessagesRead(consultationId: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(
    API_ENDPOINTS.consultations.markMessagesRead(consultationId),
    {
      auth: true,
      body: {},
    },
  );
}

export function getMyPrescriptions(): Promise<PatientPrescriptionListItem[]> {
  return getListResource<PatientPrescriptionListItem>(API_ENDPOINTS.prescriptions.my);
}

export function getMyPrescriptionDetail(id: string): Promise<PatientPrescriptionDetail> {
  return getResource<PatientPrescriptionDetail>(API_ENDPOINTS.prescriptions.myDetail(id));
}

export function getMyLabOrders(): Promise<PatientLabOrderListItem[]> {
  return getListResource<PatientLabOrderListItem>(API_ENDPOINTS.labOrders.my);
}

export function getMyLabOrderDetail(id: string): Promise<PatientLabOrderDetail> {
  return getResource<PatientLabOrderDetail>(API_ENDPOINTS.labOrders.myDetail(id));
}

export function getMyLabResults(): Promise<PatientLabResultListItem[]> {
  return getListResource<PatientLabResultListItem>(API_ENDPOINTS.labResults.my);
}

export function getMyLabResultDetail(id: string): Promise<PatientLabResultDetail> {
  return getResource<PatientLabResultDetail>(API_ENDPOINTS.labResults.myDetail(id));
}

export function getMyMedicalRecord(): Promise<PatientMedicalRecord> {
  return getResource<PatientMedicalRecord>(API_ENDPOINTS.patientRecords.my);
}