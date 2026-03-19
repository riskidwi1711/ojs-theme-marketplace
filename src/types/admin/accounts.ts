import type { PaginationMeta } from "../api";

export interface AdminAccountItem {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminAccountListResponse {
  results: AdminAccountItem[];
  pagination: PaginationMeta;
}
