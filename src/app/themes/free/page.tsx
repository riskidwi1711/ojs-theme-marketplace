import type { Metadata } from "next";
import { getThemes } from "@/server/themes";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Tema OJS Gratis",
  description: "Kumpulan tema OJS gratis berkualitas. Unduh dan pasang di jurnal ilmiah Anda tanpa biaya.",
  keywords: ["tema OJS gratis", "free OJS theme", "template jurnal gratis", "OJS free download"],
  alternates: { canonical: "/themes/free" },
  openGraph: {
    title: "Tema OJS Gratis | Open Themes",
    description: "Kumpulan tema OJS gratis berkualitas. Unduh dan pasang di jurnal ilmiah Anda tanpa biaya.",
    url: "/themes/free",
  },
};
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import Link from "next/link";

export default async function FreeThemesPage() {
  const items = await getThemes();
  const freeItems = items.filter(it => it.price?.toString().toLowerCase().includes("free") || it.price?.toString().includes("$0"));

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <h1 className="mb-8 text-[var(--text-2xl)] font-bold">Free OJS Themes</h1>
        {freeItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {freeItems.map((it) => (
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
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-500">No free themes found at the moment.</p>
            <Link href="/themes" className="text-[var(--color-primary)] mt-4 inline-block hover:underline">Browse all themes</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
