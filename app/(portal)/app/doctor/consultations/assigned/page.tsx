"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { DoctorConsultationList } from "@/components/doctor/DoctorConsultationList";
import { DoctorQueueTabs } from "@/components/doctor/DoctorQueueTabs";
import { DoctorVerificationNotice } from "@/components/doctor/DoctorVerificationNotice";
import { DoctorPageFrame } from "@/components/doctor/ui/DoctorPageFrame";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { ApiError } from "@/lib/api/errors";
import { getAssignedConsultations } from "@/lib/doctor/doctorService";
import { useAuth } from "@/components/auth/AuthProvider";
import type { DoctorConsultationListItem } from "@/types/doctor";

const FILTERS = ["all", "accepted", "doctor_responded", "closed"] as const;
type StatusFilter = (typeof FILTERS)[number];

export default function DoctorAssignedConsultationsPage() {
  const { t, locale } = useAppPreferences();
  const { verification } = useAuth();
  const [consultations, setConsultations] = useState<DoctorConsultationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("all");

  const isApproved = verification?.is_approved === true;

  const loadAssigned = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAssignedConsultations();
      setConsultations(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t.doctor.verifiedDoctorRequiredDescription);
      } else {
        setError(t.patient.noDataDescription);
      }
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [t.doctor.verifiedDoctorRequiredDescription, t.patient.noDataDescription]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAssigned();
  }, [loadAssigned]);

  const filteredConsultations = useMemo(() => {
    if (filter === "all") {
      return consultations;
    }

    return consultations.filter((consultation) => consultation.status === filter);
  }, [consultations, filter]);

  return (
    <DoctorPageFrame>
      <PageHeader
        badge={<Badge tone="primary">{t.roles.doctor}</Badge>}
        title={t.doctor.assignedConsultations}
        description={t.doctor.assignedConsultationsSubtitle}
        actions={
          <Button variant="secondary" onClick={() => void loadAssigned()}>
            {t.patient.retry}
          </Button>
        }
      />

      <DoctorQueueTabs
        active="assigned"
        pendingHref="/app/doctor/consultations/pending"
        assignedHref="/app/doctor/consultations/assigned"
        pendingLabel={t.doctor.pendingConsultations}
        assignedLabel={t.doctor.assignedConsultations}
      />

      <DoctorVerificationNotice
        verification={verification}
        requiredLabel={t.doctor.verifiedDoctorRequired}
        requiredDescription={t.doctor.verifiedDoctorRequiredDescription}
        disabledLabel={t.doctor.doctorNotApprovedActionDisabled}
      />

      <Card>
        <p className="text-sm font-semibold text-[var(--color-text)]">{t.doctor.assignedConsultations}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {FILTERS.map((item) => {
            const label = item === "all"
              ? (locale === "ar" ? "الكل" : locale === "ku" ? "هەموو" : "All")
              : t.doctor[
                  item === "accepted"
                    ? "statusAccepted"
                    : item === "doctor_responded"
                      ? "statusDoctorResponded"
                      : "statusClosed"
                ];

            return (
              <Button
                key={item}
                variant={filter === item ? "primary" : "secondary"}
                onClick={() => setFilter(item)}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </Card>

      <DashboardSection title={t.doctor.assignedConsultations} description={t.doctor.assignedConsultationsSubtitle}>
        {loading ? (
          <DashboardStateCard state="loading" description={t.patient.loading} />
        ) : error ? (
          <DashboardStateCard state="error" title={t.patient.noDataTitle} description={error} />
        ) : (
          <DoctorConsultationList
            consultations={filteredConsultations}
            emptyTitle={t.doctor.noAssignedConsultations}
            emptyDescription={t.doctor.noAssignedConsultations}
            isApproved={isApproved}
          />
        )}
      </DashboardSection>
    </DoctorPageFrame>
  );
}
