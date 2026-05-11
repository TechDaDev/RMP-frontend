"use client";

import { useState, type FormEvent } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import {
  DoctorLabOrderItemEditor,
  type DoctorLabOrderItemDraft,
} from "@/components/doctor/DoctorLabOrderItemEditor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ApiError } from "@/lib/api/errors";
import type {
  CreateDoctorLabOrderItemRequest,
  CreateDoctorLabOrderRequest,
} from "@/types/doctor";

interface DoctorLabOrderFormProps {
  onSubmit: (payload: CreateDoctorLabOrderRequest) => Promise<void>;
}

const EMPTY_ITEM: DoctorLabOrderItemDraft = {
  test_name: "",
  category: "",
  sample_type: "",
  instructions: "",
};

type ItemErrors = Partial<Record<keyof CreateDoctorLabOrderItemRequest, string>>;

export function DoctorLabOrderForm({ onSubmit }: DoctorLabOrderFormProps) {
  const { t } = useAppPreferences();
  const [items, setItems] = useState<DoctorLabOrderItemDraft[]>([{ ...EMPTY_ITEM }]);
  const [errors, setErrors] = useState<Record<number, ItemErrors>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateItem(index: number, next: DoctorLabOrderItemDraft) {
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
      // Backend accepts either catalog test UUID or test_name+category; this form uses name+category.
      if (!item.test_name?.trim()) {
        itemErrors.test_name = t.doctor.testName;
      }
      if (!item.category?.trim()) {
        itemErrors.category = t.doctor.testCategory;
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
      setSubmitError(t.doctor.labOrderCreateFailed);
      return;
    }

    if (!validate()) {
      setSubmitError(t.doctor.labOrderCreateFailed);
      return;
    }

    const payloadItems: CreateDoctorLabOrderItemRequest[] = items.map((item) => {
      const payload: CreateDoctorLabOrderItemRequest = {
        test_name: item.test_name?.trim(),
        category: item.category?.trim(),
      };

      const test = item.test?.trim();
      const sampleType = item.sample_type?.trim();
      const instructions = item.instructions?.trim();

      if (test) payload.test = test;
      if (sampleType) payload.sample_type = sampleType;
      if (instructions) payload.instructions = instructions;

      return payload;
    });

    setSubmitting(true);
    try {
      await onSubmit({ items: payloadItems });
      setItems([{ ...EMPTY_ITEM }]);
      setErrors({});
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        const rawItems = (err.fieldErrors as Record<string, unknown>).items;
        if (Array.isArray(rawItems) && rawItems.length > 0) {
          const perItem: Record<number, ItemErrors> = {};
          rawItems.forEach((itemErr, idx) => {
            if (itemErr && typeof itemErr === "object") {
              const errs: ItemErrors = {};
              for (const [k, v] of Object.entries(itemErr as Record<string, unknown>)) {
                errs[k as keyof CreateDoctorLabOrderItemRequest] = Array.isArray(v)
                  ? (v[0] as string)
                  : String(v);
              }
              if (Object.keys(errs).length > 0) perItem[idx] = errs;
            }
          });
          if (Object.keys(perItem).length > 0) {
            setErrors(perItem);
            setSubmitError(t.doctor.labOrderCreateFailed);
            return;
          }
        }
      }
      setSubmitError(t.doctor.labOrderCreateFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.createLabOrder}</h3>
      <p className="text-sm text-[var(--color-muted)]">{t.doctor.createLabOrderSubtitle}</p>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {items.map((item, index) => (
          <DoctorLabOrderItemEditor
            key={`${index}-${item.test_name ?? "test"}`}
            index={index}
            item={item}
            canRemove={items.length > 1}
            onChange={(next) => updateItem(index, next)}
            onRemove={() => removeItem(index)}
            errors={errors[index]}
          />
        ))}

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" className="w-full" onClick={addItem}>
            {t.doctor.addLabTest}
          </Button>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t.doctor.submittingLabOrder : t.doctor.submitLabOrder}
          </Button>
        </div>

        {submitError ? (
          <p className="text-sm font-medium text-red-600 dark:text-red-300">{submitError}</p>
        ) : null}
      </form>
    </Card>
  );
}
