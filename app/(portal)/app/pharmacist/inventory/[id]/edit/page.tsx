"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { PharmacyInventoryForm } from "@/components/pharmacist/PharmacyInventoryForm";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getPharmacyInventoryItem,
  updatePharmacyInventoryItem,
} from "@/lib/pharmacist/pharmacyInventoryService";
import type { PharmacyInventoryItem } from "@/types/pharmacist";

export default function PharmacistInventoryEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<PharmacyInventoryItem | null>(null);

  useEffect(() => {
    void getPharmacyInventoryItem(params.id).then(setItem);
  }, [params.id]);

  return (
    <PharmacistPageFrame>
      <PageHeader title="Edit inventory item" description="Update pharmacy stock item" />
      {item ? (
        <PharmacyInventoryForm
          initialValue={{
            custom_drug_name: item.custom_drug_name ?? undefined,
            brand_name: item.brand_name ?? undefined,
            form: item.form ?? undefined,
            strength: item.strength ?? undefined,
            route: item.route ?? undefined,
            price: item.price,
            currency: item.currency,
            stock_status: item.stock_status,
            quantity: item.quantity ?? undefined,
            is_available: item.is_available,
          }}
          onSubmit={async (payload) => {
            await updatePharmacyInventoryItem(params.id, payload);
            router.replace("/app/pharmacist/inventory");
          }}
        />
      ) : null}
    </PharmacistPageFrame>
  );
}
