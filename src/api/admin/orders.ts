import http from "@/api/adminHttp";
import { AdminOrderItem } from "@/types";

export async function adminListOrders(params?: { email?: string; status?: string }) {
  const res = await http.get("/api/v1/admin/orders", { params });
  return (res.data?.data ?? []) as AdminOrderItem[];
}

export async function adminGetOrder(id: string) {
  const res = await http.get(`/api/v1/admin/orders/${encodeURIComponent(id)}`);
  return res.data?.data as AdminOrderItem;
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  await http.put(`/api/v1/admin/orders/${encodeURIComponent(id)}/status`, { status });
}

const orders = { adminListOrders, adminGetOrder, adminUpdateOrderStatus };
export default orders;

