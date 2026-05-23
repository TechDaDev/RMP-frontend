"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorConsultationWorkspace } from "@/components/doctor/DoctorConsultationWorkspace";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import {
  acceptConsultation,
  closeConsultation,
  generateDoctorAIMessageFromReport,
  getConsultationMessages,
  getDoctorAIAssistantMessages,
  getDoctorConsultationDetail,
  markDoctorAIMessageRead,
  markConsultationMessagesRead,
  sendConsultationMessage,
  sendDoctorResponse,
} from "@/lib/doctor/doctorService";
import { canDoctorReadMessages } from "@/lib/doctor/doctorConsultationStatus";
import { useDoctorAIAssistantRealtime } from "@/lib/realtime/useDoctorAIAssistantRealtime";
import { useConsultationMessagesRealtime } from "@/lib/realtime/useConsultationMessagesRealtime";
import type {
  DoctorAIAssistantMessage,
  DoctorConsultationDetail,
  DoctorMessage,
  DoctorResponseRequest,
} from "@/types/doctor";

function sortMessagesNewestFirst(messages: DoctorMessage[]): DoctorMessage[] {
  return [...messages].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return rightTime - leftTime;
  });
}

function mergeMessagesById(messages: DoctorMessage[], incoming: DoctorMessage): DoctorMessage[] {
  const next = new Map(messages.map((message) => [message.id, message]));
  next.set(incoming.id, {
    ...(next.get(incoming.id) ?? {}),
    ...incoming,
  });
  return sortMessagesNewestFirst(Array.from(next.values()));
}

function sortAssistantMessagesNewestFirst(
  messages: DoctorAIAssistantMessage[],
): DoctorAIAssistantMessage[] {
  return [...messages].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return rightTime - leftTime;
  });
}

function mergeAssistantMessagesById(
  messages: DoctorAIAssistantMessage[],
  incoming: DoctorAIAssistantMessage,
): DoctorAIAssistantMessage[] {
  const next = new Map(messages.map((message) => [message.id, message]));
  next.set(incoming.id, {
    ...(next.get(incoming.id) ?? {}),
    ...incoming,
  });

  return sortAssistantMessagesNewestFirst(Array.from(next.values()));
}

export default function DoctorConsultationDetailPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DoctorConsultationDetail | null>(null);
  const [messages, setMessages] = useState<DoctorMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [assistantMessages, setAssistantMessages] = useState<DoctorAIAssistantMessage[]>([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [assistantGenerating, setAssistantGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  const isApproved = verification?.is_approved === true;
  const messageReadingAllowed = detail ? canDoctorReadMessages(detail.status) : false;

  const loadMessages = useCallback(async (consultationId: string, status: string) => {
    if (!canDoctorReadMessages(status)) {
      setMessages([]);
      setMessagesError(null);
      setMessagesLoading(false);
      return;
    }

    setMessagesLoading(true);
    setMessagesError(null);
    try {
      const data = await getConsultationMessages(consultationId);
      setMessages(sortMessagesNewestFirst(data));
      await markConsultationMessagesRead(consultationId);
    } catch {
      setMessagesError(t.patient.noDataDescription);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [t.patient.noDataDescription]);

  const loadAssistantMessages = useCallback(async (consultationId: string) => {
    if (!isApproved) {
      setAssistantMessages([]);
      setAssistantError(null);
      setAssistantLoading(false);
      return;
    }

    setAssistantLoading(true);
    setAssistantError(null);

    try {
      const data = await getDoctorAIAssistantMessages(consultationId);
      setAssistantMessages(sortAssistantMessagesNewestFirst(data));
    } catch {
      setAssistantMessages([]);
      setAssistantError(t.doctor.aiAssistantLoadFailed);
    } finally {
      setAssistantLoading(false);
    }
  }, [isApproved, t.doctor.aiAssistantLoadFailed]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorConsultationDetail(params.id);
      setDetail(data);
      await loadMessages(params.id, data.status);
      await loadAssistantMessages(params.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t.doctor.verifiedDoctorRequiredDescription);
      } else {
        setError(t.patient.noDataDescription);
      }
    } finally {
      setLoading(false);
    }
  }, [
    loadAssistantMessages,
    loadMessages,
    params.id,
    t.doctor.verifiedDoctorRequiredDescription,
    t.patient.noDataDescription,
  ]);

  const syncConsultationState = useCallback(async () => {
    try {
      const data = await getDoctorConsultationDetail(params.id);
      setDetail(data);
      await loadMessages(params.id, data.status);
      await loadAssistantMessages(params.id);
    } catch {
      // Best-effort fallback while socket reconnects.
    }
  }, [loadAssistantMessages, loadMessages, params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleSendMessage(body: string) {
    const createdMessage = await sendConsultationMessage(params.id, { body, attachments: [] });
    setMessages((current) => mergeMessagesById(current, createdMessage));
    void markConsultationMessagesRead(params.id);
  }

  async function handleAcceptConsultation() {
    setAcceptError(null);
    setAccepting(true);

    try {
      const accepted = await acceptConsultation(params.id);

      if (accepted) {
        setDetail(accepted);
        await loadMessages(params.id, accepted.status);
      } else {
        await loadDetail();
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setAcceptError(t.doctor.verifiedDoctorRequiredDescription);
      } else {
        setAcceptError(t.doctor.acceptFailed);
      }
    } finally {
      setAccepting(false);
    }
  }

  async function handleSendResponse(payload: DoctorResponseRequest) {
    await sendDoctorResponse(params.id, payload);
    await loadDetail();
  }

  async function handleCloseConsultation() {
    await closeConsultation(params.id);
    await loadDetail();
  }

  async function handleGenerateAssistantMessageFromReport(reportId: string, question?: string) {
    setAssistantGenerating(true);
    setAssistantError(null);

    try {
      await generateDoctorAIMessageFromReport(reportId, {
        question,
        top_k: 5,
      });
      await loadAssistantMessages(params.id);
    } catch {
      setAssistantError(t.doctor.aiAssistantGenerateFailed);
    } finally {
      setAssistantGenerating(false);
    }
  }

  async function handleMarkAssistantMessageRead(messageId: string, read: boolean) {
    try {
      const updated = await markDoctorAIMessageRead(messageId, { read });
      setAssistantMessages((current) =>
        sortAssistantMessagesNewestFirst(
          current.some((message) => message.id === updated.id)
            ? current.map((message) => (message.id === updated.id ? updated : message))
            : [...current, updated],
        ),
      );
    } catch {
      setAssistantError(t.doctor.aiAssistantMarkReadFailed);
    }
  }

  useConsultationMessagesRealtime<DoctorMessage>({
    consultationId: params.id,
    enabled: messageReadingAllowed,
    onMessageCreated: (message) => {
      setMessages((current) => mergeMessagesById(current, message));
      setMessagesError(null);
      void markConsultationMessagesRead(params.id);
    },
    onMessagesRead: () => {
      if (detail) {
        void loadMessages(params.id, detail.status);
      }
    },
    onConsultationUpdated: (update) => {
      setDetail((current) => {
        if (!current || current.id !== update.id) {
          return current;
        }

        return {
          ...current,
          status: update.status ?? current.status,
          accepted_at: update.accepted_at ?? current.accepted_at,
          closed_at: update.closed_at ?? current.closed_at,
        };
      });

      void syncConsultationState();
    },
    onFallbackSync: syncConsultationState,
  });

  useDoctorAIAssistantRealtime({
    consultationId: params.id,
    enabled: isApproved && Boolean(detail),
    onMessageCreated: (message) => {
      setAssistantMessages((current) => mergeAssistantMessagesById(current, message));
      setAssistantError(null);
    },
    onMessageUpdated: (message) => {
      setAssistantMessages((current) => mergeAssistantMessagesById(current, message));
      setAssistantError(null);
    },
    onFallbackSync: () => loadAssistantMessages(params.id),
  });

  if (loading) {
    return (
      <DashboardStateCard state="loading" description={t.patient.loading} />
    );
  }

  if (error || !detail) {
    return (
      <DashboardStateCard
        state="error"
        title={t.patient.noDataTitle}
        description={error ?? t.patient.noDataDescription}
        action={
          <>
            <Link href="/app/doctor/consultations/pending" className={buttonClassName({ variant: "secondary" })}>
              {t.doctor.backToPendingConsultations}
            </Link>
            <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
              {t.doctor.backToAssignedConsultations}
            </Link>
            <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
              {t.doctor.backToDoctorDashboard}
            </Link>
          </>
        }
      />
    );
  }

  return (
    <DoctorPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.doctor.consultationWorkspace}</Badge>}
        title={t.doctor.consultationWorkspace}
        description={t.doctor.doctorWorkspaceSubtitle}
        actions={
          <div className="flex flex-wrap gap-2">
            {detail.status === "submitted" ? (
              <Button onClick={() => void handleAcceptConsultation()} disabled={!isApproved || accepting}>
                {accepting ? t.doctor.acceptingConsultation : t.doctor.acceptConsultation}
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => void loadDetail()}>
              {t.patient.retry}
            </Button>
          </div>
        }
      />

      {acceptError ? (
        <DashboardStateCard state="error" title={t.common.error} description={acceptError} />
      ) : null}

      <DoctorConsultationWorkspace
        consultation={detail}
        isApproved={isApproved}
        messages={messages}
        messagesLoading={messagesLoading}
        messagesError={messagesError}
        assistantMessages={assistantMessages}
        assistantLoading={assistantLoading}
        assistantError={assistantError}
        assistantGenerating={assistantGenerating}
        onRetryMessages={() => void loadMessages(params.id, detail.status)}
        onRetryAssistantMessages={() => void loadAssistantMessages(params.id)}
        onSendMessage={handleSendMessage}
        onGenerateAssistantMessageFromReport={handleGenerateAssistantMessageFromReport}
        onMarkAssistantMessageRead={handleMarkAssistantMessageRead}
        onSendResponse={handleSendResponse}
        onCloseConsultation={handleCloseConsultation}
      />

      <div className="flex flex-wrap gap-2">
        <Link href="/app/doctor/consultations/pending" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToPendingConsultations}
        </Link>
        <Link href="/app/doctor/consultations/assigned" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToAssignedConsultations}
        </Link>
        <Link href="/app/doctor" className={buttonClassName({ variant: "secondary" })}>
          {t.doctor.backToDoctorDashboard}
        </Link>
        <Button variant="secondary" onClick={() => void loadDetail()}>
          {t.patient.retry}
        </Button>
      </div>
    </DoctorPageFrame>
  );
}
