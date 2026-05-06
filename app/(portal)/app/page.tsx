"use client";

import Link from "next/link";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClassName } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { portalRoles, roleMetadata } from "@/lib/roles";

export default function PortalEntryPage() {
  const { locale, t } = useAppPreferences();

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

      <EmptyState title={t.portal.roleAutoRoutingNotice} description={t.portal.previewNotice} />
    </div>
  );
}