"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import { listThemes } from "@/api/themes";
import type { ThemeItem } from "@/server/themes";
import Link from "next/link";

export default function OJSThemesPage() {
  const [themes, setThemes] = React.useState<ThemeItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const searchQuery = searchParams.get("q") || "";

  React.useEffect(() => {
    setLoading(true);
    listThemes(searchQuery || undefined)
      .then((data) => setThemes(data))
      .catch(() => setThemes([]))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/themes?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/themes");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">All Themes</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search OJS themes, templates, and plugins..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </form>
        </div>

        {/* Results info */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-4">
            {themes.length} {themes.length === 1 ? "theme" : "themes"} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        )}

        {/* Themes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              {searchQuery ? `No themes found for "${searchQuery}"` : "No themes available"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((it) => (
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
        )}
      </main>
      <Footer />
    </div>
  );
}
