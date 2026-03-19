package chat

import (
	"ojs-server/internal/domain/entities"
	"time"
)

// SendMessageReq is the request body for sending a user message.
type SendMessageReq struct {
	Text string `json:"text"`
}

// SendMessageResp is returned after a message is sent successfully.
type SendMessageResp struct {
	OK        bool      `json:"ok"`
	MessageID string    `json:"messageId"`
	CreatedAt time.Time `json:"createdAt"`
	FileURL   string    `json:"fileUrl,omitempty"`
	FileName  string    `json:"fileName,omitempty"`
}

// MessagesResp wraps the list of messages for a user session.
type MessagesResp struct {
	Messages         []entities.ChatMessage `json:"messages"`
	SessionCreatedAt *time.Time             `json:"sessionCreatedAt,omitempty"`
}

// SessionsResp wraps all sessions for admin view.
type SessionsResp struct {
	Sessions []entities.ChatSession `json:"sessions"`
}

// WebhookUpdate is a parsed Telegram update delivered to the webhook endpoint.
type WebhookUpdate struct {
	MessageID        int
	MessageThreadID  int64
	Text             string
	Caption          string
	PhotoFileID      string // set when admin sends a photo
	DocumentFileID   string // set when admin sends a document
	DocumentFileName string
	DocumentMime     string
	FromUsername     string
	IsBot            bool
	Date             int64
}
