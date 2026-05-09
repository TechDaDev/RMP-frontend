import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export interface PharmacistQrManualEntryProps {
  onSubmit: (qrToken: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  disabled?: boolean;
}

export function PharmacistQrManualEntry({
  onSubmit,
  isLoading,
  error,
  disabled = false,
}: PharmacistQrManualEntryProps) {
  const { t } = useAppPreferences();
  const [qrToken, setQrToken] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    const trimmed = qrToken.trim();
    if (!trimmed) {
      setValidationError(t.pharmacist.qrTokenRequired);
      return;
    }

    try {
      await onSubmit(trimmed);
      setQrToken("");
    } catch {
      // Parent handles request errors.
    }
  };

  return (
    <Card className="rounded-2xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.manualQrEntry}</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{t.pharmacist.scanPrescriptionSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="pharmacist-qr-token"
              label={t.pharmacist.qrToken}
              type="text"
              value={qrToken}
              placeholder={t.pharmacist.qrTokenPlaceholder}
              onChange={(event) => {
                setQrToken(event.target.value);
                setValidationError(null);
              }}
              disabled={disabled || isLoading}
            />
            {validationError ? <p className="mt-2 text-sm text-[var(--color-danger)]">{validationError}</p> : null}
            {error ? <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={disabled || isLoading || qrToken.trim().length === 0}
          >
            {isLoading ? t.pharmacist.scanningPrescription : t.pharmacist.submitQrToken}
          </Button>
        </form>
      </div>
    </Card>
  );
}
