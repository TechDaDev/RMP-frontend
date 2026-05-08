"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorLabResultDetailPanel } from "@/components/doctor/DoctorLabResultDetailPanel";
import { DoctorLabResultMedicalRecordCard } from "@/components/doctor/DoctorLabResultMedicalRecordCard";
import { DoctorLabResultReleaseCard } from "@/components/doctor/DoctorLabResultReleaseCard";
import { DoctorLabResultReviewCard } from "@/components/doctor/DoctorLabResultReviewCard";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getDoctorLabResultDetail,
  linkLabResultToMedicalRecord,
  releaseDoctorLabResult,
  reviewDoctorLabResult,
} from "@/lib/doctor/doctorService";
import type {
  DoctorLabResultDetail,
  LinkLabResultToMedicalRecordRequest,
  ReviewDoctorLabResultRequest,
} from "@/types/doctor";

export default function DoctorLabResultDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const labResultId = params.id;

  const [result, setResult] = useState<DoctorLabResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labOrderId = useMemo(() => {
    if (!result) {
      return null;
    }
    return typeof result.lab_order === "string" ? result.lab_order : result.lab_order?.id ?? null;
  }, [result]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDoctorLabResultDetail(labResultId);
      setResult(data);
    } catch {
      setError(t.patient.noDataDescription);
    } finally {
      setLoading(false);
    }
  }, [labResultId, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleReview(payload: ReviewDoctorLabResultRequest) {
    if (!result) {
      return;
    }
    const updated = await reviewDoctorLabResult(result.id, payload);
    setResult(updated);
  }

  async function handleRelease() {
    if (!result) {
      return;
    }
    const updated = await releaseDoctorLabResult(result.id);
    setResult(updated);
  }

  async function handleLink(payload: LinkLabResultToMedicalRecordRequest) {
    if (!result) {
      return;
    }
    const updated = await linkLabResultToMedicalRecord(result.id, payload);
    setResult(updated);
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !result) {
    return (
      <Card className="space-y-4 rounded-[2rem]">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.doctor.resultsUnavailable} />
        <div className="flex flex-wrap justify-center gap-2">
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
        badge={<Badge tone="primary">{t.doctor.labResultDetail}</Badge>}
        title={t.doctor.labResultDetail}
        description={t.doctor.doctorOnlyLabResultDetails}
        actions={
          <Button variant="secondary" onClick={() => void loadDetail()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorLabResultDetailPanel result={result} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DoctorLabResultReviewCard result={result} onReview={handleReview} />
        <DoctorLabResultReleaseCard result={result} onRelease={handleRelease} />
      </div>

      <DoctorLabResultMedicalRecordCard result={result} onLink={handleLink} />

      <div className="flex flex-wrap gap-2">
        {labOrderId ? (
          <Link href={`/app/doctor/lab-orders/${labOrderId}`} className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToLabOrder}
          </Link>
        ) : null}
        <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToDoctorDashboard}
        </Link>
      </div>
    </div>
  );
}
