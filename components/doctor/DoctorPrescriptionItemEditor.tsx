"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import type { DoctorPrescriptionItemCreateRequest, MedicationRoute } from "@/types/doctor";

const fieldClassName =
  "min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

const textAreaClassName =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

const ROUTES: MedicationRoute[] = [
  "oral",
  "topical",
  "inhalation",
  "injection",
  "eye",
  "ear",
  "nasal",
  "rectal",
  "other",
];

export type PrescriptionItemDraft = Omit<DoctorPrescriptionItemCreateRequest, "route"> & { route: MedicationRoute | "" };

interface DoctorPrescriptionItemEditorProps {
  index: number;
  item: PrescriptionItemDraft;
  canRemove: boolean;
  onChange: (next: PrescriptionItemDraft) => void;
  onRemove: () => void;
  errors?: Partial<Record<keyof DoctorPrescriptionItemCreateRequest, string>>;
}

export function DoctorPrescriptionItemEditor({
  index,
  item,
  canRemove,
  onChange,
  onRemove,
  errors,
}: DoctorPrescriptionItemEditorProps) {
  const { t } = useAppPreferences();

  function updateField<K extends keyof PrescriptionItemDraft>(field: K, value: PrescriptionItemDraft[K]) {
    onChange({ ...item, [field]: value });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">
          {t.doctor.prescriptionItems} #{index + 1}
        </h4>
        <Button type="button" variant="ghost" disabled={!canRemove} onClick={onRemove}>
          {t.doctor.removeMedication}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.medicationName}</span>
          <input
            className={fieldClassName}
            value={item.medication_name}
            onChange={(event) => updateField("medication_name", event.target.value)}
            required
          />
          {errors?.medication_name ? <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.medication_name}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.dosage}</span>
          <input
            className={fieldClassName}
            value={item.dosage}
            onChange={(event) => updateField("dosage", event.target.value)}
            required
          />
          {errors?.dosage ? <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.dosage}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.frequency}</span>
          <input
            className={fieldClassName}
            value={item.frequency}
            onChange={(event) => updateField("frequency", event.target.value)}
            required
          />
          {errors?.frequency ? <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.frequency}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.duration}</span>
          <input
            className={fieldClassName}
            value={item.duration}
            onChange={(event) => updateField("duration", event.target.value)}
            required
          />
          {errors?.duration ? <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.duration}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.route}</span>
          <select
            className={fieldClassName}
            value={item.route}
            onChange={(event) => updateField("route", event.target.value as MedicationRoute)}
          >
            <option value="" disabled>
              {t.doctor.selectRoute}
            </option>
            {ROUTES.map((route) => {
              const labelKey = `route${route.charAt(0).toUpperCase()}${route.slice(1)}` as keyof typeof t.doctor;
              return (
                <option key={route} value={route}>
                  {(t.doctor[labelKey] as string) ?? route}
                </option>
              );
            })}
          </select>
          {errors?.route ? <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.route}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.quantity}</span>
          <input
            className={fieldClassName}
            value={item.quantity ?? ""}
            onChange={(event) => updateField("quantity", event.target.value)}
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Strength</span>
          <input
            className={fieldClassName}
            value={item.strength ?? ""}
            onChange={(event) => updateField("strength", event.target.value)}
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.instructions}</span>
          <textarea
            className={textAreaClassName}
            rows={3}
            value={item.instructions ?? ""}
            onChange={(event) => updateField("instructions", event.target.value)}
          />
        </label>
      </div>
    </div>
  );
}
