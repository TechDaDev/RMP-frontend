import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type { LabQuotePayload, LabServiceRequest, LabServiceRequestCreate } from "@/types/laboratory";

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

async function postAction(path: string): Promise<LabServiceRequest> {
  const response = await apiRequest<LabServiceRequest | ApiEnvelope<LabServiceRequest>>(path, {
    auth: true,
    body: {},
  });

  return unwrapData(response);
}

export async function createLabRequest(payload: LabServiceRequestCreate): Promise<LabServiceRequest> {
  const response = await apiRequest<LabServiceRequest | ApiEnvelope<LabServiceRequest>>(
    API_ENDPOINTS.labRequests.list,
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function listLabRequests(params?: QueryParams): Promise<LabServiceRequest[]> {
  const response = await apiRequest<ListResponse<LabServiceRequest> | ApiEnvelope<ListResponse<LabServiceRequest>>>(
    withQuery(API_ENDPOINTS.labRequests.list, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getLabRequest(id: string): Promise<LabServiceRequest> {
  const response = await apiRequest<LabServiceRequest | ApiEnvelope<LabServiceRequest>>(
    API_ENDPOINTS.labRequests.detail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function quoteLabRequest(id: string, payload: LabQuotePayload): Promise<LabServiceRequest> {
  const response = await apiRequest<LabServiceRequest | ApiEnvelope<LabServiceRequest>>(
    API_ENDPOINTS.labRequests.quote(id),
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export function acceptLabRequest(id: string): Promise<LabServiceRequest> {
  return postAction(API_ENDPOINTS.labRequests.accept(id));
}

export function rejectLabRequest(id: string): Promise<LabServiceRequest> {
  return postAction(API_ENDPOINTS.labRequests.reject(id));
}

export function cancelLabRequest(id: string): Promise<LabServiceRequest> {
  return postAction(API_ENDPOINTS.labRequests.cancel(id));
}

export function completeLabRequest(id: string): Promise<LabServiceRequest> {
  return postAction(API_ENDPOINTS.labRequests.complete(id));
}
