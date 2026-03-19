import http from "@/api/adminHttp";
import type { AdminUserListResponse } from "@/types/admin/users";

export async function adminListUsers(params?: Record<string, string | number>) {
  const res = await http.get("/api/v1/admin/users", { params });
  // API returns { status, message, data: { results, pagination } }
  const data = res.data?.data as AdminUserListResponse;
  return data;
}

const users = { adminListUsers };
export default users;

