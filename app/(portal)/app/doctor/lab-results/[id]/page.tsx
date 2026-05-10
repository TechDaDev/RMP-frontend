"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorLabResultDetailPanel } from "@/components/doctor/DoctorLabResultDetailPanel";
import { DoctorLabResultMedicalRecordCard } from "@/components/doctor/DoctorLabResultMedicalRecordCard";
import { DoctorLabResultReleaseCard } from "@/components/doctor/DoctorLabResultReleaseCard";
import { DoctorLabResultReviewCard } from "@/components/doctor/DoctorLabResultReviewCard";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
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
      <DashboardStateCard state="loading" description={t.patient.loading} />
    );
  }

  if (error || !result) {
    return (
      <DashboardStateCard
        state="error"
        title={t.patient.noDataTitle}
        description={error ?? t.doctor.resultsUnavailable}
        action={
          <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
            {t.doctor.backToDoctorDashboard}
          </Link>
        }
      />
    );
  }

  return (
    <DoctorPageFrame>
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

      <DashboardGrid columns="two">
        <DoctorLabResultReviewCard result={result} onReview={handleReview} />
        <DoctorLabResultReleaseCard result={result} onRelease={handleRelease} />
      </DashboardGrid>

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
    </DoctorPageFrame>
  );
}
