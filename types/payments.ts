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
  balance: string;
  currency?: string;
  user?: string;
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
  created_at?: string;
  description?: string | null;
}

export interface PaymentIntent {
  id: string;
  service_type: ServiceType | string;
  reference_id?: string | null;
  amount?: string;
  currency?: string;
  payment_method?: string;
  status?: PaymentStatus | string;
  client_message?: string | null;
  created_at?: string;
  paid_at?: string | null;
}

export interface PaymentIntentCreateRequest {
  service_type: ServiceType;
  payment_method: "wallet" | "manual" | string;
  reference_id?: string;
  amount?: string | number;
}

export interface AdminManualRechargeRequest {
  user_id: string;
  amount: string | number;
  currency?: string;
  note?: string;
}
