export interface CartItem {
  id: string;
  name: string;
  priceIDR: number;
  qty?: number;
  image?: string;
  compat?: string;
  emoji?: string;
  bg?: string;
}

export interface CartResponse {
  items: CartItem[];
}

export interface WishlistItem {
  id: string;
  name: string;
  priceText?: string;
  image?: string;
}
