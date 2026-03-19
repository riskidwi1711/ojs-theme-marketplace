import http from "./http";
import type { VoucherValidateResult } from "@/types/voucher";

export async function validateVoucher(code: string, totalIDR: number): Promise<VoucherValidateResult> {
  const res = await http.post("/api/v1/vouchers/validate", { code, totalIDR });
  return res.data.data as VoucherValidateResult;
}
