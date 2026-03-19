import http from "@/api/http";
import { ProductItem, ListParams } from "@/types";

export async function listProducts(params?: ListParams): Promise<ProductItem[]> {
  const res = await http.get("/api/v1/products", { params });
  const raw = res.data?.data ?? res.data?.results ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as ProductItem[];
}

export async function getProduct(idOrSlug: string): Promise<ProductItem | null> {
  if (!idOrSlug) return null;
  try {
    const res = await http.get(`/api/v1/products/${encodeURIComponent(idOrSlug)}`);
    return res.data?.data as ProductItem | null;
  } catch {
    return null;
  }
}

const api = { listProducts, getProduct };
export default api;

