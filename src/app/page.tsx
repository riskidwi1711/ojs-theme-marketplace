import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroBanner from "@/components/sections/HeroBanner";
import BrowseByCategory from "@/components/sections/BrowseByCategory";
import FeaturedBrands from "@/components/sections/FeaturedBrands";
import TopSaverToday from "@/components/sections/TopSaverToday";
import NewsletterBanner from "@/components/sections/NewsletterBanner";
import ProductCard from "@/components/ui/product-card";
import PromoBanners from "@/components/sections/PromoBanners";
import HealthDaily from "@/components/sections/HealthDaily";
import FeaturesStrip from "@/components/sections/FeaturesStrip";
import { getThemes } from "@/server/themes";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Open Themes – Marketplace Tema OJS Indonesia",
  description: "Temukan tema premium untuk jurnal OJS. Desain modern, kompatibel OJS 3.x, support resmi, update gratis 1 tahun.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Open Themes – Marketplace Tema OJS Indonesia",
    description: "Temukan tema premium untuk jurnal OJS. Desain modern, kompatibel OJS 3.x, support resmi, update gratis 1 tahun.",
    url: "/",
    type: "website",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Open Themes",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id",
  description: "Marketplace tema premium untuk jurnal OJS (Open Journal Systems) Indonesia.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Open Themes",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id",
  potentialAction: {
    "@type": "SearchAction",
    target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id"}/themes?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const themeTabs = ["Semua", "Jurnal Ilmiah", "Konferensi", "Open Access", "Sains & Teknik", "Kedokteran", "Hukum"];

export default async function Home() {
  const dynamicThemes = await getThemes();

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <Navbar />

      <main className="w-full">
        <HeroBanner />

        <div className="w-full">
          <hr className="border-gray-100" />
        </div>

        <BrowseByCategory />

        <div className="w-full">
          <hr className="border-gray-100" />
        </div>

        <FeaturedBrands />

        <div className="bg-[var(--color-muted)] w-full">
          <TopSaverToday />
        </div>

        <NewsletterBanner />

        {/* OJS Themes from openjournaltheme.com - Terlaris */}
        <section className="w-full py-6 px-4 md:px-8 lg:px-16">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-[#1a1a2e]">OJS 3 Themes — Terlaris</h2>
            <Link
              href="/themes"
              className="text-sm text-gray-600 hover:text-[var(--color-primary-600)] transition-colors font-medium"
            >
              Lihat semua
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dynamicThemes.slice(0, 6).map((it) => (
              <ProductCard
                key={it.slug}
                product={{
                  bg: it.bg,
                  id: it.id,
                  name: it.name,
                  compat: it.compat,
                  original: it.original,
                  emoji: it.emoji,
                  price: it.price,
                  image: it.image,
                  badge: it.badge,
                  badgeColor: it.badgeColor,
                  rating: it.rating,
                  reviews: it.reviews,
                  tags: it.tags,
                }}
              />
            ))}
          </div>
        </section>

        <div className="w-full">
          <hr className="border-gray-100" />
        </div>

        {/* OJS Themes from openjournaltheme.com - Baru Rilis */}
        {dynamicThemes.length > 6 && (
          <section className="w-full py-6 px-4 md:px-8 lg:px-16">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-xl font-bold text-[#1a1a2e]">OJS 3 Themes — Baru Rilis</h2>
              <Link
                href="/themes"
                className="text-sm text-gray-600 hover:text-[var(--color-primary-600)] transition-colors font-medium"
              >
                Lihat semua
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {dynamicThemes.slice(6, 12).map((it) => {
                return (
                  <Link key={it.slug} href={`/themes/${it.slug}`} className="flex flex-col h-full group">
                    <ProductCard
                      product={{
                        bg: it.bg,
                        id: it.id,
                        name: it.name,
                        compat: it.compat,
                        original: it.original,
                        emoji: it.emoji,
                        priceText: it.price.toString(),
                        image: it.image,
                        badge: it.badge,
                        badgeColor: it.badgeColor,
                        rating: it.rating,
                        reviews: it.reviews,
                        tags: it.tags,
                      }}
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <PromoBanners />

        <HealthDaily />

        <FeaturesStrip />
      </main>

      <Footer />
    </div>
  );
}
