import type { PaginationMeta } from "../api";

export interface AdminUserListItem {
  id?: number | string;
  fullName: string;
  email: string;
  msisdn?: string;
  status?: string;
  state?: string;
  createdAt?: string;
}

export interface AdminUserListResponse {
  results: AdminUserListItem[];
  pagination: PaginationMeta;
}
