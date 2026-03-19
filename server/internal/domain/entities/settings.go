package entities

type Settings struct {
    ID           string `bson:"_id"          json:"id"`
    SiteName     string `bson:"site_name"    json:"siteName"`
    SiteURL      string `bson:"site_url"     json:"siteUrl"`
    SupportEmail string `bson:"support_email" json:"supportEmail"`
    XenditHost   string `bson:"xendit_host"  json:"xenditHost"`
    XenditKey    string `bson:"xendit_key"   json:"xenditKey,omitempty"`

    // Telegram live-chat integration
    TgBotToken      string `bson:"tg_bot_token"      json:"tgBotToken,omitempty"`
    TgGroupID       int64  `bson:"tg_group_id"       json:"tgGroupId,omitempty"`
    TgWebhookSecret string `bson:"tg_webhook_secret" json:"tgWebhookSecret,omitempty"`
    TgWebhookURL    string `bson:"tg_webhook_url"    json:"tgWebhookURL,omitempty"`
}

