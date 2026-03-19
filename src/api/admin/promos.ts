import http from "@/api/adminHttp";
import type { AdminPromoItem } from "@/types/admin/promos";

export async function adminListPromos(): Promise<AdminPromoItem[]> {
  const res = await http.get("/api/v1/admin/promos");
  const raw = res.data?.data ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminPromoItem[];
}

export async function adminCreatePromo(input: Partial<AdminPromoItem>) {
  const res = await http.post("/api/v1/admin/promos", input);
  return res.data?.data as AdminPromoItem;
}

export async function adminUpdatePromo(id: string, input: Partial<AdminPromoItem>) {
  const res = await http.put(`/api/v1/admin/promos/${id}`, input);
  return res.data?.data as AdminPromoItem;
}

export async function adminDeletePromo(id: string) {
  await http.delete(`/api/v1/admin/promos/${id}`);
}
