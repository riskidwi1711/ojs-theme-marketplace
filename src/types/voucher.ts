export interface VoucherValidateResult {
  valid: boolean;
  code: string;
  type: "percent" | "fixed";
  value: number;
  discountIDR: number;
  finalIDR: number;
  message: string;
}
