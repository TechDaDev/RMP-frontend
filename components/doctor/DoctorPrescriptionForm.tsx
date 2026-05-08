"use client";

import { useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DoctorPrescriptionItemEditor } from "@/components/doctor/DoctorPrescriptionItemEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { CreateDoctorPrescriptionRequest, DoctorPrescriptionItemCreateRequest } from "@/types/doctor";

interface DoctorPrescriptionFormProps {
  onSubmit: (payload: CreateDoctorPrescriptionRequest) => Promise<void>;
}

const EMPTY_ITEM: DoctorPrescriptionItemCreateRequest = {
  medication_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  route: "oral",
  strength: "",
  quantity: "",
  instructions: "",
};

type ItemErrors = Partial<Record<keyof DoctorPrescriptionItemCreateRequest, string>>;

export function DoctorPrescriptionForm({ onSubmit }: DoctorPrescriptionFormProps) {
  const { t } = useAppPreferences();
  const [items, setItems] = useState<DoctorPrescriptionItemCreateRequest[]>([{ ...EMPTY_ITEM }]);
  const [errors, setErrors] = useState<Record<number, ItemErrors>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateItem(index: number, next: DoctorPrescriptionItemCreateRequest) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)));
  }

  function addItem() {
    setItems((current) => [...current, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setErrors((current) => {
      const next: Record<number, ItemErrors> = {};
      Object.entries(current).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (Number.isNaN(numericKey) || numericKey === index) {
          return;
        }
        next[numericKey > index ? numericKey - 1 : numericKey] = value;
      });
      return next;
    });
  }

  function validate(): boolean {
    const nextErrors: Record<number, ItemErrors> = {};

    items.forEach((item, index) => {
      const itemErrors: ItemErrors = {};
      if (!item.medication_name.trim()) {
        itemErrors.medication_name = t.doctor.medicationName;
      }
      if (!item.dosage.trim()) {
        itemErrors.dosage = t.doctor.dosage;
      }
      if (!item.frequency.trim()) {
        itemErrors.frequency = t.doctor.frequency;
      }
      if (!item.duration.trim()) {
        itemErrors.duration = t.doctor.duration;
      }
      if (!item.route) {
        itemErrors.route = t.doctor.prescription;
      }
      if (Object.keys(itemErrors).length > 0) {
        nextErrors[index] = itemErrors;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError(t.doctor.prescriptionCreateFailed);
      return;
    }

    if (!validate()) {
      setSubmitError(t.doctor.prescriptionCreateFailed);
      return;
    }

    const payloadItems = items.map((item) => ({
      medication_name: item.medication_name.trim(),
      dosage: item.dosage.trim(),
      frequency: item.frequency.trim(),
      duration: item.duration.trim(),
      route: item.route,
      strength: item.strength?.trim() ?? "",
      quantity: item.quantity?.trim() ?? "",
      instructions: item.instructions?.trim() ?? "",
    }));

    setSubmitting(true);
    try {
      await onSubmit({ items: payloadItems });
      setItems([{ ...EMPTY_ITEM }]);
      setErrors({});
    } catch {
      setSubmitError(t.doctor.prescriptionCreateFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.createPrescription}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.createPrescriptionSubtitle}</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {items.map((item, index) => (
          <DoctorPrescriptionItemEditor
            key={`${index}-${item.medication_name}`}
            index={index}
            item={item}
            canRemove={items.length > 1}
            onChange={(next) => updateItem(index, next)}
            onRemove={() => removeItem(index)}
            errors={errors[index]}
          />
        ))}

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={addItem}>
            {t.doctor.addMedication}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? t.doctor.submittingPrescription : t.doctor.submitPrescription}
          </Button>
        </div>

        {submitError ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-300">{submitError}</p>
        ) : null}
      </form>
    </Card>
  );
}
