"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrderById } from "@/api/orders";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  LuLoader,
  LuCircleCheck,
  LuClock,
  LuCircleX,
  LuRefreshCw,
  LuDownload,
  LuPackage,
} from "react-icons/lu";

const fmt = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

interface OrderItem {
  id: string;
  name: string;
  priceIDR: number;
}

interface Order {
  id: string;
  userEmail: string;
  items: OrderItem[];
  totalIDR: number;
  status: string;
  createdAt: string;
  shipping?: Record<string, string>;
}

const STATUS_CONFIG: Record<string, {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge: string;
  color: string;
  bgIcon: string;
}> = {
  PLACED: {
    icon: <LuClock size={32} className="text-amber-500" />,
    title: "Menunggu Pembayaran",
    desc: "Pesanan kamu sedang menunggu konfirmasi pembayaran dari Xendit.",
    badge: "bg-amber-100 text-amber-700",
    color: "border-amber-200",
    bgIcon: "bg-amber-50",
  },
  PAID: {
    icon: <LuCircleCheck size={32} className="text-green-500" />,
    title: "Pembayaran Berhasil!",
    desc: "Pembayaran telah dikonfirmasi. Lisensi akan dikirim ke email kamu.",
    badge: "bg-green-100 text-green-700",
    color: "border-green-200",
    bgIcon: "bg-green-50",
  },
  EXPIRED: {
    icon: <LuCircleX size={32} className="text-gray-400" />,
    title: "Pembayaran Kedaluwarsa",
    desc: "Waktu pembayaran telah habis. Silakan buat pesanan baru.",
    badge: "bg-gray-100 text-gray-600",
    color: "border-gray-200",
    bgIcon: "bg-gray-50",
  },
  FAILED: {
    icon: <LuCircleX size={32} className="text-red-500" />,
    title: "Pembayaran Gagal",
    desc: "Pembayaran tidak berhasil diproses. Silakan coba lagi.",
    badge: "bg-red-100 text-red-600",
    color: "border-red-200",
    bgIcon: "bg-red-50",
  },
};

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);

  const fetchOrder = React.useCallback(async (silent = false) => {
    if (!orderId) { setLoading(false); return; }
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("ojs_customer_token") ?? "";
      const data = await getOrderById(orderId, token);
      if (data) setOrder(data as any);
    } catch { /* ignore */ } finally {
      setLoading(false);
      setRefreshing(false);
      setLastChecked(new Date());
    }
  }, [orderId]);

  // Initial load
  React.useEffect(() => { fetchOrder(); }, [fetchOrder]);

  // Auto-poll every 10s while status is PLACED
  React.useEffect(() => {
    if (order?.status !== "PLACED") return;
    const id = setInterval(() => fetchOrder(true), 10_000);
    return () => clearInterval(id);
  }, [order?.status, fetchOrder]);

  if (loading) {
    return (
      <main className="flex-1 bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <LuLoader size={32} className="animate-spin text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Memuat status pesanan...</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="flex-1 bg-gray-50 py-16">
        <div className="container-page max-w-lg mx-auto text-center">
          <LuPackage size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-sm text-gray-500 mb-6">ID pesanan tidak valid atau kamu belum login.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl bg-[#3e9020] text-black font-bold text-sm hover:bg-[#317318] transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG["PLACED"];
  const createdAt = new Date(order.createdAt).toLocaleString("id-ID", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <main className="flex-1 bg-gray-50 py-10">
      <div className="container-page max-w-2xl mx-auto space-y-5">

        {/* ── Status Card ── */}
        <div className={`bg-white rounded-2xl border shadow-sm p-8 text-center ${cfg.color}`}>
          <div className={`w-16 h-16 rounded-full ${cfg.bgIcon} flex items-center justify-center mx-auto mb-4`}>
            {cfg.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{cfg.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{cfg.desc}</p>

          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-3">
            <span className="text-xs text-gray-500">ID Pesanan:</span>
            <span className="text-sm font-bold text-gray-800 font-mono">{order.id.slice(-12).toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.badge}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block opacity-70" />
              {cfg.title}
            </span>
            <span className="text-xs text-gray-400">{createdAt}</span>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">Rincian Pesanan</h2>
          <ul className="divide-y divide-gray-50">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                    <LuPackage size={16} className="text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800 shrink-0">{fmt(item.priceIDR)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
            <span className="text-sm font-bold text-gray-700">Total</span>
            <span className="text-lg font-black text-gray-900">{fmt(order.totalIDR)}</span>
          </div>
        </div>

        {/* ── PAID: download notice ── */}
        {order.status === "PAID" && (
          <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4 flex items-start gap-3">
            <LuDownload size={18} className="text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Lisensi siap diunduh!</p>
              <p className="text-xs text-green-700 mt-0.5">
                Cek halaman <Link href="/account" className="font-bold underline">Akun → Unduhan</Link> untuk mengunduh file tema kamu.
                Juga akan dikirim ke <strong>{order.userEmail}</strong>.
              </p>
            </div>
          </div>
        )}

        {/* ── PLACED: check status ── */}
        {order.status === "PLACED" && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-800">Menunggu konfirmasi dari Xendit</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Status diperbarui otomatis setiap 10 detik.
                {lastChecked && ` Terakhir dicek: ${lastChecked.toLocaleTimeString("id-ID")}`}
              </p>
            </div>
            <button
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <LuRefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        )}

        {/* ── EXPIRED/FAILED: retry ── */}
        {(order.status === "EXPIRED" || order.status === "FAILED") && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <p className="text-sm text-gray-500 mb-4">Ingin mencoba lagi?</p>
            <Link href="/themes"
              className="inline-block px-6 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-[#3e9020] hover:text-black transition-colors">
              Belanja Lagi
            </Link>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 flex-1 h-12 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors">
            <WhatsAppIcon />
            Chat WhatsApp CS
          </a>
          <Link href="/account"
            className="flex items-center justify-center flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900 font-semibold text-sm transition-colors">
            Lihat Pesanan Saya →
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <React.Suspense fallback={
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <LuLoader size={28} className="animate-spin text-gray-400" />
        </main>
      }>
        <ConfirmationContent />
      </React.Suspense>
      <Footer />
    </div>
  );
}
