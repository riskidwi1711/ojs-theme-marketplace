import { adminHttp as http } from "@/api/adminHttp";

// Admin API - menggunakan token admin (_x9k)
// Endpoint yang HANYA bisa diakses admin dengan role="admin"

/**
 * Get dashboard stats
 * Only accessible by admin role
 */
export async function getAdminStats(): Promise<any> {
  const res = await http.get("/api/v1/admin/stats");
  return res.data;
}

/**
 * Get system settings
 * Only accessible by admin role
 */
export async function getAdminSettings(): Promise<any> {
  const res = await http.get("/api/v1/admin/settings");
  return res.data?.data ?? {};
}

/**
 * Update system settings
 * Only accessible by admin role
 */
export async function updateAdminSettings(settings: any): Promise<any> {
  const res = await http.put("/api/v1/admin/settings", settings);
  return res.data?.data ?? {};
}

/**
 * Get all products (admin view)
 * Only accessible by admin role
 */
export async function getAdminProducts(params?: { section?: string; category?: string }): Promise<any> {
  const res = await http.get("/api/v1/admin/products", { params });
  return res.data?.data ?? [];
}

/**
 * Get product by ID (admin view)
 * Only accessible by admin role
 */
export async function getAdminProduct(id: string): Promise<any> {
  const res = await http.get(`/api/v1/admin/products/${encodeURIComponent(id)}`);
  return res.data?.data ?? null;
}

/**
 * Create new product
 * Only accessible by admin role
 */
export async function createAdminProduct(input: any): Promise<any> {
  const res = await http.post("/api/v1/admin/products", input);
  return res.data?.data ?? {};
}

/**
 * Update product
 * Only accessible by admin role
 */
export async function updateAdminProduct(id: string, input: any): Promise<any> {
  const res = await http.put(`/api/v1/admin/products/${encodeURIComponent(id)}`, input);
  return res.data?.data ?? {};
}

/**
 * Delete product
 * Only accessible by admin role
 */
export async function deleteAdminProduct(id: string): Promise<void> {
  await http.delete(`/api/v1/admin/products/${encodeURIComponent(id)}`);
}

/**
 * Get all orders (admin view)
 * Only accessible by admin role
 */
export async function getAdminOrders(params?: any): Promise<any> {
  const res = await http.get("/api/v1/admin/orders", { params });
  return res.data?.data ?? [];
}

/**
 * Get order by ID (admin view)
 * Only accessible by admin role
 */
export async function getAdminOrder(id: string): Promise<any> {
  const res = await http.get(`/api/v1/admin/orders/${encodeURIComponent(id)}`);
  return res.data?.data ?? null;
}

/**
 * Update order status
 * Only accessible by admin role
 */
export async function updateAdminOrderStatus(id: string, status: string): Promise<any> {
  const res = await http.put(`/api/v1/admin/orders/${encodeURIComponent(id)}/status`, { status });
  return res.data;
}

/**
 * Get all accounts/users (admin view)
 * Only accessible by admin role
 */
export async function getAdminAccounts(params?: any): Promise<any> {
  const res = await http.get("/api/v1/admin/accounts", { params });
  return res.data;
}

/**
 * Set user role
 * Only accessible by admin role
 */
export async function setAdminUserRole(email: string, role: string): Promise<any> {
  const res = await http.put(`/api/v1/admin/accounts/${encodeURIComponent(email)}/role`, { role });
  return res.data;
}

/**
 * Set user status
 * Only accessible by admin role
 */
export async function setAdminUserStatus(email: string, status: string): Promise<any> {
  const res = await http.put(`/api/v1/admin/accounts/${encodeURIComponent(email)}/status`, { status });
  return res.data;
}

/**
 * Get all categories (admin view)
 * Only accessible by admin role
 */
export async function getAdminCategories(): Promise<any> {
  const res = await http.get("/api/v1/admin/categories");
  return res.data?.data ?? [];
}

/**
 * Create category
 * Only accessible by admin role
 */
export async function createAdminCategory(input: any): Promise<any> {
  const res = await http.post("/api/v1/admin/categories", input);
  return res.data?.data ?? {};
}

/**
 * Update category
 * Only accessible by admin role
 */
export async function updateAdminCategory(slug: string, input: any): Promise<any> {
  const res = await http.put(`/api/v1/admin/categories/${encodeURIComponent(slug)}`, input);
  return res.data?.data ?? {};
}

/**
 * Delete category
 * Only accessible by admin role
 */
export async function deleteAdminCategory(slug: string): Promise<void> {
  await http.delete(`/api/v1/admin/categories/${encodeURIComponent(slug)}`);
}

/**
 * Get all tags (admin view)
 * Only accessible by admin role
 */
export async function getAdminTags(): Promise<any> {
  const res = await http.get("/api/v1/admin/tags");
  return res.data?.data ?? [];
}

/**
 * Create tag
 * Only accessible by admin role
 */
export async function createAdminTag(input: any): Promise<any> {
  const res = await http.post("/api/v1/admin/tags", input);
  return res.data?.data ?? {};
}

/**
 * Update tag
 * Only accessible by admin role
 */
export async function updateAdminTag(slug: string, input: any): Promise<any> {
  const res = await http.put(`/api/v1/admin/tags/${encodeURIComponent(slug)}`, input);
  return res.data?.data ?? {};
}

/**
 * Delete tag
 * Only accessible by admin role
 */
export async function deleteAdminTag(slug: string): Promise<void> {
  await http.delete(`/api/v1/admin/tags/${encodeURIComponent(slug)}`);
}

/**
 * Get all sections (admin view)
 * Only accessible by admin role
 */
export async function getAdminSections(): Promise<any> {
  const res = await http.get("/api/v1/admin/sections");
  return res.data?.data ?? [];
}

/**
 * Create section
 * Only accessible by admin role
 */
export async function createAdminSection(input: any): Promise<any> {
  const res = await http.post("/api/v1/admin/sections", input);
  return res.data?.data ?? {};
}

/**
 * Update section
 * Only accessible by admin role
 */
export async function updateAdminSection(slug: string, input: any): Promise<any> {
  const res = await http.put(`/api/v1/admin/sections/${encodeURIComponent(slug)}`, input);
  return res.data?.data ?? {};
}

/**
 * Delete section
 * Only accessible by admin role
 */
export async function deleteAdminSection(slug: string): Promise<void> {
  await http.delete(`/api/v1/admin/sections/${encodeURIComponent(slug)}`);
}

/**
 * Upload file (images, etc)
 * Only accessible by admin role
 */
export async function uploadAdminFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await http.post("/api/v1/admin/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data ?? {};
}

/**
 * Get all users list (admin view)
 * Only accessible by admin role
 */
export async function getAdminUsers(params?: any): Promise<any> {
  const res = await http.get("/api/v1/admin/users", { params });
  return res.data?.data ?? [];
}

const adminApi = {
  getAdminStats,
  getAdminSettings,
  updateAdminSettings,
  getAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
  getAdminAccounts,
  setAdminUserRole,
  setAdminUserStatus,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminTags,
  createAdminTag,
  updateAdminTag,
  deleteAdminTag,
  getAdminSections,
  createAdminSection,
  updateAdminSection,
  deleteAdminSection,
  uploadAdminFile,
  getAdminUsers,
};

export default adminApi;
