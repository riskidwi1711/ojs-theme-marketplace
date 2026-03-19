import http from "@/api/http";
import { OrderItem, OrdersResponse } from "@/types";

export async function getOrders(): Promise<OrdersResponse> {
  const res = await http.get("/api/v1/orders");
  return res.data;
}

export async function getOrderById(id: string, token?: string): Promise<OrderItem | null> {
  try {
    const res = await http.get(`/api/v1/orders/${encodeURIComponent(id)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return (res.data?.order ?? null) as OrderItem | null;
  } catch {
    return null;
  }
}

const orders = { getOrders, getOrderById };
export default orders;
