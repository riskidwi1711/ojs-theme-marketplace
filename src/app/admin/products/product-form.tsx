"use client";
import * as React from "react";
import type { ProductItem } from "@/api/products";
import type { AdminCategoryItem } from "@/api/admin/categories";
import type { AdminSectionItem } from "@/api/admin/sections";
import type { AdminTagItem } from "@/api/admin/tags";

type ChangelogEntry = { version: string; date: string; tag: string; changes: string[] };
type FormData = Partial<ProductItem> & { featuresText?: string; changelog?: ChangelogEntry[] };

interface Props {
  initial?: FormData;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
  categories?: AdminCategoryItem[];
  sections?: AdminSectionItem[];
  tags?: AdminTagItem[];
}

const TABS = ["Info Dasar", "Harga & Badge", "Deskripsi", "Spesifikasi", "Media", "Changelog"] as const;
type Tab = (typeof TABS)[number];

const inputCls = "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e] transition-colors";
const labelCls = "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";

export default function ProductForm({ initial = {}, onSubmit, onCancel, loading, submitLabel = "Simpan", categories = [], sections = [], tags = [] }: Props) {
  const [tab, setTab] = React.useState<Tab>("Info Dasar");
  const [form, setForm] = React.useState<FormData>({
    name: "",
    slug: "",
    category: "",
    section: "",
    emoji: "📄",
    compat: "",
    price: 0,
    original: undefined,
    badge: "",
    badgeColor: "",
    description: "",
    demoUrl: "",
    ojsVersion: "3.3.x, 3.4.x",
    framework: "Bootstrap 5",
    browserSupport: "Chrome, Firefox, Safari, Edge",
    license: "Single Domain",
    updateDuration: "Gratis 1 tahun",
    supportDuration: "6 bulan via email",
    image: "",
    screenshots: initial.screenshots ?? initial.gallery ?? [],
    tags: initial.tags ?? [],
    changelog: initial.changelog ?? [],
    ...initial,
    featuresText: initial.features?.join("\n") ?? "",
  });

  const set = (key: keyof FormData, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const handleNameChange = (val: string) => {
    set("name", val);
    if (!initial.slug) {
      set("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  // ── Thumbnail ──
  const [thumbPreview, setThumbPreview] = React.useState<string>(initial.image ?? "");
  const thumbRef = React.useRef<HTMLInputElement>(null);

  const handleThumbFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setThumbPreview(src);
      set("image", src);
    };
    reader.readAsDataURL(file);
  };

  // ── Screenshots ──
  const [screenshotPreviews, setScreenshotPreviews] = React.useState<string[]>(initial.screenshots ?? initial.gallery ?? []);
  const ssRef = React.useRef<HTMLInputElement>(null);

  const handleScreenshotFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setScreenshotPreviews((p) => [...p, src]);
        setForm((prev) => ({ ...prev, screenshots: [...(prev.screenshots ?? []), src] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (idx: number) => {
    setScreenshotPreviews((p) => p.filter((_, i) => i !== idx));
    setForm((prev) => ({ ...prev, screenshots: (prev.screenshots ?? []).filter((_, i) => i !== idx) }));
  };

  // ── Tags ──
  const toggleTag = (slug: string) => {
    setForm((prev) => {
      const cur = prev.tags ?? [];
      const next = cur.includes(slug) ? cur.filter((t) => t !== slug) : [...cur, slug];
      return { ...prev, tags: next };
    });
  };

  // ── Changelog ──
  const changelogEntries: ChangelogEntry[] = form.changelog ?? [];

  const addChangelogEntry = () => {
    const entry: ChangelogEntry = { version: "", date: "", tag: "Latest", changes: [] };
    setForm((prev) => ({ ...prev, changelog: [entry, ...(prev.changelog ?? [])] }));
  };

  const removeChangelogEntry = (idx: number) => {
    setForm((prev) => ({ ...prev, changelog: (prev.changelog ?? []).filter((_, i) => i !== idx) }));
  };

  const updateChangelogField = (idx: number, field: keyof ChangelogEntry, value: string) => {
    setForm((prev) => {
      const entries = [...(prev.changelog ?? [])];
      entries[idx] = { ...entries[idx], [field]: value };
      return { ...prev, changelog: entries };
    });
  };

  const updateChangelogChanges = (idx: number, text: string) => {
    const changes = text.split("\n").map((s) => s.trim()).filter(Boolean);
    setForm((prev) => {
      const entries = [...(prev.changelog ?? [])];
      entries[idx] = { ...entries[idx], changes };
      return { ...prev, changelog: entries };
    });
  };

  // ── Submit ──
  const handleSubmit = () => {
    const features = form.featuresText
      ? form.featuresText.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];
    onSubmit({ ...form, features });
  };

  return (
    <div className="flex flex-col" style={{ maxHeight: "75vh" }}>
      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white/5 border border-white/8 p-1 rounded-xl flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === t
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-white/35 hover:text-white/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 pr-1">
        {tab === "Info Dasar" && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Nama Produk *</label>
              <input className={inputCls} placeholder="e.g. Akademia – Open Access Scientific Portal" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input className={inputCls} placeholder="e.g. akademia-open-access" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Kategori</label>
                <select className={inputCls} value={form.category ?? ""} onChange={(e) => set("category", e.target.value)}>
                  <option value="">— Pilih Kategori —</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Section</label>
                <select className={inputCls} value={form.section ?? ""} onChange={(e) => set("section", e.target.value)}>
                  <option value="">— Pilih Section —</option>
                  {sections.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Emoji (fallback thumbnail)</label>
                <input className={inputCls} placeholder="📄" value={form.emoji} onChange={(e) => set("emoji", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Kompatibilitas OJS</label>
                <input className={inputCls} placeholder="OJS 3.3.x, 3.4.x" value={form.compat} onChange={(e) => set("compat", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Demo URL</label>
              <input className={inputCls} type="url" placeholder="https://demo.example.com" value={form.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} />
            </div>
            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <label className={labelCls}>Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const selected = (form.tags ?? []).includes(t.slug);
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => toggleTag(t.slug)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          selected
                            ? "bg-[#3d8c1e] border-[#3d8c1e] text-white"
                            : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"
                        }`}
                      >
                        {t.name}
                      </button>
                    );
                  })}
                </div>
                {(form.tags ?? []).length > 0 && (
                  <p className="text-xs text-white/30 mt-1.5">Dipilih: {(form.tags ?? []).join(", ")}</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "Harga & Badge" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Harga (IDR) *</label>
                <input className={inputCls} type="number" placeholder="450000" value={form.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Harga Asli (coret)</label>
                <input className={inputCls} type="number" placeholder="600000" value={form.original ?? ""} onChange={(e) => set("original", e.target.value ? Number(e.target.value) : undefined)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Badge Label</label>
              <input className={inputCls} placeholder="e.g. BESTSELLER, NEW, SALE" value={form.badge} onChange={(e) => set("badge", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Badge Color (Tailwind class)</label>
              <input className={inputCls} placeholder="e.g. bg-green-100 text-green-700" value={form.badgeColor} onChange={(e) => set("badgeColor", e.target.value)} />
              {form.badge && (
                <div className="mt-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${form.badgeColor || "bg-white/10 text-white/60"}`}>
                    {form.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "Deskripsi" && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Deskripsi Produk</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={5}
                placeholder="Deskripsikan tema ini..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Fitur (satu per baris)</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={8}
                placeholder={"Fully Responsive Design\nOJS 3.3.x & 3.4.x Compatible\nEasy Customization via Settings"}
                value={form.featuresText}
                onChange={(e) => set("featuresText", e.target.value)}
              />
              <p className="text-xs text-white/25 mt-1">Tulis satu fitur per baris</p>
            </div>
          </div>
        )}

        {tab === "Spesifikasi" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Versi OJS</label>
                <input className={inputCls} placeholder="3.3.x, 3.4.x" value={form.ojsVersion} onChange={(e) => set("ojsVersion", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Framework</label>
                <input className={inputCls} placeholder="Bootstrap 5" value={form.framework} onChange={(e) => set("framework", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Dukungan Browser</label>
              <input className={inputCls} placeholder="Chrome, Firefox, Safari, Edge" value={form.browserSupport} onChange={(e) => set("browserSupport", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Lisensi</label>
                <input className={inputCls} placeholder="Single Domain" value={form.license} onChange={(e) => set("license", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Durasi Update</label>
                <input className={inputCls} placeholder="Gratis 1 tahun" value={form.updateDuration} onChange={(e) => set("updateDuration", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Durasi Support</label>
              <input className={inputCls} placeholder="6 bulan via email" value={form.supportDuration} onChange={(e) => set("supportDuration", e.target.value)} />
            </div>
          </div>
        )}

        {tab === "Media" && (
          <div className="space-y-6">
            {/* Thumbnail */}
            <div>
              <label className={labelCls}>Thumbnail Utama</label>
              <div
                onClick={() => thumbRef.current?.click()}
                className="border-2 border-dashed border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#3d8c1e] transition-colors"
              >
                {thumbPreview ? (
                  <div className="relative group">
                    <img src={thumbPreview} alt="thumbnail" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">Ganti Gambar</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-2 text-white/25">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span className="text-sm">Klik untuk upload thumbnail</span>
                    <span className="text-xs">PNG, JPG, WebP — maks. 2MB</span>
                  </div>
                )}
              </div>
              <input ref={thumbRef} type="file" accept="image/*" className="hidden" onChange={handleThumbFile} />
              <div className="mt-2">
                <label className={labelCls}>atau masukkan URL gambar</label>
                <input
                  className={inputCls}
                  type="url"
                  placeholder="https://..."
                  value={typeof form.image === "string" && !form.image.startsWith("data:") ? form.image : ""}
                  onChange={(e) => { set("image", e.target.value); setThumbPreview(e.target.value); }}
                />
              </div>
            </div>

            {/* Screenshots */}
            <div>
              <label className={labelCls}>Screenshots Tambahan</label>
              <div className="grid grid-cols-3 gap-3">
                {screenshotPreviews.map((src, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video">
                    <img src={src} alt={`ss-${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeScreenshot(idx)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => ssRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-[#3d8c1e] transition-colors flex flex-col items-center justify-center gap-1 text-white/25 hover:text-[#3d8c1e]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="text-xs">Tambah</span>
                </button>
              </div>
              <input ref={ssRef} type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshotFiles} />
            </div>
          </div>
        )}

        {tab === "Changelog" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/35">Kelola riwayat versi produk ini.</p>
              <button
                type="button"
                onClick={addChangelogEntry}
                className="px-3 py-1.5 text-xs font-semibold bg-[#3d8c1e] hover:bg-[#317318] text-white rounded-lg transition-colors"
              >
                + Tambah Versi
              </button>
            </div>

            {changelogEntries.length === 0 && (
              <div className="text-center py-10 text-white/20 text-sm border border-dashed border-white/8 rounded-xl">
                Belum ada changelog. Klik "+ Tambah Versi" untuk mulai.
              </div>
            )}

            {changelogEntries.map((entry, idx) => (
              <div key={idx} className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Versi #{changelogEntries.length - idx}</span>
                  <button
                    type="button"
                    onClick={() => removeChangelogEntry(idx)}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold"
                  >
                    Hapus
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>Versi</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. 2.1.0"
                      value={entry.version}
                      onChange={(e) => updateChangelogField(idx, "version", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Tanggal</label>
                    <input
                      className={inputCls}
                      placeholder="e.g. Maret 2025"
                      value={entry.date}
                      onChange={(e) => updateChangelogField(idx, "date", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Label</label>
                    <input
                      className={inputCls}
                      placeholder="Latest / Major / Patch"
                      value={entry.tag}
                      onChange={(e) => updateChangelogField(idx, "tag", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Perubahan (satu per baris)</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder={"Kompatibel penuh dengan OJS 3.4.0\nPerbaikan tampilan mobile"}
                    value={entry.changes.join("\n")}
                    onChange={(e) => updateChangelogChanges(idx, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-5 mt-4 border-t border-white/8">
        <button onClick={onCancel} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors disabled:opacity-50">
          Batal
        </button>
        <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] hover:bg-[#317318] text-white text-sm font-semibold transition-colors disabled:opacity-60">
          {loading ? "Menyimpan…" : submitLabel}
        </button>
      </div>
    </div>
  );
}
