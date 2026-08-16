import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiUrl } from "../lib/apiBase";

type AdminAuthValue = {
  authenticated: boolean | null;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin-me"), { credentials: "include" });
      const json = await res.json();
      setAuthenticated(Boolean(json?.authenticated));
      setEmail(json?.email ?? null);
    } catch {
      setAuthenticated(false);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const login = useCallback(async (loginEmail: string, password: string) => {
    const res = await fetch(apiUrl("/api/admin-login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.error || "Invalid credentials");
    }
    setAuthenticated(true);
    setEmail(loginEmail);
  }, []);

  const logout = useCallback(async () => {
    await fetch(apiUrl("/api/admin-logout"), { method: "POST", credentials: "include" });
    setAuthenticated(false);
    setEmail(null);
  }, []);

  const value = useMemo(
    () => ({ authenticated, email, loading, login, logout }),
    [authenticated, email, loading, login, logout],
  );

  return createElement(AdminAuthContext.Provider, { value }, children);
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
