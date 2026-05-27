"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PaymentIntentCheckout } from "@/components/payments/PaymentIntentCheckout";
import { PaymentStatusBadge } from "@/components/payments/PaymentStatusBadge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ConsultationDetailPanel } from "@/components/patient/ConsultationDetailPanel";
import { ConsultationLifecycleCard } from "@/components/patient/ConsultationLifecycleCard";
import { ConsultationMessagesPanel } from "@/components/patient/ConsultationMessagesPanel";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { canPatientReadMessages, canPatientUseMessages, getConsultationLifecycle } from "@/lib/patient/consultationStatus";
import { useConsultationMessagesRealtime } from "@/lib/realtime/useConsultationMessagesRealtime";
import {
  getConsultationDetail,
  getConsultationMessages,
  markConsultationMessagesRead,
  sendConsultationMessage,
} from "@/lib/patient/patientService";
import type { ConsultationDetail, ConsultationMessage } from "@/types/patient";

function sortMessagesNewestFirst(messages: ConsultationMessage[]): ConsultationMessage[] {
  return [...messages].sort((left, right) => {
    const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0;
    return rightTime - leftTime;
  });
}

function mergeMessagesById(messages: ConsultationMessage[], incoming: ConsultationMessage): ConsultationMessage[] {
  const next = new Map(messages.map((message) => [message.id, message]));
  next.set(incoming.id, {
    ...(next.get(incoming.id) ?? {}),
    ...incoming,
  });
  return sortMessagesNewestFirst(Array.from(next.values()));
}

export default function ConsultationDetailPage() {
  const { t } = useAppPreferences();
  const params = useParams<{ id: string }>();
  const consultationId = params.id;

  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null);

  const status = consultation?.status ?? "submitted";
  const lifecycle = getConsultationLifecycle(status);
  const messagingAllowed = canPatientUseMessages(status);
  const messageReadingAllowed = canPatientReadMessages(status);
  const shouldPollForAssignment = consultation ? lifecycle === "pending_review" && !consultation.assigned_doctor : true;

  const loadMessages = useCallback(async () => {
    if (!messageReadingAllowed) {
      setMessages([]);
      return;
    }

    const messageData = await getConsultationMessages(consultationId);
    setMessages(sortMessagesNewestFirst(messageData));
    void markConsultationMessagesRead(consultationId);
  }, [consultationId, messageReadingAllowed]);

  const loadConsultation = useCallback(async () => {
    const consultationData = await getConsultationDetail(consultationId);
    setConsultation(consultationData);
    return consultationData;
  }, [consultationId]);

  const syncConsultationState = useCallback(async () => {
    try {
      const consultationData = await loadConsultation();
      if (canPatientReadMessages(consultationData.status)) {
        await loadMessages();
      }
    } catch {
      // Fallback sync should be best-effort only.
    }
  }, [loadConsultation, loadMessages]);

  const unavailableReason = useMemo(() => {
    if (messagingAllowed) return null;
    switch (lifecycle) {
      case "pending_review": return t.patient.messagingPending;
      case "closed": return t.patient.messagingClosed;
      case "cancelled": return t.patient.messagingCancelled;
      default: return t.patient.messagingPermissionDenied;
    }
  }, [messagingAllowed, lifecycle, t.patient.messagingPending, t.patient.messagingClosed, t.patient.messagingCancelled, t.patient.messagingPermissionDenied]);

  const canConsultationBePaid = consultation
    ? ["accepted", "doctor_responded", "closed"].includes(consultation.status)
    : false;
  const showPayButton = consultation
    ? canConsultationBePaid && ["unpaid", "failed"].includes((consultation.payment_status ?? "unpaid").toLowerCase())
    : false;

  useEffect(() => {
    let active = true;

    async function loadInitialDetail() {
      setLoading(true);
      setError(null);
      setMessageError(null);

      let consultationData: ConsultationDetail | null = null;

      try {
        consultationData = await getConsultationDetail(consultationId);
        if (!active) {
          return;
        }
        setConsultation(consultationData);
      } catch (err) {
        if (active) {
          if (err instanceof ApiError && err.status === 403) {
            setError(t.patient.consultationDetailForbidden);
          } else {
            setError(t.patient.noDataDescription);
          }
          setConsultation(null);
          setMessages([]);
          setLoading(false);
        }

        return;
      }

      if (canPatientReadMessages(consultationData.status)) {
        try {
          const messageData = await getConsultationMessages(consultationId);
          if (!active) {
            return;
          }
          setMessages(sortMessagesNewestFirst(messageData));
          void markConsultationMessagesRead(consultationId);
        } catch (err) {
          if (active) {
            setMessages([]);
            if (err instanceof ApiError && err.status === 403) {
              setMessageError(t.patient.messagingPermissionDenied);
            } else {
              setMessageError(t.patient.consultationCreateError);
            }
          }
        }
      } else {
        if (active) {
          setMessages([]);
        }
      }

      if (active) {
        setLoading(false);
      }
    }

    void loadInitialDetail();

    return () => {
      active = false;
    };
  }, [
    consultationId,
    t.patient.consultationCreateError,
    t.patient.consultationDetailForbidden,
    t.patient.noDataDescription,
    t.patient.messagingPermissionDenied,
  ]);

  useEffect(() => {
    if (!shouldPollForAssignment) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      void getConsultationDetail(consultationId)
        .then((consultationData) => {
          setConsultation(consultationData);

          if (canPatientReadMessages(consultationData.status)) {
            void getConsultationMessages(consultationId)
              .then((messageData) => {
                setMessages(sortMessagesNewestFirst(messageData));
                void markConsultationMessagesRead(consultationId);
              })
              .catch(() => {
                setMessages([]);
              });
          }
        })
        .catch(() => undefined);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [consultationId, shouldPollForAssignment]);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    setMessageError(null);

    try {
      const consultationData = await getConsultationDetail(consultationId);
      setConsultation(consultationData);

      if (canPatientReadMessages(consultationData.status)) {
        try {
          const messageData = await getConsultationMessages(consultationId);
          setMessages(sortMessagesNewestFirst(messageData));
          void markConsultationMessagesRead(consultationId);
        } catch (err) {
          setMessages([]);
          if (err instanceof ApiError && err.status === 403) {
            setMessageError(t.patient.messagingPermissionDenied);
          } else {
            setMessageError(t.patient.consultationCreateError);
          }
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t.patient.consultationDetailForbidden);
      } else {
        setError(t.patient.noDataDescription);
      }
      setConsultation(null);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(body: string, attachments: File[]) {
    if (!body.trim() && attachments.length === 0) {
      return;
    }
    setMessageError(null);
    setMessageSuccess(null);
    setSending(true);
    try {
      const createdMessage = await sendConsultationMessage(consultationId, { body, attachments });
      setMessages((current) => mergeMessagesById(current, createdMessage));
      setMessageSuccess(t.patient.messageSent);
      void markConsultationMessagesRead(consultationId);
    } catch {
      setMessageError(t.patient.consultationCreateError);
    } finally {
      setSending(false);
    }
  }

  useConsultationMessagesRealtime<ConsultationMessage>({
    consultationId,
    enabled: messageReadingAllowed,
    onMessageCreated: (message) => {
      setMessages((current) => mergeMessagesById(current, message));
      setMessageError(null);
      setMessageSuccess(null);
      void markConsultationMessagesRead(consultationId);
    },
    onMessagesRead: () => {
      void loadMessages();
    },
    onConsultationUpdated: (update) => {
      setConsultation((current) => {
        if (!current || current.id !== update.id) {
          return current;
        }

        return {
          ...current,
          status: (update.status as ConsultationDetail["status"] | undefined) ?? current.status,
          accepted_at: update.accepted_at ?? current.accepted_at,
          closed_at: update.closed_at ?? current.closed_at,
          updated_at: update.updated_at ?? current.updated_at,
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

  if (error || !consultation) {
    return (
      <DashboardStateCard
        state="error"
        title={t.patient.noDataTitle}
        description={error ?? t.patient.noDataDescription}
        action={
          <>
          <Link href="/app/patient/consultations" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToConsultations}
          </Link>
          <Button onClick={() => void handleRefresh()}>{t.patient.retry}</Button>
          </>
        }
      />
    );
  }

  return (
    <PatientPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.patient.consultationDetailTitle}</Badge>}
        title={t.patient.consultationDetailTitle}
        description={t.patient.consultationDetailSubtitle}
        actions={
          <Link href="/app/patient/consultations" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToConsultations}
          </Link>
        }
      />

      <ConsultationDetailPanel consultation={consultation} />
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--card-shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--color-text)]">Consultation payment</h3>
          <PaymentStatusBadge status={consultation.payment_status} />
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Consultation fee is fixed from the acceptance snapshot and resolved by backend.
        </p>
        {showPayButton ? (
          <div className="mt-3">
            <PaymentIntentCheckout
              serviceType="consultation"
              referenceId={consultation.id}
              disabled={!showPayButton}
              onSuccess={handleRefresh}
            />
          </div>
        ) : null}
      </div>
      <ConsultationLifecycleCard status={status} />
      <ConsultationMessagesPanel
        canSend={messagingAllowed}
        unavailableReason={!messagingAllowed ? (messageError ?? unavailableReason) : null}
        messages={messages}
        sending={sending}
        error={messagingAllowed ? messageError : null}
        success={messageSuccess}
        onRefresh={() => void handleRefresh()}
        onSend={handleSend}
      />
    </PatientPageFrame>
  );
}
