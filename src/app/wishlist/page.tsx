"use client";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/ui/product-card";
import { useWishlist } from "@/context/wishlist";
import { useCart } from "@/context/cart";

export default function WishlistPage() {
  const { items, removeFromWishlist, count } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">My Wishlist</h1>
          <span className="text-gray-500 text-sm">{count} Items</span>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((it) => (
              <div key={it.id} className="relative group">
                <ProductCard
                  product={{
                    id: it.id,
                    name: it.name,
                    priceText: it.priceText,
                    image: it.image || "/next.svg",
                    rating: 5,
                    tags: ["Wishlist"],
                  }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button
                    onClick={() => removeFromWishlist(it.id)}
                    className="p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* <div className="mt-2">
                  <button
                    onClick={() => {
                      const numeric = parseInt((it.priceText || "0").replace(/[^0-9]/g, ""), 10) || 0;
                      addItem({ id: it.id, name: it.name, priceIDR: numeric, image: it.image });
                    }}
                    className="w-full py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-bold hover:bg-[var(--color-primary-600)] transition-colors"
                  >
                    Add to Cart
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Save your favorite themes here to find them easily later.</p>
            <a
              href="/themes"
              className="px-8 py-3 bg-[#1c3b6d] text-white rounded-xl font-bold hover:bg-[#163060] transition-colors"
            >
              Explore Themes
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
