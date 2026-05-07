"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ConsultationDetailPanel } from "@/components/patient/ConsultationDetailPanel";
import { ConsultationMessagesPanel } from "@/components/patient/ConsultationMessagesPanel";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
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
      try {
        const [consultationData, messageData] = await Promise.all([
          getConsultationDetail(consultationId),
          getConsultationMessages(consultationId),
        ]);
        if (!active) {
          return;
        }
        setConsultation(consultationData);
        setMessages(messageData);
        setError(null);
        await markConsultationMessagesRead(consultationId);
      } catch {
        if (active) {
          setError(t.patient.noDataDescription);
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
  }, [consultationId, t.patient.noDataDescription]);

  async function handleRefresh() {
    setLoading(true);
    setError(null);

    try {
      const [consultationData, messageData] = await Promise.all([
        getConsultationDetail(consultationId),
        getConsultationMessages(consultationId),
      ]);
      setConsultation(consultationData);
      setMessages(messageData);
      await markConsultationMessagesRead(consultationId);
    } catch {
      setError(t.patient.noDataDescription);
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
    return <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />;
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