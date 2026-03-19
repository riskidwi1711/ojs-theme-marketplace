import * as React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getArticleBySlug, type ArticleItem } from "@/api/articles";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel" };
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Format date to Indonesian
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      });
    } catch {
      return dateStr;
    }
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id";
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: article.author },
    datePublished: article.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "Open Themes",
      url: siteUrl,
    },
    url: `${siteUrl}/blog/${article.slug}`,
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={articleJsonLd} />
      <Navbar />
      
      <main className="container-page py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-400 mb-6 gap-2 items-center">
          <a href="/" className="hover:text-[var(--color-primary-600)] transition-colors">Home</a>
          <span>/</span>
          <a href="/blog" className="hover:text-[var(--color-primary-600)] transition-colors">Blog</a>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[300px]">{article.title}</span>
        </nav>

        {/* Article Header */}
        <div className="max-w-3xl mx-auto">
          {/* Tag */}
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${article.tagColor || "bg-gray-100 text-gray-700"} mb-4`}>
            {article.tag}
          </span>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a2e] mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <span>
              <span className="font-semibold text-gray-700">{article.author}</span>
            </span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.category && (
              <>
                <span>·</span>
                <span className="text-[var(--color-primary)]">{article.category}</span>
              </>
            )}
          </div>

          {/* Featured Image / Icon */}
          <div className={`relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${article.bg || "from-gray-50 to-gray-100"} mb-8 flex items-center justify-center`}>
            {article.icon ? (
              <div className="text-center">
                {(() => {
                  const IconComponent = getIconComponent(article.icon);
                  return IconComponent ? <IconComponent size={120} className={`${article.iconColor || "text-gray-400"} mx-auto`} /> : null;
                })()}
              </div>
            ) : (
              <div className="text-6xl">📝</div>
            )}
          </div>

          {/* Excerpt */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Content (if available) */}
          {article.content && (
            <div className="prose prose-lg max-w-none mb-8">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-navy)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {article.author?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  Ditulis oleh <span className="text-[var(--color-primary)]">{article.author}</span>
                </h3>
                {article.authorEmail && (
                  <p className="text-xs text-gray-500">{article.authorEmail}</p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  Admin dan kontributor konten untuk Open Themes Marketplace.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="flex items-center justify-center">
            <a 
              href="/#blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-600)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Kembali ke Blog
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper to get icon component from string name
function getIconComponent(iconName: string): React.ComponentType<{ size?: number; className?: string }> | null {
  const iconMap: Record<string, any> = {
    FaTools: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
    FaSyncAlt: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>,
    FaPlug: (props: any) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22v-5M9 22v-5M15 22v-5M12 17a5 5 0 0 0 5-5V8a5 5 0 0 0-10 0v4a5 5 0 0 0 5 5z"/></svg>,
  };
  return iconMap[iconName] || null;
}
