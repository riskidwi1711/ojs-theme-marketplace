package chat

import (
	"context"
	"time"
)

type Service interface {
	// SendMessage is called when a logged-in user sends a chat message.
	// It creates a Telegram forum topic on first contact, then sends the message.
	SendMessage(ctx context.Context, email, name, text string) (*SendMessageResp, error)

	// SendFile forwards an uploaded file (image or document) to the user's Telegram topic.
	SendFile(ctx context.Context, email, name string, data []byte, fileName, mimeType string) (*SendMessageResp, error)

	// GetMessages returns the message history for a user, optionally after a given time.
	GetMessages(ctx context.Context, email string, after time.Time) (*MessagesResp, error)

	// ReceiveWebhook handles an incoming Telegram webhook update (admin replies).
	ReceiveWebhook(ctx context.Context, update WebhookUpdate) error

	// ListSessions returns all active chat sessions (admin use).
	ListSessions(ctx context.Context) (*SessionsResp, error)
}
