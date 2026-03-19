export interface AdminVoucherItem {
  id?: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrderIDR?: number;
  maxDiscountIDR?: number;
  usageLimit?: number;
  usedCount?: number;
  expiresAt?: string;
  active: boolean;
  newUsersOnly?: boolean;
  createdAt?: string;
}
