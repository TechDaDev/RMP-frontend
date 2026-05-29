import { apiRequest } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiEnvelope, PaginatedResponse } from "@/types/api";
import type {
  AdminWalletSearchResult,
  AdminManualRechargeRequest,
  PaymentIntent,
  PaymentIntentCreateRequest,
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
