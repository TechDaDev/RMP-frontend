"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DashboardStateCard } from "@/components/dashboard/DashboardStateCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminVerifications } from "@/lib/admin/adminService";
import type { AdminVerificationListItem, AdminVerificationRole, AdminVerificationStatus } from "@/types/admin";

const VERIFICATION_ROLES: AdminVerificationRole[] = ["doctor", "pharmacist", "laboratorian"];
const VERIFICATION_STATUSES: AdminVerificationStatus[] = ["pending", "approved", "rejected", "suspended"];

function getRoleLabel(role: AdminVerificationRole, labels: typeof import("@/lib/i18n").translations.en.roles) {
  return role === "laboratorian" ? labels.laboratory : labels[role];
}

export default function AdminVerificationsPage() {
  const { t } = useAppPreferences();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifications, setVerifications] = useState<AdminVerificationListItem[]>([]);
  const [count, setCount] = useState(0);

  const [roleFilter, setRoleFilter] = useState<AdminVerificationRole | "">("");
  const [statusFilter, setStatusFilter] = useState<AdminVerificationStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getAdminVerifications({
          role: roleFilter || undefined,
          status: statusFilter || undefined,
          search: searchQuery || undefined,
          limit: 20,
          offset: (page - 1) * 20,
        });

        setVerifications(result.results);
        setCount(result.count);
      } catch {
        setError(t.admin.loadFailedDescription);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [roleFilter, statusFilter, searchQuery, page, t.admin.loadFailedDescription]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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

  return (
    <>
      <PageHeader
        title={t.admin.verificationQueue}
        description={t.admin.verificationQueueDescription}
        actions={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
      />

      <DashboardSection title={t.admin.filterByStatus}>
        <Card className="space-y-4 p-4 md:p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.admin.filterByRole}
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter((e.target.value as AdminVerificationRole) || "");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t.admin.allRoles}</option>
                  {VERIFICATION_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {getRoleLabel(role, t.roles)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.admin.filterByStatus}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter((e.target.value as AdminVerificationStatus) || "");
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">{t.admin.allStatuses}</option>
                  {VERIFICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {t.admin[`${status}Status` as keyof typeof t.admin] || status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  {t.admin.searchVerifications}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.admin.searchVerifications}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-end">
                <Button type="submit" variant="primary" className="w-full">
                  {t.admin.searchVerifications}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </DashboardSection>

      {loading && (
        <DashboardSection title={t.common.loading}>
          <DashboardStateCard
            state="loading"
            description={t.common.loading}
          />
        </DashboardSection>
      )}

      {error && (
        <DashboardSection title={t.admin.loadFailedTitle}>
          <DashboardStateCard
            state="error"
            title={t.admin.loadFailedTitle}
            description={error}
            action={<Button variant="secondary" onClick={() => window.location.reload()}>{t.common.retry}</Button>}
          />
        </DashboardSection>
      )}

      {!loading && !error && verifications.length === 0 && (
        <DashboardSection title={t.admin.noVerificationRequests}>
          <DashboardStateCard
            state="empty"
            title={t.admin.noVerificationRequests}
            description={statusFilter === "" ? t.admin.noVerificationRequests : t.admin.noVerificationRequests}
          />
        </DashboardSection>
      )}

      {!loading && !error && verifications.length > 0 && (
        <DashboardSection title={t.admin.verificationRequests}>
          <div className="space-y-4">
            {verifications.map((verification) => (
              <Link key={verification.id} href={`/app/admin/verifications/${verification.role}/${verification.id}`}>
                <Card className="p-4 md:p-6 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {verification.user?.full_name || verification.user?.email || "-"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {verification.user?.email}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge color={roleColor(verification.role)}>
                          {getRoleLabel(verification.role, t.roles)}
                        </Badge>
                        <Badge color={statusColor(verification.status)}>
                          {t.admin[`${verification.status}Status` as keyof typeof t.admin] ||
                            verification.status}
                        </Badge>
                      </div>
                    </div>

                    {verification.profile && (
                      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        {verification.profile.license_number && (
                          <div>
                            <span className="text-muted-foreground">{t.admin.verificationProfile}:</span>
                            <span className="ml-2 text-foreground">{verification.profile.license_number}</span>
                          </div>
                        )}
                        {verification.profile.specialty && (
                          <div>
                            <span className="text-muted-foreground">{t.patient.specialty}:</span>
                            <span className="ml-2 text-foreground">{verification.profile.specialty}</span>
                          </div>
                        )}
                        {verification.profile.workplace_name && (
                          <div>
                            <span className="text-muted-foreground">{t.profile.workplace}:</span>
                            <span className="ml-2 text-foreground">{verification.profile.workplace_name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {verification.submitted_at && (
                      <p className="text-xs text-muted-foreground">
                        {t.admin.verificationMetadata}: {new Date(verification.submitted_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {count > 20 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                {t.common.backToHome}
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(count / 20)}
              </span>
              <Button
                variant="secondary"
                disabled={page >= Math.ceil(count / 20)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </DashboardSection>
      )}
    </>
  );
}
