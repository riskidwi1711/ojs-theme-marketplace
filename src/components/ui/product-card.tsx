"use client";

import * as React from "react";
import Link from "next/link";
import Rating from "./rating";
import { useCart } from "@/context/cart";
import { useWishlist } from "@/context/wishlist";
import { Product } from "@/types";
import { parsePriceIDR } from "@/helper/price";

interface ProductCardProps {
  product: Product;
}

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CartIcon = ({ added }: { added: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={added ? "scale-90 opacity-0 transition-all" : "scale-100 opacity-100 transition-all"}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CheckIcon = ({ added }: { added: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    className={`absolute inset-0 m-auto text-white transition-all ${added ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = React.useState(false);
  const wishlisted = isInWishlist(product.id);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  const displayPrice = product.price !== undefined && product.price !== null
    ? product.price === 0
      ? "Gratis"
      : formatPrice(product.price)
    : product.priceText || "Hubungi Kami";

  const displayOriginal = product.original ? formatPrice(product.original) : null;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name, priceText: product.priceText, image: product.image });
    }
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const priceIDR = parsePriceIDR(product);
    addItem({
      id: product.id,
      name: product.name,
      priceIDR,
      image: product.image,
      bg: product.bg,
      compat: product.compat,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderVisual = () => {
    const wishlistBtn = (
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 z-10
          opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
          ${wishlisted ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur text-gray-500 hover:text-red-500"}`}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={wishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    );

    // 1. Image Variant (Scraped / Real Product)
    if (product.image) {
      return (
        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50 mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badge */}
          {(product.badge || (product.tags && product.tags.length > 0)) && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start pointer-events-none">
              {product.badge && (
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold text-white shadow-sm ${product.badgeColor || "bg-red-500"}`}
                >
                  {product.badge}
                </span>
              )}
              {product.tags?.slice(0, 1).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-md bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-semibold text-gray-700 shadow-sm border border-white/50"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {product.compat && (
            <span className="absolute bottom-2 right-2 text-[9px] bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium shadow-sm border border-white/10">
              {product.compat}
            </span>
          )}
          {wishlistBtn}
        </div>
      );
    }

    // 2. Emoji Variant (Static Placeholder)
    return (
      <div
        className={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${product.bg || "from-gray-100 to-gray-200"} mb-3 flex items-center justify-center`}
      >
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none">
          {product.emoji || "📦"}
        </span>

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${product.badgeColor ?? "bg-red-500 text-white"}`}
          >
            {product.badge}
          </span>
        )}

        {/* Compatibility Tag */}
        {product.compat && (
          <span className="absolute bottom-2 right-2 text-[9px] bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium shadow-sm border border-white/10">
            {product.compat}
          </span>
        )}
        {wishlistBtn}
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col h-full p-3">
      {/* Visual Area */}
      {renderVisual()}

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Name - Larger font for better readability */}
        <Link
          href={`/themes/${product.id}`}
          className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-[var(--color-primary)] mb-2 leading-snug transition-colors min-h-[2.75rem]"
        >
          {product.name}
        </Link>

        {/* Rating - flex items-center gap-0.5, star size 13px */}
        <div className="flex items-center gap-1 mb-2">
          <Rating value={product.rating || 0} size={13} className="" />
          {product.reviews && <span className="text-[11px] text-gray-500 font-medium">({product.reviews})</span>}
        </div>

        {/* Price & Original - flex items-baseline gap-2 */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-extrabold text-[#1a1a2e]">{displayPrice}</span>
          {displayOriginal && <span className="text-xs text-gray-400 line-through font-medium">{displayOriginal}</span>}
        </div>

        {/* Add to Cart Button - mt-auto untuk push ke bawah */}
        <button
          onClick={handleBuy}
          className={`
            w-full h-9 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm mt-auto
            ${
              added
                ? "bg-green-500 text-white shadow-green-200 pointer-events-none"
                : "bg-gray-900 text-white hover:bg-[var(--color-primary)] hover:text-white hover:shadow-[var(--color-primary-200)]"
            }
          `}
        >
          {added ? (
            <>
              <span className="relative w-4 h-4 flex items-center justify-center">
                <CheckIcon added={added} />
              </span>
              <span>Added</span>
            </>
          ) : (
            <>
              <span>Add to Cart</span>
              <CartIcon added={added} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
