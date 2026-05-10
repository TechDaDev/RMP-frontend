import type { ChangeEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import type { LaboratoryResultValueType } from "@/types/laboratory";

export interface LaboratoryResultFormState {
  valueType: LaboratoryResultValueType | "";
  numericValue: string;
  textValue: string;
  bloodGroupValue: string;
  unit: string;
  referenceRange: string;
  flag: string;
  laboratorianNotes: string;
  resultFile: File | null;
}

interface LaboratoryResultValueFieldsProps {
  state: LaboratoryResultFormState;
  onChange: (patch: Partial<LaboratoryResultFormState>) => void;
  fieldErrors?: Record<string, string[]>;
}

const bloodGroupOptions = [
  "a_positive",
  "a_negative",
  "b_positive",
  "b_negative",
  "ab_positive",
  "ab_negative",
  "o_positive",
  "o_negative",
  "unknown",
];

function fieldError(fieldErrors: Record<string, string[]> | undefined, key: string): string | null {
  const value = fieldErrors?.[key];
  return value?.[0] ?? null;
}

function InputError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300">{message}</p>;
}

export function LaboratoryResultValueFields({ state, onChange, fieldErrors }: LaboratoryResultValueFieldsProps) {
  const { t } = useAppPreferences();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onChange({ resultFile: file });
  };

  return (
    <div className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.resultValueType}</span>
        <select
          name="result-value-type"
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
          value={state.valueType}
          onChange={(event) => onChange({ valueType: event.target.value as LaboratoryResultValueType | "" })}
        >
          <option value="">{t.laboratory.selectResultValueType}</option>
          <option value="numeric">{t.laboratory.numericResult}</option>
          <option value="text">{t.laboratory.textResult}</option>
          <option value="blood_group">{t.laboratory.bloodGroupResult}</option>
          <option value="positive_negative">{t.laboratory.positiveNegativeResult}</option>
          <option value="file_only">{t.laboratory.fileOnlyResult}</option>
        </select>
        <InputError message={fieldError(fieldErrors, "value_type")} />
      </label>

      {state.valueType === "numeric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.numericValue}</span>
            <input
              name="numeric-value"
              type="number"
              inputMode="decimal"
              autoComplete="off"
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
              value={state.numericValue}
              onChange={(event) => onChange({ numericValue: event.target.value })}
              placeholder="0.0"
            />
            <InputError message={fieldError(fieldErrors, "numeric_value")} />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.unit}</span>
            <input
              name="result-unit"
              type="text"
              autoComplete="off"
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
              value={state.unit}
              onChange={(event) => onChange({ unit: event.target.value })}
              placeholder="g/dL"
            />
            <InputError message={fieldError(fieldErrors, "unit")} />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.referenceRange}</span>
            <input
              name="reference-range"
              type="text"
              autoComplete="off"
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
              value={state.referenceRange}
              onChange={(event) => onChange({ referenceRange: event.target.value })}
              placeholder="4.5-6.5"
            />
            <InputError message={fieldError(fieldErrors, "reference_range")} />
          </label>
        </div>
      ) : null}

      {state.valueType === "text" ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.textValue}</span>
          <textarea
            name="text-value"
            autoComplete="off"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            value={state.textValue}
            onChange={(event) => onChange({ textValue: event.target.value })}
          />
          <InputError message={fieldError(fieldErrors, "text_value")} />
        </label>
      ) : null}

      {state.valueType === "blood_group" ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.bloodGroupValue}</span>
          <select
            name="blood-group-value"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            value={state.bloodGroupValue}
            onChange={(event) => onChange({ bloodGroupValue: event.target.value })}
          >
            <option value="">{t.laboratory.bloodGroupResult}</option>
            {bloodGroupOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <InputError message={fieldError(fieldErrors, "blood_group_value")} />
        </label>
      ) : null}

      {state.valueType === "positive_negative" ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.textValue}</span>
          <select
            name="positive-negative-value"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            value={state.textValue}
            onChange={(event) => onChange({ textValue: event.target.value })}
          >
            <option value="">{t.laboratory.selectResultValueType}</option>
            <option value="positive">{t.laboratory.positiveResult}</option>
            <option value="negative">{t.laboratory.negativeResult}</option>
          </select>
          <InputError message={fieldError(fieldErrors, "text_value")} />
        </label>
      ) : null}

      {state.valueType === "file_only" ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.resultFile}</span>
          <input
            type="file"
            name="result-file"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--color-surface-alt)] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-text)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            onChange={handleFileChange}
          />
          {state.resultFile ? (
            <p className="text-xs text-[var(--color-muted)]">{state.resultFile.name}</p>
          ) : null}
          <InputError message={fieldError(fieldErrors, "result_file")} />
        </label>
      ) : null}

      {state.valueType ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.resultFlag}</span>
          <select
            name="result-flag"
            className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            value={state.flag}
            onChange={(event) => onChange({ flag: event.target.value })}
          >
            <option value="">{t.laboratory.selectResultFlag}</option>
            <option value="low">{t.laboratory.flagLow}</option>
            <option value="normal">{t.laboratory.flagNormal}</option>
            <option value="high">{t.laboratory.flagHigh}</option>
            <option value="critical">{t.laboratory.flagCritical}</option>
            <option value="abnormal">{t.laboratory.flagAbnormal}</option>
          </select>
          <InputError message={fieldError(fieldErrors, "flag")} />
        </label>
      ) : null}

      {state.valueType ? (
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.laboratory.laboratorianNotes}</span>
          <textarea
            name="laboratorian-notes"
            autoComplete="off"
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]"
            value={state.laboratorianNotes}
            onChange={(event) => onChange({ laboratorianNotes: event.target.value })}
          />
          <InputError message={fieldError(fieldErrors, "laboratorian_notes")} />
        </label>
      ) : null}
    </div>
  );
}
