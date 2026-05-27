"use client";

import { useRouter } from "next/navigation";
import { PharmacistPageFrame } from "@/components/pharmacist/ui/PharmacistPageFrame";
import { PharmacyInventoryForm } from "@/components/pharmacist/PharmacyInventoryForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createPharmacyInventoryItem } from "@/lib/pharmacist/pharmacyInventoryService";

export default function PharmacistInventoryCreatePage() {
  const router = useRouter();

  return (
    <PharmacistPageFrame>
      <PageHeader title="Add inventory item" description="Create pharmacy stock item" />
      <PharmacyInventoryForm
        onSubmit={async (payload) => {
          await createPharmacyInventoryItem(payload);
          router.replace("/app/pharmacist/inventory");
        }}
      />
    </PharmacistPageFrame>
  );
}
