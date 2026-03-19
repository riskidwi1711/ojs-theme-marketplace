import http from "@/api/http";
import type { MessagesResponse, SendMessageResponse } from "@/types/chat";

export async function sendChatMessage(text: string): Promise<SendMessageResponse> {
  const res = await http.post("/api/v1/chat/message", { text });
  return res.data;
}

export async function getChatMessages(after?: string): Promise<MessagesResponse> {
  const params = after ? `?after=${encodeURIComponent(after)}` : "";
  const res = await http.get(`/api/v1/chat/messages${params}`);
  return res.data;
}

export async function uploadChatFile(file: File): Promise<SendMessageResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await http.post("/api/v1/chat/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
