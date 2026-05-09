"use client";

import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { LaboratoryResultValueFields, type LaboratoryResultFormState } from "@/components/laboratory/LaboratoryResultValueFields";
import { correctLaboratoryResult } from "@/lib/laboratory/laboratoryService";
import { ApiError } from "@/lib/api/errors";
import type { LaboratoryResultDetail, CorrectLaboratoryResultRequest } from "@/types/laboratory";

interface LaboratoryResultCorrectionFormProps {
  result: LaboratoryResultDetail;
  resultId: string;
  onCorrected: (result: LaboratoryResultDetail) => void;
}

export function LaboratoryResultCorrectionForm({
  result,
  resultId,
  onCorrected,
}: LaboratoryResultCorrectionFormProps) {
  const { t } = useAppPreferences();
  const [reason, setReason] = useState("");
  const [formState, setFormState] = useState<LaboratoryResultFormState>({
    valueType: (result.value_type as any) || "numeric",
    numericValue: result.numeric_value?.toString() || "",
    textValue: result.text_value || "",
    bloodGroupValue: result.blood_group_value || "",
    unit: result.unit || "",
    referenceRange: result.reference_range || "",
    flag: result.flag || "normal",
    laboratorianNotes: result.laboratorian_notes || "",
    resultFile: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleStateChange = (patch: Partial<LaboratoryResultFormState>) => {
    setFormState(prev => ({ ...prev, ...patch }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError(null);

    if (!reason.trim()) {
      setErrors({ reason: [t.laboratory.correctionRequiresReason || "Reason is required"] });
      return;
    }

    try {
      setSubmitting(true);

      const payload: CorrectLaboratoryResultRequest = {
        reason,
        value_type: formState.valueType as any,
        numeric_value: formState.numericValue ? Number(formState.numericValue) : undefined,
        text_value: formState.textValue || undefined,
        blood_group_value: formState.bloodGroupValue || undefined,
        unit: formState.unit || undefined,
        reference_range: formState.referenceRange || undefined,
        flag: formState.flag || undefined,
        laboratorian_notes: formState.laboratorianNotes || undefined,
      };

      const corrected = await correctLaboratoryResult(resultId, payload);
      onCorrected(corrected);
    } catch (err) {
      const error = err as Error | ApiError;
      if (error instanceof ApiError && error.fieldErrors) {
        setErrors(error.fieldErrors);
      } else {
        setGlobalError(error instanceof Error ? error.message : "Failed to correct result");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {globalError && (
        <div className="rounded-lg border border-[var(--color-danger)] bg-[var(--color-danger-light)] p-3">
          <p className="text-sm text-[var(--color-danger-text)]">{globalError}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t.laboratory.correctionReason || "Reason for Correction"}
          <span className="text-[var(--color-danger)]">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t.laboratory.correctionReasonPlaceholder || "Explain why correction is needed"}
          className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          rows={3}
        />
        {errors.reason && (
          <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.reason[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t.laboratory.resultValueType || "Value Type"}
        </label>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{formState.valueType}</p>
      </div>

      <LaboratoryResultValueFields
        state={formState}
        onChange={handleStateChange}
        fieldErrors={errors}
      />

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)]">
          {t.laboratory.labNotes || "Lab Notes"}
        </label>
        <textarea
          value={formState.laboratorianNotes}
          onChange={(e) => handleStateChange({ laboratorianNotes: e.target.value })}
          placeholder={t.laboratory.labNotesPlaceholder || "Optional notes"}
          className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full"
      >
        {submitting
          ? t.laboratory.submittingCorrection || "Submitting..."
          : t.laboratory.submitCorrection || "Submit Correction"}
      </Button>
    </form>
  );
}
