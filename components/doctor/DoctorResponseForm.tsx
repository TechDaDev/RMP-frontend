"use client";

import { FormEvent, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canDoctorRespond } from "@/lib/doctor/doctorConsultationStatus";
import { DOCTOR_RECOMMENDATION_TYPES } from "@/types/doctor";

interface DoctorResponseFormProps {
  status: string;
  isApproved: boolean;
  onSubmitResponse: (payload: { response_text: string; recommendation_type?: string }) => Promise<void>;
}

export function DoctorResponseForm({
  status,
  isApproved,
  onSubmitResponse,
}: DoctorResponseFormProps) {
  const { t } = useAppPreferences();
  const [responseText, setResponseText] = useState("");
  const [recommendationType, setRecommendationType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = isApproved && canDoctorRespond(status);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = responseText.trim();
    if (!trimmed || !canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmitResponse({
        response_text: trimmed,
        recommendation_type: recommendationType || undefined,
      });
      setSuccess(t.doctor.doctorResponseSent);
    } catch {
      setError(t.doctor.doctorResponseFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.doctorResponse}</h3>

      {!canSubmit ? (
        <p className="text-sm text-[var(--color-muted)]">
          {isApproved ? t.doctor.consultationMustBeAcceptedFirst : t.doctor.doctorNotApprovedActionDisabled}
        </p>
      ) : null}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--color-text)]" htmlFor="doctor-response-text">
            {t.doctor.responseText}
          </label>
          <textarea
            id="doctor-response-text"
            value={responseText}
            onChange={(event) => setResponseText(event.target.value)}
            className="min-h-32 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            disabled={!canSubmit || submitting}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-[var(--color-text)]" htmlFor="doctor-recommendation-type">
            {t.doctor.recommendationType}
          </label>
          <select
            id="doctor-recommendation-type"
            value={recommendationType}
            onChange={(event) => setRecommendationType(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            disabled={!canSubmit || submitting}
          >
            <option value="">-</option>
            {DOCTOR_RECOMMENDATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.doctor.recommendationTypeLabels[type] ?? type}
              </option>
            ))}
          </select>
        </div>

        {success ? <p className="text-sm text-green-700 dark:text-green-300">{success}</p> : null}
        {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}

        <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit || submitting || responseText.trim().length === 0}>
          {submitting ? t.doctor.sendingDoctorResponse : t.doctor.sendDoctorResponse}
        </Button>
      </form>
    </Card>
  );
}
