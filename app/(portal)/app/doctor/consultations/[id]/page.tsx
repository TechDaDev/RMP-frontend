"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { getDoctorConsultationDetail } from "@/lib/doctor/doctorService";
import {
  getDoctorConsultationStatusLabelKey,
  getDoctorConsultationStatusTone,
} from "@/lib/doctor/doctorConsultationStatus";
import type { DoctorConsultationDetail } from "@/types/doctor";

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleString();
}

function badgeToneFromStatus(status: string): "neutral" | "primary" | "success" {
  const tone = getDoctorConsultationStatusTone(status);
  if (tone === "info") {
    return "primary";
  }
  if (tone === "success") {
    return "success";
  }
  return "neutral";
}

export default function DoctorConsultationDetailPlaceholderPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DoctorConsultationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDetail() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDoctorConsultationDetail(params.id);
        if (!active) return;
        setDetail(data);
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 403) {
          setError(t.doctor.verifiedDoctorRequiredDescription);
        } else {
          setError(t.patient.noDataDescription);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadDetail();
    return () => {
      active = false;
    };
  }, [params.id, t.doctor.verifiedDoctorRequiredDescription, t.patient.noDataDescription]);

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !detail) {
    return (
      <Card className="space-y-4 rounded-[2rem]">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/app/doctor/consultations/pending" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToPendingConsultations}
          </Link>
          <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToAssignedConsultations}
          </Link>
          <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToDoctorDashboard}
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.doctor.consultationWorkspace}</Badge>}
        title={t.doctor.consultationWorkspace}
        description={t.doctor.fullWorkspaceComingNext}
      />

      <Card className="rounded-[2rem]">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={badgeToneFromStatus(detail.status)}>
            {t.doctor[getDoctorConsultationStatusLabelKey(detail.status)]}
          </Badge>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.roles.patient}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{detail.patient?.full_name ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.specialty}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{detail.selected_specialty_display ?? detail.selected_specialty ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.severity}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{detail.severity ? (t.patient.severityLabels[detail.severity] ?? detail.severity) : "-"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.patient.createdAt}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{formatDate(detail.created_at)}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-[var(--color-muted)]">
          {detail.additional_notes || "-"}
        </p>

        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.symptoms}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {(detail.symptoms ?? []).map((symptom) => symptom.name).join("، ") || "-"}
          </p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link href="/app/doctor/consultations/pending" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToPendingConsultations}
        </Link>
        <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToAssignedConsultations}
        </Link>
        <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToDoctorDashboard}
        </Link>
      </div>
    </div>
  );
}
