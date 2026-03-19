import type { Metadata } from "next";
import { getThemes } from "@/server/themes";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Best Seller OJS Themes",
  description: "Tema OJS terlaris dan paling populer di Open Themes. Dipilih oleh ratusan jurnal ilmiah Indonesia.",
  keywords: ["best seller OJS theme", "tema OJS terlaris", "tema jurnal populer", "top OJS themes"],
  alternates: { canonical: "/themes/best-sellers" },
  openGraph: {
    title: "Best Seller OJS Themes | Open Themes",
    description: "Tema OJS terlaris dan paling populer di Open Themes.",
    url: "/themes/best-sellers",
  },
};
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";

export default async function BestSellersPage() {
  const items = await getThemes();
  const bestSellers = items.filter(it => it.name.toLowerCase().includes("academic") || it.name.toLowerCase().includes("pro"));

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <h1 className="mb-8 text-[var(--text-2xl)] font-bold">Best Sellers 🌟</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestSellers.map((it) => (
            <Link key={it.id} href={`/themes/${it.slug}`} className="flex flex-col h-full group">
              <ProductCard
                product={{
                    bg: it.bg,
                    id: it.id,
                    name: it.name,
                    compat: it.compat,
                    original: it.original,
                    emoji:it.emoji,
                    price: it.price,
                    image: it.image,
                    badge: it.badge,
                    badgeColor: it.badgeColor,
                    rating: it.rating,
                    reviews: it.reviews,
                    tags: it.tags
                  }}
              />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
