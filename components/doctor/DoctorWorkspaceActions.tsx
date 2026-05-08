"use client";

import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function DoctorWorkspaceActions() {
  const { t } = useAppPreferences();

  return (
    <Card className="space-y-3">
      <h3 className="text-base font-semibold text-[var(--color-text)]">{t.doctor.workspaceActions}</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled>
          {t.doctor.prescriptionPhaseComing}
        </Button>
        <Button variant="secondary" disabled>
          {t.doctor.labOrderPhaseComing}
        </Button>
      </div>
    </Card>
  );
}
