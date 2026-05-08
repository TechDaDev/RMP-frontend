"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { DoctorConsultationWorkspace } from "@/components/doctor/DoctorConsultationWorkspace";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
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
import type { DoctorConsultationDetail, DoctorMessage, DoctorResponseRequest } from "@/types/doctor";

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadDetail();
  }, [loadDetail]);

  async function handleSendMessage(body: string) {
    await sendConsultationMessage(params.id, { body });
    await loadMessages(params.id, detail?.status ?? "submitted");
  }

  async function handleSendResponse(payload: DoctorResponseRequest) {
    await sendDoctorResponse(params.id, payload);
    await loadDetail();
  }

  async function handleCloseConsultation() {
    await closeConsultation(params.id);
    await loadDetail();
  }

  if (loading) {
    return (
      <Card className="rounded-[2rem]">
        <p className="text-sm text-[var(--color-muted)]">{t.patient.loading}</p>
      </Card>
    );
  }

  if (error || !detail) {
    return (
      <Card className="space-y-4 rounded-[2rem]">
        <EmptyState title={t.patient.noDataTitle} description={error ?? t.patient.noDataDescription} />
        <div className="flex flex-wrap justify-center gap-2">
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
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
}
