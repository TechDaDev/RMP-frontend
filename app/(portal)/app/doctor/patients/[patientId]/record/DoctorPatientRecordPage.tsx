"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorPatientRecordPanel } from "@/components/doctor/DoctorPatientRecordPanel";
import { DoctorVerificationNotice } from "@/components/doctor/DoctorVerificationNotice";
import { RequireRole } from "@/components/auth/RequireRole";
import { useAuth } from "@/components/auth/AuthProvider";
import { getAuthorizedPatientRecord } from "@/lib/doctor/doctorService";
import { Button, buttonClassName } from "@/components/ui/Button";
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
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">{d.patientRecordDetail}</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{d.authorizedAccessOnly}</p>
        </div>
        <Button variant="ghost" onClick={handleRetry}>
          {d.retryMessages}
        </Button>
      </div>

      {!isApproved && (
        <DoctorVerificationNotice
          verification={verification ?? null}
          requiredLabel={d.verifiedDoctorRequired}
          requiredDescription={d.verifiedDoctorRequiredDescription}
          disabledLabel={d.doctorNotApprovedActionDisabled}
        />
      )}

      {loading && (
        <div role="status">
          <p className="text-sm text-[var(--color-text-secondary)]">{p.loading}</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded border border-[var(--color-border)] p-4 space-y-2">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {d.patientRecordAccessDenied}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{d.authorizedAccessOnly}</p>
        </div>
      )}

      {!loading && !error && record && <DoctorPatientRecordPanel record={record} />}

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
    </div>
  );
}

export function DoctorPatientRecordPage({ patientId }: Props) {
  return (
    <RequireRole role="doctor">
      <DoctorPatientRecordContent patientId={patientId} />
    </RequireRole>
  );
}

