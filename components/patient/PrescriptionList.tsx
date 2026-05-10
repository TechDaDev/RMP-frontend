"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { PatientListCard } from "@/components/patient/ui/PatientListCard";
import { PrescriptionIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import type { PatientPrescriptionListItem } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface PrescriptionListProps {
  prescriptions: PatientPrescriptionListItem[];
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  const { t } = useAppPreferences();

  if (prescriptions.length === 0) {
    return <DashboardStateCard state="empty" icon={<PrescriptionIcon size={20} />} title={t.patient.prescriptionsEmptyTitle} description={t.patient.prescriptionsEmptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((prescription) => (
        <PatientListCard
          key={prescription.id}
          title={prescription.doctor.full_name}
          meta={`${t.patient.issuedAt}: ${formatDate(prescription.issued_at)}`}
          badge={<Badge tone="primary">{t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"}</Badge>}
          href={`/app/patient/prescriptions/${prescription.id}`}
          actionLabel={t.patient.prescriptionDetailTitle}
        >
          <DashboardGrid columns="four">
            <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"} />
            <PatientInfoRow label={t.patient.doctor} value={prescription.doctor.full_name} />
            <PatientInfoRow label={t.patient.issuedAt} value={formatDate(prescription.issued_at)} />
            <PatientInfoRow label={t.patient.qrToken} value={<span className="block truncate">{prescription.qr_token || "-"}</span>} />
          </DashboardGrid>
        </PatientListCard>
      ))}
    </div>
  );
}
