"use client";

import * as React from "react";
import { LuSearch, LuPuzzle } from "react-icons/lu";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import { listProducts, type ProductItem } from "@/api/products";

export default function PluginsPage() {
  const [plugins, setPlugins] = React.useState<ProductItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    listProducts({ category: "plugin", limit: 100 })
      .then(setPlugins)
      .catch(() => setPlugins([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim()
    ? plugins.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.compat?.toLowerCase().includes(query.toLowerCase())
      )
    : plugins;

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />

      <main className="container-page py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <LuPuzzle size={18} className="text-[var(--color-primary)]" />
            </span>
            <h1 className="text-3xl font-bold text-[#1a1a2e]">OJS Plugins</h1>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Plugin tambahan untuk memperluas fungsionalitas OJS kamu.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari plugin OJS..."
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
            />
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} plugin ditemukan{query && ` untuk "${query}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <LuPuzzle size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {query ? `Tidak ada plugin untuk "${query}"` : "Belum ada plugin tersedia."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((plugin) => (
              <a key={plugin.id} href={`/themes/${plugin.slug || plugin.id}`} className="flex flex-col h-full">
                <ProductCard
                  product={{
                    id: plugin.id,
                    name: plugin.name,
                    priceText: plugin.priceText || (plugin.price ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(plugin.price) : "Gratis"),
                    image: plugin.image,
                    emoji: plugin.emoji,
                    bg: plugin.bg,
                    rating: plugin.rating ?? 4.5,
                    reviews: plugin.reviews,
                    badge: plugin.badge,
                    badgeColor: plugin.badgeColor,
                    compat: plugin.compat,
                    tags: ["Plugin"],
                  }}
                />
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
