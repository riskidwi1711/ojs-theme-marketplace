import http from "@/api/http";
import type { CategoryItem } from "@/types/category";

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const res = await http.get("/api/v1/categories");
    const raw = res.data?.data ?? res.data ?? [];
    return (Array.isArray(raw) ? raw : []) as CategoryItem[];
  } catch {
    return [];
  }
}

const categories = { getCategories };
export default categories;
