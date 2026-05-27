import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type { DrugCatalogItem, LabTestCatalogItem } from "@/types/catalog";

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

function withSearch(path: string, search: string): string {
  const query = search.trim();
  if (!query) {
    return path;
  }

  return `${path}?search=${encodeURIComponent(query)}`;
}

export async function searchDrugs(search: string): Promise<DrugCatalogItem[]> {
  const response = await apiRequest<ListResponse<DrugCatalogItem> | ApiEnvelope<ListResponse<DrugCatalogItem>>>(
    withSearch(API_ENDPOINTS.catalog.drugs, search),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getDrug(id: string): Promise<DrugCatalogItem> {
  const response = await apiRequest<DrugCatalogItem | ApiEnvelope<DrugCatalogItem>>(
    API_ENDPOINTS.catalog.drugDetail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function searchLabTests(search: string): Promise<LabTestCatalogItem[]> {
  const response = await apiRequest<ListResponse<LabTestCatalogItem> | ApiEnvelope<ListResponse<LabTestCatalogItem>>>(
    withSearch(API_ENDPOINTS.catalog.labTests, search),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getLabTest(id: string): Promise<LabTestCatalogItem> {
  const response = await apiRequest<LabTestCatalogItem | ApiEnvelope<LabTestCatalogItem>>(
    API_ENDPOINTS.catalog.labTestDetail(id),
    { auth: true },
  );

  return unwrapData(response);
}
