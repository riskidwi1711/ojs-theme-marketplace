import http from "@/api/adminHttp";
import type { AdminChatSession, AdminChatMessage } from "@/types/admin/chat";

export async function adminListChatSessions(): Promise<AdminChatSession[]> {
  const res = await http.get("/api/v1/admin/chat/sessions");
  return res.data?.sessions ?? [];
}

export async function adminGetChatMessages(email: string): Promise<AdminChatMessage[]> {
  const res = await http.get("/api/v1/admin/chat/messages", { params: { email } });
  return res.data?.messages ?? [];
}
