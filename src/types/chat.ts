export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  fileURL?: string;
  fileName?: string;
  fileSize?: number;
  isAdmin: boolean;
  createdAt: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

export interface SendMessageResponse {
  message: ChatMessage;
}
