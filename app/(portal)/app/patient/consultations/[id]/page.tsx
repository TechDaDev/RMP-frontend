"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ConsultationDetailPanel } from "@/components/patient/ConsultationDetailPanel";
import { ConsultationLifecycleCard } from "@/components/patient/ConsultationLifecycleCard";
import { ConsultationMessagesPanel } from "@/components/patient/ConsultationMessagesPanel";
import { PatientPageFrame } from "@/components/patient/ui/PatientPageFrame";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { canPatientUseMessages, getConsultationLifecycle } from "@/lib/patient/consultationStatus";
import {
  getConsultationDetail,
  getConsultationMessages,
  markConsultationMessagesRead,
  sendConsultationMessage,
} from "@/lib/patient/patientService";
import type { ConsultationDetail, ConsultationMessage } from "@/types/patient";

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

  const unavailableReason = useMemo(() => {
    if (messagingAllowed) return null;
    switch (lifecycle) {
      case "pending_review": return t.patient.messagingPending;
      case "closed": return t.patient.messagingClosed;
      case "cancelled": return t.patient.messagingCancelled;
      default: return t.patient.messagingPermissionDenied;
    }
  }, [messagingAllowed, lifecycle, t.patient.messagingPending, t.patient.messagingClosed, t.patient.messagingCancelled, t.patient.messagingPermissionDenied]);

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

      if (canPatientUseMessages(consultationData.status)) {
        try {
          const messageData = await getConsultationMessages(consultationId);
          if (!active) {
            return;
          }
          setMessages(messageData);
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

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    setMessageError(null);

    try {
      const consultationData = await getConsultationDetail(consultationId);
      setConsultation(consultationData);

      if (canPatientUseMessages(consultationData.status)) {
        try {
          const messageData = await getConsultationMessages(consultationId);
          setMessages(messageData);
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

  async function handleSend(body: string) {
    if (!body.trim()) {
      return;
    }
    setMessageError(null);
    setMessageSuccess(null);
    setSending(true);
    try {
      await sendConsultationMessage(consultationId, { body });
      setMessageSuccess(t.patient.messageSent);
      const nextMessages = await getConsultationMessages(consultationId);
      setMessages(nextMessages);
      void markConsultationMessagesRead(consultationId);
    } catch {
      setMessageError(t.patient.consultationCreateError);
    } finally {
      setSending(false);
    }
  }

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
