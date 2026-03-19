package config

type Xendit struct {
	APIHost  string `json:"apiHost"`
	KeyName  string `json:"keyName"`
	KeyToken string `json:"keyToken"`
}

type Telegram struct {
	BotToken      string `json:"botToken"`
	GroupID       int64  `json:"groupId"`
	WebhookSecret string `json:"webhookSecret"`
}
