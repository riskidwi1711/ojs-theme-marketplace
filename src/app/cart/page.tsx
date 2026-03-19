"use client";
import * as React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart";

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const CartEmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const fmt = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

export default function CartPage() {
  const { items, removeItem, totalIDR } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#3e9020] transition-colors">Beranda</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium">Keranjang</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Keranjang Belanja</h1>

          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <CartEmptyIcon />
              <h2 className="mt-5 text-lg font-semibold text-gray-700">Keranjang kosong</h2>
              <p className="mt-2 text-sm text-gray-400">Tambahkan tema yang kamu suka ke keranjang.</p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-[#3e9020] hover:bg-[#317318] text-white font-semibold text-sm transition-colors"
              >
                Mulai Belanja
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
              {/* Left: Items list */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">
                    {items.length} item{items.length > 1 ? "s" : ""} di keranjang
                  </h2>
                </div>
                <ul className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                      {/* Thumbnail */}
                      <div
                        className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${item.bg ? `bg-gradient-to-br ${item.bg}` : "bg-gray-100"}`}
                      >
                        {item.emoji ? (
                          <span>{item.emoji}</span>
                        ) : item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-gray-400 text-xs">?</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                        {item.compat && (
                          <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                            {item.compat}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-bold text-gray-800">{fmt(item.priceIDR)}</span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <TrashIcon />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="px-6 py-4 border-t border-gray-100">
                  <Link href="/" className="text-sm text-[#3e9020] hover:text-[#317318] font-medium transition-colors">
                    ← Lanjut Belanja
                  </Link>
                </div>
              </div>

              {/* Right: Order summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 text-base mb-4">Ringkasan Pesanan</h2>

                <ul className="space-y-3 mb-4">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3">
                      <span className="text-xs text-gray-600 leading-snug line-clamp-2 flex-1">{item.name}</span>
                      <span className="text-xs font-medium text-gray-800 shrink-0">{fmt(item.priceIDR)}</span>
                    </li>
                  ))}
                </ul>

                <hr className="border-gray-100 mb-4" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-lg font-bold text-gray-900">{fmt(totalIDR)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center w-full h-11 rounded-xl bg-[#3e9020] hover:bg-[#317318] text-white font-semibold text-sm transition-colors"
                >
                  Lanjut ke Checkout →
                </Link>

                <Link
                  href="/"
                  className="flex items-center justify-center w-full h-10 mt-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 font-medium text-sm transition-colors"
                >
                  Lanjut Belanja
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
