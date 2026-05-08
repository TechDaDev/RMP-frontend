"use client";

import { Button } from "@/components/ui/Button";
import { canDoctorAccept } from "@/lib/doctor/doctorConsultationStatus";

interface DoctorAcceptButtonProps {
  status: string;
  isApproved: boolean;
  loading?: boolean;
  onAccept: () => void;
  label: string;
  loadingLabel: string;
}

export function DoctorAcceptButton({
  status,
  isApproved,
  loading = false,
  onAccept,
  label,
  loadingLabel,
}: DoctorAcceptButtonProps) {
  const canAccept = canDoctorAccept(status) && isApproved;

  return (
    <Button onClick={onAccept} disabled={!canAccept || loading}>
      {loading ? loadingLabel : label}
    </Button>
  );
}
