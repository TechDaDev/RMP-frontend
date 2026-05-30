import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  AdminWalletSearchResult,
  AdminManualRechargeRequest,
  PaymentIntent,
  PaymentIntentCreateRequest,
  RechargeRequest,
  RechargeRequestCreatePayload,
  RechargeRequestDecisionPayload,
  RechargeRequestListParams,
  ServiceType,
  Wallet,
  WalletTransaction,
} from "@/types/payments";

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

export function buildServicePaymentIntentPayload(serviceType: ServiceType, referenceId: string): PaymentIntentCreateRequest {
  if (serviceType === "wallet_recharge") {
    throw new Error("wallet_recharge must use buildWalletRechargePayload");
  }

  return {
    service_type: serviceType,
    reference_id: referenceId,
    payment_method: "wallet",
  };
}

export function buildWalletRechargePayload(amount: number | string): PaymentIntentCreateRequest {
  return {
    service_type: "wallet_recharge",
    amount,
    payment_method: "manual",
  };
}

export async function getWallet(): Promise<Wallet> {
  const response = await apiRequest<Wallet | ApiEnvelope<Wallet>>(API_ENDPOINTS.payments.wallet, {
    auth: true,
  });

  const wallet = unwrapData(response);
  const cachedBalance = wallet.cached_balance ?? wallet.balance ?? "0";

  return {
    ...wallet,
    cached_balance: String(cachedBalance),
  };
}

export async function getWalletTransactions(params?: QueryParams): Promise<WalletTransaction[]> {
  const response = await apiRequest<ListResponse<WalletTransaction> | ApiEnvelope<ListResponse<WalletTransaction>>>(
    withQuery(API_ENDPOINTS.payments.walletTransactions, params),
    {
      auth: true,
    },
  );

  return normalizeList(unwrapData(response));
}

export async function getAdminWallets(params?: QueryParams): Promise<AdminWalletSearchResult[]> {
  const response = await apiRequest<
    ListResponse<AdminWalletSearchResult> | ApiEnvelope<ListResponse<AdminWalletSearchResult>>
  >(
    withQuery(API_ENDPOINTS.payments.adminWallets, params),
    {
      auth: true,
    },
  );

  return normalizeList(unwrapData(response));
}

export async function createPaymentIntent(payload: PaymentIntentCreateRequest): Promise<PaymentIntent> {
  const response = await apiRequest<PaymentIntent | ApiEnvelope<PaymentIntent>>(API_ENDPOINTS.payments.intents, {
    auth: true,
    body: payload,
  });

  return unwrapData(response);
}

export async function getPaymentIntents(params?: QueryParams): Promise<PaymentIntent[]> {
  const response = await apiRequest<ListResponse<PaymentIntent> | ApiEnvelope<ListResponse<PaymentIntent>>>(
    withQuery(API_ENDPOINTS.payments.intents, params),
    {
      auth: true,
    },
  );

  return normalizeList(unwrapData(response));
}

export async function getPaymentIntentDetail(id: string): Promise<PaymentIntent> {
  const response = await apiRequest<PaymentIntent | ApiEnvelope<PaymentIntent>>(API_ENDPOINTS.payments.intentDetail(id), {
    auth: true,
    method: "GET",
  });

  return unwrapData(response);
}

export async function payIntentWithWallet(id: string): Promise<PaymentIntent> {
  const response = await apiRequest<PaymentIntent | ApiEnvelope<PaymentIntent>>(API_ENDPOINTS.payments.payWallet(id), {
    auth: true,
    body: {},
  });

  return unwrapData(response);
}

export async function adminManualRecharge(payload: AdminManualRechargeRequest): Promise<WalletTransaction> {
  const normalizedPayload = {
    user: payload.user ?? payload.user_id,
    amount: payload.amount,
    currency: payload.currency,
    description: payload.description ?? payload.note,
  };

  const response = await apiRequest<WalletTransaction | ApiEnvelope<WalletTransaction>>(
    API_ENDPOINTS.payments.adminManualRecharge,
    {
      auth: true,
      body: normalizedPayload,
    },
  );

  return unwrapData(response);
}

export async function createRechargeRequest(payload: RechargeRequestCreatePayload): Promise<RechargeRequest> {
  const formData = new FormData();
  formData.append("amount", payload.amount);
  formData.append("receipt_file", payload.receipt_file);
  if (payload.note?.trim()) {
    formData.append("note", payload.note.trim());
  }

  const response = await apiRequest<RechargeRequest | ApiEnvelope<RechargeRequest>>(
    API_ENDPOINTS.payments.rechargeRequests,
    {
      auth: true,
      body: formData,
    },
  );

  return unwrapData(response);
}

export async function getRechargeRequests(params?: RechargeRequestListParams): Promise<RechargeRequest[]> {
  const queryParams: QueryParams = {};
  if (params?.status) queryParams.status = params.status;
  if (params?.user) queryParams.user = params.user;
  if (params?.user_id) queryParams.user_id = params.user_id;
  if (params?.email) queryParams.email = params.email;
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  const response = await apiRequest<ListResponse<RechargeRequest> | ApiEnvelope<ListResponse<RechargeRequest>>>(
    withQuery(API_ENDPOINTS.payments.rechargeRequests, queryParams),
    { auth: true },
  );

  return normalizeList(unwrapData(response));
}

export async function getRechargeRequestDetail(id: string): Promise<RechargeRequest> {
  const response = await apiRequest<RechargeRequest | ApiEnvelope<RechargeRequest>>(
    API_ENDPOINTS.payments.rechargeRequestDetail(id),
    { auth: true },
  );

  return unwrapData(response);
}

export async function approveRechargeRequest(id: string, payload?: RechargeRequestDecisionPayload): Promise<RechargeRequest> {
  const response = await apiRequest<RechargeRequest | ApiEnvelope<RechargeRequest>>(
    API_ENDPOINTS.payments.rechargeRequestApprove(id),
    {
      auth: true,
      body: payload ?? {},
    },
  );

  return unwrapData(response);
}

export async function rejectRechargeRequest(id: string, payload?: RechargeRequestDecisionPayload): Promise<RechargeRequest> {
  const response = await apiRequest<RechargeRequest | ApiEnvelope<RechargeRequest>>(
    API_ENDPOINTS.payments.rechargeRequestReject(id),
    {
      auth: true,
      body: payload ?? {},
    },
  );

  return unwrapData(response);
}
