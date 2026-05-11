import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../lib/auth-storage";
import { fetchCurrentUser, login, logout, register } from "../lib/study-api";
import { getApiErrorMessage } from "../lib/api-client";
import type { AuthUser } from "../types/domain";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  authError: string | null;
  loginUser: (input: LoginInput) => Promise<void>;
  registerUser: (input: RegisterInput) => Promise<void>;
  logoutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);

  const hydrateUser = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    try {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
      setStatus("authenticated");
    } catch {
      clearAuthToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  const loginUser = useCallback(async (input: LoginInput) => {
    setAuthError(null);
    try {
      const payload = await login(input);
      setAuthToken(payload.token);
      setUser(payload.user);
      setStatus("authenticated");
    } catch (error) {
      setStatus("unauthenticated");
      setAuthError(getApiErrorMessage(error));
      throw error;
    }
  }, []);

  const registerUser = useCallback(async (input: RegisterInput) => {
    setAuthError(null);
    try {
      const payload = await register({
        name: input.name,
        email: input.email,
        password: input.password,
        password_confirmation: input.passwordConfirmation,
      });
      setAuthToken(payload.token);
      setUser(payload.user);
      setStatus("authenticated");
    } catch (error) {
      setStatus("unauthenticated");
      setAuthError(getApiErrorMessage(error));
      throw error;
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Keep logout resilient even if backend is unreachable.
    } finally {
      clearAuthToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      authError,
      loginUser,
      registerUser,
      logoutUser,
      clearAuthError,
    }),
    [authError, clearAuthError, loginUser, logoutUser, registerUser, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

