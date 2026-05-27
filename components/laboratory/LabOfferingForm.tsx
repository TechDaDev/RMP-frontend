"use client";

import { useState, type FormEvent } from "react";
import { LabTestAutocomplete } from "@/components/catalog/LabTestAutocomplete";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { LabTestCatalogItem } from "@/types/catalog";
import type { LabOfferingCreateRequest } from "@/types/laboratory";

interface LabOfferingFormProps {
  initialValue?: Partial<LabOfferingCreateRequest>;
  onSubmit: (payload: LabOfferingCreateRequest) => Promise<void>;
}

export function LabOfferingForm({ initialValue, onSubmit }: LabOfferingFormProps) {
  const [selectedTest, setSelectedTest] = useState<LabTestCatalogItem | null>(null);
  const [customTestName, setCustomTestName] = useState(initialValue?.custom_test_name ?? "");
  const [localName, setLocalName] = useState(initialValue?.local_name ?? "");
  const [sampleTypeOverride, setSampleTypeOverride] = useState(initialValue?.sample_type_override ?? "");
  const [preparationNotes, setPreparationNotes] = useState(initialValue?.preparation_notes ?? "");
  const [eta, setEta] = useState(initialValue?.estimated_turnaround_time ?? "");
  const [price, setPrice] = useState(initialValue?.price ? String(initialValue.price) : "");
  const [currency, setCurrency] = useState(initialValue?.currency ?? "IQD");
  const [isAvailable, setIsAvailable] = useState(initialValue?.is_available ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!price) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        lab_test: selectedTest?.id,
        custom_test_name: customTestName || undefined,
        local_name: localName || undefined,
        sample_type_override: sampleTypeOverride || undefined,
        preparation_notes: preparationNotes || undefined,
        estimated_turnaround_time: eta || undefined,
        price,
        currency,
        is_available: isAvailable,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">Lab offering</h3>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <LabTestAutocomplete
          value={selectedTest?.display_name ?? ""}
          selectedTestId={selectedTest?.id}
          customTestName={customTestName}
          onSelectTest={setSelectedTest}
          onCustomTestNameChange={setCustomTestName}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input id="local-name" label="Local name" value={localName} onChange={(event) => setLocalName(event.target.value)} />
          <Input id="sample-type" label="Sample type override" value={sampleTypeOverride} onChange={(event) => setSampleTypeOverride(event.target.value)} />
          <Input id="eta" label="Estimated turnaround" value={eta} onChange={(event) => setEta(event.target.value)} />
          <Input id="price" label="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
          <Input id="currency" label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value)} />

          <label className="flex items-center gap-2 pt-8 text-sm text-[var(--color-text)]">
            <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} />
            Available
          </label>
        </div>

        <label className="block space-y-2" htmlFor="prep-notes">
          <span className="text-sm font-semibold text-[var(--color-text)]">Preparation notes</span>
          <textarea
            id="prep-notes"
            value={preparationNotes}
            onChange={(event) => setPreparationNotes(event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]"
          />
        </label>

        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save offering"}</Button>
      </form>
    </Card>
  );
}
