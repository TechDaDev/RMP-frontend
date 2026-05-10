"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
  onSubmit: (payload: ConsultationCreateRequest) => Promise<void>;
}

export function ConsultationForm({
  categories,
  symptoms,
  loadingSymptoms,
  submitting,
  error,
  onSubmit,
}: ConsultationFormProps) {
  const { t } = useAppPreferences();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [duration, setDuration] = useState<ConsultationDuration>("less_than_24_hours");
  const [severity, setSeverity] = useState<ConsultationSeverity>("mild");
  const [hasFever, setHasFever] = useState(false);
  const [hasPain, setHasPain] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const durationOptions = useMemo(
    () => Object.entries(t.patient.durationLabels),
    [t.patient.durationLabels],
  );
  const severityOptions = useMemo(
    () => Object.entries(t.patient.severityLabels),
    [t.patient.severityLabels],
  );

  // Count symptoms per category for the dropdown label
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of symptoms) {
      if (s.category?.id) {
        counts[s.category.id] = (counts[s.category.id] ?? 0) + 1;
      }
    }
    return counts;
  }, [symptoms]);

  // Client-side category + search filtering, then sorting
  const filteredSymptoms = useMemo(() => {
    let list = symptoms;

    if (selectedCategory) {
      list = list.filter((s) => s.category?.id === selectedCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((symptom) => {
        const name = symptom.name.toLowerCase();
        const description = symptom.description?.toLowerCase() ?? "";
        const categoryName = symptom.category?.name?.toLowerCase() ?? "";
        return name.includes(query) || description.includes(query) || categoryName.includes(query);
      });
    }

    // Sort: selected first, then red-flag, then display_order
    return [...list].sort((a, b) => {
      const aSelected = selectedSymptoms.includes(a.id) ? 0 : 1;
      const bSelected = selectedSymptoms.includes(b.id) ? 0 : 1;
      if (aSelected !== bSelected) return aSelected - bSelected;
      const aRedFlag = a.is_red_flag ? 0 : 1;
      const bRedFlag = b.is_red_flag ? 0 : 1;
      if (aRedFlag !== bRedFlag) return aRedFlag - bRedFlag;
      return (a.display_order ?? 999) - (b.display_order ?? 999);
    });
  }, [symptoms, selectedCategory, searchQuery, selectedSymptoms]);

  // Data for selected symptom chips
  const selectedSymptomsData = useMemo(
    () => symptoms.filter((s) => selectedSymptoms.includes(s.id)),
    [symptoms, selectedSymptoms],
  );

  // Whether any selected symptom is a red flag
  const hasRedFlagSelected = useMemo(
    () => selectedSymptomsData.some((s) => s.is_red_flag),
    [selectedSymptomsData],
  );

  function removeSymptom(id: string) {
    setSelectedSymptoms((current) => current.filter((item) => item !== id));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedSymptoms.length === 0) {
      setSelectionError(t.patient.atLeastOneSymptomRequired);
      return;
    }

    setSelectionError(null);
    await onSubmit({
      duration,
      severity,
      has_fever: hasFever,
      has_pain: hasPain,
      additional_notes: additionalNotes.trim() || undefined,
      symptom_ids: selectedSymptoms,
    });
  }

  return (
    <Card className="space-y-6">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
        {t.patient.emergencyWarning}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.automaticSpecialtyRouting}</p>
          <p className="text-sm text-[var(--color-muted)]">{t.patient.symptomsWillGuideSpecialty}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
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

        <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">{t.patient.selectSymptoms}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.symptomCategory}</span>
              <select
                className={fieldClassName}
                value={selectedCategory}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedCategory(value);
                  setSelectionError(null);
                }}
              >
                <option value="">{t.patient.allCategories} ({symptoms.length})</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}{categoryCounts[category.id] !== undefined ? ` (${categoryCounts[category.id]})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">{t.patient.searchSymptoms}</span>
              <input
                type="search"
                className={fieldClassName}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.patient.searchSymptoms}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-muted)]">
              {t.patient.selectedSymptoms}: <span className="font-semibold text-[var(--color-text)]">{selectedSymptoms.length}</span>
              {filteredSymptoms.length < symptoms.length ? (
                <span className="ms-2">
                  ({filteredSymptoms.length} / {symptoms.length})
                </span>
              ) : null}
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSelectedSymptoms([]);
                setSelectionError(null);
              }}
              disabled={selectedSymptoms.length === 0}
            >
              {t.patient.clearSelection}
            </Button>
          </div>

          {/* Selected symptom chips */}
          {selectedSymptomsData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSymptomsData.map((symptom) => (
                <span
                  key={symptom.id}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_12%,var(--color-surface))] px-3 py-1 text-xs font-medium text-[var(--color-primary)]"
                >
                  <span className="truncate">{symptom.name}</span>
                  <button
                    type="button"
                    aria-label={`${t.patient.removeSymptom}: ${symptom.name}`}
                    className="shrink-0 opacity-70 transition hover:opacity-100"
                    onClick={() => removeSymptom(symptom.id)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          {/* Red-flag safety notice */}
          {hasRedFlagSelected ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
              {t.patient.safetyEmergencyNotice}
            </div>
          ) : null}

          {loadingSymptoms ? (
            <DashboardStateCard state="loading" description={t.patient.loading} />
          ) : symptoms.length === 0 ? (
            <DashboardStateCard
              state="empty"
              title={t.patient.noSymptomsAvailable}
              description={t.patient.consultationCreateUnavailableDescription}
            />
          ) : filteredSymptoms.length === 0 ? (
            <DashboardStateCard
              state="empty"
              title={t.patient.noSymptomsMatch}
              description={t.patient.searchSymptoms}
            />
          ) : (
            <div className="max-h-96 overflow-y-auto rounded-2xl">
              <div className="grid gap-3 md:grid-cols-2">
                {filteredSymptoms.map((symptom) => {
                  const checked = selectedSymptoms.includes(symptom.id);
                  return (
                    <button
                      key={symptom.id}
                      type="button"
                      className={`text-start rounded-2xl border px-4 py-3 transition ${checked
                        ? "border-[var(--color-primary)] bg-[color:color-mix(in_srgb,var(--color-primary)_10%,var(--color-surface))]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)]"
                        }`}
                      onClick={() => {
                        setSelectedSymptoms((current) => {
                          const exists = current.includes(symptom.id);
                          if (exists) {
                            return current.filter((item) => item !== symptom.id);
                          }
                          return [...current, symptom.id];
                        });
                        setSelectionError(null);
                      }}
                    >
                      <span className="block text-sm text-[var(--color-text)]">
                        <span className="block font-semibold">{symptom.name}</span>
                        <span className="mt-1 block text-xs text-[var(--color-muted)]">
                          {symptom.category?.name ?? t.patient.systemAssignedSpecialty}
                        </span>
                        {symptom.description ? (
                          <span className="mt-1 block text-xs text-[var(--color-muted)]">{symptom.description}</span>
                        ) : null}
                        {symptom.is_red_flag ? (
                          <span className="mt-2 inline-flex rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-200">
                            {t.patient.redFlagSymptom}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {selectionError ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{selectionError}</p> : null}
        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

        <Button type="submit" disabled={submitting || loadingSymptoms || symptoms.length === 0 || selectedSymptoms.length === 0}>
          {submitting ? t.patient.submittingRequest : t.patient.submitRequest}
        </Button>
      </form>
    </Card>
  );
}
