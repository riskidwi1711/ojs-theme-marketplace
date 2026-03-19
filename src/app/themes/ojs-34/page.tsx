import type { Metadata } from "next";
import { getThemes } from "@/server/themes";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Tema OJS 3.4+ Ready",
  description: "Tema OJS yang sudah siap untuk versi 3.4 ke atas. Nikmati fitur terbaru OJS dengan tampilan profesional.",
  keywords: ["tema OJS 3.4", "OJS 3.4 theme", "template jurnal OJS 3.4", "OJS 3.4 compatible"],
  alternates: { canonical: "/themes/ojs-34" },
  openGraph: {
    title: "Tema OJS 3.4+ Ready | Open Themes",
    description: "Tema OJS yang sudah siap untuk versi 3.4 ke atas.",
    url: "/themes/ojs-34",
  },
};
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";

export default async function OJS34Page() {
  const items = await getThemes();
  const items34 = items.filter(it => it.name.toLowerCase().includes("academic") || it.name.toLowerCase().includes("unify"));

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <h1 className="mb-8 text-[var(--text-2xl)] font-bold">OJS 3.4+ Ready Themes</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items34.map((it) => (
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
