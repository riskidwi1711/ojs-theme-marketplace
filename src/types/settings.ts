export interface Settings {
  id?: string;
  siteName: string;
  supportEmail: string;
  xenditHost?: string;
  xenditKey?: string;
  // Telegram live-chat
  tgBotToken?: string;
  tgGroupId?: number;
  tgWebhookSecret?: string;
  tgWebhookURL?: string;
}
