"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { LabOfferingForm } from "@/components/laboratory/LabOfferingForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getLabOffering, updateLabOffering } from "@/lib/laboratory/labInventoryService";
import type { LabOfferingItem } from "@/types/laboratory";

export default function LabOfferingEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<LabOfferingItem | null>(null);

  useEffect(() => {
    void getLabOffering(params.id).then(setItem);
  }, [params.id]);

  return (
    <LaboratoryPageFrame>
      <PageHeader title="Edit lab offering" description={params.id} />
      {item ? (
        <LabOfferingForm
          initialValue={{
            custom_test_name: item.custom_test_name ?? undefined,
            local_name: item.local_name ?? undefined,
            sample_type_override: item.sample_type_override ?? undefined,
            preparation_notes: item.preparation_notes ?? undefined,
            estimated_turnaround_time: item.estimated_turnaround_time ?? undefined,
            price: item.price,
            currency: item.currency,
            is_available: item.is_available,
          }}
          onSubmit={async (payload) => {
            await updateLabOffering(params.id, payload);
            router.replace("/app/lab/offerings");
          }}
        />
      ) : null}
    </LaboratoryPageFrame>
  );
}
