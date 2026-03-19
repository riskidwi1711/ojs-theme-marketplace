"use client";

import * as React from "react";
import { FaBook, FaMicroscope, FaFileAlt, FaBalanceScale, FaStar } from "react-icons/fa";
import { getPromos, type PromoItem } from "@/api/promos";
import { useCountdownToMidnight } from "@/helper/hooks";

// Default fallback promos if API returns empty
const DEFAULT_PROMOS: PromoItem[] = [
  {
    id: "1",
    productId: "scholar",
    productName: "Scholar – Clean Academic Journal OJS Theme",
    productImage: "",
    price: 19.00,
    original: 29.00,
    rating: 5,
    reviews: 120,
    sold: 15,
    total: 60,
    badge: "Sale",
    badgeColor: "bg-red-500 text-white",
    compat: "OJS 3.3+",
    emoji: "📘",
    bg: "from-blue-50 to-blue-100",
    active: true,
    order: 1,
  },
  {
    id: "2",
    productId: "akademia",
    productName: "Akademia – Open Access Scientific Portal",
    productImage: "",
    price: 25.00,
    original: 35.00,
    rating: 4,
    reviews: 85,
    sold: 144,
    total: 300,
    badge: "10% Off",
    badgeColor: "bg-[var(--color-primary)] text-white",
    compat: "OJS 3.4+",
    emoji: "🔬",
    bg: "from-cyan-50 to-cyan-100",
    active: true,
    order: 2,
  },
  {
    id: "3",
    productId: "primus",
    productName: "Primus – Minimalist Journal Theme OJS 3.x",
    productImage: "",
    price: 15.00,
    original: 22.00,
    rating: 4.5,
    reviews: 340,
    sold: 344,
    total: 500,
    badge: "Hot",
    badgeColor: "bg-orange-500 text-white",
    compat: "OJS 3.x",
    emoji: "📄",
    bg: "from-indigo-50 to-indigo-100",
    active: true,
    order: 3,
  },
  {
    id: "4",
    productId: "lexica",
    productName: "Lexica – Law Review Journal Template",
    productImage: "",
    price: 18.00,
    original: 28.00,
    rating: 5,
    reviews: 52,
    sold: 35,
    total: 80,
    badge: "New",
    badgeColor: "bg-blue-500 text-white",
    compat: "OJS 3.3+",
    emoji: "⚖️",
    bg: "from-amber-50 to-amber-100",
    active: true,
    order: 4,
  },
];

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

// Map icon name to component
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaBook, FaMicroscope, FaFileAlt, FaBalanceScale,
};

export const TopSaverToday: React.FC = () => {
  const [promos, setPromos] = React.useState<PromoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const countdown = useCountdownToMidnight();

  React.useEffect(() => {
    getPromos().then((data) => {
      setPromos(data.length > 0 ? data : DEFAULT_PROMOS);
      setLoading(false);
    }).catch(() => {
      setPromos(DEFAULT_PROMOS);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-6 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </section>
    );
  }
  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-16">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FaStar className="text-[var(--color-primary)]" size={20} />
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Promo Hari Ini</h2>
          </div>
          <a href="/promos" className="text-base font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-600)] transition-colors">Semua Promo</a>
          {/* Countdown */}
          <div className="flex items-center gap-1 ml-2">
            {countdown.map((t, i) => (
              <React.Fragment key={i}>
                <span className="inline-flex h-8 min-w-[36px] items-center justify-center rounded-lg bg-amber-100 text-amber-900 text-sm font-bold px-2 border border-amber-300">{t}</span>
                {i < 2 && <span className="text-sm font-bold text-gray-500">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-gray-500">
            <ChevronLeft />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-gray-500">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Product cards */}
        {promos.map((p) => {
          const pct = Math.round((p.sold / p.total) * 100);
          const save = (p.original - p.price).toFixed(2);
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col group"
            >
              {/* Image / Preview */}
              {p.productImage ? (
                <div className="relative rounded-xl overflow-hidden bg-gray-50 aspect-square mb-3">
                  <img src={p.productImage} alt={p.productName} className="h-full w-full object-cover" />
                  <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                  <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full font-medium">
                    {p.compat}
                  </span>
                </div>
              ) : (
                <div className={`relative rounded-xl bg-gradient-to-br ${p.bg} aspect-square flex items-center justify-center mb-3`}>
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm select-none">
                    {p.emoji || "📦"}
                  </span>
                  <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                  <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-full font-medium">
                    {p.compat}
                  </span>
                </div>
              )}
              {/* Name - Larger font */}
              <a href={`/themes/${p.productId}`} className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-[var(--color-primary)] mb-2 leading-snug">
                {p.productName}
              </a>
              {/* Rating - Larger stars */}
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="currentColor" className="text-[var(--color-primary)]">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0L6.605 16.28c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.97 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-500 font-medium">({p.reviews})</span>
              </div>
              {/* Prices - Larger */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-lg font-extrabold text-[#1a1a2e]">Rp {p.price.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through font-medium">Rp {p.original.toFixed(2)}</span>
              </div>
              {/* Sold progress */}
              <div className="mb-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">Terjual: {p.sold}/{p.total}</p>
              </div>
              <p className="text-sm text-[var(--color-danger)] font-bold mt-auto">Hemat: Rp {save}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopSaverToday;
