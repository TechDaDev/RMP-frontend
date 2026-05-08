"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DoctorLabResultDetail, LinkLabResultToMedicalRecordRequest } from "@/types/doctor";

interface DoctorLabResultMedicalRecordCardProps {
  result: DoctorLabResultDetail;
  onLink: (payload: LinkLabResultToMedicalRecordRequest) => Promise<void>;
}

const LINKABLE_STATUSES = new Set(["reviewed", "released"]);

export function DoctorLabResultMedicalRecordCard({
  result,
  onLink,
}: DoctorLabResultMedicalRecordCardProps) {
  const { t } = useAppPreferences();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canLink = LINKABLE_STATUSES.has(result.status ?? "") && !result.is_linked_to_medical_record;

  async function handleLink() {
    if (!canLink || loading) {
      return;
    }

    const confirmed = window.confirm(t.doctor.confirmLinkToMedicalRecord);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onLink(notes.trim() ? { notes: notes.trim() } : {});
      setSuccess(t.doctor.labResultLinkedToRecord);
    } catch {
      setError(t.doctor.labResultLinkFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.linkToMedicalRecord}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.linkToMedicalRecordDescription}</p>

      {!canLink ? (
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
          {result.is_linked_to_medical_record ? t.doctor.labResultLinkedToRecord : t.doctor.notReleasedToPatient}
        </p>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.reviewNotes}</span>
        <textarea
          className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={!canLink || loading}
        />
      </label>

      {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-green-700 dark:text-green-300">{success}</p> : null}

      <Button onClick={() => void handleLink()} disabled={!canLink || loading}>
        {loading ? t.doctor.submittingReview : t.doctor.linkToMedicalRecord}
      </Button>
    </Card>
  );
}
