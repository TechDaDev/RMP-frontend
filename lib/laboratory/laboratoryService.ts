import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  CompleteLabOrderRequest,
  CorrectLaboratoryResultRequest,
  LaboratoryCompletionResult,
  LaboratoryOrderScanResponse,
  LaboratoryResultCreateRequest,
  LaboratoryResultDetail,
  LaboratoryTestCatalogItem,
  ScanLabOrderRequest,
} from "@/types/laboratory";

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

function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
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

function toResultRequestBody(
  payload: LaboratoryResultCreateRequest | CorrectLaboratoryResultRequest,
): FormData | Record<string, unknown> {
  if ("result_file" in payload && payload.result_file instanceof File) {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      if (key === "result_file") {
        formData.append(key, value as File);
        return;
      }
      formData.append(key, String(value));
    });
    return formData;
  }

  const body: Record<string, unknown> = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) {
      body[key] = value;
    }
  });
  return body;
}

export function getLabTestCatalog(params?: { category?: string; search?: string }): Promise<LaboratoryTestCatalogItem[]> {
  return getListResource<LaboratoryTestCatalogItem>(
    `${API_ENDPOINTS.laboratoryTests.list}${toQueryString(params)}`,
  );
}

export async function scanLabOrder(payload: ScanLabOrderRequest): Promise<LaboratoryOrderScanResponse> {
  const response = await apiRequest<LaboratoryOrderScanResponse | ApiEnvelope<LaboratoryOrderScanResponse>>(
    API_ENDPOINTS.laboratoryOrders.scan,
    {
      auth: true,
      body: payload,
    },
  );

  return unwrapData(response);
}

export async function completeLabOrderItems(orderId: string, payload: CompleteLabOrderRequest): Promise<LaboratoryCompletionResult> {
  const response = await apiRequest<LaboratoryCompletionResult | ApiEnvelope<LaboratoryCompletionResult>>(
    API_ENDPOINTS.laboratoryOrders.complete(orderId),
    {
      auth: true,
      body: payload,
    },
  );

  const result = unwrapData(response) as LaboratoryCompletionResult & {
    pending_items?: LaboratoryCompletionResult["remaining_items"];
  };

  return {
    ...result,
    remaining_items: result.remaining_items ?? result.pending_items,
  };
}

export async function createLabResultForItem(
  itemId: string,
  payload: LaboratoryResultCreateRequest,
): Promise<LaboratoryResultDetail> {
  const response = await apiRequest<LaboratoryResultDetail | ApiEnvelope<LaboratoryResultDetail>>(
    API_ENDPOINTS.laboratoryResults.createForItem(itemId),
    {
      auth: true,
      body: toResultRequestBody(payload),
    },
  );

  return unwrapData(response);
}

export function getLaboratoryResultDetail(resultId: string): Promise<LaboratoryResultDetail> {
  return getResource<LaboratoryResultDetail>(API_ENDPOINTS.laboratoryResults.detail(resultId));
}

export async function correctLaboratoryResult(
  resultId: string,
  payload: CorrectLaboratoryResultRequest,
): Promise<LaboratoryResultDetail> {
  const response = await apiRequest<LaboratoryResultDetail | ApiEnvelope<LaboratoryResultDetail>>(
    API_ENDPOINTS.laboratoryResults.correct(resultId),
    {
      auth: true,
      body: toResultRequestBody(payload),
    },
  );

  return unwrapData(response);
}
