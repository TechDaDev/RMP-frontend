"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorPatientRecordPanel } from "@/components/doctor/DoctorPatientRecordPanel";
import { DoctorVerificationNotice } from "@/components/doctor/DoctorVerificationNotice";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { RequireRole } from "@/components/auth/RequireRole";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAuthorizedPatientRecord } from "@/lib/doctor/doctorService";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import type { DoctorPatientRecord } from "@/types/doctor";

interface Props {
  patientId: string;
}

function DoctorPatientRecordContent({ patientId }: Props) {
  const { t } = useAppPreferences();
  const p = t.patient;
  const { verification } = useAuth();
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultationId");
  const d = t.doctor;

  const [record, setRecord] = useState<DoctorPatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isApproved = verification?.is_approved === true;

  function handleRetry() {
    setLoading(true);
    setError(null);
    getAuthorizedPatientRecord(patientId)
      .then((data) => setRecord(data))
      .catch((err: unknown) => {
        const status = (err as { status?: number })?.status;
        if (status === 403 || status === 404) {
          setError(d.patientRecordAccessDenied);
        } else {
          setError(d.patientRecordUnavailable);
        }
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAuthorizedPatientRecord(patientId);
        if (active) setRecord(data);
      } catch (err: unknown) {
        if (!active) return;
        const status = (err as { status?: number })?.status;
        if (status === 403 || status === 404) {
          setError(d.patientRecordAccessDenied);
        } else {
          setError(d.patientRecordUnavailable);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  return (
    <DoctorPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.roles.doctor}</Badge>}
        title={d.patientRecordDetail}
        description={d.authorizedAccessOnly}
        actions={
          <Button variant="secondary" onClick={handleRetry}>
            {d.retryMessages}
          </Button>
        }
      />

      {!isApproved && (
        <DoctorVerificationNotice
          verification={verification ?? null}
          requiredLabel={d.verifiedDoctorRequired}
          requiredDescription={d.verifiedDoctorRequiredDescription}
          disabledLabel={d.doctorNotApprovedActionDisabled}
        />
      )}

      {loading ? <DashboardStateCard state="loading" description={p.loading} /> : null}

      {!loading && error && (
        <DashboardStateCard
          state="error"
          title={d.patientRecordAccessDenied}
          description={`${error} ${d.authorizedAccessOnly}`}
        />
      )}

      {!loading && !error && record ? (
        <DashboardSection title={d.patientRecordDetail} description={d.patientRecordReadOnlyNotice}>
          <DoctorPatientRecordPanel record={record} />
        </DashboardSection>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        {consultationId && (
          <Link
            href={`/app/doctor/consultations/${consultationId}`}
            className={buttonClassName({ variant: "secondary" })}
          >
            {d.backToConsultationWorkspace}
          </Link>
        )}
        <Link
          href="/app/doctor/consultations/assigned"
          className={buttonClassName({ variant: "ghost" })}
        >
          {d.backToAssignedConsultationsList}
        </Link>
        <Link href="/app/doctor" className={buttonClassName({ variant: "ghost" })}>
          {d.backToDoctorDashboard}
        </Link>
      </div>
    </DoctorPageFrame>
  );
}

export function DoctorPatientRecordPage({ patientId }: Props) {
  return (
    <RequireRole role="doctor">
      <DoctorPatientRecordContent patientId={patientId} />
    </RequireRole>
  );
}
