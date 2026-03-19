import type { ThemeItem } from "@/server/themes";
import http from "@/api/http";

const isServer = typeof window === "undefined";

export async function listThemes(q?: string): Promise<ThemeItem[]> {
  if (isServer) {
    const { getThemes, searchThemes } = await import("@/server/themes");
    return q ? searchThemes(q) : getThemes();
  }
  const res = await http.get("/api/v1/themes", { params: q ? { q } : undefined });
  return (res.data?.data ?? []) as ThemeItem[];
}

const themeApi = { listThemes };
export default themeApi;
