"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  canDoctorAccessPatientRecord,
  canDoctorCreateLabOrder,
  canDoctorCreatePrescription,
} from "@/lib/doctor/doctorConsultationStatus";

interface DoctorWorkspaceActionsProps {
  consultationId: string;
  status: string;
  isApproved: boolean;
  patientId?: string;
}

export function DoctorWorkspaceActions({ consultationId, status, isApproved, patientId }: DoctorWorkspaceActionsProps) {
  const { t } = useAppPreferences();
  const canCreatePrescription = isApproved && canDoctorCreatePrescription(status);
  const canCreateLabOrder = isApproved && canDoctorCreateLabOrder(status);
  const canViewRecord = isApproved && !!patientId && canDoctorAccessPatientRecord(status);

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
        {canCreateLabOrder ? (
          <Link
            href={`/app/doctor/consultations/${consultationId}/lab-orders/new`}
            className={buttonClassName({ variant: "secondary" })}
          >
            {t.doctor.createLabOrder}
          </Link>
        ) : (
          <Button variant="secondary" disabled>
            {!isApproved ? t.doctor.verifiedDoctorRequired : t.doctor.labOrderRequiresAcceptedConsultation}
          </Button>
        )}
        {canViewRecord ? (
          <Link
            href={`/app/doctor/patients/${patientId}/record?consultationId=${consultationId}`}
            className={buttonClassName({ variant: "secondary" })}
          >
            {t.doctor.viewPatientRecord}
          </Link>
        ) : (
          <Button variant="secondary" disabled>
            {!isApproved ? t.doctor.verifiedDoctorRequired : t.doctor.patientRecordRequiresRelationship}
          </Button>
        )}
      </div>
    </Card>
  );
}
