"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginService,
  logoutService,
  getCurrentProfileService,
} from "@/lib/auth/authService";
import { getAccessToken, clearTokens } from "@/lib/auth/tokenStorage";
import type { BackendUser, ProfileVerification } from "@/types/backend";
import type { LoginRequest } from "@/types/backend";
import { ApiError } from "@/lib/api/errors";

interface AuthState {
  user: BackendUser | null;
  verification: ProfileVerification | null;
  /** true while the initial token check is running */
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  /** Reload user + profile from the server */
  refresh: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    verification: null,
    loading: true,
  });

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getCurrentProfileService();
      setState({
        user: profile.user,
        verification: profile.verification,
        loading: false,
      });
    } catch (err) {
      // If the stored token is invalid/expired, purge it immediately so
      // subsequent page loads don't re-attempt and get stuck.
      if (err instanceof ApiError && err.status === 401) {
        clearTokens();
      }
      setState({ user: null, verification: null, loading: false });
    }
  }, []);

  // On mount, check if we already have a stored token and load the user.
  // The eslint rule is suppressed here because this is an intentional
  // async initialization pattern, not a sync setState call.
  useEffect(() => {
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
    setState({ user: null, verification: null, loading: false });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      refresh: loadProfile,
      isAuthenticated: state.user !== null,
    }),
    [state, login, logout, loadProfile],
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
