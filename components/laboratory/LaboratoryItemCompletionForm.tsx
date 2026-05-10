import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";

interface LaboratoryItemCompletionFormProps {
  note: string;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function LaboratoryItemCompletionForm({
  note,
  onNoteChange,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: LaboratoryItemCompletionFormProps) {
  const { t } = useAppPreferences();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <p className="mb-3 text-sm font-semibold text-[var(--color-text)]">{t.laboratory.confirmCompleteItem}</p>
      <label className="block">
        <span className="text-xs font-semibold text-[var(--color-text)]">{t.laboratory.itemCompletionNote}</span>
        <textarea
          name="completion-note"
          autoComplete="off"
          className="mt-2 min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          placeholder={t.laboratory.itemCompletionNotePlaceholder}
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          disabled={isSubmitting}
        />
      </label>

      {error ? <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-300" aria-live="polite">{error}</p> : null}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button
          className="sm:flex-1"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? t.laboratory.completingItem : t.laboratory.completeSelectedItem}
        </Button>
        <Button
          variant="secondary"
          className="sm:flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t.common.cancel}
        </Button>
      </div>
    </div>
  );
}
