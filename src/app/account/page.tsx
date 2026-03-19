"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useToast } from "@/components/ui/toast";
import { getMyOrders, downloadInvoice, downloadThemeFile, changePassword } from "@/api/customer";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  LuPackage,
  LuDownload,
  LuUser,
  LuLogOut,
  LuChevronRight,
  LuClock,
  LuCircleCheck,
  LuCircleX,
  LuLoader,
  LuShieldCheck,
  LuKey,
  LuFileText,
  LuCreditCard,
} from "react-icons/lu";

interface Order {
  id: string;
  userEmail: string;
  items: { name: string; priceIDR: number; image?: string }[];
  totalIDR: number;
  status: string;
  xenditInvoiceUrl?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PLACED: {
    label: "Menunggu Pembayaran",
    color: "text-yellow-600 bg-yellow-50 border-yellow-100",
    icon: <LuClock size={13} />,
  },
  PAID: {
    label: "Sudah Dibayar",
    color: "text-green-600 bg-green-50 border-green-100",
    icon: <LuCircleCheck size={13} />,
  },
  EXPIRED: { label: "Kedaluwarsa", color: "text-gray-500 bg-gray-50 border-gray-100", icon: <LuCircleX size={13} /> },
  FAILED: { label: "Gagal", color: "text-red-600 bg-red-50 border-red-100", icon: <LuCircleX size={13} /> },
};

type Tab = "orders" | "downloads" | "profile";

export default function AccountPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>("orders");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = React.useState(false);
  const [ordersError, setOrdersError] = React.useState("");

  const handlePayNow = (order: Order) => {
    if (order.xenditInvoiceUrl) {
      window.location.href = order.xenditInvoiceUrl;
    } else {
      toast("Link pembayaran tidak tersedia. Hubungi support.", "error");
    }
  };

  // Profile form state
  const [name, setName] = React.useState("");
  const [currentPw, setCurrentPw] = React.useState("");
  const [newPw, setNewPw] = React.useState("");
  const [pwMsg, setPwMsg] = React.useState("");

  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Not logged in at all - redirect to customer login
        const next = encodeURIComponent(window.location.pathname);
        router.replace(`/auth/login?next=${next}`);
      }
    }
  }, [user, authLoading, router]);

  React.useEffect(() => {
    if (user) setName(user.name ?? "");
  }, [user]);

  React.useEffect(() => {
    if (user && (tab === "orders" || tab === "downloads")) fetchOrders();
  }, [tab, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await getMyOrders();
      setOrders(res.orders ?? []);
    } catch (err: unknown) {
      setOrdersError(err instanceof Error ? err.message : "Gagal memuat pesanan");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      setPwMsg("Isi semua field password");
      return;
    }
    if (newPw.length < 8) {
      setPwMsg("Password baru minimal 8 karakter");
      return;
    }
    try {
      await changePassword(currentPw, newPw);
      setPwMsg("Password berhasil diubah");
      setCurrentPw("");
      setNewPw("");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPwMsg(msg || "Gagal mengubah password");
    }
  };

  const handleDownload = async (itemName: string, orderId: string) => {
    toast(`Mempersiapkan unduhan ${itemName}…`, "info");
    try {
      const blob = await downloadThemeFile(orderId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${itemName.replace(/\s+/g, "-").toLowerCase()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast(`${itemName} berhasil diunduh`, "success");
    } catch {
      toast("File unduhan belum tersedia. Hubungi support@openthemes.id", "warning");
    }
  };

  const printInvoiceFallback = (order: Order) => {
    const fmt = (n: number) =>
      new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const rows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${fmt(item.priceIDR)}</td>
      </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<title>Invoice #${order.id.slice(-8).toUpperCase()}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; padding: 48px; font-size: 14px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .brand { font-size: 22px; font-weight: 800; color: #1c3b6d; }
  .brand span { color: #3e9020; }
  .invoice-title { text-align: right; }
  .invoice-title h1 { font-size: 28px; font-weight: 900; color: #1a1a2e; letter-spacing: -0.5px; }
  .invoice-title p { font-size: 12px; color: #888; margin-top: 4px; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; background: #f8fafc; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px; }
  .meta-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #999; margin-bottom: 4px; }
  .meta-value { font-size: 13px; font-weight: 600; color: #1a1a2e; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  thead tr { background: #1c3b6d; color: white; }
  thead th { padding: 11px 12px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  thead th:last-child { text-align: right; }
  tbody tr:hover { background: #f8fafc; }
  .total-row td { padding: 14px 12px; font-weight: 800; font-size: 15px; border-top: 2px solid #1c3b6d; }
  .total-row td:last-child { text-align: right; color: #1c3b6d; }
  .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #aaa; text-align: center; line-height: 1.7; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="header">
  <div class="brand">Open<span>Themes</span><div style="font-size:11px;font-weight:400;color:#888;margin-top:2px;">Marketplace Tema OJS Indonesia</div></div>
  <div class="invoice-title">
    <h1>INVOICE</h1>
    <p>#${order.id.slice(-8).toUpperCase()}</p>
  </div>
</div>
<div class="meta">
  <div>
    <div class="meta-label">Tanggal</div>
    <div class="meta-value">${date}</div>
  </div>
  <div>
    <div class="meta-label">Status</div>
    <div class="meta-value"><span class="status-badge">Lunas</span></div>
  </div>
  <div>
    <div class="meta-label">Tagihan Kepada</div>
    <div class="meta-value">${user?.name || "-"}<br/><span style="font-weight:400;color:#555">${order.userEmail}</span></div>
  </div>
  <div>
    <div class="meta-label">Penjual</div>
    <div class="meta-value">OpenThemes<br/><span style="font-weight:400;color:#555">support@openthemes.id</span></div>
  </div>
</div>
<table>
  <thead><tr><th>Item</th><th style="text-align:right">Harga</th></tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr class="total-row"><td>Total</td><td>${fmt(order.totalIDR)}</td></tr></tfoot>
</table>
<div class="footer">
  Terima kasih telah berbelanja di OpenThemes.<br/>
  Dokumen ini dibuat secara otomatis dan sah tanpa tanda tangan.<br/>
  Hubungi kami di support@openthemes.id untuk pertanyaan lebih lanjut.
</div>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`;

    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
      toast("Popup diblokir browser. Izinkan popup untuk mencetak invoice.", "warning");
      return;
    }
    win.document.write(html);
    win.document.close();
  };

  const handleDownloadInvoice = async (order: Order) => {
    try {
      const blob = await downloadInvoice(order.id);
      // Verify it's actually a PDF (not an error JSON)
      if (blob.type && !blob.type.includes("pdf") && !blob.type.includes("octet")) {
        throw new Error("non-pdf response");
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.id.slice(-8).toLowerCase()}-${new Date(order.createdAt).toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast("Invoice berhasil diunduh", "success");
    } catch {
      // API unavailable — generate client-side invoice
      printInvoiceFallback(order);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LuLoader size={32} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.status === "PAID");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "orders", label: "Pesanan Saya", icon: <LuPackage size={16} /> },
    { id: "downloads", label: "Unduhan", icon: <LuDownload size={16} /> },
    { id: "profile", label: "Profil", icon: <LuUser size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container-page py-8 lg:py-12">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Halo, {user?.name || user?.email} 👋</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
          >
            <LuLogOut size={16} />
            Keluar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    tab === t.id
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)] font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {t.icon}
                    {t.label}
                  </span>
                  <LuChevronRight size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* ── Orders ── */}
            {tab === "orders" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Riwayat Pesanan</h2>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <LuLoader size={24} className="animate-spin text-gray-400" />
                  </div>
                ) : ordersError ? (
                  <div className="text-sm text-red-500 text-center py-10">{ordersError}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <LuPackage size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Belum ada pesanan</p>
                    <Link
                      href="/themes"
                      className="mt-3 inline-block text-xs text-[var(--color-primary-600)] font-semibold hover:underline"
                    >
                      Mulai belanja tema →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const cfg = statusConfig[order.status] ?? statusConfig["PLACED"];
                      const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      });
                      return (
                        <div
                          key={order.id}
                          className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <p className="text-xs text-gray-400 font-mono">#{order.id.slice(-8).toUpperCase()}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700 font-medium">{item.name}</span>
                                <span className="text-gray-500 text-xs">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                  }).format(item.priceIDR)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <span className="text-xs text-gray-500">{order.items.length} item</span>
                            <div className="flex items-center gap-2">
                              {order.status === "PLACED" ? (
                                <button
                                  onClick={() => handlePayNow(order)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                                >
                                  <LuCreditCard size={13} />
                                  Bayar Sekarang
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDownloadInvoice(order)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  title="Download Invoice"
                                >
                                  <LuFileText size={13} />
                                  Invoice
                                </button>
                              )}
                              <span className="text-sm font-bold text-gray-900">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumFractionDigits: 0,
                                }).format(order.totalIDR)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Downloads ── */}
            {tab === "downloads" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Download Center</h2>
                <p className="text-sm text-gray-400 mb-5">
                  Hanya pesanan dengan status Sudah Dibayar yang tersedia untuk diunduh.
                </p>
                {ordersLoading ? (
                  <div className="flex justify-center py-12">
                    <LuLoader size={24} className="animate-spin text-gray-400" />
                  </div>
                ) : paidOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <LuDownload size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Belum ada file yang bisa diunduh</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paidOrders.flatMap((order) =>
                      order.items.map((item, i) => {
                        return (
                          <div
                            key={`${order.id}-${i}`}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <LuDownload size={18} className="text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-400">OJS Theme · .zip</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDownloadInvoice(order)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                title="Download Invoice"
                              >
                                <LuFileText size={13} />
                                Invoice
                              </button>
                              <button
                                onClick={() => handleDownload(item.name, order.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                              >
                                <LuDownload size={13} />
                                Unduh
                              </button>
                            </div>
                          </div>
                        );
                      }),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Profile ── */}
            {tab === "profile" && (
              <div className="space-y-5">
                {/* Info Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Informasi Profil</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={user?.name || ""}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email tidak bisa diubah.</p>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm">
                      Simpan Perubahan
                    </button>
                  </div>
                </div>

                {/* Password Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Ubah Password</h2>
                  <p className="text-sm text-gray-400 mb-5">Pastikan password baru minimal 8 karakter.</p>
                  {pwMsg && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-sm">
                      {pwMsg}
                    </div>
                  )}
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Password Saat Ini
                      </label>
                      <input
                        type="password"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                        placeholder="Min. 8 karakter"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                    >
                      <LuKey size={15} />
                      Ubah Password
                    </button>
                  </form>
                </div>

                {/* Security info */}
                <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-green-50 border border-green-100">
                  <LuShieldCheck size={18} className="text-green-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-green-700 leading-relaxed">
                    Akun kamu dilindungi dengan enkripsi JWT. Semua sesi akan otomatis kedaluwarsa setelah periode
                    tertentu.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
