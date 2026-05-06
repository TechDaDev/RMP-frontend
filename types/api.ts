export type ApiStatus = "success" | "error";

export interface ApiEnvelope<T> {
  status?: ApiStatus;
  success?: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorDetail {
  detail?: string;
  code?: string;
  messages?: Array<Record<string, unknown>>;
}

export type ApiResponse<T> = ApiEnvelope<T> | T;
