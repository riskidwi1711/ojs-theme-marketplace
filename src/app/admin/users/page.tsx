"use client";
import * as React from "react";
import { adminListAccounts, adminSetRole, adminSetStatus, type AdminAccountItem, type AdminAccountListResponse } from "@/api/admin/accounts";
import { ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

type ActionType = "make-admin" | "make-user" | "ban" | "activate";

interface PendingAction {
  user: AdminAccountItem;
  type: ActionType;
}

const ACTION_CONFIG: Record<ActionType, { title: string; message: (name: string) => string; label: string; variant: "danger" | "primary" }> = {
  "make-admin": { title: "Jadikan Admin?", message: (n) => `${n} akan mendapatkan akses admin penuh.`, label: "Jadikan Admin", variant: "primary" },
  "make-user": { title: "Turunkan ke User?", message: (n) => `${n} akan kehilangan akses admin.`, label: "Turunkan", variant: "danger" },
  "ban":        { title: "Ban Pengguna?", message: (n) => `${n} tidak akan bisa login. Tindakan ini bisa dibalik.`, label: "Ban", variant: "danger" },
  "activate":   { title: "Aktifkan Pengguna?", message: (n) => `${n} akan bisa login kembali.`, label: "Aktifkan", variant: "primary" },
};

export default function AdminUsers() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminAccountItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [pendingAction, setPendingAction] = React.useState<PendingAction | null>(null);
  const [acting, setActing] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data: AdminAccountListResponse = await adminListAccounts({ page, limit: 20, q: q || undefined, role: role || undefined, status: status || undefined } as any);
      setItems((data?.results ?? []) as AdminAccountItem[]);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch (e: any) {
      setError(e.message || "Failed to load users");
      toast(e.message || "Gagal memuat data users", "error");
    } finally { setLoading(false); }
  }, [page, q, role, status]);

  React.useEffect(() => { load(); }, [load]);

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { user, type } = pendingAction;
    setActing(true);
    try {
      if (type === "make-admin") await adminSetRole(user.email, "admin");
      else if (type === "make-user") await adminSetRole(user.email, "user");
      else if (type === "ban") await adminSetStatus(user.email, "banned");
      else if (type === "activate") await adminSetStatus(user.email, "active");

      const label = ACTION_CONFIG[type].label;
      toast(`${label} berhasil untuk ${user.name || user.email}`, "success");
      setPendingAction(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Tindakan gagal", "error");
    } finally {
      setActing(false);
    }
  };

  const cfg = pendingAction ? ACTION_CONFIG[pendingAction.type] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Users Management</h1>
        <button
          onClick={() => toast("Fitur tambah user sedang dikembangkan", "info")}
          className="bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all"
        >
          + Add User
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name/email..."
              className="px-3 py-2 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 bg-white/5 w-64 focus:outline-none focus:border-[#3d8c1e]"
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 border border-white/10 rounded-lg text-sm text-white/70 bg-[#0d1f35] focus:outline-none">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-white/10 rounded-lg text-sm text-white/70 bg-[#0d1f35] focus:outline-none">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
            <button
              className="px-3 py-2 bg-[#3d8c1e] text-white rounded-lg text-sm font-medium hover:bg-[#317318] transition-colors"
              onClick={() => { setPage(1); load(); }}
            >
              Apply
            </button>
          </div>
          <span className="text-sm text-white/35">{loading ? "Loading…" : error ? error : `Page ${page} / ${totalPages}`}</span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 w-16 font-semibold"><input type="checkbox" className="rounded border-white/20 bg-white/5" /></th>
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Joined Date</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-white/30">Loading users…</td></tr>
            )}
            {!loading && !error && items.map((u, idx) => (
              <tr key={u.email || idx} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-4"><input type="checkbox" className="rounded border-white/20 bg-white/5" /></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1c3a6e] flex items-center justify-center text-xs font-bold text-white">
                      {(u.name || u.email || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-white/90">{u.name || u.email}</div>
                      <div className="text-xs text-white/35">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${u.role === "admin" ? "bg-purple-500/15 text-purple-400 border-purple-500/20" : "bg-white/8 text-white/40 border-white/10"}`}>
                    {u.role || "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    u.status === "active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                    : u.status === "banned" ? "bg-red-500/15 text-red-400 border-red-500/20"
                    : "bg-white/8 text-white/40 border-white/10"
                  }`}>
                    {u.status || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID") : "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.role !== "admin" ? (
                      <button
                        onClick={() => setPendingAction({ user: u, type: "make-admin" })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                      >
                        Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => setPendingAction({ user: u, type: "make-user" })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all text-xs font-semibold border border-blue-500/20"
                      >
                        Make User
                      </button>
                    )}
                    {u.status !== "banned" ? (
                      <button
                        onClick={() => setPendingAction({ user: u, type: "ban" })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-semibold border border-red-500/20"
                      >
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => setPendingAction({ user: u, type: "activate" })}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold border border-emerald-500/20"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-white/25">No users found</td></tr>
            )}
            {error && !loading && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-red-400">{error}</td></tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between">
          <button className="text-sm text-white/35 hover:text-white/60 disabled:opacity-30 transition-colors" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
          <div className="text-xs text-white/35">Page {page} of {totalPages}</div>
          <button className="text-sm text-white/35 hover:text-white/60 disabled:opacity-30 transition-colors" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>

      {cfg && pendingAction && (
        <ConfirmModal
          open={!!pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
          title={cfg.title}
          message={cfg.message(pendingAction.user.name || pendingAction.user.email)}
          confirmLabel={cfg.label}
          variant={cfg.variant}
          loading={acting}
        />
      )}
    </div>
  );
}
