"use client";
import * as React from "react";
import {
  adminListOrders,
  adminGetOrder,
  adminUpdateOrderStatus,
  type AdminOrderItem,
} from "@/api/admin/orders";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/helper/date";

// The API type covers the list shape; the detail endpoint may return richer fields.
interface OrderDetail extends AdminOrderItem {
  subtotalIDR?: number;
  discountIDR?: number;
  voucherCode?: string;
  paymentRef?: string;
  paymentMethod?: string;
  paidAt?: string;
}

type OrderStatus = "PAID" | "PLACED" | "CANCELLED" | "EXPIRED";

function formatIDR(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

const inputCls =
  "px-3 py-2 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 bg-white/5 focus:outline-none focus:border-[#3d8c1e]";
const selectCls =
  "px-3 py-2 border border-white/10 rounded-lg text-sm text-white/70 bg-[#0d1f35] focus:outline-none focus:border-[#3d8c1e]";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "PAID"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
      : status === "PLACED"
      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      : status === "CANCELLED"
      ? "bg-red-500/15 text-red-400 border-red-500/20"
      : "bg-white/8 text-white/40 border-white/10"; // EXPIRED + unknown
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${cls}`}
    >
      {status}
    </span>
  );
}

const STATUS_CHANGE_COPY: Record<
  OrderStatus,
  { label: string; title: string; variant: "primary" | "danger" }
> = {
  PAID: {
    label: "Mark Paid",
    title: "Tandai sebagai PAID?",
    variant: "primary",
  },
  PLACED: {
    label: "Set PLACED",
    title: "Kembalikan ke PLACED?",
    variant: "primary",
  },
  CANCELLED: {
    label: "Cancel",
    title: "Batalkan order ini?",
    variant: "danger",
  },
  EXPIRED: {
    label: "Mark Expired",
    title: "Tandai sebagai EXPIRED?",
    variant: "danger",
  },
};

// ------------------------------------------------------------
// Detail Modal
// ------------------------------------------------------------
function OrderDetailModal({
  order,
  onClose,
  onChangeStatus,
}: {
  order: OrderDetail | null;
  onClose: () => void;
  onChangeStatus: (order: OrderDetail, status: OrderStatus) => void;
}) {
  if (!order) return null;

  const subtotal =
    order.subtotalIDR ??
    order.items.reduce((s, i) => s + i.priceIDR * i.qty, 0);
  const discount = order.discountIDR ?? 0;

  return (
    <Modal open={!!order} onClose={onClose} title="Order Detail" size="lg">
      {/* ID / Status / Date */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <p className="text-[11px] text-white/30 uppercase tracking-wider mb-0.5">
            Order ID
          </p>
          <p className="font-mono text-xs text-white/60 break-all">{order.id}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={order.status} />
          <p className="text-xs text-white/30">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/8">
        <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">
          Customer
        </p>
        <p className="text-sm text-white/80">{order.userEmail}</p>
      </div>

      {/* Items */}
      <div className="mb-4">
        <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
          Items
        </p>
        <div className="rounded-xl border border-white/8 divide-y divide-white/[0.05] overflow-hidden">
          {order.items.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="flex items-center justify-between px-4 py-2.5 bg-white/[0.02]"
            >
              <div>
                <p className="text-sm text-white/80">
                  {item.name || item.id}
                </p>
                <p className="text-xs text-white/30">qty: {item.qty}</p>
              </div>
              <p className="text-sm font-semibold text-white/70">
                {formatIDR(item.priceIDR * item.qty)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
        <div className="flex justify-between text-sm text-white/50">
          <span>Subtotal</span>
          <span>{formatIDR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-yellow-400">
            <span>
              Diskon
              {order.voucherCode && (
                <span className="ml-1 text-xs bg-yellow-500/15 border border-yellow-500/20 px-1.5 py-0.5 rounded font-mono">
                  {order.voucherCode}
                </span>
              )}
            </span>
            <span>- {formatIDR(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-white border-t border-white/8 pt-2">
          <span>Total</span>
          <span>{formatIDR(order.totalIDR)}</span>
        </div>
      </div>

      {/* Payment info */}
      {(order.paymentRef || order.paymentMethod || order.paidAt) && (
        <div className="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-1.5">
          <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">
            Payment
          </p>
          {order.paymentMethod && (
            <div className="flex justify-between text-sm text-white/50">
              <span>Method</span>
              <span className="text-white/70">{order.paymentMethod}</span>
            </div>
          )}
          {order.paymentRef && (
            <div className="flex justify-between text-sm text-white/50">
              <span>Ref</span>
              <span className="font-mono text-white/70 text-xs">
                {order.paymentRef}
              </span>
            </div>
          )}
          {order.paidAt && (
            <div className="flex justify-between text-sm text-white/50">
              <span>Paid at</span>
              <span className="text-white/70">{formatDate(order.paidAt)}</span>
            </div>
          )}
        </div>
      )}

      {/* Status actions */}
      <div>
        <p className="text-[11px] text-white/30 uppercase tracking-wider mb-2">
          Change Status
        </p>
        <div className="flex flex-wrap gap-2">
          {(["PAID", "CANCELLED", "EXPIRED"] as OrderStatus[])
            .filter((s) => s !== order.status)
            .map((s) => {
              const copy = STATUS_CHANGE_COPY[s];
              const btnCls =
                s === "PAID"
                  ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                  : s === "CANCELLED"
                  ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                  : "border-white/15 text-white/40 hover:bg-white/5";
              return (
                <button
                  key={s}
                  onClick={() => onChangeStatus(order, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${btnCls}`}
                >
                  {copy.label}
                </button>
              );
            })}
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------
// Page
// ------------------------------------------------------------
export default function AdminOrders() {
  const toast = useToast();
  const [items, setItems] = React.useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("");

  // Detail modal
  const [detailOrder, setDetailOrder] = React.useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  // Status-change confirm
  const [statusTarget, setStatusTarget] = React.useState<{
    order: OrderDetail;
    newStatus: OrderStatus;
  } | null>(null);
  const [statusChanging, setStatusChanging] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminListOrders({
        email: email || undefined,
        status: status || undefined,
      });
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load orders");
      toast(e.message || "Gagal memuat data orders", "error");
    } finally {
      setLoading(false);
    }
  }, [email, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  // Open detail — fetch full order, fall back to list row data
  const openDetail = async (row: AdminOrderItem) => {
    setDetailLoading(true);
    // Show modal with list data immediately while fetching
    setDetailOrder(row as OrderDetail);
    try {
      const full = await adminGetOrder(row.id);
      setDetailOrder(full as OrderDetail);
    } catch {
      // keep what we already have from the list row
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setDetailOrder(null);
  };

  // Called from table row quick-actions or from the detail modal
  const requestStatusChange = (order: OrderDetail, newStatus: OrderStatus) => {
    setStatusTarget({ order, newStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    setStatusChanging(true);
    try {
      await adminUpdateOrderStatus(statusTarget.order.id, statusTarget.newStatus);
      toast(
        `Order ${statusTarget.order.id.slice(0, 8)}… ditandai ${statusTarget.newStatus}`,
        "success"
      );
      // Update detail modal if open for the same order
      if (detailOrder?.id === statusTarget.order.id) {
        setDetailOrder((prev) =>
          prev ? { ...prev, status: statusTarget.newStatus } : prev
        );
      }
      setStatusTarget(null);
      await load();
    } catch (e: any) {
      toast(e.message || "Gagal mengubah status order", "error");
    } finally {
      setStatusChanging(false);
    }
  };

  const confirmCopy = statusTarget
    ? STATUS_CHANGE_COPY[statusTarget.newStatus]
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders Management</h1>
        <button
          onClick={load}
          className="bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/[0.08] transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 gap-2">
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Filter by email"
              className={`${inputCls} w-64`}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectCls}
            >
              <option value="">All Status</option>
              <option value="PLACED">PLACED</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
            <button
              className="px-3 py-2 bg-[#3d8c1e] text-white rounded-lg text-sm font-medium hover:bg-[#317318] transition-colors"
              onClick={load}
            >
              Apply
            </button>
          </div>
          <span className="text-sm text-white/35">
            {loading ? "Loading…" : error ? error : `Total ${items.length}`}
          </span>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-white/25 uppercase tracking-wider bg-white/[0.03]">
            <tr>
              <th className="px-6 py-3 font-semibold">Order ID</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Items</th>
              <th className="px-6 py-3 font-semibold">Total</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-white/30"
                >
                  Loading orders…
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              items.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-white/30">
                    {o.id.slice(0, 8)}…
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-6 py-4 font-medium text-white/80">
                    {o.userEmail}
                  </td>
                  <td className="px-6 py-4 text-white/40">
                    {o.items?.length || 0} item(s)
                  </td>
                  <td className="px-6 py-4 font-semibold text-white/80">
                    {formatIDR(o.totalIDR)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick status actions */}
                      {o.status !== "PAID" && (
                        <button
                          onClick={() => requestStatusChange(o as OrderDetail, "PAID")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-xs font-semibold border border-emerald-500/20"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Mark Paid
                        </button>
                      )}
                      {o.status !== "CANCELLED" && o.status !== "PAID" && (
                        <button
                          onClick={() => requestStatusChange(o as OrderDetail, "CANCELLED")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-xs font-semibold border border-red-500/20"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                          Cancel
                        </button>
                      )}
                      {/* Detail button */}
                      <button
                        onClick={() => openDetail(o)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold border border-white/15"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-white/25"
                >
                  No orders found
                </td>
              </tr>
            )}
            {error && !loading && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <OrderDetailModal
        order={detailOrder}
        onClose={closeDetail}
        onChangeStatus={(order, newStatus) => {
          requestStatusChange(order, newStatus);
        }}
      />

      {/* Loading overlay inside detail while fetching full data */}
      {detailLoading && detailOrder && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#0d1f35] border border-white/10 rounded-xl px-4 py-2 text-xs text-white/40 shadow-xl">
          Loading detail…
        </div>
      )}

      {/* Generalised status-change confirm modal */}
      <ConfirmModal
        open={!!statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatusChange}
        title={confirmCopy?.title ?? "Konfirmasi"}
        message={
          statusTarget
            ? `Order dari ${statusTarget.order.userEmail} senilai ${formatIDR(
                statusTarget.order.totalIDR
              )} akan diubah ke ${statusTarget.newStatus}.`
            : ""
        }
        confirmLabel={confirmCopy?.label ?? "Konfirmasi"}
        variant={confirmCopy?.variant ?? "primary"}
        loading={statusChanging}
      />
    </div>
  );
}
