import { Badge } from "@/components/ui/Badge";
import { useAppPreferences } from "@/components/AppPreferencesProvider";

interface ProfileSaveStatusProps {
  saving: boolean;
  successMessage?: string | null;
  errorMessage?: string | null;
}

export function ProfileSaveStatus({
  saving,
  successMessage,
  errorMessage,
}: ProfileSaveStatusProps) {
  const { t } = useAppPreferences();

  if (saving) {
    return <Badge tone="primary">{t.profile.saving}</Badge>;
  }

  if (successMessage) {
    return <Badge tone="success">{successMessage}</Badge>;
  }

  if (errorMessage) {
    return <Badge tone="neutral">{errorMessage}</Badge>;
  }

  return null;
}
