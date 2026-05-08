import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { getLabOrderStatusTone } from "@/lib/laboratory/laboratoryStatus";
import type { LaboratoryOrderStatus } from "@/types/laboratory";

export interface LaboratoryOrderStatusBadgeProps {
  status: LaboratoryOrderStatus;
}

export function LaboratoryOrderStatusBadge({ status }: LaboratoryOrderStatusBadgeProps) {
  const { t } = useAppPreferences();

  const statusLabelMap: Record<LaboratoryOrderStatus, string> = {
    issued: t.laboratory.statusIssued,
    partially_completed: t.laboratory.statusPartiallyCompleted,
    fully_completed: t.laboratory.statusFullyCompleted,
    expired: t.laboratory.statusExpired,
    cancelled: t.laboratory.statusCancelled,
  };

  const label = statusLabelMap[status] || status;
  const tone = getLabOrderStatusTone(status);

  return <Badge tone={tone}>{label}</Badge>;
}
