"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canDoctorClose } from "@/lib/doctor/doctorConsultationStatus";

interface DoctorCloseConsultationCardProps {
  status: string;
  isApproved: boolean;
  onCloseConsultation: () => Promise<void>;
}

export function DoctorCloseConsultationCard({
  status,
  isApproved,
  onCloseConsultation,
}: DoctorCloseConsultationCardProps) {
  const { t } = useAppPreferences();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canClose = isApproved && canDoctorClose(status);

  async function handleClose() {
    if (!canClose) {
      return;
    }

    const confirmed = window.confirm(t.doctor.confirmCloseConsultation);
    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await onCloseConsultation();
      setMessage(t.doctor.consultationClosed);
    } catch {
      setError(t.doctor.closeConsultationFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.closeConsultation}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.closeConsultationDescription}</p>

      {!canClose ? (
        <p className="text-sm text-[var(--color-muted)]">
          {isApproved ? t.doctor.consultationMustBeAcceptedFirst : t.doctor.doctorNotApprovedActionDisabled}
        </p>
      ) : null}

      {message ? <p className="text-sm text-green-700 dark:text-green-300">{message}</p> : null}
      {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}

      <Button onClick={() => void handleClose()} disabled={!canClose || loading}>
        {loading ? t.doctor.closingConsultation : t.doctor.closeConsultation}
      </Button>
    </Card>
  );
}
