"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClassName } from "@/components/ui/Button";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { listLabOfferings } from "@/lib/laboratory/labInventoryService";
import type { LabOfferingItem } from "@/types/laboratory";

export default function LabOfferingsPage() {
  const [items, setItems] = useState<LabOfferingItem[]>([]);

  useEffect(() => {
    void listLabOfferings().then(setItems);
  }, []);

  return (
    <LaboratoryPageFrame>
      <PageHeader
        title="Lab offerings"
        description="Catalog-aware test offerings"
        actions={<Link href="/app/lab/offerings/new" className={buttonClassName()}>Add offering</Link>}
      />

      <Card className="space-y-2">
        {items.length === 0 ? <p className="text-sm text-[var(--color-muted)]">No offerings yet.</p> : null}
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--color-border)] p-3">
            <div>
              <p className="font-semibold text-[var(--color-text)]">{item.display_name ?? item.custom_test_name ?? item.local_name ?? "-"}</p>
              <p className="text-xs text-[var(--color-muted)]">{item.sample_type_override ?? "-"}</p>
            </div>
            <div className="flex items-center gap-2">
              <PriceDisplay amount={item.price} currency={item.currency} />
              <Link href={`/app/lab/offerings/${item.id}/edit`} className={buttonClassName({ variant: "secondary" })}>Edit</Link>
            </div>
          </div>
        ))}
      </Card>
    </LaboratoryPageFrame>
  );
}
