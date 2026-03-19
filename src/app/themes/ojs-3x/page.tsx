import type { Metadata } from "next";
import { getThemes } from "@/server/themes";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Tema Kompatibel OJS 3.x",
  description: "Koleksi tema OJS yang kompatibel dengan Open Journal Systems versi 3.x. Desain modern, responsif, dan mudah diinstal.",
  keywords: ["tema OJS 3.x", "OJS 3 theme", "template jurnal OJS 3", "OJS 3.x compatible"],
  alternates: { canonical: "/themes/ojs-3x" },
  openGraph: {
    title: "Tema Kompatibel OJS 3.x | Open Themes",
    description: "Koleksi tema OJS yang kompatibel dengan Open Journal Systems versi 3.x.",
    url: "/themes/ojs-3x",
  },
};
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";

export default async function OJS3xPage() {
  const items = await getThemes();
  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <h1 className="mb-8 text-[var(--text-2xl)] font-bold">OJS 3.x Compatibility Themes</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <Link key={it.id} href={`/themes/${it.slug}`} className="flex flex-col h-full group">
              <ProductCard
               product={{
                    bg: it.bg,
                    id: it.id,
                    name: it.name,
                    compat: it.compat,
                    original: it.original,
                    emoji:it.emoji,
                    priceText: it.price?.toString(),
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
