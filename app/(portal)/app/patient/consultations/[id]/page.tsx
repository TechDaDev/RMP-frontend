"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ConsultationDetailPanel } from "@/components/patient/ConsultationDetailPanel";
import { ConsultationMessagesPanel } from "@/components/patient/ConsultationMessagesPanel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
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

  const status = useMemo(() => consultation?.status ?? "submitted", [consultation?.status]);

  useEffect(() => {
    let active = true;

    async function loadInitialDetail() {
      setLoading(true);
      setError(null);
      setMessageError(null);

      try {
        const consultationData = await getConsultationDetail(consultationId);
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

      try {
        const messageData = await getConsultationMessages(consultationId);
        if (!active) {
          return;
        }
        setMessages(messageData);
        await markConsultationMessagesRead(consultationId);
      } catch (err) {
        if (active) {
          setMessages([]);
          if (!(err instanceof ApiError && err.status === 403)) {
            setMessageError(t.patient.consultationCreateError);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
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
  ]);

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    setMessageError(null);

    try {
      const consultationData = await getConsultationDetail(consultationId);
      setConsultation(consultationData);

      try {
        const messageData = await getConsultationMessages(consultationId);
        setMessages(messageData);
        await markConsultationMessagesRead(consultationId);
      } catch (err) {
        setMessages([]);
        if (!(err instanceof ApiError && err.status === 403)) {
          setMessageError(t.patient.consultationCreateError);
        }
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
      await markConsultationMessagesRead(consultationId);
    } catch {
      setMessageError(t.patient.consultationCreateError);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !consultation) {
    return (
      <Card className="space-y-5 rounded-[2rem]">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/app/patient/consultations" className={buttonClassName({ variant: "secondary" })}>
            {t.patient.backToConsultations}
          </Link>
          <Button onClick={() => void handleRefresh()}>{t.patient.retry}</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.consultationDetailTitle}</Badge>}
        title={t.patient.consultationDetailTitle}
        description={t.patient.consultationDetailSubtitle}
      />

      <ConsultationDetailPanel consultation={consultation} />
      <ConsultationMessagesPanel
        status={status}
        messages={messages}
        sending={sending}
        error={messageError}
        success={messageSuccess}
        onRefresh={() => void handleRefresh()}
        onSend={handleSend}
      />
    </div>
  );
}