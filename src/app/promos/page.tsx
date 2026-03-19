"use client";
import * as React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getPromos, type PromoItem } from "@/api/promos";
import { useCountdownToMidnight } from "@/helper/hooks";

export default function PromosPage() {
  const [promos, setPromos] = React.useState<PromoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [h, m, s] = useCountdownToMidnight();

  React.useEffect(() => {
    getPromos()
      .then((data) => setPromos(data))
      .catch(() => setPromos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-14">
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-2">Promo Hari Ini</p>
            <h1 className="text-3xl font-bold">Penawaran Terbatas</h1>
            <p className="text-white/50 text-sm mt-1">Dapatkan tema premium dengan harga spesial sebelum waktu habis.</p>
          </div>
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest mr-1">Berakhir dalam</span>
            {[h, m, s].map((v, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <span className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-2xl font-black tabular-nums">
                    {v}
                  </span>
                  <span className="text-[9px] text-white/30 mt-1 uppercase tracking-widest">
                    {["Jam", "Menit", "Detik"][i]}
                  </span>
                </div>
                {i < 2 && <span className="text-2xl font-bold text-white/30 mb-4">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-page py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-semibold mb-2">Belum ada promo aktif</p>
            <p className="text-sm">Pantau terus halaman ini untuk penawaran terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {promos.map((p) => {
              const pct = Math.round((p.sold / p.total) * 100);
              const save = (p.original - p.price).toFixed(2);
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col group">
                  {p.productImage ? (
                    <div className="relative rounded-xl overflow-hidden bg-gray-50 aspect-square mb-3">
                      <img src={p.productImage} alt={p.productName} className="h-full w-full object-cover" />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                      <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full font-medium">{p.compat}</span>
                    </div>
                  ) : (
                    <div className={`relative rounded-xl bg-gradient-to-br ${p.bg} aspect-square flex items-center justify-center mb-3`}>
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300 select-none">{p.emoji || "📦"}</span>
                      <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${p.badgeColor}`}>{p.badge}</span>
                      <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-full font-medium">{p.compat}</span>
                    </div>
                  )}
                  <a href={`/themes/${p.productId}`} className="text-xs font-medium text-gray-800 line-clamp-2 hover:text-[var(--color-primary)] mb-1 leading-snug">
                    {p.productName}
                  </a>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm font-bold text-[#1a1a2e]">Rp {p.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 line-through">Rp {p.original.toFixed(2)}</span>
                  </div>
                  <div className="mb-1">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Terjual: {p.sold}/{p.total}</p>
                  </div>
                  <p className="text-[10px] text-[var(--color-danger)] font-medium mt-auto">Hemat: Rp {save}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
