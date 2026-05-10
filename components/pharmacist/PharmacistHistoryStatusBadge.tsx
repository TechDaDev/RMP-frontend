"use client";

import { Badge } from "@/components/ui/Badge";

interface PharmacistHistoryStatusBadgeProps {
  status?: string;
}

export function PharmacistHistoryStatusBadge({
  status,
}: PharmacistHistoryStatusBadgeProps) {
  const getTone = (status?: string): "success" | "danger" | "warning" | "info" => {
    switch (status?.toLowerCase()) {
      case "dispensed":
        return "success";
      case "unavailable":
        return "danger";
      case "partial":
        return "warning";
      default:
        return "info";
    }
  };

  return <Badge tone={getTone(status)}>{status || "-"}</Badge>;
}
