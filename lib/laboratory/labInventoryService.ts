import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type { LabOfferingCreateRequest, LabOfferingItem, LabOfferingUpdateRequest } from "@/types/laboratory";

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

export async function listLabOfferings(params?: QueryParams): Promise<LabOfferingItem[]> {
  const response = await apiRequest<ListResponse<LabOfferingItem> | ApiEnvelope<ListResponse<LabOfferingItem>>>(
    withQuery(API_ENDPOINTS.labInventory.list, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getLabOffering(id: string): Promise<LabOfferingItem> {
  const response = await apiRequest<LabOfferingItem | ApiEnvelope<LabOfferingItem>>(
    API_ENDPOINTS.labInventory.detail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function createLabOffering(payload: LabOfferingCreateRequest): Promise<LabOfferingItem> {
  const response = await apiRequest<LabOfferingItem | ApiEnvelope<LabOfferingItem>>(
    API_ENDPOINTS.labInventory.list,
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function updateLabOffering(
  id: string,
  payload: LabOfferingUpdateRequest,
): Promise<LabOfferingItem> {
  const response = await apiRequest<LabOfferingItem | ApiEnvelope<LabOfferingItem>>(
    API_ENDPOINTS.labInventory.detail(id),
    {
      auth: true,
      method: "PATCH",
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function deleteLabOffering(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.labInventory.detail(id), {
    auth: true,
    method: "DELETE",
  });
}
