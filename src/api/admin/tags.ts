import http from "@/api/adminHttp";
import type { AdminTagItem } from "@/types/admin/tags";

export async function adminListTags(): Promise<AdminTagItem[]> {
  const res = await http.get("/api/v1/admin/tags");
  const raw = res.data?.data ?? res.data?.results ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminTagItem[];
}

export async function adminCreateTag(input: Partial<AdminTagItem>) {
  const res = await http.post("/api/v1/admin/tags", input);
  return res.data?.data as AdminTagItem;
}

export async function adminUpdateTag(slug: string, input: Partial<AdminTagItem>) {
  const res = await http.put(`/api/v1/admin/tags/${encodeURIComponent(slug)}`, input);
  return res.data?.data as AdminTagItem;
}

export async function adminDeleteTag(slug: string) {
  await http.delete(`/api/v1/admin/tags/${encodeURIComponent(slug)}`);
}

const tags = { adminListTags, adminCreateTag, adminUpdateTag, adminDeleteTag };
export default tags;

