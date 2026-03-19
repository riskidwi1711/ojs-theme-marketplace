import * as React from "react";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Rating from "@/components/ui/rating";
import { notFound } from "next/navigation";
import {
  LuDownload,
  LuShieldCheck,
  LuLayoutTemplate,
  LuHeart,
} from "react-icons/lu";
import AddToCartButton from "./add-to-cart-button";
import ShareButton from "./share-button";
import ThemeTabs from "./theme-tabs";
import RecentlyViewedTracker from "./recently-viewed-tracker";
import Link from "next/link";
import { getProduct } from "@/api/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Tema OJS" };

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const priceText = p.priceText || (p.price > 0 ? fmt(p.price) : p.price === 0 ? "Gratis" : undefined);
  const desc = p.description ||
    `${p.name} — tema premium untuk jurnal OJS.${priceText ? ` Harga: ${priceText}.` : ""} Kompatibel ${p.compat || "OJS 3.x"}.`;

  return {
    title: p.name,
    description: desc,
    openGraph: {
      title: p.name,
      description: desc,
      images: p.image ? [{ url: p.image, alt: p.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description: desc,
      images: p.image ? [p.image] : [],
    },
    alternates: { canonical: `/themes/${slug}` },
  };
}

// Unified shape used by this page
interface DetailItem {
  id: string;
  title: string;
  price?: number;
  original?: number;
  priceText: string;
  rating: number;
  reviews: number;
  compat?: string;
  image?: string;
  gallery?: string[];
  emoji?: string;
  bg?: string;
  badge?: string;
  badgeColor?: string;
  externalUrl?: string;
  description?: string;
  features?: string[];
  ojsVersion?: string;
  framework?: string;
  browserSupport?: string;
  license?: string;
  updateDuration?: string;
  supportDuration?: string;
  changelog?: { version: string; date: string; tag: string; changes: string[] }[];
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const p = await getProduct(slug);
  if (!p?.slug) notFound();

  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const item: DetailItem = {
    id: p.id || p.slug,
    title: p.name,
    price: p.price,
    original: p.original,
    priceText: p.price !== undefined && p.price !== null
      ? p.price === 0
        ? "Gratis"
        : fmt(p.price)
      : p.priceText || "Hubungi Kami",
    rating: p.rating || 4.5,
    reviews: p.reviews || 0,
    compat: p.compat,
    image: p.image || (Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery[0] : undefined),
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    emoji: p.emoji,
    bg: p.bg,
    badge: p.badge,
    badgeColor: p.badgeColor,
    externalUrl: p.demoUrl || p.livePreviewUrl,
    description: p.description,
    features: Array.isArray(p.features) ? p.features : [],
    ojsVersion: p.ojsVersion,
    framework: p.framework,
    browserSupport: p.browserSupport,
    license: p.license,
    updateDuration: p.updateDuration,
    supportDuration: p.supportDuration,
    changelog: Array.isArray(p.changelog) ? p.changelog : [],
  };

  if (!item) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    description: item.description,
    image: item.image,
    url: `${siteUrl}/themes/${slug}`,
    ...(item.price !== undefined && {
      offers: {
        "@type": "Offer",
        price: item.price,
        priceCurrency: "IDR",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/themes/${slug}`,
      },
    }),
    ...(item.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: item.rating,
        reviewCount: item.reviews || 1,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={productJsonLd} />
      <RecentlyViewedTracker id={item.id} name={item.title} slug={slug} image={item.image} />
      <Navbar />

      <main className="container-page py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-400 mb-6 gap-2 items-center">
          <Link href="/" className="hover:text-[var(--color-primary-600)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/themes" className="hover:text-[var(--color-primary-600)] transition-colors">Themes</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: hero + tabs */}
          <div className="lg:col-span-2">
            {/* Hero visual */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className={`w-full aspect-video flex items-center justify-center bg-gradient-to-br ${item.bg ?? "from-gray-100 to-gray-200"}`}>
                  <span className="text-8xl select-none">{item.emoji ?? "📦"}</span>
                </div>
              )}
            </div>

            <ThemeTabs
              productId={item.id}
              title={item.title}
              image={item.image}
              gallery={item.gallery}
              description={item.description}
              features={item.features}
              ojsVersion={item.ojsVersion}
              framework={item.framework}
              browserSupport={item.browserSupport}
              license={item.license}
              updateDuration={item.updateDuration}
              supportDuration={item.supportDuration}
              changelog={item.changelog}
              reviewsCount={item.reviews}
              ratingCount={item.rating}
            />
          </div>

          {/* Right: pricing (sticky) */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 sticky top-24">
              {item.badge && (
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3 ${item.badgeColor ?? "bg-gray-200 text-gray-700"}`}>
                  {item.badge}
                </span>
              )}

              <h1 className="text-xl font-extrabold text-gray-900 mb-1 leading-snug">{item.title}</h1>

              {item.compat && (
                <p className="text-xs text-gray-400 mb-3 font-medium">{item.compat}</p>
              )}

              <div className="flex items-center gap-2 mb-5">
                <Rating value={item.rating} size={13} />
                <span className="text-xs text-gray-400">({item.reviews} Ulasan)</span>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Harga Lisensi</p>
                <h3 className="text-3xl font-black text-[#1a1a2e]">{item.priceText}</h3>
                {item.original && item.original > 0 && (
                  <p className="text-sm text-gray-400 line-through mt-0.5">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.original)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <AddToCartButton
                  product={{
                    id: item.id,
                    name: item.title,
                    price: item.price,
                    priceText: item.priceText,
                    image: item.image,
                  }}
                />

                {item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <LuLayoutTemplate size={16} />
                    Live Preview
                  </a>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
                    <LuHeart size={15} />
                    Simpan
                  </button>
                  <ShareButton title={item.title} slug={slug} />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <LuDownload className="text-green-500 shrink-0" size={16} />
                  <span>Download instan setelah pembayaran</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <LuShieldCheck className="text-green-500 shrink-0" size={16} />
                  <span>Update gratis selama 1 tahun</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <LuShieldCheck className="text-green-500 shrink-0" size={16} />
                  <span>Support 6 bulan via email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
