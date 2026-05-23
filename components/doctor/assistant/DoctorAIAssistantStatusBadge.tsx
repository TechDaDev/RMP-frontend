import { Badge } from "@/components/ui/Badge";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import type {
  DoctorAIAssistantMessageStatus,
  DoctorAIAssistantSafetyLevel,
} from "@/types/doctor";

interface DoctorAIAssistantStatusBadgeProps {
  status?: DoctorAIAssistantMessageStatus | string;
  safetyLevel?: DoctorAIAssistantSafetyLevel | string;
}

export function DoctorAIAssistantStatusBadge({
  status,
  safetyLevel,
}: DoctorAIAssistantStatusBadgeProps) {
  const { t } = useAppPreferences();

  const statusTone =
    status === "unread"
      ? "warning"
      : status === "read"
        ? "success"
        : "neutral";

  const statusLabel =
    status === "unread"
      ? t.doctor.aiAssistantUnread
      : status === "read"
        ? t.doctor.aiAssistantRead
        : t.doctor.aiAssistantArchived;

  const safetyTone =
    safetyLevel === "doctor_only"
      ? "info"
      : safetyLevel === "failed"
        ? "danger"
        : "warning";

  const safetyLabel =
    safetyLevel === "doctor_only"
      ? t.doctor.aiAssistantSafetyDoctorOnly
      : safetyLevel === "needs_review"
        ? t.doctor.aiAssistantSafetyNeedsReview
        : safetyLevel === "low_confidence"
          ? t.doctor.aiAssistantSafetyLowConfidence
          : safetyLevel === "no_context"
            ? t.doctor.aiAssistantSafetyNoContext
            : t.doctor.aiAssistantSafetyFailed;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone={statusTone}>{statusLabel}</Badge>
      <Badge tone={safetyTone}>{safetyLabel}</Badge>
    </div>
  );
}
