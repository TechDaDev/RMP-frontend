"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { canDoctorCreatePrescription } from "@/lib/doctor/doctorConsultationStatus";

interface DoctorWorkspaceActionsProps {
  consultationId: string;
  status: string;
  isApproved: boolean;
}

export function DoctorWorkspaceActions({ consultationId, status, isApproved }: DoctorWorkspaceActionsProps) {
  const { t } = useAppPreferences();
  const canCreatePrescription = isApproved && canDoctorCreatePrescription(status);

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.workspaceActions}</h3>
      <div className="flex flex-wrap gap-2">
        {canCreatePrescription ? (
          <Link
            href={`/app/doctor/consultations/${consultationId}/prescriptions/new`}
            className={buttonClassName({ variant: "secondary" })}
          >
            {t.doctor.createPrescription}
          </Link>
        ) : (
          <Button variant="secondary" disabled>
            {!isApproved ? t.doctor.verifiedDoctorRequired : t.doctor.prescriptionRequiresAcceptedConsultation}
          </Button>
        )}
        <Button variant="secondary" disabled>
          {t.doctor.labOrderPhaseComing}
        </Button>
      </div>
    </Card>
  );
}
