import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  PharmacyInventoryCreateRequest,
  PharmacyInventoryItem,
  PharmacyInventoryUpdateRequest,
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

export async function listPharmacyInventory(params?: QueryParams): Promise<PharmacyInventoryItem[]> {
  const response = await apiRequest<ListResponse<PharmacyInventoryItem> | ApiEnvelope<ListResponse<PharmacyInventoryItem>>>(
    withQuery(API_ENDPOINTS.pharmacyInventory.list, params),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getPharmacyInventoryItem(id: string): Promise<PharmacyInventoryItem> {
  const response = await apiRequest<PharmacyInventoryItem | ApiEnvelope<PharmacyInventoryItem>>(
    API_ENDPOINTS.pharmacyInventory.detail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function createPharmacyInventoryItem(
  payload: PharmacyInventoryCreateRequest,
): Promise<PharmacyInventoryItem> {
  const response = await apiRequest<PharmacyInventoryItem | ApiEnvelope<PharmacyInventoryItem>>(
    API_ENDPOINTS.pharmacyInventory.list,
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function updatePharmacyInventoryItem(
  id: string,
  payload: PharmacyInventoryUpdateRequest,
): Promise<PharmacyInventoryItem> {
  const response = await apiRequest<PharmacyInventoryItem | ApiEnvelope<PharmacyInventoryItem>>(
    API_ENDPOINTS.pharmacyInventory.detail(id),
    {
      auth: true,
      method: "PATCH",
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function deletePharmacyInventoryItem(id: string): Promise<void> {
  await apiRequest<void | ApiEnvelope<void>>(API_ENDPOINTS.pharmacyInventory.detail(id), {
    auth: true,
    method: "DELETE",
  });
}
