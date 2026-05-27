import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  PharmacyPrescriptionRequest,
  PharmacyPrescriptionRequestCreate,
  PharmacyQuotePayload,
} from "@/types/pharmacist";

type ListResponse<T> = T[] | PaginatedResponse<T>;

type QueryParams = Record<string, string | number | boolean | undefined>;

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

function withQuery(path: string, params?: QueryParams): string {
  if (!params) {
    return path;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

async function postAction(path: string): Promise<PharmacyPrescriptionRequest> {
  const response = await apiRequest<PharmacyPrescriptionRequest | ApiEnvelope<PharmacyPrescriptionRequest>>(
    path,
    {
      auth: true,
      body: {},
    },
  );

  return unwrapData(response);
}

export async function createPharmacyRequest(
  payload: PharmacyPrescriptionRequestCreate,
): Promise<PharmacyPrescriptionRequest> {
  const response = await apiRequest<PharmacyPrescriptionRequest | ApiEnvelope<PharmacyPrescriptionRequest>>(
    API_ENDPOINTS.pharmacyRequests.list,
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function listPharmacyRequests(params?: QueryParams): Promise<PharmacyPrescriptionRequest[]> {
  const response = await apiRequest<ListResponse<PharmacyPrescriptionRequest> | ApiEnvelope<ListResponse<PharmacyPrescriptionRequest>>>(
    withQuery(API_ENDPOINTS.pharmacyRequests.list, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getPharmacyRequest(id: string): Promise<PharmacyPrescriptionRequest> {
  const response = await apiRequest<PharmacyPrescriptionRequest | ApiEnvelope<PharmacyPrescriptionRequest>>(
    API_ENDPOINTS.pharmacyRequests.detail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function quotePharmacyRequest(
  id: string,
  payload: PharmacyQuotePayload,
): Promise<PharmacyPrescriptionRequest> {
  const response = await apiRequest<PharmacyPrescriptionRequest | ApiEnvelope<PharmacyPrescriptionRequest>>(
    API_ENDPOINTS.pharmacyRequests.quote(id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export function acceptPharmacyRequest(id: string): Promise<PharmacyPrescriptionRequest> {
  return postAction(API_ENDPOINTS.pharmacyRequests.accept(id));
}

export function rejectPharmacyRequest(id: string): Promise<PharmacyPrescriptionRequest> {
  return postAction(API_ENDPOINTS.pharmacyRequests.reject(id));
}

export function cancelPharmacyRequest(id: string): Promise<PharmacyPrescriptionRequest> {
  return postAction(API_ENDPOINTS.pharmacyRequests.cancel(id));
}

export function completePharmacyRequest(id: string): Promise<PharmacyPrescriptionRequest> {
  return postAction(API_ENDPOINTS.pharmacyRequests.complete(id));
}
