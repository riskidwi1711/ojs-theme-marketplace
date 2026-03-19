"use client";
import * as React from "react";
import { adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory, type AdminCategoryItem } from "@/api/admin/categories";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const inputCls = "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls = "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";

export default function AdminCategories() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminCategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [color, setColor] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const [editTarget, setEditTarget] = React.useState<AdminCategoryItem | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editDesc, setEditDesc] = React.useState("");
  const [editing, setEditing] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<AdminCategoryItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setItems(await adminListCategories());
    } catch (e: any) {
      setError(e.message || "Failed to load");
      toast(e.message || "Gagal memuat kategori", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminCreateCategory({ name, slug: slug || undefined, description: desc || undefined, color: color || undefined });
      toast(`Kategori "${name}" berhasil ditambahkan`, "success");
      setName(""); setSlug(""); setDesc(""); setColor("");
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menambahkan kategori", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget) return;
    setEditing(true);
    try {
      await adminUpdateCategory(editTarget.slug, { name: editName, description: editDesc });
      toast("Kategori berhasil diperbarui", "success");
      setEditTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal memperbarui kategori", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteCategory(deleteTarget.slug);
      toast(`Kategori "${deleteTarget.name}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menghapus kategori", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
      </div>

      {/* Create form */}
      <div className="bg-white/5 rounded-xl border border-white/8 p-6 mb-6">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Tambah Kategori Baru</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className={labelCls}>Nama *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Academic" required />
          </div>
          <div>
            <label className={labelCls}>Slug (opsional)</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="academic" />
          </div>
          <div>
            <label className={labelCls}>Deskripsi</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} className={inputCls} placeholder="Tema untuk jurnal akademik" />
          </div>
          <div>
            <label className={labelCls}>Color</label>
            <input value={color} onChange={(e) => setColor(e.target.value)} className={inputCls} placeholder="#3e9020" />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="md:col-span-4 md:w-fit bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all disabled:opacity-60"
          >
            {creating ? "Menambahkan…" : "+ Add Category"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white/80">List Kategori</span>
          <span className="text-sm text-white/35">{loading ? "Loading…" : error ? error : `${items.length} kategori`}</span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Nama</th>
              <th className="px-6 py-3 font-semibold">Slug</th>
              <th className="px-6 py-3 font-semibold">Deskripsi</th>
              <th className="px-6 py-3 font-semibold">Color</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-white/30">Loading…</td></tr>}
            {!loading && !error && items.map((c) => (
              <tr key={c.slug} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-3 font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    {c.color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.color.startsWith("#") ? c.color : undefined }} />}
                    {c.name}
                  </div>
                </td>
                <td className="px-6 py-3 text-white/40 font-mono text-xs">{c.slug}</td>
                <td className="px-6 py-3 text-white/40 max-w-xs truncate">{c.description || "-"}</td>
                <td className="px-6 py-3 text-white/30 text-xs">{c.color || "-"}</td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setEditTarget(c); setEditName(c.name); setEditDesc(c.description ?? ""); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
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
            {!loading && !error && items.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-white/25">Belum ada kategori</td></tr>}
            {error && !loading && <tr><td colSpan={5} className="px-6 py-8 text-center text-red-400">{error}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => !editing && setEditTarget(null)} title="Edit Kategori" size="sm">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nama</label>
            <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Deskripsi</label>
            <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className={inputCls} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditTarget(null)} disabled={editing} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors">Batal</button>
            <button onClick={handleEdit} disabled={editing || !editName.trim()} className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition-colors disabled:opacity-60">
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
        title="Hapus Kategori?"
        message={`Kategori "${deleteTarget?.name}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
