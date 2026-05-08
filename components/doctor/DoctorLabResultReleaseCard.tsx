"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { DoctorLabResultDetail } from "@/types/doctor";

interface DoctorLabResultReleaseCardProps {
  result: DoctorLabResultDetail;
  onRelease: () => Promise<void>;
}

export function DoctorLabResultReleaseCard({ result, onRelease }: DoctorLabResultReleaseCardProps) {
  const { t } = useAppPreferences();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canRelease = result.status !== "released";

  async function handleRelease() {
    if (!canRelease || loading) {
      return;
    }

    const confirmed = window.confirm(t.doctor.confirmReleaseLabResult);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onRelease();
      setSuccess(t.doctor.labResultReleased);
    } catch {
      setError(t.doctor.labResultReleaseFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.releaseLabResult}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.releaseLabResultDescription}</p>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.patientWillSeeAfterRelease}</p>

      {!canRelease ? (
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{t.doctor.alreadyReleased}</p>
      ) : null}

      {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-green-700 dark:text-green-300">{success}</p> : null}

      <Button onClick={() => void handleRelease()} disabled={!canRelease || loading}>
        {loading ? t.doctor.submittingReview : t.doctor.releaseLabResult}
      </Button>
    </Card>
  );
}
