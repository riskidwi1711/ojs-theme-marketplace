"use client";

import * as React from "react";
import { FaBox, FaGift, FaTools } from "react-icons/fa";
import { LuArrowRight } from "react-icons/lu";
import { getBanners } from "@/api/banners";
import type { BannerItem } from "@/types/banner";

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: "1",
    title: "Paket Hemat",
    subtitle: "Bundle 5 Tema",
    price: "Hanya $59.9",
    discount: "Hemat hingga 40%",
    icon: "FaBox",
    bg: "from-violet-600 to-purple-800",
    textColor: "text-white",
    subColor: "text-purple-200",
    href: "/themes?bundle=true",
    cta: "Lihat Bundle",
  },
  {
    id: "2",
    title: "STARTER THEME",
    subtitle: "Gratis selamanya",
    price: "$0",
    originalPrice: "$15",
    description: "OJS 3.3+",
    icon: "FaGift",
    bg: "from-[#1a1a2e] to-[#16213e]",
    textColor: "text-white",
    subColor: "text-white/80",
    href: "/themes/free",
    cta: "Download Gratis",
  },
  {
    id: "3",
    title: "Custom Development",
    subtitle: "Tema Kustom",
    description: "Sesuai kebutuhan jurnal Anda",
    price: "Dari $299",
    icon: "FaTools",
    bg: "from-amber-50 to-yellow-100",
    textColor: "text-[#1a1a2e]",
    subColor: "text-gray-500",
    href: "/kontak",
    cta: "Konsultasi Gratis",
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaBox, FaGift, FaTools,
};

export const PromoBanners: React.FC = () => {
  const [banners, setBanners] = React.useState<BannerItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getBanners().then((data) => {
      setBanners(data.length > 0 ? data : DEFAULT_BANNERS);
    }).catch(() => {
      setBanners(DEFAULT_BANNERS);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="w-full py-10 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {banners.map((banner, idx) => {
          const IconComponent = ICON_MAP[banner.icon || "FaBox"] || FaBox;
          const isDark = !banner.bg?.includes("amber") && !banner.bg?.includes("yellow") && !banner.bg?.includes("white");
          const ctaClass = isDark
            ? "bg-white/15 hover:bg-white/25 text-white border border-white/20"
            : "bg-[#1a1a2e]/8 hover:bg-[#1a1a2e]/15 text-[#1a1a2e] border border-[#1a1a2e]/15";

          return (
            <div
              key={banner.id || idx}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${banner.bg || "from-gray-100 to-gray-200"} p-6 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-xl transition-all duration-300 group`}
            >
              {/* Decorative icon — top right */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <IconComponent size={72} className={isDark ? "text-white" : "text-[#1a1a2e]"} />
              </div>

              <div>
                {banner.subtitle && (
                  <p className={`text-xs font-bold ${banner.subColor || "text-white/80"} uppercase tracking-widest mb-2`}>
                    {banner.subtitle}
                  </p>
                )}
                <h3 className={`text-xl font-extrabold ${banner.textColor || "text-white"} leading-tight mb-1`}>
                  {banner.title}
                </h3>
                {banner.originalPrice ? (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-2xl font-black ${banner.textColor || "text-white"}`}>{banner.price}</span>
                    <span className={`text-sm line-through opacity-50 ${banner.textColor || "text-white"}`}>{banner.originalPrice}</span>
                  </div>
                ) : banner.price ? (
                  <p className={`text-2xl font-black ${banner.textColor || "text-white"} mt-1`}>{banner.price}</p>
                ) : null}
                {banner.discount && (
                  <p className={`text-xs ${banner.subColor || "text-white/70"} mt-1 font-semibold`}>{banner.discount}</p>
                )}
                {banner.description && (
                  <p className={`text-xs ${banner.subColor || "text-white/60"} mt-1`}>{banner.description}</p>
                )}
              </div>

              {/* CTA */}
              {banner.cta && (
                <a
                  href={banner.href || "#"}
                  className={`mt-4 self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${ctaClass}`}
                >
                  {banner.cta}
                  <LuArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PromoBanners;
