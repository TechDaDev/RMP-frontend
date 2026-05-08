"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { getConsultationLifecycle } from "@/lib/patient/consultationStatus";
import type { ConsultationStatus } from "@/types/patient";

interface ConsultationStatusBadgeProps {
  status: ConsultationStatus;
}

export function ConsultationStatusBadge({ status }: ConsultationStatusBadgeProps) {
  const { t } = useAppPreferences();

  const lifecycle = getConsultationLifecycle(status);
  const tone =
    lifecycle === "accepted" || lifecycle === "in_progress"
      ? "success"
      : lifecycle === "pending_review"
        ? "primary"
        : "neutral";

  return <Badge tone={tone}>{t.patient.statusLabels[status] ?? status}</Badge>;
}