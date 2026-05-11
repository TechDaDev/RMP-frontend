"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  hasAdminAccessService,
  loginService,
  logoutService,
  getCurrentProfileService,
} from "@/lib/auth/authService";
import { getAccessToken, clearTokens } from "@/lib/auth/tokenStorage";
import type {
  BackendUser,
  ProfileCompletion,
  ProfileVerification,
  ProfilesMeResponse,
} from "@/types/backend";
import type { LoginRequest } from "@/types/backend";
import { ApiError } from "@/lib/api/errors";

interface AuthState {
  user: BackendUser | null;
  profile: ProfilesMeResponse | null;
  completion: ProfileCompletion | null;
  verification: ProfileVerification | null;
  adminAccess: boolean;
  /** true while the initial token check is running */
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  /** Reload user + profile from the server */
  refresh: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileStateAfterSave: (updatedProfile: ProfilesMeResponse) => void;
  isAuthenticated: boolean;
  effectiveRole: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    completion: null,
    verification: null,
    adminAccess: false,
    loading: true,
  });

  const loadProfile = useCallback(async () => {
    try {
      const [profile, adminAccess] = await Promise.all([
        getCurrentProfileService(),
        hasAdminAccessService(),
      ]);

      setState({
        user: profile.user,
        profile,
        completion: profile.completion,
        verification: profile.verification,
        adminAccess,
        loading: false,
      });
    } catch (err) {
      // If the stored token is invalid/expired, purge it immediately so
      // subsequent page loads don't re-attempt and get stuck.
      if (err instanceof ApiError && err.status === 401) {
        clearTokens();
      }
      setState({
        user: null,
        profile: null,
        completion: null,
        verification: null,
        adminAccess: false,
        loading: false,
      });
    }
  }, []);

  const updateProfileStateAfterSave = useCallback((updatedProfile: ProfilesMeResponse) => {
    setState((prev) => ({
      ...prev,
      user: updatedProfile.user,
      profile: updatedProfile,
      completion: updatedProfile.completion,
      verification: updatedProfile.verification,
    }));
  }, []);

  const bootstrapped = useRef(false);

  // On mount, check if we already have a stored token and load the user.
  // The eslint rule is suppressed here because this is an intentional
  // async initialization pattern, not a sync setState call.
  // The bootstrapped ref guards against React StrictMode's double-invoke
  // in development, which would otherwise fire two profile fetches.
  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    if (getAccessToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadProfile();
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [loadProfile]);

  const login = useCallback(async (credentials: LoginRequest) => {
    await loginService(credentials);
    await loadProfile();
  }, [loadProfile]);

  const logout = useCallback(() => {
    logoutService();
    setState({
      user: null,
      profile: null,
      completion: null,
      verification: null,
      adminAccess: false,
      loading: false,
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh: loadProfile,
      refreshProfile: loadProfile,
      updateProfileStateAfterSave,
      isAuthenticated: state.user !== null,
      effectiveRole: state.adminAccess ? "admin" : state.user?.user_type ?? null,
    }),
    [state, login, logout, loadProfile, updateProfileStateAfterSave],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
