"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { FileTextIcon, LabIcon, MessageIcon, PrescriptionIcon } from "@/components/icons";
import { PatientSummaryCards } from "@/components/patient/PatientSummaryCards";
import { PatientWorkflowCard } from "@/components/patient/PatientWorkflowCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfilePromptCard } from "@/components/profile/ProfilePromptCard";
import { getPatientDashboardSummary } from "@/lib/patient/patientService";
import type { PatientDashboardSummary } from "@/types/patient";

export default function PatientPortalPage() {
  const { t } = useAppPreferences();
  const { user } = useAuth();
  const [summary, setSummary] = useState<PatientDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadInitialSummary() {
      try {
        const data = await getPatientDashboardSummary();
        if (active) {
          setSummary(data);
          setError(null);
        }
      } catch {
        if (active) {
          setError(t.patient.dashboardErrorDescription);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialSummary();

    return () => {
      active = false;
    };
  }, [t.patient.dashboardErrorDescription]);

  async function handleRetry() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatientDashboardSummary();
      setSummary(data);
    } catch {
      setError(t.patient.dashboardErrorDescription);
    } finally {
      setLoading(false);
    }
  }

  const workflows = [
    {
      title: t.patient.requestConsultation,
      description: t.patient.consultationNewSubtitle,
      href: "/app/patient/consultations/new",
      ctaLabel: t.patient.requestConsultation,
      icon: <MessageIcon size={20} />,
    },
    {
      title: t.patient.viewConsultations,
      description: t.patient.consultationsSubtitle,
      href: "/app/patient/consultations",
      ctaLabel: t.patient.viewConsultations,
      icon: <MessageIcon size={20} />,
    },
    {
      title: t.patient.viewPrescriptions,
      description: t.patient.prescriptionsSubtitle,
      href: "/app/patient/prescriptions",
      ctaLabel: t.patient.viewPrescriptions,
      icon: <PrescriptionIcon size={20} />,
    },
    {
      title: t.patient.viewLabOrders,
      description: t.patient.labOrdersSubtitle,
      href: "/app/patient/lab-orders",
      ctaLabel: t.patient.viewLabOrders,
      icon: <LabIcon size={20} />,
    },
    {
      title: t.patient.viewLabResults,
      description: t.patient.labResultsSubtitle,
      href: "/app/patient/lab-results",
      ctaLabel: t.patient.viewLabResults,
      icon: <LabIcon size={20} />,
    },
    {
      title: t.patient.viewMedicalRecord,
      description: t.patient.medicalRecordSubtitle,
      href: "/app/patient/medical-record",
      ctaLabel: t.patient.viewMedicalRecord,
      icon: <FileTextIcon size={20} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.roles.patient}</Badge>}
        title={t.patient.dashboardTitle}
        description={t.patient.dashboardSubtitle}
      />

      <Card>
        <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.welcomeTitle}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{t.patient.welcomeDescription}</p>
        {user ? (
          <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{user.full_name ?? `${user.first_name} ${user.last_name}`.trim()}</p>
        ) : null}
      </Card>

      <ProfilePromptCard />

      <DashboardSection title={t.patient.dashboardTitle} description={t.patient.dashboardSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error || !summary ? (
          <DashboardStateCard
            state="error"
            title={t.patient.dashboardErrorTitle}
            description={error ?? t.patient.noDataDescription}
            action={<Button variant="secondary" onClick={() => void handleRetry()}>{t.patient.retry}</Button>}
          />
        ) : (
          <PatientSummaryCards summary={summary} />
        )}
      </DashboardSection>

      <DashboardSection title={t.patient.quickActionsTitle} description={t.patient.quickActionsSubtitle}>
        <DashboardGrid columns="three">
          {workflows.map((workflow) => (
            <PatientWorkflowCard key={workflow.href} {...workflow} />
          ))}
        </DashboardGrid>
      </DashboardSection>
    </div>
  );
}
