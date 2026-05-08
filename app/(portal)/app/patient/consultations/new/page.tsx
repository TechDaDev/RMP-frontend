"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { ConsultationForm } from "@/components/patient/ConsultationForm";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import {
  createConsultation,
  getSymptomCategories,
  getSymptoms,
} from "@/lib/patient/patientService";
import type {
  ConsultationCreateRequest,
  Symptom,
  SymptomCategory,
} from "@/types/patient";

export default function NewConsultationPage() {
  const { t } = useAppPreferences();
  const router = useRouter();

  const [categories, setCategories] = useState<SymptomCategory[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unavailable = useMemo(
    () => !loadingSymptoms && symptoms.length === 0,
    [loadingSymptoms, symptoms.length],
  );

  useEffect(() => {
    let active = true;

    async function loadInitial() {
      setLoadingSymptoms(true);
      setError(null);

      try {
        const [loadedCategories, loadedSymptoms] = await Promise.all([
          getSymptomCategories(),
          getSymptoms(),
        ]);

        if (!active) {
          return;
        }

        setCategories(loadedCategories);
        setSymptoms(loadedSymptoms);
      } catch {
        if (active) {
          setError(t.patient.consultationCreateError);
        }
      } finally {
        if (active) {
          setLoadingSymptoms(false);
        }
      }
    }

    void loadInitial();

    return () => {
      active = false;
    };
  }, [t.patient.consultationCreateError]);

  async function handleSubmit(payload: ConsultationCreateRequest) {
    setSubmitting(true);
    setError(null);

    try {
      const consultation = await createConsultation(payload);
      if (consultation.id) {
        router.replace(`/app/patient/consultations/${consultation.id}`);
        return;
      }
      router.replace("/app/patient/consultations");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || t.patient.consultationCreateError);
      } else {
        setError(t.patient.consultationCreateError);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.patient.consultationNewTitle}</Badge>}
        title={t.patient.consultationNewTitle}
        description={t.patient.consultationNewSubtitle}
      />

      {unavailable ? (
        <EmptyState
          title={t.patient.consultationCreateUnavailableTitle}
          description={t.patient.consultationCreateUnavailableDescription}
        />
      ) : (
        <ConsultationForm
          categories={categories}
          symptoms={symptoms}
          loadingSymptoms={loadingSymptoms}
          submitting={submitting}
          error={error}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}