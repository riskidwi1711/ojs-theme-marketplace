export type ListParams = { 
  section?: string; 
  category?: string; 
  tags?: string; 
  q?: string; 
  limit?: number 
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
