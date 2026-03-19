"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/adminAuth";
import { adminListProducts } from "@/api/admin/products";
import { adminListOrders, type AdminOrderItem } from "@/api/admin/orders";
import { adminListAccounts } from "@/api/admin/accounts";
import Link from "next/link";
import { formatDate } from "@/helper/date";

function formatIDR(v: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);
}

const statusStyle: Record<string, string> = {
  PAID: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  PLACED: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export default function AdminDashboard() {
  const { user, loading } = useAdminAuth();
  const router = useRouter();

  const [productCount, setProductCount] = React.useState<number | null>(null);
  const [userCount, setUserCount] = React.useState<number | null>(null);
  const [orders, setOrders] = React.useState<AdminOrderItem[]>([]);
  const [loadingStats, setLoadingStats] = React.useState(true);

  React.useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/admin/login");
    }
  }, [user, loading, router]);

  React.useEffect(() => {
    Promise.all([
      adminListProducts().then((products) => setProductCount(Array.isArray(products) ? products.length : null)).catch(() => setProductCount(null)),
      adminListAccounts({ limit: 1 } as any).then((accounts) => setUserCount(accounts?.pagination?.totalItems ?? null)).catch(() => setUserCount(null)),
      adminListOrders().then((ords) => setOrders(Array.isArray(ords) ? ords : [])).catch(() => setOrders([])),
    ]).finally(() => setLoadingStats(false));
  }, []);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#080e1a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3d8c1e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const totalRevenue = paidOrders.reduce((s, o) => s + (o.totalIDR || 0), 0);
  const activeOrders = orders.filter((o) => o.status === "PLACED").length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const stats = [
    {
      label: "Total Revenue",
      value: loadingStats ? "—" : formatIDR(totalRevenue),
      sub: `${paidOrders.length} transaksi lunas`,
      icon: <RevenueIcon />, color: "text-emerald-400", bg: "bg-emerald-500/15",
    },
    {
      label: "Active Orders",
      value: loadingStats ? "—" : String(activeOrders),
      sub: "Status PLACED",
      icon: <CartIcon />, color: "text-orange-400", bg: "bg-orange-500/15",
    },
    {
      label: "Total Products",
      value: loadingStats ? "—" : productCount !== null ? String(productCount) : "—",
      sub: "Produk terdaftar",
      icon: <BoxIcon />, color: "text-blue-400", bg: "bg-blue-500/15",
    },
    {
      label: "Total Users",
      value: loadingStats ? "—" : userCount !== null ? userCount.toLocaleString("id-ID") : "—",
      sub: "Pengguna terdaftar",
      icon: <UsersIcon />, color: "text-purple-400", bg: "bg-purple-500/15",
    },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/35 mt-0.5">{dateStr}</p>
        </div>
        <a
          href="/admin/products"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white text-sm font-semibold hover:from-[#162f5a] hover:to-[#317318] transition-all shadow-lg shadow-black/20"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Produk
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 rounded-2xl border border-white/8 p-5 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </span>
              {loadingStats && (
                <span className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
              )}
            </div>
            <p className="text-[11px] font-semibold text-white/35 uppercase tracking-wider">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 rounded-2xl border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-sm font-bold text-white">Pesanan Terbaru</h2>
            <p className="text-xs text-white/30 mt-0.5">5 transaksi terakhir</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#3d8c1e] hover:text-[#4aaa24] transition-colors">
            Lihat Semua →
          </Link>
        </div>

        {loadingStats ? (
          <div className="px-6 py-10 text-center text-white/30 text-sm">Memuat data…</div>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-white/30 text-sm">Belum ada pesanan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
                  <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-3 text-left font-semibold">Customer</th>
                  <th className="px-6 py-3 text-left font-semibold">Items</th>
                  <th className="px-6 py-3 text-left font-semibold">Tanggal</th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3.5 font-mono text-xs text-white/30">{o.id.slice(0, 8)}…</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1c3a6e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {o.userEmail?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span className="text-white/70 font-medium text-sm truncate max-w-[160px]">{o.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-white/40">{o.items?.length ?? 0} item</td>
                    <td className="px-6 py-3.5 text-white/40">{formatDate(o.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[o.status] ?? "bg-white/10 text-white/50"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-white/80">{formatIDR(o.totalIDR)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RevenueIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
}
function CartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
}
function BoxIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
}
function UsersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
