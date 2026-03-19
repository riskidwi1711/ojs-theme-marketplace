"use client";
import * as React from "react";
import { adminHttp } from "@/api/adminHttp";
import { AdminProfile } from "@/types";

interface AdminAuthContextType {
  user: AdminProfile | null;
  token: string | null;
  loading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = React.createContext<AdminAuthContextType | null>(null);

const ADMIN_TOKEN_KEY = "ojs_admin_token";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!adminToken) {
      setLoading(false);
      return;
    }

    setToken(adminToken);
    // adminHttp reads token from localStorage automatically via interceptor

    adminHttp
      .get("/api/v1/auth/me")
      .then((res) => {
        const profile = res.data.profile;
        if (profile?.role === "admin") {
          setUser(profile);
        } else {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    const res = await adminHttp.post("/api/v1/admin/auth/login", { email, password });
    const { token: tok, profile } = res.data;
    if (profile?.role !== "admin") {
      throw new Error("Akses ditolak: Bukan admin");
    }
    localStorage.setItem(ADMIN_TOKEN_KEY, tok);
    setToken(tok);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, token, loading, loginAdmin, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
