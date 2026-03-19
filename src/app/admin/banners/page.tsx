"use client";
import * as React from "react";
import {
  adminListBanners,
  adminCreateBanner,
  adminUpdateBanner,
  adminDeleteBanner,
  type AdminBannerItem,
} from "@/api/admin/banners";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const inputCls =
  "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls =
  "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";

const emptyForm = (): Partial<AdminBannerItem> => ({
  title: "",
  subtitle: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: "",
  icon: "",
  bg: "",
  textColor: "",
  subColor: "",
  href: "",
  active: true,
  order: 0,
});

export default function AdminBanners() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminBannerItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<Partial<AdminBannerItem>>(emptyForm());
  const [creating, setCreating] = React.useState(false);

  const [editTarget, setEditTarget] = React.useState<AdminBannerItem | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<AdminBannerItem>>({});
  const [editing, setEditing] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<AdminBannerItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListBanners());
    } catch (e: any) {
      setError(e.message || "Failed to load");
      toast(e.message || "Gagal memuat banner", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const setF = (k: keyof AdminBannerItem, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));
  const setEF = (k: keyof AdminBannerItem, v: unknown) =>
    setEditForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminCreateBanner(form);
      toast(`Banner "${form.title}" berhasil ditambahkan`, "success");
      setForm(emptyForm());
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menambahkan banner", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget?.id) return;
    setEditing(true);
    try {
      await adminUpdateBanner(editTarget.id, editForm);
      toast("Banner berhasil diperbarui", "success");
      setEditTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal memperbarui banner", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await adminDeleteBanner(deleteTarget.id);
      toast(`Banner "${deleteTarget.title}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menghapus banner", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Banners</h1>
      </div>

      {/* Create form */}
      <div className="bg-white/5 rounded-xl border border-white/8 p-6 mb-6">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Tambah Banner Baru</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className={labelCls}>Judul *</label>
            <input
              value={form.title}
              onChange={(e) => setF("title", e.target.value)}
              className={inputCls}
              placeholder="e.g. Bundle Promo — Hemat 30%"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input
              value={form.subtitle}
              onChange={(e) => setF("subtitle", e.target.value)}
              className={inputCls}
              placeholder="Deskripsi singkat"
            />
          </div>
          <div>
            <label className={labelCls}>Harga Display</label>
            <input
              value={form.price}
              onChange={(e) => setF("price", e.target.value)}
              className={inputCls}
              placeholder="Rp 350.000"
            />
          </div>
          <div>
            <label className={labelCls}>Diskon</label>
            <input
              value={form.discount}
              onChange={(e) => setF("discount", e.target.value)}
              className={inputCls}
              placeholder="-30%"
            />
          </div>
          <div>
            <label className={labelCls}>Link (href)</label>
            <input
              value={form.href}
              onChange={(e) => setF("href", e.target.value)}
              className={inputCls}
              placeholder="/themes?category=academic"
            />
          </div>
          <div>
            <label className={labelCls}>Icon (emoji/svg class)</label>
            <input
              value={form.icon}
              onChange={(e) => setF("icon", e.target.value)}
              className={inputCls}
              placeholder="🎨"
            />
          </div>
          <div>
            <label className={labelCls}>Background (Tailwind)</label>
            <input
              value={form.bg}
              onChange={(e) => setF("bg", e.target.value)}
              className={inputCls}
              placeholder="from-blue-900/80 to-green-900/80"
            />
          </div>
          <div>
            <label className={labelCls}>Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setF("order", Number(e.target.value))}
              className={inputCls}
              placeholder="0"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setF("active", e.target.checked)}
                className="w-4 h-4 accent-[#3d8c1e]"
              />
              Aktif
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="md:col-span-3 md:w-fit bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all disabled:opacity-60"
          >
            {creating ? "Menambahkan…" : "+ Add Banner"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white/80">List Banner</span>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `${items.length} banner`}
          </span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Judul</th>
              <th className="px-6 py-3 font-semibold">Subtitle</th>
              <th className="px-6 py-3 font-semibold">Harga</th>
              <th className="px-6 py-3 font-semibold">Order</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-white/30">Loading…</td>
              </tr>
            )}
            {!loading && !error && items.map((b, idx) => (
              <tr key={b.id ?? idx} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-3 font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    {b.icon && <span className="text-lg">{b.icon}</span>}
                    {b.title}
                  </div>
                </td>
                <td className="px-6 py-3 text-white/40 max-w-xs truncate">{b.subtitle || "-"}</td>
                <td className="px-6 py-3 text-white/60">
                  {b.price || "-"}
                  {b.discount && (
                    <span className="ml-1 text-xs text-emerald-400">{b.discount}</span>
                  )}
                </td>
                <td className="px-6 py-3 text-white/40">{b.order ?? 0}</td>
                <td className="px-6 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      b.active
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-white/5 text-white/25 border-white/10"
                    }`}
                  >
                    {b.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditTarget(b); setEditForm({ ...b }); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(b)}
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
                <td colSpan={6} className="px-6 py-8 text-center text-white/25">Belum ada banner</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-400">{error}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => !editing && setEditTarget(null)} title="Edit Banner" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Judul</label>
              <input value={editForm.title ?? ""} onChange={(e) => setEF("title", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input value={editForm.subtitle ?? ""} onChange={(e) => setEF("subtitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Deskripsi</label>
              <input value={editForm.description ?? ""} onChange={(e) => setEF("description", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Harga Display</label>
              <input value={editForm.price ?? ""} onChange={(e) => setEF("price", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Diskon</label>
              <input value={editForm.discount ?? ""} onChange={(e) => setEF("discount", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Icon</label>
              <input value={editForm.icon ?? ""} onChange={(e) => setEF("icon", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Link (href)</label>
              <input value={editForm.href ?? ""} onChange={(e) => setEF("href", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Background</label>
              <input value={editForm.bg ?? ""} onChange={(e) => setEF("bg", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <input type="number" value={editForm.order ?? 0} onChange={(e) => setEF("order", Number(e.target.value))} className={inputCls} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
                <input type="checkbox" checked={editForm.active} onChange={(e) => setEF("active", e.target.checked)} className="w-4 h-4 accent-[#3d8c1e]" />
                Aktif
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditTarget(null)} disabled={editing} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors">Batal</button>
            <button onClick={handleEdit} disabled={editing} className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition-colors disabled:opacity-60">
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
        title="Hapus Banner?"
        message={`Banner "${deleteTarget?.title}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
