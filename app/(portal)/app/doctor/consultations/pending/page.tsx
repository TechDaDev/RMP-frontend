"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorConsultationList } from "@/components/doctor/DoctorConsultationList";
import { DoctorQueueTabs } from "@/components/doctor/DoctorQueueTabs";
import { DoctorVerificationNotice } from "@/components/doctor/DoctorVerificationNotice";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { acceptConsultation, getPendingConsultations } from "@/lib/doctor/doctorService";
import { useAuth } from "@/components/auth/AuthProvider";
import type { DoctorConsultationListItem } from "@/types/doctor";

function errorMessageForStatus(status: number, fallback: string, verificationRequired: string) {
  if (status === 403) {
    return verificationRequired;
  }

  return fallback;
}

export default function DoctorPendingConsultationsPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const [consultations, setConsultations] = useState<DoctorConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isApproved = verification?.is_approved === true;

  const loadPending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPendingConsultations();
      setConsultations(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(errorMessageForStatus(err.status, t.patient.noDataDescription, t.doctor.verifiedDoctorRequiredDescription));
      } else {
        setError(t.patient.noDataDescription);
      }
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [t.doctor.verifiedDoctorRequiredDescription, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadPending();
  }, [loadPending]);

  async function handleAccept(consultationId: string) {
    if (!isApproved) {
      return;
    }

    setSuccessMessage(null);
    setAcceptingId(consultationId);
    try {
      await acceptConsultation(consultationId);
      setSuccessMessage(t.doctor.consultationAccepted);
      await loadPending();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(errorMessageForStatus(err.status, t.doctor.acceptFailed, t.doctor.verifiedDoctorRequiredDescription));
      } else {
        setError(t.doctor.acceptFailed);
      }
    } finally {
      setAcceptingId(null);
    }
  }

  const subtitle = useMemo(() => {
    if (loading) {
      return t.patient.loading;
    }

    return t.doctor.pendingConsultationsSubtitle;
  }, [loading, t.doctor.pendingConsultationsSubtitle, t.patient.loading]);

  return (
    <DoctorPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.roles.doctor}</Badge>}
        title={t.doctor.pendingConsultations}
        description={subtitle}
        actions={
          <Button variant="secondary" onClick={() => void loadPending()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorQueueTabs
        active="pending"
        pendingHref="/app/doctor/consultations/pending"
        assignedHref="/app/doctor/consultations/assigned"
        pendingLabel={t.doctor.pendingConsultations}
        assignedLabel={t.doctor.assignedConsultations}
      />

      <DoctorVerificationNotice
        verification={verification}
        requiredLabel={t.doctor.verifiedDoctorRequired}
        requiredDescription={t.doctor.verifiedDoctorRequiredDescription}
        disabledLabel={t.doctor.doctorNotApprovedActionDisabled}
      />

      <Card>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.matchingSpecialtyQueue}</p>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{t.doctor.pendingConsultationsSubtitle}</p>
      </Card>

      {successMessage ? (
        <DashboardStateCard
          state="success"
          description={successMessage}
          action={
            <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
              {t.doctor.backToAssignedConsultations}
            </Link>
          }
        />
      ) : null}

      <DashboardSection title={t.doctor.pendingConsultations} description={t.doctor.pendingConsultationsSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <DoctorConsultationList
            consultations={consultations}
            emptyTitle={t.doctor.noPendingConsultations}
            emptyDescription={t.doctor.noPendingConsultations}
            isApproved={isApproved}
            showAccept
            acceptingId={acceptingId}
            onAccept={(id) => void handleAccept(id)}
          />
        )}
      </DashboardSection>
    </DoctorPageFrame>
  );
}
