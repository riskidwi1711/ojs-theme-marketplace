import http from "@/api/adminHttp";
import type { AdminCategoryItem } from "@/types/admin/categories";

export async function adminListCategories(): Promise<AdminCategoryItem[]> {
  const res = await http.get("/api/v1/admin/categories");
  const raw = res.data?.data ?? res.data?.results ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminCategoryItem[];
}

export async function adminCreateCategory(input: Partial<AdminCategoryItem>) {
  const res = await http.post("/api/v1/admin/categories", input);
  return res.data?.data as AdminCategoryItem;
}

export async function adminUpdateCategory(slug: string, input: Partial<AdminCategoryItem>) {
  const res = await http.put(`/api/v1/admin/categories/${encodeURIComponent(slug)}`, input);
  return res.data?.data as AdminCategoryItem;
}

export async function adminDeleteCategory(slug: string) {
  await http.delete(`/api/v1/admin/categories/${encodeURIComponent(slug)}`);
}

const categories = { adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory };
export default categories;

