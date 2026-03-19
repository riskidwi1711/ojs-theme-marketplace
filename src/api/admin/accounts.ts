import http from "@/api/adminHttp";
import type { AdminAccountListResponse } from "@/types/admin/accounts";

export async function adminListAccounts(params?: Record<string, string | number | undefined>) {
  const res = await http.get("/api/v1/admin/accounts", { params });
  const data = res.data?.data as AdminAccountListResponse;
  return data;
}

export async function adminSetRole(email: string, role: "admin" | "user") {
  await http.put(`/api/v1/admin/accounts/${encodeURIComponent(email)}/role`, { role });
}

export async function adminSetStatus(email: string, status: "active" | "inactive" | "banned") {
  await http.put(`/api/v1/admin/accounts/${encodeURIComponent(email)}/status`, { status });
}

const accounts = { adminListAccounts, adminSetRole, adminSetStatus };
export default accounts;

