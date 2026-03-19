import http from "@/api/http";
import type { BannerItem } from "@/types/banner";

export async function getBanners(): Promise<BannerItem[]> {
  try {
    const res = await http.get("/api/v1/banners");
    const raw = res.data?.data ?? res.data ?? [];
    return (Array.isArray(raw) ? raw : []) as BannerItem[];
  } catch {
    return [];
  }
}

const banners = { getBanners };
export default banners;
