import http from "@/api/adminHttp";
import type { ProductItem } from "@/api/products";

export async function adminListProducts(params?: { section?: string; category?: string }): Promise<ProductItem[]> {
  const res = await http.get("/api/v1/admin/products", { params });
  const raw = res.data?.data ?? res.data?.results ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as ProductItem[];
}

export async function adminGetProduct(id: string): Promise<ProductItem | null> {
  const res = await http.get(`/api/v1/admin/products/${encodeURIComponent(id)}`);
  return res.data?.data as ProductItem;
}

export async function adminCreateProduct(input: Partial<ProductItem>): Promise<ProductItem> {
  const res = await http.post("/api/v1/admin/products", input);
  return res.data?.data as ProductItem;
}

export async function adminUpdateProduct(id: string, input: Partial<ProductItem>): Promise<ProductItem> {
  const res = await http.put(`/api/v1/admin/products/${encodeURIComponent(id)}`, input);
  return res.data?.data as ProductItem;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await http.delete(`/api/v1/admin/products/${encodeURIComponent(id)}`);
}

const adminProducts = { adminListProducts, adminGetProduct, adminCreateProduct, adminUpdateProduct, adminDeleteProduct };
export default adminProducts;

