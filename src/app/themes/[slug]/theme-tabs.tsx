"use client";
import * as React from "react";
import Rating from "@/components/ui/rating";
import {
  LuCircleCheck,
  LuTag,
  LuHistory,
  LuMessageSquare,
  LuUser,
  LuStar,
  LuLoader,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuMaximize2,
} from "react-icons/lu";
import { listReviews, createReview, type Review } from "@/api/reviews";

interface ChangelogEntry {
  version: string;
  date: string;
  tag: string;
  changes: string[];
}

interface ThemeTabsProps {
  productId: string;
  title: string;
  image?: string;
  gallery?: string[];
  description?: string;
  features?: string[];
  ojsVersion?: string;
  framework?: string;
  browserSupport?: string;
  license?: string;
  updateDuration?: string;
  supportDuration?: string;
  changelog?: ChangelogEntry[];
  reviewsCount?: number;
  ratingCount?: number;
}

const changelog = [
  {
    version: "2.1.0",
    date: "Maret 2025",
    tag: "Latest",
    tagColor: "bg-green-500",
    changes: [
      "Kompatibel penuh dengan OJS 3.4.0",
      "Perbaikan tampilan pada layar mobile",
      "Peningkatan kecepatan loading halaman artikel",
      "Penyesuaian font dan tipografi",
    ],
  },
  {
    version: "2.0.0",
    date: "November 2024",
    tag: "Major",
    tagColor: "bg-blue-500",
    changes: [
      "Desain ulang total UI — lebih modern dan bersih",
      "Dukungan dark mode dasar",
      "Optimasi SEO dengan schema markup artikel",
      "Sidebar kategori yang bisa di-collapse",
    ],
  },
  {
    version: "1.5.2",
    date: "Juli 2024",
    tag: "Patch",
    tagColor: "bg-gray-500",
    changes: [
      "Perbaikan bug pada halaman submission",
      "Kompatibilitas dengan plugin Crossref",
      "Fix tampilan tabel pada artikel",
    ],
  },
  {
    version: "1.0.0",
    date: "Januari 2024",
    tag: "Rilis Awal",
    tagColor: "bg-purple-500",
    changes: [
      "Rilis pertama tema ke marketplace",
      "Dukungan OJS 3.3.0+",
      "Template halaman artikel, arsip, dan beranda",
    ],
  },
];

const features = [
  "Fully Responsive Design",
  "OJS 3.3.x & 3.4.x Compatible",
  "Easy Customization via Settings",
  "Optimized for SEO & Speed",
  "Modern & Clean UI",
  "Multi-language Support",
  "Bootstrap 5 Framework",
  "Google Fonts Integration",
  "Custom Color Scheme",
  "Cross-browser Compatible",
];

const specs = [
  { label: "Versi OJS", value: "3.3.x, 3.4.x" },
  { label: "Framework", value: "Bootstrap 5" },
  { label: "Dukungan Browser", value: "Chrome, Firefox, Safari, Edge" },
  { label: "Lisensi", value: "Single Domain" },
  { label: "Update", value: "Gratis 1 tahun" },
  { label: "Support", value: "6 bulan via email" },
];

type Tab = "overview" | "changelog" | "reviews";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = React.useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="text-2xl transition-colors"
        >
          <LuStar
            size={24}
            className={(hovered || value) >= s ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ThemeTabs({ productId, title, image, gallery = [], description, features: featuresProp = [], ojsVersion, framework, browserSupport, license, updateDuration, supportDuration, changelog: changelogProp = [], reviewsCount, ratingCount }: ThemeTabsProps) {
  const [tab, setTab] = React.useState<Tab>("overview");
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  // Reviews state
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [avg, setAvg] = React.useState(0);
  const [dist, setDist] = React.useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [reviewsLoading, setReviewsLoading] = React.useState(false);
  const [reviewsLoaded, setReviewsLoaded] = React.useState(false);

  // Submit review form
  const [rating, setRating] = React.useState(0);
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [submitDone, setSubmitDone] = React.useState(false);

  // Use gallery from API; fall back to thumbnail only if no gallery
  const screenshots = gallery.length > 0 ? gallery : (image ? [image] : []);

  const displayChangelog = changelogProp;

  // Use features from API; fall back to static defaults if none saved
  const displayFeatures = featuresProp.length > 0 ? featuresProp : features;

  // Build specs from props; skip rows with no value
  const displaySpecs = [
    { label: "Versi OJS",         value: ojsVersion    || specs[0].value },
    { label: "Framework",         value: framework     || specs[1].value },
    { label: "Dukungan Browser",  value: browserSupport || specs[2].value },
    { label: "Lisensi",           value: license       || specs[3].value },
    { label: "Update",            value: updateDuration || specs[4].value },
    { label: "Support",           value: supportDuration || specs[5].value },
  ];

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = React.useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i > 0 ? i - 1 : screenshots.length - 1) : null)),
    [screenshots.length]
  );
  const goNext = React.useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i < screenshots.length - 1 ? i + 1 : 0) : null)),
    [screenshots.length]
  );

  // Keyboard nav: ESC, ← →
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handle);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handle);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, goPrev, goNext]);

  // Lazy-load reviews when tab opens
  React.useEffect(() => {
    if (tab !== "reviews" || reviewsLoaded) return;
    setReviewsLoading(true);
    listReviews(productId)
      .then((data) => {
        setReviews(data.reviews);
        setAvg(data.avg);
        setDist(data.dist);
        setReviewsLoaded(true);
      })
      .catch(() => setReviewsLoaded(true))
      .finally(() => setReviewsLoading(false));
  }, [tab, productId, reviewsLoaded]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setSubmitError("Pilih bintang terlebih dahulu"); return; }
    if (!body.trim()) { setSubmitError("Tulis ulasan kamu"); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const rev = await createReview(productId, { rating, body: body.trim() });
      setReviews((prev) => [rev, ...prev]);
      setAvg((prev) => {
        const total = reviews.length + 1;
        return (prev * reviews.length + rating) / total;
      });
      setDist((prev) => ({ ...prev, [rating]: (prev[rating] || 0) + 1 }));
      setRating(0);
      setBody("");
      setSubmitDone(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Gagal mengirim ulasan";
      setSubmitError(msg === "already reviewed" ? "Kamu sudah pernah mengulas produk ini." : msg);
    } finally {
      setSubmitting(false);
    }
  }

  const tabList: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Deskripsi & Fitur", icon: <LuTag size={14} /> },
    { id: "changelog", label: "Changelog", icon: <LuHistory size={14} /> },
    { id: "reviews", label: `Ulasan (${reviewsCount})`, icon: <LuMessageSquare size={14} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-100">
        {tabList.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-[var(--color-primary)] text-[var(--color-primary-700)]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === "overview" && (
        <div className="space-y-8">
          {/* About */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Tentang Tema Ini</h2>
            {description ? (
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{description}</p>
            ) : (
              <>
                <p className="text-gray-600 leading-relaxed text-sm">
                  <strong>{title}</strong> dirancang khusus untuk jurnal ilmiah yang menggunakan sistem OJS 3.
                  Tema ini fokus pada kemudahan navigasi bagi pembaca dan estetika profesional yang
                  meningkatkan kredibilitas jurnal Anda. Dengan integrasi Bootstrap 5 dan optimasi
                  khusus untuk kecepatan dan SEO, jurnal Anda akan tampil sempurna di semua perangkat.
                </p>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Tersedia kustomisasi warna, tipografi, dan layout melalui panel pengaturan OJS — tanpa
                  perlu mengedit kode. Cocok untuk jurnal sains, sosial, humaniora, maupun multidisiplin.
                </p>
              </>
            )}
          </div>

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Screenshot</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {screenshots.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="relative rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-50 cursor-zoom-in group"
                  >
                    <img
                      src={src}
                      alt={`Screenshot ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200">
                        <LuMaximize2 size={16} className="text-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox */}
          {lightboxIndex !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/95 flex flex-col !m-0"
              onClick={closeLightbox}
            >
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-5 py-3 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-white/50 text-sm font-medium tabular-nums">
                  {lightboxIndex + 1} / {screenshots.length}
                </span>
                <button
                  onClick={closeLightbox}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Tutup"
                >
                  <LuX size={18} className="text-white" />
                </button>
              </div>

              {/* Main image + nav arrows */}
              <div
                className="flex-1 flex items-center justify-center relative min-h-0 px-16"
                onClick={closeLightbox}
              >
                {screenshots.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-3 sm:left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Sebelumnya"
                  >
                    <LuChevronLeft size={22} className="text-white" />
                  </button>
                )}

                <img
                  src={screenshots[lightboxIndex]}
                  alt={`Screenshot ${lightboxIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />

                {screenshots.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-3 sm:right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Berikutnya"
                  >
                    <LuChevronRight size={22} className="text-white" />
                  </button>
                )}
              </div>

              {/* Thumbnail strip */}
              {screenshots.length > 1 && (
                <div
                  className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {screenshots.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className={`shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                        i === lightboxIndex
                          ? "border-white opacity-100 scale-105"
                          : "border-transparent opacity-40 hover:opacity-70"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`Thumb ${i + 1}`}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Features grid */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Fitur Lengkap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <LuCircleCheck className="text-green-500 shrink-0" size={18} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Spesifikasi Teknis</h2>
            <div className="divide-y divide-gray-50">
              {displaySpecs.map((s) => (
                <div key={s.label} className="flex justify-between py-3 text-sm">
                  <span className="text-gray-500 font-medium">{s.label}</span>
                  <span className="text-gray-800 font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Changelog ── */}
      {tab === "changelog" && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Riwayat Perubahan</h2>
          {displayChangelog.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada riwayat perubahan.</p>
          ) : (
            <div className="space-y-6">
              {displayChangelog.map((entry, i) => {
                const tagColorMap: Record<string, string> = {
                  Latest: "bg-green-500",
                  Major: "bg-blue-500",
                  Patch: "bg-gray-500",
                  "Rilis Awal": "bg-purple-500",
                };
                const tagColor = (entry as any).tagColor ?? tagColorMap[entry.tag] ?? "bg-gray-400";
                return (
                  <div key={i} className="relative pl-6 border-l-2 border-gray-100 last:border-0">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-200" />
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base font-bold text-gray-900">v{entry.version}</span>
                      <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${tagColor}`}>
                        {entry.tag}
                      </span>
                      <span className="text-xs text-gray-400">{entry.date}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {entry.changes.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Reviews ── */}
      {tab === "reviews" && (
        <div className="space-y-5">
          {reviewsLoading ? (
            <div className="flex justify-center py-16">
              <LuLoader size={28} className="animate-spin text-gray-300" />
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-black text-gray-900">{avg > 0 ? avg.toFixed(1) : "—"}</p>
                    <Rating value={avg} size={16} className="mt-1 justify-center" />
                    <p className="text-xs text-gray-400 mt-1">{reviews.length} ulasan</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = dist[star] ?? 0;
                      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-3 text-right">{star}</span>
                          <span className="text-yellow-400">★</span>
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-5 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Write review form */}
              {!submitDone ? (
                <form onSubmit={handleSubmitReview} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-base font-bold text-gray-800">Tulis Ulasan</h3>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Rating</p>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Ulasan</p>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={3}
                      placeholder="Bagikan pengalaman kamu menggunakan tema ini..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all resize-none"
                    />
                  </div>
                  {submitError && <p className="text-xs text-red-500">{submitError}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? "Mengirim..." : "Kirim Ulasan"}
                  </button>
                </form>
              ) : (
                <div className="bg-green-50 border border-green-100 rounded-3xl p-6 text-center text-sm text-green-700 font-medium">
                  Ulasan kamu berhasil dikirim. Terima kasih!
                </div>
              )}

              {/* Reviews list */}
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  Belum ada ulasan. Jadilah yang pertama!
                </div>
              ) : (
                reviews.map((r) => (
                  <div key={r.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <LuUser size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.name || r.userEmail.split("@")[0]}</p>
                          <p className="text-xs text-gray-400">{r.userEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Rating value={r.rating} size={12} />
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
