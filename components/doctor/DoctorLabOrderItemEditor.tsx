"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { LabTestAutocomplete } from "@/components/catalog/LabTestAutocomplete";
import { Button } from "@/components/ui/Button";
import type { CreateDoctorLabOrderItemRequest } from "@/types/doctor";

const fieldClassName =
  "min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

const textAreaClassName =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

export type DoctorLabOrderItemDraft = CreateDoctorLabOrderItemRequest;

interface DoctorLabOrderItemEditorProps {
  index: number;
  item: DoctorLabOrderItemDraft;
  canRemove: boolean;
  onChange: (next: DoctorLabOrderItemDraft) => void;
  onRemove: () => void;
  errors?: Partial<Record<keyof CreateDoctorLabOrderItemRequest, string>>;
}

export function DoctorLabOrderItemEditor({
  index,
  item,
  canRemove,
  onChange,
  onRemove,
  errors,
}: DoctorLabOrderItemEditorProps) {
  const { t } = useAppPreferences();

  function updateField<K extends keyof DoctorLabOrderItemDraft>(
    field: K,
    value: DoctorLabOrderItemDraft[K],
  ) {
    onChange({ ...item, [field]: value });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[var(--color-text)]">
          {t.doctor.labOrderItems} #{index + 1}
        </h4>
        <Button type="button" variant="ghost" disabled={!canRemove} onClick={onRemove}>
          {t.doctor.removeLabTest}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <LabTestAutocomplete
            value={item.custom_test_name ?? item.test_name ?? ""}
            selectedTestId={item.lab_test}
            onSelectTest={(selected) => {
              onChange({
                ...item,
                lab_test: selected?.id,
                custom_test_name: selected ? "" : item.custom_test_name,
                test_name: selected ? "" : item.test_name,
              });
            }}
            onCustomTestNameChange={(value) => {
              updateField("custom_test_name", value);
              updateField("test_name", value);
            }}
            label={t.doctor.testName}
          />
          {errors?.custom_test_name ? (
            <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.custom_test_name}</p>
          ) : null}
          {errors?.test_name ? (
            <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.test_name}</p>
          ) : null}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Priority</span>
          <select
            className={fieldClassName}
            value={item.priority ?? "routine"}
            onChange={(event) => updateField("priority", event.target.value)}
          >
            <option value="routine">routine</option>
            <option value="urgent">urgent</option>
          </select>
          {errors?.priority ? (
            <p className="text-xs font-medium text-red-600 dark:text-red-300">{errors.priority}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Legacy test code</span>
          <input
            className={fieldClassName}
            value={item.test ?? ""}
            onChange={(event) => updateField("test", event.target.value)}
            placeholder="Optional legacy code"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.sampleType}</span>
          <input
            className={fieldClassName}
            value={item.sample_type ?? ""}
            onChange={(event) => updateField("sample_type", event.target.value)}
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">Notes</span>
          <textarea
            className={textAreaClassName}
            rows={3}
            value={item.notes ?? item.instructions ?? ""}
            onChange={(event) => {
              updateField("notes", event.target.value);
              updateField("instructions", event.target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
}
