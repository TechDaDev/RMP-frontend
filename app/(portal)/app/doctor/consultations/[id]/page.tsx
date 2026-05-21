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
  closeConsultation,
  getConsultationMessages,
  getDoctorConsultationDetail,
  markConsultationMessagesRead,
  sendConsultationMessage,
  sendDoctorResponse,
} from "@/lib/doctor/doctorService";
import { canDoctorReadMessages } from "@/lib/doctor/doctorConsultationStatus";
import { useConsultationMessagesRealtime } from "@/lib/realtime/useConsultationMessagesRealtime";
import type { DoctorConsultationDetail, DoctorMessage, DoctorResponseRequest } from "@/types/doctor";

function mergeMessagesById(messages: DoctorMessage[], incoming: DoctorMessage): DoctorMessage[] {
  const next = new Map(messages.map((message) => [message.id, message]));
  next.set(incoming.id, {
    ...(next.get(incoming.id) ?? {}),
    ...incoming,
  });
  return Array.from(next.values()).sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return leftTime - rightTime;
  });
}

export default function DoctorConsultationDetailPage() {
  const { t } = useAppPreferences();
  const { verification } = useAuth();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DoctorConsultationDetail | null>(null);
  const [messages, setMessages] = useState<DoctorMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setMessages(data);
      await markConsultationMessagesRead(consultationId);
    } catch {
      setMessagesError(t.patient.noDataDescription);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, [t.patient.noDataDescription]);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDoctorConsultationDetail(params.id);
      setDetail(data);
      await loadMessages(params.id, data.status);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t.doctor.verifiedDoctorRequiredDescription);
      } else {
        setError(t.patient.noDataDescription);
      }
    } finally {
      setLoading(false);
    }
  }, [loadMessages, params.id, t.doctor.verifiedDoctorRequiredDescription, t.patient.noDataDescription]);

  const syncConsultationState = useCallback(async () => {
    try {
      const data = await getDoctorConsultationDetail(params.id);
      setDetail(data);
      await loadMessages(params.id, data.status);
    } catch {
      // Best-effort fallback while socket reconnects.
    }
  }, [loadMessages, params.id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleSendMessage(body: string, attachments: File[]) {
    const createdMessage = await sendConsultationMessage(params.id, { body, attachments });
    setMessages((current) => mergeMessagesById(current, createdMessage));
    void markConsultationMessagesRead(params.id);
  }

  async function handleSendResponse(payload: DoctorResponseRequest) {
    await sendDoctorResponse(params.id, payload);
    await loadDetail();
  }

  async function handleCloseConsultation() {
    await closeConsultation(params.id);
    await loadDetail();
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
          <Button variant="secondary" onClick={() => void loadDetail()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorConsultationWorkspace
        consultation={detail}
        isApproved={isApproved}
        messages={messages}
        messagesLoading={messagesLoading}
        messagesError={messagesError}
        onRetryMessages={() => void loadMessages(params.id, detail.status)}
        onSendMessage={handleSendMessage}
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
      </div>
    </DoctorPageFrame>
  );
}
