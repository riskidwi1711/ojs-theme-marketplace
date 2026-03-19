import type { Metadata } from "next";
import { getThemes } from "@/server/themes";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "New Arrivals OJS Themes",
  description: "Tema OJS terbaru yang baru ditambahkan ke Open Themes. Tampilan modern dan fitur terkini untuk jurnal Anda.",
  keywords: ["tema OJS terbaru", "new OJS theme", "template jurnal baru", "OJS theme 2025"],
  alternates: { canonical: "/themes/new-arrivals" },
  openGraph: {
    title: "New Arrivals OJS Themes | Open Themes",
    description: "Tema OJS terbaru yang baru ditambahkan ke Open Themes.",
    url: "/themes/new-arrivals",
  },
};
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";

export default async function NewArrivalsPage() {
  const items = await getThemes();
  const newItems = items.slice(0, 12);

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[var(--text-2xl)] font-bold">New Arrivals 🔥</h1>
          <span className="text-sm text-gray-500">{newItems.length} Themes found</span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {newItems.map((it) => (
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
