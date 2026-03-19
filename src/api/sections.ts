import http from "@/api/http";
import type { SectionItem } from "@/types/section";

export async function getSections(): Promise<SectionItem[]> {
  try {
    const res = await http.get("/api/v1/sections");
    const raw = res.data?.data ?? res.data ?? [];
    return (Array.isArray(raw) ? raw : []) as SectionItem[];
  } catch {
    return [];
  }
}

const sections = { getSections };
export default sections;
