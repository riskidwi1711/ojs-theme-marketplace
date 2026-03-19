"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { LuX, LuCopy, LuCheck, LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaTools, FaBook, FaStar, FaRocket, FaGraduationCap, FaChartLine, FaUsers, FaShieldAlt, FaGift, FaPalette } from "react-icons/fa";
import { getBanners, type BannerItem } from "@/api/banners";

const PROMO_CODE = "PREMIUM20";

const ICON_MAP: Record<string, React.ReactNode> = {
  "FaTools": <FaTools size={120} />,
  "FaBook": <FaBook size={120} />,
  "FaStar": <FaStar size={120} />,
  "FaRocket": <FaRocket size={120} />,
  "FaGraduationCap": <FaGraduationCap size={120} />,
  "FaChartLine": <FaChartLine size={120} />,
  "FaUsers": <FaUsers size={120} />,
  "FaShieldAlt": <FaShieldAlt size={120} />,
  "FaGift": <FaGift size={120} />,
  "FaPalette": <FaPalette size={120} />,
};

function renderIcon(icon?: string) {
  if (!icon) return null;
  if (ICON_MAP[icon]) return ICON_MAP[icon];
  return icon;
}

// ── Fallback slides ────────────────────────────────────────────────────────────

const FALLBACK_SLIDES: BannerItem[] = [
  {
    title: "Tema OJS Premium untuk Jurnal Akademik",
    subtitle: "Premium OJS Templates",
    description: "Tingkatkan kredibilitas jurnal Anda dengan desain profesional. Mudah dikustomisasi, SEO-friendly, dan mobile-responsive.",
    bg: "from-[#071428] via-[#0d2a52] to-[#071a0a]",
    textColor: "text-white",
    subColor: "text-emerald-400",
    href: "/themes",
    icon: "FaGraduationCap",
  },
  {
    title: "DISKON 20% SEMUA TEMA",
    subtitle: "Flash Sale – Hari Ini Saja",
    description: "Gunakan kode voucher di bawah dan hemat hingga 20% untuk semua tema premium. Jangan sampai kehabisan!",
    bg: "from-[#160826] via-[#260f40] to-[#0e1c10]",
    textColor: "text-white",
    subColor: "text-amber-400",
    href: `voucher:${PROMO_CODE}`,
    icon: "FaGift",
    price: "20% OFF",
    discount: "Semua Tema",
  },
  {
    title: "Gratis Update Selamanya",
    subtitle: "Lifetime Free Updates",
    description: "Beli sekali, dapatkan semua update masa depan secara gratis. Kompatibel dengan OJS 3.x dan versi terbaru.",
    bg: "from-[#061829] via-[#0c3248] to-[#062016]",
    textColor: "text-white",
    subColor: "text-cyan-400",
    href: "/themes",
    icon: "FaRocket",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

type AccentKey = "emerald" | "amber" | "cyan" | "blue" | "white";

function getAccent(subColor?: string): AccentKey {
  if (subColor?.includes("emerald")) return "emerald";
  if (subColor?.includes("amber")) return "amber";
  if (subColor?.includes("cyan")) return "cyan";
  if (subColor?.includes("blue")) return "blue";
  return "white";
}

const BADGE_CLASSES: Record<AccentKey, string> = {
  emerald: "bg-emerald-400/15 border border-emerald-400/30 text-emerald-400",
  amber:   "bg-amber-400/15 border border-amber-400/30 text-amber-400",
  cyan:    "bg-cyan-400/15 border border-cyan-400/30 text-cyan-400",
  blue:    "bg-blue-400/15 border border-blue-400/30 text-blue-400",
  white:   "bg-white/10 border border-white/20 text-white/80",
};

const GLOW_CLASSES: Record<AccentKey, string> = {
  emerald: "bg-emerald-500",
  amber:   "bg-amber-500",
  cyan:    "bg-cyan-500",
  blue:    "bg-blue-500",
  white:   "bg-white",
};

// ── Voucher Modal ──────────────────────────────────────────────────────────────

interface VoucherModalProps {
  code: string;
  onClose: () => void;
}

const VoucherModal: React.FC<VoucherModalProps> = ({ code, onClose }) => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShop = () => {
    onClose();
    router.push(`/themes?voucher=${code}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Gradient header — brand navy → green */}
        <div className="relative bg-linear-to-br from-[#1c3b6d] via-[#1a5228] to-[#3e9020] px-8 pt-7 pb-12 overflow-hidden">
          {/* Dot texture */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Decorative orbs */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-emerald-400/20 blur-2xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <LuX size={14} />
          </button>

          <div className="relative z-10">
            <div className="text-4xl mb-3 leading-none">🎁</div>
            <div className="inline-block bg-white/15 text-white/90 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-2 uppercase tracking-widest">
              Penawaran Terbatas
            </div>
            <h3 className="text-3xl font-black text-white leading-none">Diskon 20%</h3>
          </div>
        </div>

        {/* Body */}
        <div className="relative -mt-6 bg-white rounded-t-4xl z-10 px-8 pt-6 pb-8">
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            Gunakan kode berikut saat checkout untuk mendapatkan diskon 20% di semua tema premium.
          </p>

          {/* Code box */}
          <div className="bg-gray-50 border-2 border-dashed border-[#3e9020]/30 rounded-2xl p-4 mb-2 flex items-center justify-between gap-3">
            <span className="text-2xl font-black font-mono tracking-[0.15em] text-gray-900">{code}</span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                copied
                  ? "bg-green-100 text-green-600 scale-95"
                  : "bg-gray-900 text-white hover:bg-gray-700 hover:scale-105"
              }`}
            >
              {copied ? <><LuCheck size={13} />Disalin!</> : <><LuCopy size={13} />Salin</>}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mb-6 text-center">Berlaku untuk semua tema · Hanya minggu ini</p>

          <button
            onClick={handleShop}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#1c3b6d] to-[#0d2a52] hover:from-[#224680] hover:to-[#0f3060] text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-navy/20"
          >
            Belanja Sekarang <LuArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Slide Card ─────────────────────────────────────────────────────────────────

interface SlideCardProps {
  slide: BannerItem;
  onVoucher: (code: string) => void;
}

const SlideCard: React.FC<SlideCardProps> = ({ slide, onVoucher }) => {
  const router = useRouter();
  const isVoucher = slide.href?.startsWith("voucher:");
  const accent = getAccent(slide.subColor);

  const handleCta = () => {
    if (!slide.href) return;
    if (isVoucher) {
      onVoucher(slide.href.replace("voucher:", ""));
    } else {
      router.push(slide.href);
    }
  };

  return (
    <div
      className={`w-full h-full bg-linear-to-br ${slide.bg || "from-[#071428] via-[#0d2a52] to-[#0d2a52]"} relative overflow-hidden`}
    >
      {/* Background: glow orbs */}
      <div className="absolute -top-32 -right-16 w-125 h-125 rounded-full bg-white/4 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-black/25 blur-3xl pointer-events-none" />
      <div
        className={`absolute top-1/2 right-1/3 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-[0.12] pointer-events-none ${GLOW_CLASSES[accent]}`}
      />

      {/* Background: radial dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1.2px, transparent 1.2px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Background: diagonal stripe accent (right half) */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(-55deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Decorative icon — right side */}
      {slide.icon && (
        <div className="absolute right-6 md:right-14 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden sm:block">
          <div className="relative flex items-center justify-center">
            {/* Outer soft glow */}
            <div
              className={`absolute rounded-full blur-3xl opacity-25 ${GLOW_CLASSES[accent]}`}
              style={{ width: "180px", height: "180px" }}
            />
            {/* Dashed ring */}
            <div
              className="absolute rounded-full border border-white/10"
              style={{
                width: "200px",
                height: "200px",
                borderStyle: "dashed",
                borderWidth: "1.5px",
              }}
            />
            {/* Solid inner ring */}
            <div
              className="absolute rounded-full border border-white/5"
              style={{ width: "150px", height: "150px" }}
            />
            {/* The icon */}
            <span
              className="leading-none opacity-80 text-white"
              style={{ filter: "drop-shadow(0 0 32px rgba(255,255,255,0.18))" }}
            >
              {renderIcon(slide.icon)}
            </span>
          </div>
        </div>
      )}

      {/* Floating price badge (for discount slides) */}
      {slide.price && (
        <div
          className="absolute top-5 z-10 bg-amber-400 text-gray-900 font-black text-sm px-4 py-1.5 rounded-xl shadow-lg shadow-amber-500/30"
          style={{
            right: "calc(50% - 260px)",
            transform: "rotate(-6deg)",
          }}
        >
          {slide.price}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-16">
        <div className="max-w-lg">
          {/* Subtitle pill */}
          {slide.subtitle && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 ${BADGE_CLASSES[accent]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {slide.subtitle}
            </div>
          )}

          {/* Headline */}
          <h2 className="text-[2rem] md:text-[2.8rem] font-black leading-[1.08] tracking-tight text-white mb-5">
            {slide.title}
          </h2>

          {/* Description */}
          {slide.description && (
            <p className="text-sm md:text-[15px] text-white/60 mb-8 max-w-md leading-relaxed">
              {slide.description}
            </p>
          )}

          {/* CTA Button */}
          {slide.href && (
            <button
              onClick={handleCta}
              className={`group inline-flex items-center gap-2 font-bold text-[13px] px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] shadow-xl ${
                isVoucher
                  ? "bg-linear-to-r from-amber-400 to-orange-400 text-gray-900 hover:from-amber-300 hover:to-orange-300 shadow-amber-500/25"
                  : "bg-white text-gray-900 hover:bg-gray-50 shadow-black/25"
              }`}
            >
              {isVoucher ? "🎉 Klaim Voucher Sekarang" : "Lihat Koleksi Lengkap"}
              <LuArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main HeroBanner ────────────────────────────────────────────────────────────

export const HeroBanner: React.FC = () => {
  const [slides, setSlides] = React.useState<BannerItem[]>([]);
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [voucherCode, setVoucherCode] = React.useState<string | null>(null);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  React.useEffect(() => {
    getBanners().then((data) => {
      setSlides(data.length > 0 ? data : FALLBACK_SLIDES);
    });
  }, []);

  const total = slides.length;

  const goTo = React.useCallback((idx: number) => {
    setCurrent((idx + total) % total);
  }, [total]);

  const next = React.useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = React.useCallback(() => goTo(current - 1), [current, goTo]);

  React.useEffect(() => {
    if (total <= 1 || paused) return;
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next, paused, total]);

  if (total === 0) return null;

  return (
    <>
      <section className="w-full px-4 md:px-8 lg:px-16 py-4">
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{ minHeight: 480, boxShadow: "0 8px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)`, height: 480 }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="shrink-0 w-full h-full" style={{ width: "100%" }}>
                <SlideCard slide={slide} onVoucher={setVoucherCode} />
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          {total > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 shadow-lg"
                aria-label="Sebelumnya"
              >
                <LuChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 shadow-lg"
                aria-label="Berikutnya"
              >
                <LuChevronRight size={20} />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {total > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-7 h-2.5 bg-white shadow-sm shadow-white/50"
                      : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress bar */}
          {total > 1 && !paused && (
            <div className="absolute bottom-0 left-0 h-0.75 bg-white/10 w-full z-10">
              <div
                key={current}
                className="h-full bg-[#3e9020]"
                style={{ animation: "hero-progress 5s linear forwards" }}
              />
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes hero-progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>

      {voucherCode && (
        <VoucherModal code={voucherCode} onClose={() => setVoucherCode(null)} />
      )}
    </>
  );
};

export default HeroBanner;
