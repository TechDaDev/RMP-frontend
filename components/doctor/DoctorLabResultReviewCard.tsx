"use client";

import { FormEvent, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DoctorLabResultDetail, ReviewDoctorLabResultRequest } from "@/types/doctor";

interface DoctorLabResultReviewCardProps {
  result: DoctorLabResultDetail;
  onReview: (payload: ReviewDoctorLabResultRequest) => Promise<void>;
}

const REVIEWABLE_STATUSES = new Set(["submitted", "corrected"]);

export function DoctorLabResultReviewCard({ result, onReview }: DoctorLabResultReviewCardProps) {
  const { t } = useAppPreferences();
  const [doctorNotes, setDoctorNotes] = useState(result.doctor_notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canReview = REVIEWABLE_STATUSES.has(result.status ?? "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canReview || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onReview({ doctor_notes: doctorNotes, release_to_patient: false });
      setSuccess(t.doctor.labResultReviewed);
    } catch {
      setError(t.doctor.labResultReviewFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-3 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.reviewLabResult}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.reviewLabResultDescription}</p>

      {!canReview ? (
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
          {result.status === "released" ? t.doctor.alreadyReleased : t.doctor.alreadyReviewed}
        </p>
      ) : null}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.reviewNotes}</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            value={doctorNotes}
            onChange={(event) => setDoctorNotes(event.target.value)}
            disabled={!canReview || submitting}
          />
        </label>

        {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}
        {success ? <p className="text-sm text-green-700 dark:text-green-300">{success}</p> : null}

        <Button type="submit" className="w-full sm:w-auto" disabled={!canReview || submitting}>
          {submitting ? t.doctor.submittingReview : t.doctor.submitReview}
        </Button>
      </form>
    </Card>
  );
}
