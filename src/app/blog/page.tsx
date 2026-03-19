import * as React from "react";
import type { Metadata } from "next";
import { getArticles, type ArticleItem } from "@/api/articles";

export const metadata: Metadata = {
  title: "Blog & Panduan OJS",
  description: "Tutorial, tips, dan panduan lengkap menggunakan OJS 3.x untuk jurnal ilmiah Indonesia.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Panduan OJS | Open Themes",
    description: "Tutorial, tips, dan panduan lengkap menggunakan OJS 3.x untuk jurnal ilmiah Indonesia.",
    url: "/blog",
    type: "website",
  },
};
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { formatDate } from "@/helper/date";

// Get icon component from string name
function getIconComponent(iconName: string): React.ComponentType<{ size?: number; className?: string }> | null {
  const iconMap: Record<string, any> = {
    FaTools: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    FaSyncAlt: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
    FaPlug: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-5M9 22v-5M15 22v-5M12 17a5 5 0 0 0 5-5V8a5 5 0 0 0-10 0v4a5 5 0 0 0 5 5z"/></svg>,
  };
  return iconMap[iconName] || null;
}

export default async function BlogPage() {
  const articles = await getArticles(50);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="container-page py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-400 mb-4 gap-2 items-center">
            <Link href="/" className="hover:text-(--color-primary-600) transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Blog</span>
          </nav>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-2">
            Blog & Panduan OJS
          </h1>
          <p className="text-gray-500">
            Tutorial, tips, dan panduan lengkap menggunakan OJS 3.x
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Belum ada artikel</h2>
            <p className="text-gray-500">Artikel akan segera hadir</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const IconComponent = getIconComponent(article.icon || "FaTools");
              return (
                <article 
                  key={article.slug} 
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-gray-100"
                >
                  {/* Thumbnail */}
                  <div className={`relative h-24 overflow-auto   bg-gradient-to-br ${article.bg || "from-gray-50 to-gray-100"} flex items-center justify-center`}>
                    {IconComponent ? (
                      <IconComponent size={80} className={`${article.iconColor || "text-gray-400"} group-hover:scale-110 transition-transform duration-300`} />
                    ) : (
                      <div className="text-5xl">📝</div>
                    )}
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full ${article.tagColor || "bg-gray-100 text-gray-700"}`}>
                      {article.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <a href={`/blog/${article.slug}`}>
                      <h3 className="text-lg font-bold text-[#1a1a2e] mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </a>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                      {article.excerpt}
                    </p>

                    {/* Read More */}
                    <a 
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:gap-2 transition-all"
                    >
                      Baca selengkapnya
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
