import http from "@/api/adminHttp";
import type { AdminVoucherItem } from "@/types/admin/vouchers";

export async function adminListVouchers(): Promise<AdminVoucherItem[]> {
  const res = await http.get("/api/v1/admin/vouchers");
  const raw = res.data?.data ?? res.data ?? [];
  return (Array.isArray(raw) ? raw : []) as AdminVoucherItem[];
}

export async function adminCreateVoucher(input: Partial<AdminVoucherItem>) {
  const res = await http.post("/api/v1/admin/vouchers", input);
  return res.data?.data as AdminVoucherItem;
}

export async function adminUpdateVoucher(id: string, input: Partial<AdminVoucherItem>) {
  const res = await http.put(`/api/v1/admin/vouchers/${id}`, input);
  return res.data?.data as AdminVoucherItem;
}

export async function adminDeleteVoucher(id: string) {
  await http.delete(`/api/v1/admin/vouchers/${id}`);
}
