import { NextResponse } from "next/server";
import { listProducts } from "@/api/products";
import { getArticles } from "@/api/articles";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id";

  const staticUrls = [
    { url: base,                       lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/themes`,           lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/blog`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/tentang-kami`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/faq`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/kontak`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let productUrls: { url: string; lastModified: Date; changeFrequency: string; priority: number }[] = [];
  try {
    const products = await listProducts({ limit: 500 });
    productUrls = products.map((p) => ({
      url: `${base}/themes/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {}

  let articleUrls: { url: string; lastModified: Date; changeFrequency: string; priority: number }[] = [];
  try {
    const articles = await getArticles(100);
    articleUrls = articles.map((a) => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {}

  const allUrls = [...staticUrls, ...productUrls, ...articleUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map((item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastModified.toISOString()}</lastmod>
    <changefreq>${item.changeFrequency}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
