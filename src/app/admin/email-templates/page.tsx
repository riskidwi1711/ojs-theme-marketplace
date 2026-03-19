"use client";
import * as React from "react";
import {
  adminListEmailTemplates,
  adminUpdateEmailTemplate,
  adminResetEmailTemplate,
  type EmailTemplate,
} from "@/api/admin/email-templates";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

const inputCls = "w-full px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls = "block text-xs font-semibold text-white/35 mb-1.5 uppercase tracking-wide";
const textareaCls = "w-full px-3 py-2.5 border border-white/10 rounded-xl text-xs text-white/80 placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e] font-mono leading-relaxed resize-y";

export default function AdminEmailTemplates() {
  const toast = useToast();
  const [items, setItems] = React.useState<EmailTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [editTarget, setEditTarget] = React.useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = React.useState("");
  const [editBody, setEditBody] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const [resetTarget, setResetTarget] = React.useState<EmailTemplate | null>(null);
  const [resetting, setResetting] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await adminListEmailTemplates());
    } catch (e: any) {
      setError(e.message || "Failed to load");
      toast(e.message || "Gagal memuat email templates", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openEdit = (t: EmailTemplate) => {
    setEditTarget(t);
    setEditSubject(t.subject);
    setEditBody(t.body);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      await adminUpdateEmailTemplate(editTarget.key, { subject: editSubject, body: editBody });
      toast(`Template "${editTarget.name}" berhasil disimpan`, "success");
      setEditTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal menyimpan template", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!resetTarget) return;
    setResetting(true);
    try {
      await adminResetEmailTemplate(resetTarget.key);
      toast(`Template "${resetTarget.name}" berhasil direset`, "success");
      setResetTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal mereset template", "error");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Email Templates</h1>
      </div>

      {/* List */}
      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <span className="font-semibold text-white/80">List Templates</span>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `${items.length} template`}
          </span>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Key</th>
              <th className="px-6 py-3 font-semibold">Last Updated</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/30">Loading…</td>
              </tr>
            )}
            {!loading && !error && items.map((t) => (
              <tr key={t.key} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-6 py-3 text-white/80 font-medium">{t.name}</td>
                <td className="px-6 py-3">
                  <span className="font-mono text-xs text-white/50 bg-white/[0.06] px-2 py-1 rounded-lg">
                    {t.key}
                  </span>
                </td>
                <td className="px-6 py-3 text-white/40 text-xs">
                  {t.updatedAt
                    ? new Date(t.updatedAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
                    : "—"}
                </td>
                <td className="px-6 py-3 text-right space-x-3">
                  <button
                    className="text-blue-400 hover:text-blue-300 font-medium"
                    onClick={() => openEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-amber-400 hover:text-amber-300 font-medium"
                    onClick={() => setResetTarget(t)}
                  >
                    Reset to Default
                  </button>
                </td>
              </tr>
            ))}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/25">Belum ada email template</td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-red-400">{error}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => !saving && setEditTarget(null)}
        title={`Edit Template: ${editTarget?.name ?? ""}`}
        size="xl"
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Subject</label>
            <input
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className={inputCls}
              placeholder="Email subject…"
            />
          </div>

          <div>
            <label className={labelCls}>Body (HTML)</label>
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className={textareaCls}
              rows={20}
              placeholder="<p>Email body…</p>"
            />
          </div>

          {editTarget && editTarget.variables.length > 0 && (
            <div>
              <label className={labelCls}>Available Variables</label>
              <div className="flex flex-wrap gap-2">
                {editTarget.variables.map((v) => (
                  <div
                    key={v.key}
                    className="flex flex-col gap-0.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/8"
                  >
                    <span className="font-mono text-xs text-[#4ade80] font-semibold">{`{{${v.key}}}`}</span>
                    <span className="text-[11px] text-white/45">{v.description}</span>
                    <span className="text-[10px] text-white/25 italic">{v.example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setEditTarget(null)}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white/50 hover:bg-white/5 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition-colors disabled:opacity-60"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirm */}
      <ConfirmModal
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={handleReset}
        title="Reset Template?"
        message={`Template "${resetTarget?.name}" akan dikembalikan ke pengaturan default.`}
        confirmLabel="Reset"
        variant="danger"
        loading={resetting}
      />
    </div>
  );
}
