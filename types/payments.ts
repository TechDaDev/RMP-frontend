export type ServiceType =
  | "consultation"
  | "lab_request"
  | "pharmacy_request"
  | "wallet_recharge";

export type PaymentStatus =
  | "unpaid"
  | "payment_pending"
  | "paid"
  | "refunded"
  | "failed";

export interface Wallet {
  id?: string;
  cached_balance: string;
  /** @deprecated backend canonical field is cached_balance */
  balance?: string;
  currency?: string;
  user?: string;
  updated_at?: string;
}

export interface AdminWalletSearchResult {
  id: string;
  user: string;
  user_email?: string | null;
  user_full_name?: string | null;
  cached_balance?: string | null;
  currency?: string | null;
  status?: string | null;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  wallet?: string;
  transaction_type?: string;
  amount: string;
  currency?: string;
  status?: string;
  service_type?: ServiceType | string;
  reference_id?: string | null;
  payment_intent?: string | null;
  provider_transaction_id?: string | null;
  external_reference?: string | null;
  created_by?: string | null;
  updated_at?: string;
  notes?: string | null;
  created_at?: string;
  description?: string | null;
}

export interface PaymentIntent {
  id: string;
  service_type: ServiceType | string;
  reference_id?: string | null;
  provider_id?: string | null;
  patient_id?: string | null;
  amount?: string;
  currency?: string;
  payment_method?: string;
  status?: PaymentStatus | string;
  provider_transaction_id?: string | null;
  external_reference?: string | null;
  source?: string | null;
  notes?: string | null;
  client_message?: string | null;
  created_at?: string;
  updated_at?: string;
  paid_at?: string | null;
}

export interface PaymentIntentCreateRequest {
  service_type: ServiceType;
  payment_method: "wallet" | "manual" | string;
  reference_id?: string;
  amount?: string | number;
}

export interface AdminManualRechargeRequest {
  user?: string;
  user_id?: string;
  amount: string | number;
  currency?: string;
  description?: string;
  note?: string;
}
