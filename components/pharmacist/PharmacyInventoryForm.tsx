"use client";

import { useState, type FormEvent } from "react";
import { DrugAutocomplete } from "@/components/catalog/DrugAutocomplete";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { DrugCatalogItem } from "@/types/catalog";
import type { PharmacyInventoryCreateRequest } from "@/types/pharmacist";

interface PharmacyInventoryFormProps {
  initialValue?: Partial<PharmacyInventoryCreateRequest>;
  onSubmit: (payload: PharmacyInventoryCreateRequest) => Promise<void>;
}

export function PharmacyInventoryForm({ initialValue, onSubmit }: PharmacyInventoryFormProps) {
  const [selectedDrug, setSelectedDrug] = useState<DrugCatalogItem | null>(null);
  const [customDrugName, setCustomDrugName] = useState(initialValue?.custom_drug_name ?? "");
  const [brandName, setBrandName] = useState(initialValue?.brand_name ?? "");
  const [form, setForm] = useState(initialValue?.form ?? "");
  const [strength, setStrength] = useState(initialValue?.strength ?? "");
  const [route, setRoute] = useState(initialValue?.route ?? "");
  const [price, setPrice] = useState(initialValue?.price ? String(initialValue.price) : "");
  const [currency, setCurrency] = useState(initialValue?.currency ?? "IQD");
  const [stockStatus, setStockStatus] = useState(initialValue?.stock_status ?? "in_stock");
  const [quantity, setQuantity] = useState(initialValue?.quantity ? String(initialValue.quantity) : "");
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
        drug: selectedDrug?.id,
        custom_drug_name: customDrugName || undefined,
        brand_name: brandName || undefined,
        form: form || undefined,
        strength: strength || undefined,
        route: route || undefined,
        price,
        currency,
        stock_status: stockStatus,
        quantity: quantity ? Number(quantity) : undefined,
        is_available: isAvailable,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">Inventory item</h3>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <DrugAutocomplete
          value={selectedDrug?.display_name ?? ""}
          selectedDrugId={selectedDrug?.id}
          customDrugName={customDrugName}
          onSelectDrug={setSelectedDrug}
          onCustomDrugNameChange={setCustomDrugName}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input id="brand-name" label="Brand name" value={brandName} onChange={(event) => setBrandName(event.target.value)} />
          <Input id="form" label="Form" value={form} onChange={(event) => setForm(event.target.value)} />
          <Input id="strength" label="Strength" value={strength} onChange={(event) => setStrength(event.target.value)} />
          <Input id="route" label="Route" value={route} onChange={(event) => setRoute(event.target.value)} />
          <Input id="price" label="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
          <Input id="currency" label="Currency" value={currency} onChange={(event) => setCurrency(event.target.value)} />
          <Input id="quantity" label="Quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} />

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--color-text)]">Stock status</span>
            <select
              value={stockStatus}
              onChange={(event) => setStockStatus(event.target.value)}
              className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)]"
            >
              <option value="in_stock">in_stock</option>
              <option value="low_stock">low_stock</option>
              <option value="out_of_stock">out_of_stock</option>
              <option value="unavailable">unavailable</option>
            </select>
          </label>

          <label className="flex items-center gap-2 pt-8 text-sm text-[var(--color-text)]">
            <input type="checkbox" checked={isAvailable} onChange={(event) => setIsAvailable(event.target.checked)} />
            Available
          </label>
        </div>

        <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save item"}</Button>
      </form>
    </Card>
  );
}
