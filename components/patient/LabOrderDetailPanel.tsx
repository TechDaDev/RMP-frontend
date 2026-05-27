"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { PatientQrCode } from "@/components/patient/PatientQrCode";
import { PatientInfoRow } from "@/components/patient/ui/PatientInfoRow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { PatientLabOrderDetail } from "@/types/patient";

const defaultLabGuidance =
  "Show this QR code to any verified laboratory/laboratorian registered in the platform. The laboratory will scan it and view only the pending requested tests.";

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function getLocalizedGuidance(guidance: string | undefined, locale: string) {
  if (!guidance) {
    return "-";
  }

  if (normalizeText(guidance) !== normalizeText(defaultLabGuidance)) {
    return guidance;
  }

  if (locale === "ar") {
    return "اعرض رمز QR هذا على أي مختبر أو مختبري موثّق ومسجل في المنصة. سيقوم المختبر بمسحه وعرض الفحوصات المطلوبة المعلقة فقط.";
  }

  if (locale === "ku") {
    return "ئەم کۆدی QR ـە پیشان بدە بە هەر تاقیگە یان کارمەندی تاقیگەیەکی پشتڕاستکراو و تۆمارکراو لە پلاتفۆڕمەکەدا. تاقیگەکە دەیسکانێت و تەنها تاقیکردنەوە داواکراوە چاوەڕوانەکان دەبینێت.";
  }

  return defaultLabGuidance;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

interface LabOrderDetailPanelProps {
  order: PatientLabOrderDetail;
}

export function LabOrderDetailPanel({ order }: LabOrderDetailPanelProps) {
  const { locale, t } = useAppPreferences();

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.labOrderDetailTitle}</h2>
        <Badge tone="primary">{t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"}</Badge>
      </div>
      <DashboardGrid columns="four">
        <PatientInfoRow label={t.patient.status} value={t.patient.statusLabels[order.status ?? "issued"] ?? order.status ?? "-"} />
        <PatientInfoRow label={t.patient.doctor} value={order.doctor.full_name} />
        <PatientInfoRow label={t.patient.issuedAt} value={formatDate(order.issued_at)} />
        <PatientInfoRow label={t.patient.expiresAt} value={formatDate(order.expires_at)} />
      </DashboardGrid>
      <PatientInfoRow label="Payment" value={<PaymentStatusBadge status={order.payment_status} />} muted />
      <DashboardGrid columns="two">
        <PatientInfoRow
          label={t.patient.qrToken}
          value={<PatientQrCode token={order.qr_token} imageUrl={order.qr_url} alt={t.patient.qrToken} />}
          muted
        />
        <PatientInfoRow label={t.patient.guidance} value={getLocalizedGuidance(order.guidance, locale)} muted />
      </DashboardGrid>
      <p className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm text-[var(--color-muted)]">
        {t.patient.labOrderPrivacyNote}
      </p>
    </Card>
  );
}
