"use client";

import * as React from "react";
import { FaMagic, FaPalette, FaBox, FaGift } from "react-icons/fa";
import { getSections } from "@/api/sections";
import type { SectionItem } from "@/types/section";

const DEFAULT_SECTIONS: SectionItem[] = [
  {
    slug: "new-releases",
    name: "Rilis Tema Terbaru 2024",
    sub: "Desain segar & modern",
    icon: "FaMagic",
    iconColor: "text-purple-300",
    bg: "from-violet-800 to-purple-900",
    textColor: "text-white",
    subColor: "text-purple-300",
    tag: "Baru",
    tagBg: "bg-[var(--color-primary)] text-white",
    href: "#",
  },
  {
    slug: "bootstrap-collection",
    name: "Koleksi Bootstrap 3 OJS",
    sub: "Mulai dari $9.9",
    icon: "FaPalette",
    iconColor: "text-amber-500",
    bg: "from-amber-50 to-orange-100",
    textColor: "text-gray-900",
    subColor: "text-gray-600",
    tag: "Populer",
    tagBg: "bg-green-500 text-white",
    href: "#",
  },
  {
    slug: "ojs-34-bundle",
    name: "Paket OJS 3.4",
    sub: "Support terjamin",
    icon: "FaBox",
    iconColor: "text-blue-400",
    bg: "from-sky-50 to-blue-100",
    textColor: "text-gray-900",
    subColor: "text-gray-600",
    tag: "Sale",
    tagBg: "bg-red-500 text-white",
    href: "#",
  },
  {
    slug: "free-themes",
    name: "Tema Gratis",
    sub: "100% free, no credit card",
    icon: "FaGift",
    iconColor: "text-green-500",
    bg: "from-green-50 to-emerald-100",
    textColor: "text-gray-900",
    subColor: "text-gray-600",
    tag: "Gratis",
    tagBg: "bg-blue-500 text-white",
    href: "#",
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaMagic, FaPalette, FaBox, FaGift,
};

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

export const FeaturedBrands: React.FC = () => {
  const [sections, setSections] = React.useState<SectionItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getSections().then((data) => {
      setSections(data.length > 0 ? data : DEFAULT_SECTIONS);
    }).catch(() => {
      setSections(DEFAULT_SECTIONS);
    }).finally(() => {
      setLoading(false);
    });
  }, []);
  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-16 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Koleksi Unggulan</h2>
            <p className="text-sm text-gray-500">Pilihan tema terbaik untuk kebutuhan Anda</p>
          </div>
        </div>
        <a href="/themes" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-600)] transition-colors">
          Lihat Semua
          <ChevronRight />
        </a>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : (
          sections.map((sec) => {
            const IconComponent = ICON_MAP[sec.icon || "FaMagic"] || FaMagic;
            return (
              <a
                key={sec.slug}
                href={sec.href || "#"}
                className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br ${sec.bg || "from-gray-50 to-gray-100"} aspect-[4/3] flex flex-col justify-end p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Big icon with animation */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <IconComponent size={120} className={`${sec.iconColor || "text-gray-400"}`} />
                </div>
                
                {/* Main icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <IconComponent size={40} className={`${sec.iconColor || "text-gray-600"}`} />
                  </div>
                </div>
                
                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-b-3xl"></div>
                
                {/* Tag badge */}
                {sec.tag && (
                  <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm ${sec.tagBg || "bg-gray-500 text-white"}`}>
                    {sec.tag}
                  </span>
                )}
                
                {/* Label - Larger fonts */}
                <div className="relative z-10">
                  <p className={`text-base font-bold leading-snug ${sec.textColor || "text-white"}`}>{sec.name}</p>
                  <p className={`text-sm mt-1 font-semibold ${sec.subColor || "text-white/90"}`}>{sec.sub}</p>
                </div>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
};

export default FeaturedBrands;
