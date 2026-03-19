export interface CheckoutRequest {
  voucherCode?: string;
  shipping: {
    name: string;
    email: string;
    institution?: string;
    phone?: string;
  };
  payment: {
    method: string;
  };
  successUrl?: string;
  failureUrl?: string;
}

export interface InvoiceRequest {
  external_id: string;
  amount: number;
  payer_email: string;
  description: string;
  success_redirect_url: string;
  failure_redirect_url: string;
}

export interface CheckoutResponse {
  order: {
    id: string;
    _id?: string;
    userEmail: string;
    items: any[];
    subtotalIDR: number;
    discountIDR: number;
    totalIDR: number;
    voucherCode?: string;
    status: string;
    xenditInvoiceUrl?: string;
    createdAt: string;
  };
}

export interface InvoiceResponse {
  invoice_url: string;
  invoiceUrl?: string;
}

export interface CustomerOrderItem {
  id: string;
  userEmail: string;
  items: {
    name: string;
    priceIDR: number;
    image?: string;
  }[];
  totalIDR: number;
  status: string;
  xenditInvoiceUrl?: string;
  createdAt: string;
}

export interface CustomerOrdersResponse {
  orders: CustomerOrderItem[];
}
