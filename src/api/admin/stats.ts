import http from "@/api/adminHttp";
import type { AdminStats } from "@/types/admin/stats";

export async function adminGetStats(): Promise<AdminStats> {
  const res = await http.get("/api/v1/admin/stats");
  return res.data?.data ?? res.data ?? {};
}
