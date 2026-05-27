"use client";

import { useRouter } from "next/navigation";
import { LaboratoryPageFrame } from "@/components/laboratory/ui/LaboratoryPageFrame";
import { LabOfferingForm } from "@/components/laboratory/LabOfferingForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createLabOffering } from "@/lib/laboratory/labInventoryService";

export default function LabOfferingCreatePage() {
  const router = useRouter();

  return (
    <LaboratoryPageFrame>
      <PageHeader title="Add lab offering" description="Create offering with catalog fallback" />
      <LabOfferingForm
        onSubmit={async (payload) => {
          await createLabOffering(payload);
          router.replace("/app/lab/offerings");
        }}
      />
    </LaboratoryPageFrame>
  );
}
