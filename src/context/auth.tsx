"use client";
import * as React from "react";
import http from "@/api/http";
import axios from "axios";
import { AuthProfile } from "@/types";

interface AuthContextType {
  user: AuthProfile | null;
  token: string | null;
  loading: boolean;
  isCustomer: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

const CUSTOMER_TOKEN_KEY = "ojs_customer_token";
const ADMIN_TOKEN_KEY = "ojs_admin_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthProfile | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const customerToken = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (!customerToken) {
      setLoading(false);
      return;
    }

    setToken(customerToken);

    // Use a separate axios instance for customer auth to avoid conflicts
    const customerHttp = axios.create({ baseURL: http.defaults.baseURL });
    customerHttp.defaults.headers.common["Authorization"] = `Bearer ${customerToken}`;

    customerHttp
      .get("/api/v1/auth/me")
      .then((res) => {
        const profile = res.data.profile;
        setUser(profile);
        http.defaults.headers.common["Authorization"] = `Bearer ${customerToken}`;
      })
      .catch(() => {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await http.post("/api/v1/auth/login", { email, password });
    const { token: tok, profile } = res.data;
    localStorage.setItem(CUSTOMER_TOKEN_KEY, tok);
    http.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    setToken(tok);
    setUser(profile);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await http.post("/api/v1/auth/register", { email, password, name });
    const { token: tok, profile } = res.data;
    localStorage.setItem(CUSTOMER_TOKEN_KEY, tok);
    http.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
    setToken(tok);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    // Don't clear global header if admin token exists
    const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!adminToken) {
      delete http.defaults.headers.common["Authorization"];
    }
    setToken(null);
    setUser(null);
  };

  const isCustomer = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isCustomer, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
