import { Badge } from "@/components/ui/Badge";

interface QuoteStatusBadgeProps {
  status?: string | null;
}

export function QuoteStatusBadge({ status }: QuoteStatusBadgeProps) {
  const normalized = (status ?? "pending").toLowerCase();

  const tone =
    normalized.includes("accept")
      ? "success"
      : normalized.includes("reject") || normalized.includes("cancel")
        ? "danger"
        : normalized.includes("quote") || normalized.includes("pending")
          ? "warning"
          : "neutral";

  return <Badge tone={tone}>{status ?? "pending"}</Badge>;
}
