import http from "@/api/http";
import type { Settings } from "@/types/settings";

export async function getSettings(): Promise<Settings> {
  const res = await http.get("/api/v1/admin/settings");
  return res.data?.data ?? {};
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  const res = await http.put("/api/v1/admin/settings", settings);
  return res.data?.data ?? {};
}

const settings = { getSettings, updateSettings };
export default settings;
