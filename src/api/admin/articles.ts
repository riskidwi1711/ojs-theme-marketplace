import http from "@/api/adminHttp";
import type { AdminArticleItem } from "@/types/admin/articles";

export async function adminListArticles(): Promise<AdminArticleItem[]> {
  const res = await http.get("/api/v1/admin/articles");
  const raw = res.data?.data ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminArticleItem[];
}

export async function adminCreateArticle(input: Partial<AdminArticleItem>) {
  const res = await http.post("/api/v1/admin/articles", input);
  return res.data?.data as AdminArticleItem;
}

export async function adminUpdateArticle(slug: string, input: Partial<AdminArticleItem>) {
  const res = await http.put(`/api/v1/admin/articles/${encodeURIComponent(slug)}`, input);
  return res.data?.data as AdminArticleItem;
}

export async function adminDeleteArticle(slug: string) {
  await http.delete(`/api/v1/admin/articles/${encodeURIComponent(slug)}`);
}
