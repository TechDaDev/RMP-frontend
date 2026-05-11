"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  approveAdminVerification,
  getAdminVerificationDetail,
  rejectAdminVerification,
  suspendAdminVerification,
} from "@/lib/admin/adminService";
import type {
  AdminVerificationDetail,
  AdminVerificationRejectRequest,
  AdminVerificationRole,
  AdminVerificationStatus,
  AdminVerificationSuspendRequest,
} from "@/types/admin";

function getRoleLabel(role: AdminVerificationRole, labels: typeof import("@/lib/i18n").translations.en.roles) {
  return role === "laboratorian" ? labels.laboratory : labels[role];
}

export default function AdminVerificationDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ role: string; id: string }>;
}) {
  const router = useRouter();
  const { t } = useAppPreferences();
  const [params, setParams] = useState<{ role: string; id: string } | null>(null);

  useEffect(() => {
    void paramsPromise.then(setParams);
  }, [paramsPromise]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<AdminVerificationDetail | null>(null);

  const [approving, setApproving] = useState(false);
  const [approveNote, setApproveNote] = useState("");

  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState<string | null>(null);

  const [suspending, setSuspending] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendError, setSuspendError] = useState<string | null>(null);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!params) return;

    let cancelled = false;

    async function loadDetail() {
      if (!params) return;
      
      setLoading(true);
      setError(null);

      try {
        const detail = await getAdminVerificationDetail(params.role, params.id);
        if (!cancelled) {
          setVerification(detail);
        }
      } catch {
        if (!cancelled) {
          setError(t.admin.loadFailedDescription);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [params, t.admin.loadFailedDescription]);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params || !verification) return;

    setApproving(true);

    try {
      const updated = await approveAdminVerification(params.role, params.id, {
        note: approveNote || undefined,
      });
      setVerification(updated);
      setApproveNote("");
      setActionSuccess(t.admin.verificationDecisionSucceeded);
    } catch {
      setActionSuccess(null);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params || !verification) return;

    if (!rejectReason.trim()) {
      setRejectError(t.admin.decisionReasonRequired);
      return;
    }

    setRejecting(true);
    setRejectError(null);

    try {
      const payload: AdminVerificationRejectRequest = { reason: rejectReason };
      const updated = await rejectAdminVerification(params.role, params.id, payload);
      setVerification(updated);
      setRejectReason("");
      setActionSuccess(t.admin.verificationDecisionSucceeded);
    } catch {
      setRejectError(t.admin.verificationDecisionFailed);
      setActionSuccess(null);
    } finally {
      setRejecting(false);
    }
  };

  const handleSuspend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params || !verification) return;

    if (!suspendReason.trim()) {
      setSuspendError(t.admin.decisionReasonRequired);
      return;
    }

    setSuspending(true);
    setSuspendError(null);

    try {
      const payload: AdminVerificationSuspendRequest = { reason: suspendReason };
      const updated = await suspendAdminVerification(params.role, params.id, payload);
      setVerification(updated);
      setSuspendReason("");
      setActionSuccess(t.admin.verificationDecisionSucceeded);
    } catch {
      setSuspendError(t.admin.verificationDecisionFailed);
      setActionSuccess(null);
    } finally {
      setSuspending(false);
    }
  };

  const statusColor = (status: AdminVerificationStatus) => {
    switch (status) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
      case "suspended":
        return "danger";
      default:
        return "default";
    }
  };

  const roleColor = (role: AdminVerificationRole) => {
    switch (role) {
      case "doctor":
        return "info";
      case "pharmacist":
        return "success";
      case "laboratorian":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title={t.admin.verificationDetail}
          description={t.admin.verificationDetailDescription}
        />
        <DashboardSection title={t.common.loading}>
          <DashboardStateCard state="loading" description={t.common.loading} />
        </DashboardSection>
      </>
    );
  }

  if (error || !verification) {
    return (
      <>
        <PageHeader
          title={t.admin.verificationDetail}
          description={t.admin.verificationDetailDescription}
        />
        <DashboardSection title={t.admin.loadFailedTitle}>
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error || t.admin.loadFailedDescription}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        </DashboardSection>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={verification.user?.full_name || verification.user?.email || "-"}
        description={t.admin.verificationDetailDescription}
        actions={<Button variant="secondary" onClick={() => router.push("/app/admin/verifications")}>{t.admin.backToVerificationQueue}</Button>}
      />

      {actionSuccess && (
        <DashboardSection title={t.common.success}>
          <Card className="border-l-4 border-green-500 bg-green-50 dark:bg-green-950 p-4">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">{actionSuccess}</p>
          </Card>
        </DashboardSection>
      )}

      <DashboardSection title={t.admin.verificationSummary}>
        <Card className="space-y-6 p-4 md:p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-muted-foreground">{t.admin.verificationRole}</label>
                <Badge color={roleColor(verification.role)} className="mt-2">
                  {getRoleLabel(verification.role, t.roles)}
                </Badge>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">{t.admin.verificationStatus}</label>
                <Badge color={statusColor(verification.status)} className="mt-2">
                  {t.admin[`${verification.status}Status` as keyof typeof t.admin] || verification.status}
                </Badge>
              </div>
            </div>
          </div>

          {verification.user && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-foreground">{t.admin.verificationUser}</h3>
              <div className="space-y-3">
                {verification.user.full_name && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.auth.nameLabel}</label>
                    <p className="text-foreground">{verification.user.full_name}</p>
                  </div>
                )}
                {verification.user.email && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.auth.emailLabel}</label>
                    <p className="text-foreground">{verification.user.email}</p>
                  </div>
                )}
                {verification.user.date_joined && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.patient.createdAt}</label>
                    <p className="text-foreground">{new Date(verification.user.date_joined).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {verification.profile && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-foreground">{t.admin.verificationProfile}</h3>
              <div className="space-y-3">
                {verification.profile.license_number && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.profile.licenseNumber}</label>
                    <p className="text-foreground">{verification.profile.license_number}</p>
                  </div>
                )}
                {verification.profile.specialty && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.patient.specialty}</label>
                    <p className="text-foreground">{verification.profile.specialty}</p>
                  </div>
                )}
                {verification.profile.workplace_name && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.profile.workplace}</label>
                    <p className="text-foreground">{verification.profile.workplace_name}</p>
                  </div>
                )}
                {verification.profile.phone_number && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.profile.phone}</label>
                    <p className="text-foreground">{verification.profile.phone_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {verification.verified_at && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-foreground">{t.admin.verificationMetadata}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">{t.patient.verifiedAt}</label>
                  <p className="text-foreground">{new Date(verification.verified_at).toLocaleString()}</p>
                </div>
                {verification.verified_by && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.patient.verifiedBy}</label>
                    <p className="text-foreground">
                      {verification.verified_by.full_name || verification.verified_by.email || "-"}
                    </p>
                  </div>
                )}
                {verification.verification_notes && (
                  <div>
                    <label className="text-sm text-muted-foreground">{t.admin.approvalReason}</label>
                    <p className="text-foreground">{verification.verification_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      </DashboardSection>

      {verification.status === "pending" && (
        <DashboardSection title={t.admin.verificationActions}>
          <div className="space-y-6">
            <Card className="space-y-4 p-4 md:p-6">
              <h3 className="font-semibold text-foreground">{t.admin.approveVerification}</h3>
              <form onSubmit={handleApprove} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">{t.admin.approveVerification}</label>
                  <textarea
                    value={approveNote}
                    onChange={(e) => setApproveNote(e.target.value)}
                    placeholder={t.admin.approveVerification}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button type="submit" variant="primary" disabled={approving}>
                  {approving ? t.common.loading : t.admin.approveVerification}
                </Button>
              </form>
            </Card>

            <Card className="space-y-4 p-4 md:p-6">
              <h3 className="font-semibold text-foreground">{t.admin.rejectVerification}</h3>
              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t.admin.rejectionReason} *
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder={t.admin.rejectionReason}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {rejectError && <p className="text-sm text-red-500 mt-2">{rejectError}</p>}
                </div>
                <Button type="submit" variant="secondary" disabled={rejecting}>
                  {rejecting ? t.common.loading : t.admin.rejectVerification}
                </Button>
              </form>
            </Card>

            <Card className="space-y-4 p-4 md:p-6">
              <h3 className="font-semibold text-foreground">{t.admin.suspendVerification}</h3>
              <form onSubmit={handleSuspend} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t.admin.suspensionReason} *
                  </label>
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    placeholder={t.admin.suspensionReason}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {suspendError && <p className="text-sm text-red-500 mt-2">{suspendError}</p>}
                </div>
                <Button type="submit" variant="secondary" disabled={suspending}>
                  {suspending ? t.common.loading : t.admin.suspendVerification}
                </Button>
              </form>
            </Card>
          </div>
        </DashboardSection>
      )}

      {verification.status !== "pending" && (
        <DashboardSection title={t.admin.verificationActions}>
          <Card className="p-4 md:p-6">
            <p className="text-sm text-muted-foreground">
              {t.admin.verificationMetadata}: {verification.status}. {t.admin.noMoreActionsAvailable}
            </p>
          </Card>
        </DashboardSection>
      )}
    </>
  );
}
