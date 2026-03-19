"use client";
import * as React from "react";
import {
  adminListVouchers,
  adminCreateVoucher,
  adminUpdateVoucher,
  adminDeleteVoucher,
  type AdminVoucherItem,
} from "@/api/admin/vouchers";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const inputCls =
  "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls =
  "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";

const emptyForm = (): Partial<AdminVoucherItem> => ({
  code: "",
  type: "percent",
  value: 0,
  minOrderIDR: 0,
  maxDiscountIDR: 0,
  usageLimit: 0,
  active: true,
  newUsersOnly: false,
  expiresAt: "",
});

export default function AdminVouchers() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminVoucherItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<Partial<AdminVoucherItem>>(emptyForm());
  const [creating, setCreating] = React.useState(false);

  const [editTarget, setEditTarget] = React.useState<AdminVoucherItem | null>(null);
  const [editForm, setEditForm] = React.useState<Partial<AdminVoucherItem>>({});
  const [editing, setEditing] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<AdminVoucherItem | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListVouchers());
    } catch (e: any) {
      setError(e.message || "Failed to load");
      toast(e.message || "Gagal memuat voucher", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const setF = (k: keyof AdminVoucherItem, v: unknown) =>
    setForm((p) => ({ ...p, [k]: v }));
  const setEF = (k: keyof AdminVoucherItem, v: unknown) =>
    setEditForm((p) => ({ ...p, [k]: v }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        ...form,
        code: form.code?.toUpperCase().trim(),
        expiresAt: form.expiresAt || undefined,
      };
      await adminCreateVoucher(payload);
      toast(`Voucher "${payload.code}" berhasil ditambahkan`, "success");
      setForm(emptyForm());
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menambahkan voucher", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!editTarget?.id) return;
    setEditing(true);
    try {
      const payload = { ...editForm, expiresAt: editForm.expiresAt || undefined };
      await adminUpdateVoucher(editTarget.id, payload);
      toast("Voucher berhasil diperbarui", "success");
      setEditTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal memperbarui voucher", "error");
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await adminDeleteVoucher(deleteTarget.id);
      toast(`Voucher "${deleteTarget.code}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menghapus voucher", "error");
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (v: AdminVoucherItem) => {
    setEditTarget(v);
    setEditForm({
      code: v.code,
      type: v.type,
      value: v.value,
      minOrderIDR: v.minOrderIDR ?? 0,
      maxDiscountIDR: v.maxDiscountIDR ?? 0,
      usageLimit: v.usageLimit ?? 0,
      active: v.active,
      newUsersOnly: v.newUsersOnly ?? false,
      expiresAt: v.expiresAt ?? "",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Vouchers</h1>
      </div>

      {/* Create form */}
      <div className="bg-white/5 rounded-xl border border-white/8 p-6 mb-6">
        <h2 className="text-sm font-semibold text-white/60 mb-4">Tambah Voucher Baru</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className={labelCls}>Kode *</label>
            <input
              value={form.code}
              onChange={(e) => setF("code", e.target.value)}
              className={inputCls}
              placeholder="PROMO20"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Tipe *</label>
            <select
              value={form.type}
              onChange={(e) => setF("type", e.target.value)}
              className={`${inputCls} bg-[#0d1f35]`}
            >
              <option value="percent">Persen (%)</option>
              <option value="fixed">Nominal (IDR)</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Nilai *</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) => setF("value", Number(e.target.value))}
              className={inputCls}
              placeholder={form.type === "percent" ? "20" : "50000"}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Min. Order (IDR)</label>
            <input
              type="number"
              value={form.minOrderIDR}
              onChange={(e) => setF("minOrderIDR", Number(e.target.value))}
              className={inputCls}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelCls}>Max. Diskon (IDR)</label>
            <input
              type="number"
              value={form.maxDiscountIDR}
              onChange={(e) => setF("maxDiscountIDR", Number(e.target.value))}
              className={inputCls}
              placeholder="0 = tidak ada batas"
            />
          </div>
          <div>
            <label className={labelCls}>Limit Penggunaan</label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={(e) => setF("usageLimit", Number(e.target.value))}
              className={inputCls}
              placeholder="0 = unlimited"
            />
          </div>
          <div>
            <label className={labelCls}>Kadaluarsa</label>
            <input
              type="datetime-local"
              value={form.expiresAt ?? ""}
              onChange={(e) => setF("expiresAt", e.target.value)}
              className={`${inputCls} [color-scheme:dark]`}
            />
          </div>
          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setF("active", e.target.checked)}
                className="w-4 h-4 accent-[#3d8c1e]"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.newUsersOnly}
                onChange={(e) => setF("newUsersOnly", e.target.checked)}
                className="w-4 h-4 accent-[#3d8c1e]"
              />
              User Baru Saja
            </label>
          </div>
          <button
            type="submit"
            disabled={creating}
            className="md:col-span-3 md:w-fit bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all disabled:opacity-60"
          >
            {creating ? "Menambahkan…" : "+ Add Voucher"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white/80">List Voucher</span>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `${items.length} voucher`}
          </span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Kode</th>
              <th className="px-6 py-3 font-semibold">Tipe / Nilai</th>
              <th className="px-6 py-3 font-semibold">Min. Order</th>
              <th className="px-6 py-3 font-semibold">Limit / Terpakai</th>
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
            {!loading && !error && items.map((v) => (
              <tr key={v.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-3 font-mono font-bold text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    {v.code}
                    {v.newUsersOnly && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                        NEW ONLY
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-white/60">
                  {v.type === "percent" ? `${v.value}%` : `Rp ${v.value?.toLocaleString("id-ID")}`}
                  {v.maxDiscountIDR ? (
                    <span className="text-white/30 text-xs ml-1">
                      (max Rp {v.maxDiscountIDR.toLocaleString("id-ID")})
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-3 text-white/40">
                  {v.minOrderIDR ? `Rp ${v.minOrderIDR.toLocaleString("id-ID")}` : "-"}
                </td>
                <td className="px-6 py-3 text-white/40">
                  {v.usageLimit ? `${v.usedCount ?? 0} / ${v.usageLimit}` : `${v.usedCount ?? 0} / ∞`}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      v.active
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-white/5 text-white/25 border-white/10"
                    }`}
                  >
                    {v.active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(v)}
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
                <td colSpan={6} className="px-6 py-8 text-center text-white/25">Belum ada voucher</td>
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
      <Modal open={!!editTarget} onClose={() => !editing && setEditTarget(null)} title="Edit Voucher" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Kode</label>
              <input
                value={editForm.code}
                onChange={(e) => setEF("code", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Tipe</label>
              <select
                value={editForm.type}
                onChange={(e) => setEF("type", e.target.value)}
                className={`${inputCls} bg-[#0d1f35]`}
              >
                <option value="percent">Persen (%)</option>
                <option value="fixed">Nominal (IDR)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Nilai</label>
              <input
                type="number"
                value={editForm.value}
                onChange={(e) => setEF("value", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Min. Order (IDR)</label>
              <input
                type="number"
                value={editForm.minOrderIDR}
                onChange={(e) => setEF("minOrderIDR", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Max. Diskon (IDR)</label>
              <input
                type="number"
                value={editForm.maxDiscountIDR}
                onChange={(e) => setEF("maxDiscountIDR", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Limit Penggunaan</label>
              <input
                type="number"
                value={editForm.usageLimit}
                onChange={(e) => setEF("usageLimit", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Kadaluarsa</label>
              <input
                type="datetime-local"
                value={editForm.expiresAt ?? ""}
                onChange={(e) => setEF("expiresAt", e.target.value)}
                className={`${inputCls} [color-scheme:dark]`}
              />
            </div>
            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={editForm.active}
                  onChange={(e) => setEF("active", e.target.checked)}
                  className="w-4 h-4 accent-[#3d8c1e]"
                />
                Aktif
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
                <input
                  type="checkbox"
                  checked={editForm.newUsersOnly}
                  onChange={(e) => setEF("newUsersOnly", e.target.checked)}
                  className="w-4 h-4 accent-[#3d8c1e]"
                />
                User Baru Saja
              </label>
            </div>
          </div>
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
        title="Hapus Voucher?"
        message={`Voucher "${deleteTarget?.code}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
