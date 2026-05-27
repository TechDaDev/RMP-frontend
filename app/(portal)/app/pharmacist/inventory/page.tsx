"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClassName } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { listPharmacyInventory } from "@/lib/pharmacist/pharmacyInventoryService";
import type { PharmacyInventoryItem } from "@/types/pharmacist";
import { Badge } from "@/components/ui/Badge";

export default function PharmacistInventoryPage() {
  const [items, setItems] = useState<PharmacyInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listPharmacyInventory()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PharmacistPageFrame>
      <PageHeader
        title="Pharmacy inventory"
        description="Catalog-aware inventory items"
        actions={<Link href="/app/pharmacist/inventory/new" className={buttonClassName()}>Add item</Link>}
      />

      <Card className="space-y-3">
        {loading ? <p className="text-sm text-[var(--color-muted)]">Loading inventory...</p> : null}
        {!loading && items.length === 0 ? <p className="text-sm text-[var(--color-muted)]">No inventory items yet.</p> : null}
        {!loading && items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--color-border)] p-3">
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{item.display_name ?? item.custom_drug_name ?? "-"}</p>
                  <p className="text-xs text-[var(--color-muted)]">{item.stock_status ?? "-"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriceDisplay amount={item.price} currency={item.currency} />
                  <Badge tone={item.stock_status === "in_stock" ? "success" : item.stock_status === "low_stock" ? "warning" : "danger"}>{item.stock_status ?? "-"}</Badge>
                  <Link href={`/app/pharmacist/inventory/${item.id}/edit`} className={buttonClassName({ variant: "secondary" })}>Edit</Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <Link href="/app/pharmacist" className={buttonClassName({ variant: "secondary" })}>Back</Link>
    </PharmacistPageFrame>
  );
}
