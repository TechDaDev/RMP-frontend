import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Card } from "@/components/ui/Card";
import { LockIcon } from "@/components/icons";

export function LaboratoryPrivacyNotice() {
  const { t } = useAppPreferences();

  const notes = [
    t.laboratory.patientSeesReleasedResultsOnly,
    t.laboratory.internalNotesHiddenFromPatient,
    t.laboratory.correctResultBeforeRelease,
  ];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
          <LockIcon size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.laboratory.labPrivacyNotice}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.laboratory.laboratoryActionsDisabled}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
        {notes.map((note) => (
          <li key={note} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
            {note}
          </li>
        ))}
      </ul>
    </Card>
  );
}
