export interface AdminChatSession {
  userEmail: string;
  topicId: number;
  lastMessage?: string;
  lastAt?: string;
  messageCount?: number;
}

export interface AdminChatMessage {
  id: string;
  userEmail: string;
  sender: "user" | "admin";
  type: "text" | "photo" | "document";
  text?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}
