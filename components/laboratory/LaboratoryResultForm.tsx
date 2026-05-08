import { useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { createLabResultForItem } from "@/lib/laboratory/laboratoryService";
import { ApiError } from "@/lib/api/errors";
import type { LaboratoryResultCreateRequest, LaboratoryResultDetail } from "@/types/laboratory";
import { LaboratoryResultValueFields, type LaboratoryResultFormState } from "./LaboratoryResultValueFields";

interface LaboratoryResultFormProps {
  itemId: string;
  disabled?: boolean;
  onCreated: (result: LaboratoryResultDetail) => void;
}

function initialState(): LaboratoryResultFormState {
  return {
    valueType: "",
    numericValue: "",
    textValue: "",
    bloodGroupValue: "",
    unit: "",
    referenceRange: "",
    flag: "",
    laboratorianNotes: "",
    resultFile: null,
  };
}

export function LaboratoryResultForm({ itemId, disabled = false, onCreated }: LaboratoryResultFormProps) {
  const { t } = useAppPreferences();
  const [state, setState] = useState<LaboratoryResultFormState>(() => initialState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | undefined>(undefined);

  const isBlocked = disabled || isSubmitting;

  const canSubmit = useMemo(() => {
    if (!state.valueType) {
      return false;
    }

    if (state.valueType === "numeric") {
      return state.numericValue.trim().length > 0;
    }

    if (state.valueType === "text") {
      return state.textValue.trim().length > 0;
    }

    if (state.valueType === "blood_group") {
      return state.bloodGroupValue.trim().length > 0;
    }

    if (state.valueType === "positive_negative") {
      return state.textValue === "positive" || state.textValue === "negative";
    }

    if (state.valueType === "file_only") {
      return Boolean(state.resultFile);
    }

    return false;
  }, [state]);

  const patchState = (patch: Partial<LaboratoryResultFormState>) => {
    setState((previous) => ({ ...previous, ...patch }));
  };

  const validateClient = (): string | null => {
    if (!state.valueType) {
      return t.laboratory.resultFieldRequired;
    }

    if (state.valueType === "numeric") {
      if (!state.numericValue.trim()) {
        return t.laboratory.resultFieldRequired;
      }

      if (Number.isNaN(Number(state.numericValue))) {
        return t.laboratory.invalidNumericValue;
      }
    }

    if (state.valueType === "text" && !state.textValue.trim()) {
      return t.laboratory.resultFieldRequired;
    }

    if (state.valueType === "blood_group" && !state.bloodGroupValue.trim()) {
      return t.laboratory.resultFieldRequired;
    }

    if (state.valueType === "positive_negative") {
      if (state.textValue !== "positive" && state.textValue !== "negative") {
        return t.laboratory.resultFieldRequired;
      }
    }

    if (state.valueType === "file_only" && !state.resultFile) {
      return t.laboratory.resultFieldRequired;
    }

    return null;
  };

  const buildPayload = (): LaboratoryResultCreateRequest => {
    const payload: LaboratoryResultCreateRequest = {
      value_type: state.valueType as LaboratoryResultCreateRequest["value_type"],
      laboratorian_notes: state.laboratorianNotes.trim() || undefined,
      flag: state.flag || undefined,
    };

    if (state.valueType === "numeric") {
      payload.numeric_value = state.numericValue.trim();
      payload.unit = state.unit.trim() || undefined;
      payload.reference_range = state.referenceRange.trim() || undefined;
    }

    if (state.valueType === "text") {
      payload.text_value = state.textValue.trim();
      payload.reference_range = state.referenceRange.trim() || undefined;
      payload.unit = state.unit.trim() || undefined;
    }

    if (state.valueType === "blood_group") {
      payload.blood_group_value = state.bloodGroupValue;
    }

    if (state.valueType === "positive_negative") {
      payload.text_value = state.textValue;
      payload.reference_range = state.referenceRange.trim() || undefined;
    }

    if (state.valueType === "file_only") {
      payload.result_file = state.resultFile ?? undefined;
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    const clientError = validateClient();
    if (clientError) {
      setError(clientError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors(undefined);

    try {
      const result = await createLabResultForItem(itemId, buildPayload());
      onCreated(result);
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message || t.laboratory.labResultCreateFailed);
        setFieldErrors(caughtError.fieldErrors);
      } else if (caughtError instanceof Error) {
        setError(caughtError.message || t.laboratory.labResultCreateFailed);
      } else {
        setError(t.laboratory.labResultCreateFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <LaboratoryResultValueFields state={state} onChange={patchState} fieldErrors={fieldErrors} />

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-300">{error}</p> : null}

      <Button fullWidth onClick={handleSubmit} disabled={isBlocked}>
        {isSubmitting ? t.laboratory.submittingLabResult : t.laboratory.submitLabResult}
      </Button>

      {!canSubmit && !error ? (
        <p className="text-xs text-[var(--color-muted)]">{t.laboratory.resultFieldRequired}</p>
      ) : null}
    </div>
  );
}
