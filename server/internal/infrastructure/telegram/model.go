package telegram

// ─── Bot API requests ──────────────────────────────────────────────────────────

type SendMessageRequest struct {
	ChatID          int64  `json:"chat_id"`
	Text            string `json:"text"`
	MessageThreadID int64  `json:"message_thread_id,omitempty"`
	ParseMode       string `json:"parse_mode,omitempty"`
}

type CreateForumTopicRequest struct {
	ChatID    int64  `json:"chat_id"`
	Name      string `json:"name"`
	IconColor int    `json:"icon_color,omitempty"`
}

type SetWebhookRequest struct {
	URL         string `json:"url"`
	SecretToken string `json:"secret_token,omitempty"`
}

// ─── Bot API responses ─────────────────────────────────────────────────────────

type SendMessageResponse struct {
	OK     bool    `json:"ok"`
	Result Message `json:"result"`
}

type CreateForumTopicResponse struct {
	OK     bool       `json:"ok"`
	Result ForumTopic `json:"result"`
}

type ForumTopic struct {
	MessageThreadID int64  `json:"message_thread_id"`
	Name            string `json:"name"`
	IconColor       int    `json:"icon_color"`
}

// ─── Webhook update types ──────────────────────────────────────────────────────

type Update struct {
	UpdateID int      `json:"update_id"`
	Message  *Message `json:"message,omitempty"`
}

type Message struct {
	MessageID       int         `json:"message_id"`
	MessageThreadID int64       `json:"message_thread_id,omitempty"`
	Text            string      `json:"text,omitempty"`
	Caption         string      `json:"caption,omitempty"`
	Photo           []PhotoSize `json:"photo,omitempty"`
	Document        *Document   `json:"document,omitempty"`
	From            *User       `json:"from,omitempty"`
	Chat            *Chat       `json:"chat,omitempty"`
	Date            int64       `json:"date"`
}

type PhotoSize struct {
	FileID       string `json:"file_id"`
	FileUniqueID string `json:"file_unique_id"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	FileSize     int    `json:"file_size,omitempty"`
}

type Document struct {
	FileID       string `json:"file_id"`
	FileUniqueID string `json:"file_unique_id"`
	FileName     string `json:"file_name,omitempty"`
	MimeType     string `json:"mime_type,omitempty"`
	FileSize     int    `json:"file_size,omitempty"`
}

type GetFileResponse struct {
	OK     bool   `json:"ok"`
	Result struct {
		FileID   string `json:"file_id"`
		FilePath string `json:"file_path"`
	} `json:"result"`
}

type SendFileResponse struct {
	OK     bool    `json:"ok"`
	Result Message `json:"result"`
}

type User struct {
	ID        int64  `json:"id"`
	IsBot     bool   `json:"is_bot"`
	FirstName string `json:"first_name"`
	Username  string `json:"username,omitempty"`
}

type Chat struct {
	ID    int64  `json:"id"`
	Type  string `json:"type"`
	Title string `json:"title,omitempty"`
}
