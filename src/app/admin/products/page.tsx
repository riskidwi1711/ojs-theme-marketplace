"use client";
import * as React from "react";
import { adminListProducts, adminCreateProduct, adminDeleteProduct, adminUpdateProduct } from "@/api/admin/products";
import { adminListCategories } from "@/api/admin/categories";
import { adminListSections } from "@/api/admin/sections";
import { adminListTags } from "@/api/admin/tags";
import type { ProductItem } from "@/api/products";
import type { AdminCategoryItem } from "@/api/admin/categories";
import type { AdminSectionItem } from "@/api/admin/sections";
import type { AdminTagItem } from "@/api/admin/tags";
import { Price } from "@/components/ui/price";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import ProductForm from "./product-form";
import http from "@/api/adminHttp";

export default function AdminProducts() {
  const toast = useToast();
  const [items, setItems] = React.useState<ProductItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [categories, setCategories] = React.useState<AdminCategoryItem[]>([]);
  const [sections, setSections] = React.useState<AdminSectionItem[]>([]);
  const [tags, setTags] = React.useState<AdminTagItem[]>([]);

  const [addOpen, setAddOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<ProductItem | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<ProductItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [uploadTarget, setUploadTarget] = React.useState<ProductItem | null>(null);
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminListProducts();
        if (mounted) setItems(data);
        const [cats, secs, tgs] = await Promise.all([adminListCategories(), adminListSections(), adminListTags()]);
        if (mounted) setCategories(Array.isArray(cats) ? cats : []);
        if (mounted) setSections(Array.isArray(secs) ? secs : []);
        if (mounted) setTags(Array.isArray(tgs) ? tgs : []);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = React.useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [items, query]);

  const handleAdd = async (data: Partial<ProductItem>) => {
    setSaving(true);
    try {
      const created = await adminCreateProduct(data);
      setItems((prev) => [created, ...prev]);
      toast(`Produk "${created.name}" berhasil ditambahkan`, "success");
      setAddOpen(false);
    } catch (e: any) {
      toast(e.message || "Gagal menambahkan produk", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (data: Partial<ProductItem>) => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const updated = await adminUpdateProduct(editTarget.id, data);
      setItems((prev) => prev.map((p) => p.id === editTarget.id ? updated : p));
      toast(`Produk "${updated.name}" berhasil diperbarui`, "success");
      setEditTarget(null);
    } catch (e: any) {
      toast(e.message || "Gagal memperbarui produk", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminDeleteProduct(deleteTarget.id);
      setItems((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast(`Produk "${deleteTarget.name}" berhasil dihapus`, "success");
      setDeleteTarget(null);
    } catch (e: any) {
      toast(e.message || "Gagal menghapus produk", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadTarget || !uploadFile) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", uploadFile);
      await http.post(`/api/v1/admin/products/${uploadTarget.id}/file`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("File tema berhasil diupload", "success");
      setUploadTarget(null);
      setUploadFile(null);
    } catch (e: any) {
      toast(e.message || "Upload gagal", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products Management</h1>
        <button
          onClick={() => setAddOpen(true)}
          className="bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="px-3 py-2 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 bg-white/5 w-64 focus:outline-none focus:border-[#3d8c1e]"
            />
            <button className="px-3 py-2 bg-[#3d8c1e] text-white rounded-lg text-sm font-medium hover:bg-[#317318] transition-colors">Filter</button>
          </div>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 w-16 font-semibold"><input type="checkbox" className="rounded border-white/20 bg-white/5" /></th>
              <th className="px-6 py-3 font-semibold">Product Name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Price</th>
              <th className="px-6 py-3 font-semibold">Rating</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-white/30">Loading products…</td></tr>
            )}
            {!loading && !error && filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-white/20 bg-white/5" /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/8 rounded-md flex items-center justify-center text-lg">{p.emoji || "📄"}</div>
                    <div>
                      <div className="font-medium text-white/90">{p.name}</div>
                      <div className="text-xs text-white/35">Slug: {p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/50">
                  <select
                    className="border border-white/10 rounded px-2 py-1 text-sm bg-[#0d1f35] text-white/70"
                    value={p.category || ""}
                    onChange={async (e) => {
                      const slug = e.target.value;
                      try {
                        await adminUpdateProduct(p.id, { category: slug || undefined });
                        setItems((prev) => prev.map((it) => it.id === p.id ? { ...it, category: slug } : it));
                        toast("Kategori diperbarui", "success");
                      } catch (err: any) {
                        toast(err.message || "Gagal memperbarui kategori", "error");
                      }
                    }}
                  >
                    <option value="">-</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 font-medium"><Price value={p.price} original={p.original} /></td>
                <td className="px-6 py-4 text-white/40">{p.rating ? `${p.rating}★ (${p.reviews ?? 0})` : "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setUploadTarget(p); setUploadFile(null); }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all text-xs font-semibold border border-indigo-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Upload
                    </button>
                    <button
                      onClick={() => setEditTarget(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
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
            {!loading && !error && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-white/25">No products found</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-red-400">{error}</td></tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
          <button className="text-sm text-white/25 cursor-not-allowed" disabled>Previous</button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3d8c1e] text-white font-medium text-sm">1</button>
          </div>
          <button className="text-sm text-white/25 cursor-not-allowed" disabled>Next</button>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => !saving && setAddOpen(false)} title="Tambah Produk Baru" size="xl">
        <ProductForm
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
          loading={saving}
          submitLabel="Tambah Produk"
          categories={categories}
          sections={sections}
          tags={tags}
        />
      </Modal>

      <Modal open={!!editTarget} onClose={() => !saving && setEditTarget(null)} title="Edit Produk" size="xl">
        <ProductForm
          initial={editTarget ?? {}}
          onSubmit={handleEdit}
          onCancel={() => setEditTarget(null)}
          loading={saving}
          submitLabel="Simpan Perubahan"
          categories={categories}
          sections={sections}
          tags={tags}
        />
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Produk?"
        message={`Produk "${deleteTarget?.name}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
      />

      <Modal
        open={!!uploadTarget}
        onClose={() => !uploading && (setUploadTarget(null), setUploadFile(null))}
        title="Upload File Tema"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            Produk: <span className="font-semibold text-white">{uploadTarget?.name}</span>
          </p>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">File ZIP</label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-white/70 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-white/80 hover:file:bg-white/15 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setUploadTarget(null); setUploadFile(null); }}
              disabled={uploading}
              className="px-4 py-2 text-sm text-white/50 hover:text-white/80 transition-colors disabled:opacity-40"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Mengupload…
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
