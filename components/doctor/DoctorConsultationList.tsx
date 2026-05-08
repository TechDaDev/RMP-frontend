"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { DoctorConsultationCard } from "@/components/doctor/DoctorConsultationCard";
import type { DoctorConsultationListItem } from "@/types/doctor";

interface DoctorConsultationListProps {
  consultations: DoctorConsultationListItem[];
  emptyTitle: string;
  emptyDescription: string;
  isApproved: boolean;
  showAccept?: boolean;
  acceptingId?: string | null;
  onAccept?: (id: string) => void;
}

export function DoctorConsultationList({
  consultations,
  emptyTitle,
  emptyDescription,
  isApproved,
  showAccept = false,
  acceptingId,
  onAccept,
}: DoctorConsultationListProps) {
  if (consultations.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      {consultations.map((consultation) => (
        <DoctorConsultationCard
          key={consultation.id}
          consultation={consultation}
          isApproved={isApproved}
          detailHref={`/app/doctor/consultations/${consultation.id}`}
          showAccept={showAccept}
          accepting={acceptingId === consultation.id}
          onAccept={onAccept}
        />
      ))}
    </div>
  );
}
