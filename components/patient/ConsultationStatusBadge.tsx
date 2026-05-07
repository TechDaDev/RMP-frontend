"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import type { ConsultationStatus } from "@/types/patient";

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus;
}

export function ConsultationStatusBadge({ status }: ConsultationStatusBadgeProps) {
  const { t } = useAppPreferences();

  const tone = status === "accepted" || status === "doctor_responded"
    ? "success"
    : status === "submitted"
      ? "primary"
      : "neutral";

  return <Badge tone={tone}>{t.patient.statusLabels[status] ?? status}</Badge>;
}