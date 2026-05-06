"use client";

import { AppPreferencesProvider } from "@/components/AppPreferencesProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <AppPreferencesProvider>{children}</AppPreferencesProvider>;
}