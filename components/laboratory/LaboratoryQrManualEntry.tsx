import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export interface LaboratoryQrManualEntryProps {
  onSubmit: (qrToken: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  disabled?: boolean;
}

export function LaboratoryQrManualEntry({
  onSubmit,
  isLoading,
  error,
  disabled = false,
}: LaboratoryQrManualEntryProps) {
  const { t } = useAppPreferences();
  const [qrToken, setQrToken] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedToken = qrToken.trim();
    if (!trimmedToken) {
      setValidationError(t.laboratory.qrTokenRequired);
      return;
    }

    try {
      await onSubmit(trimmedToken);
      setQrToken("");
    } catch {
      // Error is handled by parent and displayed
    }
  };

  return (
    <Card className="rounded-2xl">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.scanLabOrder}</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{t.laboratory.manualQrOnly}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              id="qr-token"
              label={t.laboratory.qrToken}
              type="text"
              placeholder={t.laboratory.qrTokenPlaceholder}
              value={qrToken}
              onChange={(e) => {
                setQrToken(e.target.value);
                setValidationError(null);
              }}
              disabled={disabled || isLoading}
              className="mt-2"
            />
            {validationError && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{validationError}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={disabled || isLoading || !qrToken.trim()}
            className="w-full"
          >
            {isLoading ? t.laboratory.scanningOrder : t.laboratory.scanOrder}
          </Button>
        </form>
      </div>
    </Card>
  );
}
