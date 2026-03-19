import http from "@/api/adminHttp";
import type { EmailTemplate } from "@/types/admin/email-templates";

export async function adminListEmailTemplates(): Promise<EmailTemplate[]> {
  const res = await http.get("/api/v1/admin/email-templates");
  return res.data?.templates ?? [];
}

export async function adminGetEmailTemplate(key: string): Promise<EmailTemplate> {
  const res = await http.get(`/api/v1/admin/email-templates/${key}`);
  return res.data?.template;
}

export async function adminUpdateEmailTemplate(key: string, data: { name?: string; subject: string; body: string }): Promise<EmailTemplate> {
  const res = await http.put(`/api/v1/admin/email-templates/${key}`, data);
  return res.data?.template;
}

export async function adminResetEmailTemplate(key: string): Promise<EmailTemplate> {
  const res = await http.post(`/api/v1/admin/email-templates/${key}/reset`);
  return res.data?.template;
}
