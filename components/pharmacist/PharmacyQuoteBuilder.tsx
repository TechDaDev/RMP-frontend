"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { PharmacyQuoteItemPayload, PharmacyQuotePayload } from "@/types/pharmacist";

interface PharmacyQuoteBuilderProps {
  onSubmit: (payload: PharmacyQuotePayload) => Promise<void>;
}

const EMPTY_ITEM: PharmacyQuoteItemPayload = {
  prescription_item: "",
  availability_status: "available",
  quantity: "1",
  unit_price: "",
};

export function PharmacyQuoteBuilder({ onSubmit }: PharmacyQuoteBuilderProps) {
  const [items, setItems] = useState<PharmacyQuoteItemPayload[]>([{ ...EMPTY_ITEM }]);
  const [submitting, setSubmitting] = useState(false);

  function updateItem(index: number, patch: Partial<PharmacyQuoteItemPayload>) {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = items.filter((item) => item.prescription_item);
    if (normalized.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ items: normalized });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 rounded-[2rem]">
      <h3 className="text-base font-semibold text-[var(--color-text)]">Build pharmacy quote</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {items.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-[var(--color-border)] p-3 sm:grid-cols-2">
            <Input id={`prescription-item-${index}`} label="Prescription item" value={item.prescription_item} onChange={(event) => updateItem(index, { prescription_item: event.target.value })} />
            <Input id={`inventory-item-${index}`} label="Inventory item" value={item.inventory_item ?? ""} onChange={(event) => updateItem(index, { inventory_item: event.target.value })} />
            <Input id={`quoted-name-${index}`} label="Quoted name" value={item.quoted_name ?? ""} onChange={(event) => updateItem(index, { quoted_name: event.target.value })} />
            <Input id={`quantity-${index}`} label="Quantity" value={String(item.quantity ?? "")} onChange={(event) => updateItem(index, { quantity: event.target.value })} />
            <Input id={`unit-price-${index}`} label="Unit price" value={String(item.unit_price ?? "")} onChange={(event) => updateItem(index, { unit_price: event.target.value })} />
            <Input id={`availability-${index}`} label="Availability" value={item.availability_status} onChange={(event) => updateItem(index, { availability_status: event.target.value })} />
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setItems((current) => [...current, { ...EMPTY_ITEM }])}>Add quote item</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Submit quote"}</Button>
        </div>
      </form>
    </Card>
  );
}
