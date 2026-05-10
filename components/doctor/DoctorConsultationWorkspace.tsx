"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DoctorClinicalFlagsCard } from "@/components/doctor/DoctorClinicalFlagsCard";
import { DoctorCloseConsultationCard } from "@/components/doctor/DoctorCloseConsultationCard";
import DoctorPatientSummaryCard from "@/components/doctor/DoctorPatientSummaryCard";
import { DoctorMessagesPanel } from "@/components/doctor/DoctorMessagesPanel";
import { DoctorResponseForm } from "@/components/doctor/DoctorResponseForm";
import { DoctorSymptomsCard } from "@/components/doctor/DoctorSymptomsCard";
import { DoctorWorkspaceActions } from "@/components/doctor/DoctorWorkspaceActions";
import type { DoctorConsultationDetail, DoctorMessage, DoctorResponseRequest } from "@/types/doctor";

interface DoctorConsultationWorkspaceProps {
  consultation: DoctorConsultationDetail;
  isApproved: boolean;
  messages: DoctorMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  onRetryMessages: () => void;
  onSendMessage: (body: string) => Promise<void>;
  onSendResponse: (payload: DoctorResponseRequest) => Promise<void>;
  onCloseConsultation: () => Promise<void>;
}

export function DoctorConsultationWorkspace({
  consultation,
  isApproved,
  messages,
  messagesLoading,
  messagesError,
  onRetryMessages,
  onSendMessage,
  onSendResponse,
  onCloseConsultation,
}: DoctorConsultationWorkspaceProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-6">
      <DashboardSection title={t.doctor.patientSummary}>
        <DashboardGrid columns="two">
        <DoctorPatientSummaryCard consultation={consultation} />
        <DoctorSymptomsCard consultation={consultation} />
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection title={t.doctor.clinicalFlags}>
        <DoctorClinicalFlagsCard consultation={consultation} />
      </DashboardSection>

      <DashboardSection title={t.doctor.doctorMessages}>
        <DoctorMessagesPanel
          status={consultation.status}
          isApproved={isApproved}
          loading={messagesLoading}
          error={messagesError}
          messages={messages}
          onRetry={onRetryMessages}
          onSend={onSendMessage}
        />
      </DashboardSection>

      <DashboardSection title={t.doctor.doctorResponse}>
        <DashboardGrid columns="two">
        <DoctorResponseForm
          status={consultation.status}
          isApproved={isApproved}
          onSubmitResponse={onSendResponse}
        />
        <DoctorCloseConsultationCard
          status={consultation.status}
          isApproved={isApproved}
          onCloseConsultation={onCloseConsultation}
        />
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection title={t.doctor.workspaceActions}>
        <DoctorWorkspaceActions
          consultationId={consultation.id}
          status={consultation.status}
          isApproved={isApproved}
          patientId={consultation.patient?.id}
        />
      </DashboardSection>
    </div>
  );
}
