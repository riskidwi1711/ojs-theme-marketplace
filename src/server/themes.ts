import type { ThemeItem } from "@/types/theme";

const BACKEND_URL = process.env.SERVER_URL || "http://localhost:4000";

export async function getThemes(): Promise<ThemeItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/themes?limit=100`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch themes from backend");
    const data = await res.json();
    const products = (data.data ?? []) as ThemeItem[];
    return products
  } catch {
    return [];
  }
}

export async function getThemeBySlug(slug: string): Promise<ThemeItem | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/themes/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data as ThemeItem;
  } catch {
    return null;
  }
}

export async function searchThemes(q: string): Promise<ThemeItem[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/themes?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch themes from backend");
    const data = await res.json();
    const products = (data.data ?? []) as ThemeItem[];
    return products;
  } catch {
    return [];
  }
}
