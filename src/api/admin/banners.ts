import http from "@/api/adminHttp";
import type { AdminBannerItem } from "@/types/admin/banners";

export async function adminListBanners(): Promise<AdminBannerItem[]> {
  const res = await http.get("/api/v1/admin/banners");
  const raw = res.data?.data ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminBannerItem[];
}

export async function adminCreateBanner(input: Partial<AdminBannerItem>) {
  const res = await http.post("/api/v1/admin/banners", input);
  return res.data?.data as AdminBannerItem;
}

export async function adminUpdateBanner(id: string, input: Partial<AdminBannerItem>) {
  const res = await http.put(`/api/v1/admin/banners/${id}`, input);
  return res.data?.data as AdminBannerItem;
}

export async function adminDeleteBanner(id: string) {
  await http.delete(`/api/v1/admin/banners/${id}`);
}
