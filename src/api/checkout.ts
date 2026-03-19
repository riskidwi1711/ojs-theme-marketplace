import http from "@/api/http";
import type { CheckoutRequest, InvoiceRequest, CheckoutResponse, InvoiceResponse } from "@/types/checkout";

export async function createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
  const res = await http.post("/api/v1/checkout", data);
  return res.data;
}

export async function createInvoice(data: InvoiceRequest): Promise<InvoiceResponse> {
  const res = await http.post("/api/v1/payment/invoice", data);
  return res.data;
}

export async function syncCartToBackend(items: any[]): Promise<void> {
  for (const item of items) {
    await http.post("/api/v1/cart", {
      id: item.id,
      name: item.name,
      priceIDR: item.priceIDR,
      qty: 1,
      image: item.image ?? "",
      compat: item.compat ?? "",
      emoji: item.emoji ?? "",
      bg: item.bg ?? "",
    });
  }
}

const checkout = { createCheckout, createInvoice, syncCartToBackend };
export default checkout;
