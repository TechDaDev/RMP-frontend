"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DoctorAIAssistantPanel } from "@/components/doctor/assistant/DoctorAIAssistantPanel";
import { DoctorClinicalFlagsCard } from "@/components/doctor/DoctorClinicalFlagsCard";
import { DoctorAiCaseSummaryCard } from "@/components/doctor/DoctorAiCaseSummaryCard";
import { DoctorCloseConsultationCard } from "@/components/doctor/DoctorCloseConsultationCard";
import DoctorPatientSummaryCard from "@/components/doctor/DoctorPatientSummaryCard";
import { DoctorMessagesPanel } from "@/components/doctor/DoctorMessagesPanel";
import { DoctorResponseForm } from "@/components/doctor/DoctorResponseForm";
import { DoctorSymptomsCard } from "@/components/doctor/DoctorSymptomsCard";
import { DoctorWorkspaceActions } from "@/components/doctor/DoctorWorkspaceActions";
import type {
  DoctorAIAssistantMessage,
  DoctorConsultationDetail,
  DoctorMessage,
  DoctorResponseRequest,
} from "@/types/doctor";

interface DoctorConsultationWorkspaceProps {
  consultation: DoctorConsultationDetail;
  isApproved: boolean;
  messages: DoctorMessage[];
  messagesLoading: boolean;
  messagesError: string | null;
  assistantMessages: DoctorAIAssistantMessage[];
  assistantLoading: boolean;
  assistantError: string | null;
  assistantGenerating: boolean;
  onRetryMessages: () => void;
  onRetryAssistantMessages: () => void;
  onSendMessage: (body: string) => Promise<void>;
  onGenerateAssistantMessageFromReport: (reportId: string, question?: string) => Promise<void>;
  onMarkAssistantMessageRead: (messageId: string, read: boolean) => Promise<void>;
  onSendResponse: (payload: DoctorResponseRequest) => Promise<void>;
  onCloseConsultation: () => Promise<void>;
}

export function DoctorConsultationWorkspace({
  consultation,
  isApproved,
  messages,
  messagesLoading,
  messagesError,
  assistantMessages,
  assistantLoading,
  assistantError,
  assistantGenerating,
  onRetryMessages,
  onRetryAssistantMessages,
  onSendMessage,
  onGenerateAssistantMessageFromReport,
  onMarkAssistantMessageRead,
  onSendResponse,
  onCloseConsultation,
}: DoctorConsultationWorkspaceProps) {
  const { t } = useAppPreferences();

  return (
    <div className="space-y-6">
      <DashboardSection title={t.doctor.patientSummary}>
        <DashboardGrid columns="two" className="items-start">
          <DoctorPatientSummaryCard consultation={consultation} />
          <DoctorSymptomsCard consultation={consultation} />
          <div className="md:col-span-2">
            <DoctorAiCaseSummaryCard summary={consultation.ai_case_summary} />
          </div>
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection title={t.doctor.clinicalFlags}>
        <DoctorClinicalFlagsCard consultation={consultation} />
      </DashboardSection>

      <DashboardSection
        title={t.doctor.aiAssistantTitle}
        description={t.doctor.aiAssistantDescription}
      >
        <DoctorAIAssistantPanel
          consultationId={consultation.id}
          isApproved={isApproved}
          messages={assistantMessages}
          loading={assistantLoading}
          error={assistantError}
          generating={assistantGenerating}
          onRetry={onRetryAssistantMessages}
          onGenerateFromReport={onGenerateAssistantMessageFromReport}
          onMarkRead={onMarkAssistantMessageRead}
        />
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
