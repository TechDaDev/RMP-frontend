import { Badge } from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types/payments";

interface PaymentIntentStatusBadgeProps {
  status?: PaymentStatus | string | null;
}

function normalizeStatus(value?: string | null): string {
  return (value ?? "unknown").toLowerCase();
}

export function PaymentIntentStatusBadge({ status }: PaymentIntentStatusBadgeProps) {
  const normalized = normalizeStatus(status);

  if (normalized === "paid") {
    return <Badge tone="success">Paid</Badge>;
  }

  if (normalized === "payment_pending") {
    return <Badge tone="warning">Pending</Badge>;
  }

  if (normalized === "failed") {
    return <Badge tone="danger">Failed</Badge>;
  }

  if (normalized === "refunded") {
    return <Badge tone="info">Refunded</Badge>;
  }

  if (normalized === "unpaid") {
    return <Badge tone="neutral">Unpaid</Badge>;
  }

  return <Badge tone="neutral">{status ?? "Unknown"}</Badge>;
}
