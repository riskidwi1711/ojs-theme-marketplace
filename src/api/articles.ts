import http from "@/api/http";
import type { ArticleItem } from "@/types/article";

export async function getArticles(limit: number = 3): Promise<ArticleItem[]> {
  try {
    const res = await http.get(`/api/v1/articles?limit=${limit}`);
    const raw = res.data?.data ?? res.data ?? [];
    return (Array.isArray(raw) ? raw : []) as ArticleItem[];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const res = await http.get(`/api/v1/articles/${encodeURIComponent(slug)}`);
    return (res.data?.data ?? null) as ArticleItem | null;
  } catch {
    return null;
  }
}

const articles = { getArticles, getArticleBySlug };
export default articles;
