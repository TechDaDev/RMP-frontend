import { Badge } from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types/payments";

interface PaymentStatusBadgeProps {
  status?: PaymentStatus | string | null;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const normalized = (status ?? "unpaid") as PaymentStatus | string;

  const tone =
    normalized === "paid"
      ? "success"
      : normalized === "payment_pending"
        ? "warning"
        : normalized === "failed"
          ? "danger"
          : normalized === "refunded"
            ? "info"
            : "neutral";

  return <Badge tone={tone}>{normalized}</Badge>;
}
