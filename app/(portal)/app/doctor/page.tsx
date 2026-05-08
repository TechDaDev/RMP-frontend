"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorConsultationList } from "@/components/doctor/DoctorConsultationList";
import { DoctorDashboardSummary } from "@/components/doctor/DoctorDashboardSummary";
import { DoctorVerificationNotice } from "@/components/doctor/DoctorVerificationNotice";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import {
  acceptConsultation,
  getAssignedConsultations,
  getPendingConsultations,
} from "@/lib/doctor/doctorService";
import type { DoctorConsultationListItem } from "@/types/doctor";

export default function DoctorPortalPage() {
  const { t } = useAppPreferences();
  const { profile, verification } = useAuth();
  const [pending, setPending] = useState<DoctorConsultationListItem[]>([]);
  const [assigned, setAssigned] = useState<DoctorConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const doctorSpecialty = useMemo(() => {
    if (!profile?.role_profile || !("specialty" in profile.role_profile)) {
      return null;
    }

    const specialty = profile.role_profile.specialty;
    return typeof specialty === "string" && specialty.length > 0 ? specialty : null;
  }, [profile?.role_profile]);

  const isApproved = verification?.is_approved === true;

  const loadQueues = useCallback(async () => {
    setLoading(true);
    setError(null);
    let firstError: string | null = null;

    const [pendingResult, assignedResult] = await Promise.allSettled([
      getPendingConsultations(),
      getAssignedConsultations(),
    ]);

    if (pendingResult.status === "fulfilled") {
      setPending(pendingResult.value);
    } else {
      setPending([]);
      const reason = pendingResult.reason;
      if (reason instanceof ApiError && reason.status === 403) {
        firstError = t.doctor.verifiedDoctorRequiredDescription;
      } else {
        firstError = t.patient.noDataDescription;
      }
    }

    if (assignedResult.status === "fulfilled") {
      setAssigned(assignedResult.value);
    } else {
      setAssigned([]);
      if (!firstError) {
        const reason = assignedResult.reason;
        if (reason instanceof ApiError && reason.status === 403) {
          firstError = t.doctor.verifiedDoctorRequiredDescription;
        } else {
          firstError = t.patient.noDataDescription;
        }
      }
    }

    if (firstError) {
      setError(firstError);
    }

    setLoading(false);
  }, [t.doctor.verifiedDoctorRequiredDescription, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadQueues();
  }, [loadQueues]);

  async function handleAccept(consultationId: string) {
    if (!isApproved) {
      return;
    }

    setSuccessMessage(null);
    setAcceptingId(consultationId);

    try {
      await acceptConsultation(consultationId);
      setSuccessMessage(t.doctor.consultationAccepted);
      await loadQueues();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t.doctor.verifiedDoctorRequiredDescription);
      } else {
        setError(t.doctor.acceptFailed);
      }
    } finally {
      setAcceptingId(null);
    }
  }

  const latestPending = pending.slice(0, 3);
  const latestAssigned = assigned.slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.roles.doctor}</Badge>}
        title={t.doctor.doctorDashboard}
        description={t.doctor.doctorDashboardSubtitle}
        actions={
          <Button variant="secondary" onClick={() => void loadQueues()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorVerificationNotice
        verification={verification}
        requiredLabel={t.doctor.verifiedDoctorRequired}
        requiredDescription={t.doctor.verifiedDoctorRequiredDescription}
        disabledLabel={t.doctor.doctorNotApprovedActionDisabled}
      />

      {doctorSpecialty ? (
        <Card className="rounded-[2rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{t.doctor.doctorSpecialty}</p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{t.patient.specialtyLabels[doctorSpecialty] ?? doctorSpecialty}</p>
        </Card>
      ) : null}

      <DoctorDashboardSummary
        pendingCount={pending.length}
        assignedCount={assigned.length}
        pendingLabel={t.doctor.pendingConsultations}
        assignedLabel={t.doctor.assignedConsultations}
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/app/doctor/consultations/pending" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.pendingConsultations}
        </Link>
        <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.assignedConsultations}
        </Link>
      </div>

      {successMessage ? (
        <Card className="rounded-[2rem] border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">{successMessage}</p>
        </Card>
      ) : null}

      {loading ? (
        <Card className="rounded-[2rem]">
          <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
        </Card>
      ) : error ? (
        <EmptyState title={t.patient.noDataTitle} description={error} />
      ) : (
        <>
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-text)]">{t.doctor.latestPending}</h2>
            <DoctorConsultationList
              consultations={latestPending}
              emptyTitle={t.doctor.noPendingConsultations}
              emptyDescription={t.doctor.noPendingConsultations}
              isApproved={isApproved}
              showAccept
              acceptingId={acceptingId}
              onAccept={(id) => void handleAccept(id)}
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[var(--color-text)]">{t.doctor.latestAssigned}</h2>
            <DoctorConsultationList
              consultations={latestAssigned}
              emptyTitle={t.doctor.noAssignedConsultations}
              emptyDescription={t.doctor.noAssignedConsultations}
              isApproved={isApproved}
            />
          </div>
        </>
      )}
    </div>
  );
}