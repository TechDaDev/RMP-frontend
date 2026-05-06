"use client";

import { AppPreferencesProvider } from "@/components/AppPreferencesProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppPreferencesProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppPreferencesProvider>
  );
}