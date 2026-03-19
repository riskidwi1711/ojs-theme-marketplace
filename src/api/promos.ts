import http from "@/api/http";
import type { PromoItem } from "@/types/promo";

export async function getPromos(): Promise<PromoItem[]> {
  try {
    const res = await http.get("/api/v1/promos");
    const raw = res.data?.data ?? res.data ?? [];
    return (Array.isArray(raw) ? raw : []) as PromoItem[];
  } catch {
    return [];
  }
}

const promos = { getPromos };
export default promos;
