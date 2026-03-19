"use client";
import * as React from "react";
import { useToast } from "@/components/ui/toast";
import { getAdminSettings, updateAdminSettings } from "@/api/admin";

const inputCls = "w-full px-3 py-2 border border-white/10 rounded-lg text-sm text-white bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const labelCls = "block text-sm font-medium text-white/60 mb-1";

export default function AdminSettings() {
  const toast = useToast();
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // General
  const [siteName, setSiteName] = React.useState("");
  const [siteUrl, setSiteUrl] = React.useState("");
  const [supportEmail, setSupportEmail] = React.useState("");

  // Xendit
  const [xenditHost, setXenditHost] = React.useState("");
  const [xenditKey, setXenditKey] = React.useState("");

  // Telegram
  const [tgBotToken, setTgBotToken] = React.useState("");
  const [tgGroupId, setTgGroupId] = React.useState("");
  const [tgWebhookSecret, setTgWebhookSecret] = React.useState("");
  const [tgWebhookURL, setTgWebhookURL] = React.useState("");

  React.useEffect(() => {
    (async () => {
      try {
        const s = await getAdminSettings();
        setSiteName(s.siteName || "");
        setSiteUrl(s.siteUrl || "");
        setSupportEmail(s.supportEmail || "");
        setXenditHost(s.xenditHost || "");
        setXenditKey(s.xenditKey || "");
        setTgBotToken(s.tgBotToken || "");
        setTgGroupId(s.tgGroupId ? String(s.tgGroupId) : "");
        setTgWebhookSecret(s.tgWebhookSecret || "");
        setTgWebhookURL(s.tgWebhookURL || "");
      } catch (e: any) {
        setError(e.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSettings({
        id: "site",
        siteName,
        siteUrl,
        supportEmail,
        xenditHost,
        xenditKey,
        tgBotToken,
        tgGroupId: tgGroupId ? Number(tgGroupId) : undefined,
        tgWebhookSecret,
        tgWebhookURL,
      });
      toast("Pengaturan berhasil disimpan", "success");
    } catch (e: any) {
      toast(e.message || "Gagal menyimpan pengaturan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>

      <div className="space-y-6">
        {/* ── General ───────────────────────────────────────────────── */}
        <div className="bg-white/5 rounded-xl border border-white/8 p-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold mb-5 text-white/80">General Information</h2>
            <div className="space-y-4">
              {loading && <div className="text-white/35">Loading…</div>}
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <div>
                <label className={labelCls}>Site Name</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Site URL</label>
                <input type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} className={inputCls} placeholder="https://openthemes.id" />
                <p className="text-[10px] text-white/30 mt-1">Digunakan sebagai <code className="text-white/50">{"{{.SiteURL}}"}</code> di template email (link tombol).</p>
              </div>
              <div>
                <label className={labelCls}>Support Email</label>
                <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className={inputCls} />
                <p className="text-[10px] text-white/30 mt-1">Digunakan sebagai <code className="text-white/50">{"{{.SupportEmail}}"}</code> di template email.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Xendit ────────────────────────────────────────────────── */}
        <div className="bg-white/5 rounded-xl border border-white/8 p-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold mb-1 text-white/80">Xendit Payment</h2>
            <p className="text-xs text-white/35 mb-5">Kredensial untuk gateway pembayaran Xendit.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Xendit Host</label>
                <input type="text" value={xenditHost} onChange={(e) => setXenditHost(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Xendit Secret Key</label>
                <input type="text" value={xenditKey} onChange={(e) => setXenditKey(e.target.value)} className={inputCls} placeholder="****" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Telegram ──────────────────────────────────────────────── */}
        <div className="bg-white/5 rounded-xl border border-white/8 p-6">
          <div className="max-w-2xl">
            <h2 className="text-base font-semibold mb-1 text-white/80">Telegram Live Chat</h2>
            <p className="text-xs text-white/35 mb-5">
              Konfigurasi bot Telegram untuk fitur live chat. Setelah menyimpan, webhook akan otomatis
              di-register ke Telegram jika Webhook URL diisi.
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Bot Token</label>
                <input
                  type="text"
                  value={tgBotToken}
                  onChange={(e) => setTgBotToken(e.target.value)}
                  className={inputCls}
                  placeholder="1234567890:ABC…"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className={labelCls}>Group / Supergroup ID</label>
                <input
                  type="text"
                  value={tgGroupId}
                  onChange={(e) => setTgGroupId(e.target.value)}
                  className={inputCls}
                  placeholder="-1001234567890"
                />
                <p className="text-[10px] text-white/30 mt-1">
                  Angka negatif — ID supergroup dengan Topics yang sudah diaktifkan.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Webhook Secret</label>
                  <input
                    type="text"
                    value={tgWebhookSecret}
                    onChange={(e) => setTgWebhookSecret(e.target.value)}
                    className={inputCls}
                    placeholder="****"
                    autoComplete="off"
                  />
                  <p className="text-[10px] text-white/30 mt-1">
                    Token rahasia untuk verifikasi request dari Telegram.
                  </p>
                </div>
                <div>
                  <label className={labelCls}>Webhook URL</label>
                  <input
                    type="url"
                    value={tgWebhookURL}
                    onChange={(e) => setTgWebhookURL(e.target.value)}
                    className={inputCls}
                    placeholder="https://api-ojs.example.com/api/v1/chat/webhook"
                  />
                  <p className="text-[10px] text-white/30 mt-1">
                    URL endpoint server kamu. Diregistrasi ke Telegram saat Save.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Save button ───────────────────────────────────────────── */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:from-[#162f5a] hover:to-[#317318] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Menyimpan…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
