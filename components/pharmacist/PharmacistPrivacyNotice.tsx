import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { LockIcon } from "@/components/icons";
import { Card } from "@/components/ui/Card";

export function PharmacistPrivacyNotice() {
  const { t } = useAppPreferences();

  const notes = [
    t.pharmacist.patientDoesNotSeeInternalNotes,
    t.pharmacist.expiredCancelledNotDispensable,
    t.pharmacist.fullyDispensedNotDispensable,
    t.pharmacist.partialDispensingSupported,
    t.pharmacist.dispensingIsAudited,
  ];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
          <LockIcon size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.pharmacist.prescriptionSafetyNotice}</h2>
          <p className="mt-1 text-sm leading-7 text-[var(--color-muted)]">{t.pharmacist.patientPrivacyNotice}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
        {notes.map((note, index) => (
          <li key={`pharmacist-privacy-note-${index}`} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
            {note}
          </li>
        ))}
      </ul>
    </Card>
  );
}
