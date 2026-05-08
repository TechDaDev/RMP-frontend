"use client";

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
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <DoctorPatientSummaryCard consultation={consultation} />
        <DoctorSymptomsCard consultation={consultation} />
      </div>

      <DoctorClinicalFlagsCard consultation={consultation} />

      <DoctorMessagesPanel
        status={consultation.status}
        isApproved={isApproved}
        loading={messagesLoading}
        error={messagesError}
        messages={messages}
        onRetry={onRetryMessages}
        onSend={onSendMessage}
      />

      <div className="grid gap-6 xl:grid-cols-2">
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
      </div>

      <DoctorWorkspaceActions
        consultationId={consultation.id}
        status={consultation.status}
        isApproved={isApproved}
      />
    </div>
  );
}
