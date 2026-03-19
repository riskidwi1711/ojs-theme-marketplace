"use client";

import * as React from "react";
import { FaTools, FaSyncAlt, FaPlug } from "react-icons/fa";
import { getArticles, type ArticleItem } from "@/api/articles";
import { formatDate } from "@/helper/date";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaTools, FaSyncAlt, FaPlug,
};

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    slug: "install-tema-ojs",
    title: "Cara Install Tema OJS 3.x dari Awal",
    excerpt: "Panduan lengkap instalasi tema OJS mulai dari download, upload via FTP, hingga aktivasi di panel admin. Cocok untuk pemula.",
    author: "Admin",
    tag: "Tutorial",
    tagColor: "bg-blue-100 text-blue-700",
    icon: "FaTools",
    iconColor: "text-blue-400",
    bg: "from-blue-50 to-indigo-100",
    publishedAt: "2026-03-14T00:00:00Z",
  },
  {
    slug: "migrasi-ojs-33-34",
    title: "Panduan Migrasi OJS 3.3 ke OJS 3.4",
    excerpt: "Langkah demi langkah migrasi versi OJS tanpa kehilangan data artikel, reviewer, dan pengaturan jurnal Anda.",
    author: "Admin",
    tag: "Migrasi",
    tagColor: "bg-amber-100 text-amber-700",
    icon: "FaSyncAlt",
    iconColor: "text-amber-400",
    bg: "from-amber-50 to-orange-100",
    publishedAt: "2026-03-10T00:00:00Z",
  },
  {
    slug: "plugin-ojs-terbaik",
    title: "10 Plugin OJS Terbaik untuk Jurnal Anda",
    excerpt: "Rekomendasi plugin OJS paling berguna: DOI, Plagiarism Check, Google Scholar indexing, dan plugin aksesibilitas terpopuler.",
    author: "Admin",
    tag: "Plugin",
    tagColor: "bg-green-100 text-green-700",
    icon: "FaPlug",
    iconColor: "text-green-400",
    bg: "from-green-50 to-emerald-100",
    publishedAt: "2026-03-05T00:00:00Z",
  },
];

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

export const HealthDaily: React.FC = () => {
  const [articles, setArticles] = React.useState<ArticleItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getArticles(3).then((data) => {
      setArticles(data.length > 0 ? data : DEFAULT_ARTICLES);
    }).catch(() => {
      setArticles(DEFAULT_ARTICLES);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  return (
    <section className="bg-[var(--color-muted)] py-12 w-full">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Blog & Panduan OJS</h2>
            <p className="text-sm text-gray-500">Tips, tutorial, dan panduan lengkap untuk OJS</p>
          </div>
          <a href="/blog" className="hidden sm:flex items-center gap-1.5 text-base font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-600)] transition-colors">
            Semua Artikel <ChevronRight />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
            </div>
          ) : (
            articles.map((article) => {
              const IconComponent = ICON_MAP[article.icon || "FaTools"] || FaTools;
              return (
                <article key={article.slug} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  {/* Thumbnail */}
                  <div className={`relative h-48 bg-gradient-to-br ${article.bg || "from-gray-50 to-gray-100"} flex items-center justify-center`}>
                    <IconComponent size={72} className={`${article.iconColor || "text-gray-400"} group-hover:scale-110 transition-transform duration-300`} />
                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${article.tagColor || "bg-gray-100 text-gray-700"}`}>
                      {article.tag}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <p className="text-xs text-gray-500 font-medium mb-2">{article.author} · {formatDate(article.publishedAt)}</p>
                    <h3 className="text-base font-bold text-[#1a1a2e] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      <a href={`/blog/${article.slug}`}>{article.title}</a>
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-3">{article.excerpt}</p>
                    <a href={`/blog/${article.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary)] hover:gap-2 transition-all">
                      Baca selengkapnya <ChevronRight />
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default HealthDaily;
