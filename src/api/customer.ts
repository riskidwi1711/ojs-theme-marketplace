import http from "@/api/http";
import type { CustomerOrdersResponse, CheckoutRequest, InvoiceRequest } from "@/types/checkout";

// Customer API - menggunakan token customer (ojs_token)
// Endpoint yang hanya bisa diakses customer/user biasa

/**
 * Get orders for current logged-in customer
 * Uses customer token (ojs_token)
 */
export async function getMyOrders(): Promise<CustomerOrdersResponse> {
  const res = await http.get("/api/v1/orders");
  return res.data;
}

export async function createMyOrder(data: CheckoutRequest): Promise<any> {
  const res = await http.post("/api/v1/checkout", data);
  return res.data;
}

/**
 * Create invoice for order
 * Only accessible by customer role
 */
export async function createMyInvoice(data: InvoiceRequest): Promise<any> {
  const res = await http.post("/api/v1/payment/invoice", data);
  return res.data;
}

/**
 * Sync cart items to backend
 * Only accessible by customer role
 */
export async function syncMyCartToBackend(items: any[]): Promise<void> {
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

/**
 * Get my cart items
 * Only accessible by customer role
 */
export async function getMyCart(): Promise<any> {
  const res = await http.get("/api/v1/cart");
  return res.data;
}

/**
 * Add item to my cart
 * Only accessible by customer role
 */
export async function addToMyCart(item: any): Promise<any> {
  const res = await http.post("/api/v1/cart", item);
  return res.data;
}

/**
 * Remove item from my cart
 * Only accessible by customer role
 */
export async function removeFromMyCart(id: string): Promise<any> {
  const res = await http.delete(`/api/v1/cart/${id}`);
  return res.data;
}

/**
 * Get my wishlist
 * Only accessible by customer role
 */
export async function getMyWishlist(): Promise<any> {
  const res = await http.get("/api/v1/wishlist");
  return res.data;
}

/**
 * Add item to my wishlist
 * Only accessible by customer role
 */
export async function addToMyWishlist(item: any): Promise<any> {
  const res = await http.post("/api/v1/wishlist", item);
  return res.data;
}

/**
 * Remove item from my wishlist
 * Only accessible by customer role
 */
export async function removeFromMyWishlist(id: string): Promise<any> {
  const res = await http.delete(`/api/v1/wishlist/${id}`);
  return res.data;
}

/**
 * Check if item is in my wishlist
 * Only accessible by customer role
 */
export async function checkMyWishlist(id: string): Promise<any> {
  const res = await http.get(`/api/v1/wishlist/${id}/check`);
  return res.data;
}

/**
 * Download invoice PDF for order
 * Only accessible by customer role
 */
export async function downloadInvoice(orderId: string): Promise<Blob> {
  const res = await http.get(`/api/v1/orders/${orderId}/invoice`, {
    responseType: 'blob',
  });
  return res.data;
}

/**
 * Download theme file for a paid order
 * Only accessible by customer role
 */
export async function downloadThemeFile(orderId: string): Promise<Blob> {
  const res = await http.get(`/api/v1/orders/${orderId}/download`, {
    responseType: 'blob',
  });
  return res.data;
}

/**
 * Get invoice URL for order (Xendit invoice URL)
 * Only accessible by customer role
 */
export async function getInvoiceUrl(orderId: string): Promise<{ invoiceUrl: string }> {
  const res = await http.get(`/api/v1/orders/${orderId}/invoice-url`);
  return res.data;
}

/**
 * Change password for current logged-in customer
 * Only accessible by customer role
 */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await http.patch("/api/v1/auth/change-password", { currentPassword, newPassword });
}

const customerApi = {
  getMyOrders,
  createMyOrder,
  createMyInvoice,
  syncMyCartToBackend,
  getMyCart,
  addToMyCart,
  removeFromMyCart,
  getMyWishlist,
  addToMyWishlist,
  removeFromMyWishlist,
  checkMyWishlist,
};

export default customerApi;
