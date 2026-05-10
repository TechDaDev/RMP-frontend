"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { PatientListCard } from "@/components/patient/ui/PatientListCard";
import { LabIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { PatientLabResultListItem } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabResultListProps {
  results: PatientLabResultListItem[];
}

export function LabResultList({ results }: LabResultListProps) {
  const { t } = useAppPreferences();

  if (results.length === 0) {
    return <DashboardStateCard state="empty" icon={<LabIcon size={20} />} title={t.patient.labResultsEmptyTitle} description={t.patient.labResultsEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <PatientListCard
          key={result.id}
          title={result.test_label}
          meta={`${t.patient.verifiedAt}: ${formatDate(result.released_at)}`}
          badge={<Badge tone="success">{t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"}</Badge>}
          href={`/app/patient/lab-results/${result.id}`}
          actionLabel={t.patient.labResultDetailTitle}
        >
          <DashboardGrid columns="four">
            <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[result.status ?? "released"] ?? result.status ?? "-"} />
            <PatientInfoRow label={t.patient.value} value={result.numeric_value || result.text_value || result.blood_group_value || "-"} />
            <PatientInfoRow label={t.patient.consultation} value={result.test_label} />
            <PatientInfoRow label={t.patient.verifiedAt} value={formatDate(result.released_at)} />
          </DashboardGrid>
        </PatientListCard>
      ))}
    </div>
  );
}
