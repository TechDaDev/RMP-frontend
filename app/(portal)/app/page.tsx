"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { buttonClassName } from "@/components/ui/Button";
import { portalRoles, roleMetadata } from "@/lib/roles";
import Link from "next/link";

const roleRouteMap: Record<string, string> = {
  patient: "/app/patient",
  doctor: "/app/doctor",
  pharmacist: "/app/pharmacist",
  laboratorian: "/app/lab",
};

export default function PortalEntryPage() {
  const { locale, t } = useAppPreferences();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const route = roleRouteMap[user.user_type];
      if (route) {
        router.replace(route);
      }
    }
  }, [user, router]);

  // Show role cards as fallback (staff / admin or unknown role)
  return (
    <div className="space-y-6">
      <PageHeader
        badge={<Badge tone="primary">{t.portal.chooseRole}</Badge>}
        title={t.portal.entryTitle}
        description={t.portal.entrySubtitle}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {portalRoles.map((role) => {
          const meta = roleMetadata[role];
          return (
            <Card key={role} hoverable className="flex h-full flex-col gap-4 rounded-[2rem]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-[var(--color-text)]">{meta.labels[locale]}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{meta.description[locale]}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-primary)]">
                  <meta.Icon size={20} />
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <Badge tone="success">{t.common.previewBadge}</Badge>
                <Link href={meta.defaultRoute} className={buttonClassName({ variant: "secondary" })}>
                  {t.common.viewPreview}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}