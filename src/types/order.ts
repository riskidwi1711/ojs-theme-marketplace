export interface OrderItem {
  id: string;
  userEmail: string;
  items: {
    name: string;
    priceIDR: number;
    image?: string;
  }[];
  totalIDR: number;
  status: string;
  createdAt: string;
}

export interface OrdersResponse {
  orders: OrderItem[];
}

export interface AdminOrderItem {
  id: string;
  userEmail: string;
  items: Array<{ id: string; name?: string; qty: number; priceIDR: number }>;
  totalIDR: number;
  status: string;
  createdAt: string;
}
