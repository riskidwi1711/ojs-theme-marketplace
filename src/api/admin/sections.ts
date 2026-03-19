import http from "@/api/adminHttp";
import type { AdminSectionItem } from "@/types/admin/sections";

export async function adminListSections(): Promise<AdminSectionItem[]> {
  const res = await http.get("/api/v1/admin/sections");
  const raw = res.data?.data ?? res.data?.results ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminSectionItem[];
}

export async function adminCreateSection(input: Partial<AdminSectionItem>): Promise<AdminSectionItem> {
  const res = await http.post("/api/v1/admin/sections", input);
  return res.data?.data as AdminSectionItem;
}

export async function adminUpdateSection(slug: string, input: Partial<AdminSectionItem>): Promise<AdminSectionItem> {
  const res = await http.put(`/api/v1/admin/sections/${encodeURIComponent(slug)}`, input);
  return res.data?.data as AdminSectionItem;
}

export async function adminDeleteSection(slug: string): Promise<void> {
  await http.delete(`/api/v1/admin/sections/${encodeURIComponent(slug)}`);
}
