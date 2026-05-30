"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { FileTextIcon, LabIcon, MessageIcon, PrescriptionIcon } from "@/components/icons";
import { PatientSummaryCards } from "@/components/patient/PatientSummaryCards";
import { PatientWorkflowCard } from "@/components/patient/PatientWorkflowCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProfilePromptCard } from "@/components/profile/ProfilePromptCard";
import { getPatientDashboardSummary } from "@/lib/patient/patientService";
import { getWallet } from "@/lib/payments/paymentsService";
import type { PatientDashboardSummary } from "@/types/patient";
import type { Wallet } from "@/types/payments";

export default function PatientPortalPage() {
  const { t } = useAppPreferences();
  const { user } = useAuth();
  const [summary, setSummary] = useState<PatientDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);

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

  useEffect(() => {
    let active = true;

    async function loadWallet() {
      setWalletLoading(true);
      try {
        const data = await getWallet();
        if (active) {
          setWallet(data);
        }
      } catch {
        if (active) {
          setWallet(null);
        }
      } finally {
        if (active) {
          setWalletLoading(false);
        }
      }
    }

    void loadWallet();

    return () => {
      active = false;
    };
  }, []);

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
      title: t.patient.labServiceRequestsTitle,
      description: t.patient.labServiceRequestsSubtitle,
      href: "/app/patient/lab-requests",
      ctaLabel: t.patient.viewLabServiceRequests,
      icon: <LabIcon size={20} />,
    },
    {
      title: t.patient.pharmacyServiceRequestsTitle,
      description: t.patient.pharmacyServiceRequestsSubtitle,
      href: "/app/patient/pharmacy-requests",
      ctaLabel: t.patient.viewPharmacyServiceRequests,
      icon: <PrescriptionIcon size={20} />,
    },
    {
      title: t.patient.walletTitle,
      description: t.patient.walletSubtitle,
      href: "/app/patient/wallet",
      ctaLabel: t.patient.openWallet,
      icon: <FileTextIcon size={20} />,
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
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-text)]">{t.patient.welcomeTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{t.patient.welcomeDescription}</p>
            {user ? (
              <p className="mt-3 text-sm font-semibold text-[var(--color-text)]">{user.full_name ?? `${user.first_name} ${user.last_name}`.trim()}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-4 min-w-[220px]">
            <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{t.patient.walletBalanceTitle}</p>
            {walletLoading ? (
              <p className="mt-2 text-sm text-[var(--color-muted)]">{t.patient.walletBalanceLoading}</p>
            ) : (
              <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
                <PriceDisplay amount={wallet?.cached_balance ?? "0"} currency={wallet?.currency} />
              </p>
            )}
            <Link href="/app/patient/wallet" className="mt-2 inline-block text-sm text-primary underline">
              {t.patient.openWallet}
            </Link>
          </div>
        </div>
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
