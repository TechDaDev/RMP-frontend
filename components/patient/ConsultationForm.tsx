"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  ConsultationCreateRequest,
  ConsultationDuration,
  ConsultationSeverity,
  Symptom,
  SymptomCategory,
} from "@/types/patient";

const fieldClassName = "min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";
const textAreaClassName = "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--color-primary)_18%,transparent)]";

interface ConsultationFormProps {
  categories: SymptomCategory[];
  symptoms: Symptom[];
  loadingSymptoms: boolean;
  submitting: boolean;
  error?: string | null;
  onCategoryChange: (categoryId?: string) => void;
  onSubmit: (payload: ConsultationCreateRequest) => Promise<void>;
}

export function ConsultationForm({
  categories,
  symptoms,
  loadingSymptoms,
  submitting,
  error,
  onCategoryChange,
  onSubmit,
}: ConsultationFormProps) {
  const { t } = useAppPreferences();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("general_medicine");
  const [duration, setDuration] = useState<ConsultationDuration>("less_than_24_hours");
  const [severity, setSeverity] = useState<ConsultationSeverity>("mild");
  const [hasFever, setHasFever] = useState(false);
  const [hasPain, setHasPain] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const specialtyOptions = useMemo(
    () => Object.entries(t.patient.specialtyLabels),
    [t.patient.specialtyLabels],
  );
  const durationOptions = useMemo(
    () => Object.entries(t.patient.durationLabels),
    [t.patient.durationLabels],
  );
  const severityOptions = useMemo(
    () => Object.entries(t.patient.severityLabels),
    [t.patient.severityLabels],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      selected_specialty: selectedSpecialty,
      duration,
      severity,
      has_fever: hasFever,
      has_pain: hasPain,
      additional_notes: additionalNotes.trim() || undefined,
      symptom_ids: selectedSymptoms,
    });
  }

  return (
    <Card className="space-y-6 rounded-[2rem]">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
        {t.patient.emergencyWarning}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.specialty}</span>
            <select
              className={fieldClassName}
              value={selectedSpecialty}
              onChange={(event) => setSelectedSpecialty(event.target.value)}
            >
              {specialtyOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.duration}</span>
            <select
              className={fieldClassName}
              value={duration}
              onChange={(event) => setDuration(event.target.value as ConsultationDuration)}
            >
              {durationOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.severity}</span>
            <select
              className={fieldClassName}
              value={severity}
              onChange={(event) => setSeverity(event.target.value as ConsultationSeverity)}
            >
              {severityOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
            <input type="checkbox" checked={hasFever} onChange={(event) => setHasFever(event.target.checked)} />
            {t.patient.fever}
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
            <input type="checkbox" checked={hasPain} onChange={(event) => setHasPain(event.target.checked)} />
            {t.patient.pain}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.additionalNotes}</span>
          <textarea
            className={textAreaClassName}
            rows={5}
            value={additionalNotes}
            onChange={(event) => setAdditionalNotes(event.target.value)}
          />
        </label>

        <div className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr] md:items-end">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.symptomCategories}</span>
              <select
                className={fieldClassName}
                value={selectedCategory}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedCategory(value);
                  onCategoryChange(value || undefined);
                  setSelectedSymptoms([]);
                }}
              >
                <option value="">{t.patient.symptoms}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm text-[var(--color-muted)]">
              {t.patient.selectedSymptomsCount}: {selectedSymptoms.length}
            </p>
          </div>

          {loadingSymptoms ? (
            <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
          ) : symptoms.length === 0 ? (
            <EmptyState
              title={t.patient.consultationCreateUnavailableTitle}
              description={t.patient.consultationCreateUnavailableDescription}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {symptoms.map((symptom) => {
                const checked = selectedSymptoms.includes(symptom.id);
                return (
                  <label
                    key={symptom.id}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        setSelectedSymptoms((current) => {
                          if (event.target.checked) {
                            return [...current, symptom.id];
                          }
                          return current.filter((item) => item !== symptom.id);
                        });
                      }}
                    />
                    <span>
                      <span className="block font-semibold">{symptom.name}</span>
                      {symptom.description ? (
                        <span className="mt-1 block text-xs text-[var(--color-muted)]">{symptom.description}</span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

        <Button type="submit" disabled={submitting || loadingSymptoms || symptoms.length === 0 || selectedSymptoms.length === 0}>
          {submitting ? t.patient.submittingRequest : t.patient.submitRequest}
        </Button>
      </form>
    </Card>
  );
}