"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { PatientQrCode } from "@/components/patient/PatientQrCode";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PatientPrescriptionDetail } from "@/types/patient";

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface PrescriptionDetailPanelProps {
  prescription: PatientPrescriptionDetail;
}

export function PrescriptionDetailPanel({ prescription }: PrescriptionDetailPanelProps) {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.prescriptionDetailTitle}</h2>
        <Badge tone="primary">{t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"}</Badge>
      </div>
      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[prescription.status ?? "issued"] ?? prescription.status ?? "-"} />
        <PatientInfoRow label={t.patient.doctor} value={prescription.doctor.full_name} />
        <PatientInfoRow label={t.patient.issuedAt} value={formatDate(prescription.issued_at)} />
        <PatientInfoRow label={t.patient.expiresAt} value={formatDate(prescription.expires_at)} />
      </DashboardGrid>
      <PatientInfoRow label="Payment" value={<PaymentStatusBadge status={prescription.payment_status} />} muted />
      <PatientInfoRow
        label={t.patient.qrToken}
        value={<PatientQrCode token={prescription.qr_token} imageUrl={prescription.qr_url} alt={t.patient.qrToken} />}
        muted
      />
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.prescriptionPrivacyNote}
      </p>
    </Card>
  );
}
