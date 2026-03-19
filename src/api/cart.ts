import http from "./http";
import { CartItem, CartResponse } from "@/types";

export async function getCart(): Promise<CartItem[]> {
  const res = await http.get<CartResponse>("/api/v1/cart");
  return res.data.items;
}

export async function addToCart(item: CartItem): Promise<void> {
  await http.post("/api/v1/cart", { ...item, qty: item.qty || 1 });
}

export async function removeFromCart(id: string): Promise<void> {
  await http.delete(`/api/v1/cart/${id}`);
}

export async function clearCart(): Promise<void> {
  const items = await getCart();
  for (const item of items) {
    await removeFromCart(item.id);
  }
}
