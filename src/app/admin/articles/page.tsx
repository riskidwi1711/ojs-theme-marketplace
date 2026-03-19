"use client";
import * as React from "react";
import {
  adminListArticles,
  adminCreateArticle,
  adminUpdateArticle,
  adminDeleteArticle,
  type AdminArticleItem,
} from "@/api/admin/articles";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const inputCls =
  "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls =
  "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";

const emptyForm = (): Partial<AdminArticleItem> => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  author: "",
  category: "",
  tag: "",
  tagColor: "",
  icon: "",
  iconColor: "",
  bg: "",
  active: true,
  order: 0,
});

export default function AdminArticles() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminArticleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showCreate, setShowCreate] = React.useState(false);
  const [form, setForm] = React.useState<Partial<AdminArticleItem>>(emptyForm());
  const [creating, setCreating] = React.useState(false);

  const [editTarget, setEditTarget] = React.useState<AdminArticleItem | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<AdminArticleItem>>({});
  const [editing, setEditing] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<AdminArticleItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListArticles());
    } catch (e: any) {
      setError(e.message || "Failed to load");
      toast(e.message || "Gagal memuat artikel", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const setF = (k: keyof AdminArticleItem, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));
  const setEF = (k: keyof AdminArticleItem, v: unknown) =>
    setEditForm((p) => ({ ...p, [k]: v }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleCreate = async () => {
    if (!form.title?.trim()) return;
    setCreating(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || autoSlug(form.title),
      };
      await adminCreateArticle(payload);
      toast(`Artikel "${payload.title}" berhasil ditambahkan`, "success");
      setForm(emptyForm());
      setShowCreate(false);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menambahkan artikel", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget?.slug) return;
    setEditing(true);
    try {
      await adminUpdateArticle(editTarget.slug, editForm);
      toast("Artikel berhasil diperbarui", "success");
      setEditTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal memperbarui artikel", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.slug) return;
    setDeleting(true);
    try {
      await adminDeleteArticle(deleteTarget.slug);
      toast(`Artikel "${deleteTarget.title}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menghapus artikel", "error");
    } finally {
      setDeleting(false);
    }
  };

  const ArticleFormFields = ({
    data,
    onChange,
  }: {
    data: Partial<AdminArticleItem>;
    onChange: (k: keyof AdminArticleItem, v: unknown) => void;
  }) => (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className={labelCls}>Judul *</label>
        <input
          value={data.title ?? ""}
          onChange={(e) => {
            onChange("title", e.target.value);
            if (!data.slug) onChange("slug", autoSlug(e.target.value));
          }}
          className={inputCls}
          placeholder="e.g. 5 Cara Memilih Tema OJS Terbaik"
        />
      </div>
      <div>
        <label className={labelCls}>Slug</label>
        <input
          value={data.slug ?? ""}
          onChange={(e) => onChange("slug", e.target.value)}
          className={inputCls}
          placeholder="auto-generate dari judul"
        />
      </div>
      <div>
        <label className={labelCls}>Author</label>
        <input
          value={data.author ?? ""}
          onChange={(e) => onChange("author", e.target.value)}
          className={inputCls}
          placeholder="Nama penulis"
        />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Excerpt</label>
        <textarea
          value={data.excerpt ?? ""}
          onChange={(e) => onChange("excerpt", e.target.value)}
          className={`${inputCls} resize-none`}
          rows={2}
          placeholder="Ringkasan artikel (tampil di listing)"
        />
      </div>
      <div className="col-span-2">
        <label className={labelCls}>Konten (Markdown / HTML)</label>
        <textarea
          value={data.content ?? ""}
          onChange={(e) => onChange("content", e.target.value)}
          className={`${inputCls} resize-none`}
          rows={5}
          placeholder="Isi artikel lengkap..."
        />
      </div>
      <div>
        <label className={labelCls}>Kategori</label>
        <input
          value={data.category ?? ""}
          onChange={(e) => onChange("category", e.target.value)}
          className={inputCls}
          placeholder="Tutorial, Tips, News"
        />
      </div>
      <div>
        <label className={labelCls}>Tag Label</label>
        <input
          value={data.tag ?? ""}
          onChange={(e) => onChange("tag", e.target.value)}
          className={inputCls}
          placeholder="Guide"
        />
      </div>
      <div>
        <label className={labelCls}>Tag Color (Tailwind)</label>
        <input
          value={data.tagColor ?? ""}
          onChange={(e) => onChange("tagColor", e.target.value)}
          className={inputCls}
          placeholder="bg-blue-500/15 text-blue-400"
        />
      </div>
      <div>
        <label className={labelCls}>Icon</label>
        <input
          value={data.icon ?? ""}
          onChange={(e) => onChange("icon", e.target.value)}
          className={inputCls}
          placeholder="📝"
        />
      </div>
      <div>
        <label className={labelCls}>Order</label>
        <input
          type="number"
          value={data.order ?? 0}
          onChange={(e) => onChange("order", Number(e.target.value))}
          className={inputCls}
        />
      </div>
      <div className="flex items-center gap-2 pt-5">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
          <input
            type="checkbox"
            checked={data.active ?? true}
            onChange={(e) => onChange("active", e.target.checked)}
            className="w-4 h-4 accent-[#3d8c1e]"
          />
          Aktif / Publish
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Articles</h1>
        <button
          onClick={() => { setForm(emptyForm()); setShowCreate(true); }}
          className="bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all"
        >
          + Artikel Baru
        </button>
      </div>

      {/* List */}
      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white/80">List Artikel</span>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `${items.length} artikel`}
          </span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Icon</th>
              <th className="px-6 py-3 font-semibold">Judul</th>
              <th className="px-6 py-3 font-semibold">Slug</th>
              <th className="px-6 py-3 font-semibold">Author</th>
              <th className="px-6 py-3 font-semibold">Kategori</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-white/30">Loading…</td>
              </tr>
            )}
            {!loading && !error && items.map((a) => (
              <tr key={a.slug} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-3 text-lg text-center">{a.icon || "-"}</td>
                <td className="px-6 py-3 font-medium text-white/90 max-w-xs truncate">{a.title}</td>
                <td className="px-6 py-3 text-white/40 font-mono text-xs">{a.slug}</td>
                <td className="px-6 py-3 text-white/50">{a.author || "-"}</td>
                <td className="px-6 py-3 text-white/40">
                  {a.category ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {a.category}
                    </span>
                  ) : "-"}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      a.active
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-white/5 text-white/25 border-white/10"
                    }`}
                  >
                    {a.active ? "Publish" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditTarget(a); setEditForm({ ...a }); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-semibold border border-red-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-white/25">Belum ada artikel</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-red-400">{error}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => !creating && setShowCreate(false)} title="Artikel Baru" size="xl">
        <div className="space-y-4">
          <ArticleFormFields data={form} onChange={setF} />
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreate(false)}
              disabled={creating}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleCreate}
              disabled={creating || !form.title?.trim()}
              className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition-colors disabled:opacity-60"
            >
              {creating ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => !editing && setEditTarget(null)} title="Edit Artikel" size="xl">
        <div className="space-y-4">
          <ArticleFormFields data={editForm} onChange={setEF} />
          <div className="flex gap-3">
            <button
              onClick={() => setEditTarget(null)}
              disabled={editing}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleEdit}
              disabled={editing}
              className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition-colors disabled:opacity-60"
            >
              {editing ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Artikel?"
        message={`Artikel "${deleteTarget?.title}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
