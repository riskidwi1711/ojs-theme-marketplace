package telegram

import "context"

// Wrapper abstracts calls to the Telegram Bot API.
type Wrapper interface {
	// CreateTopic creates a new forum topic in the configured supergroup.
	CreateTopic(ctx context.Context, topicName string) (int64, error)

	// SendMessage sends text to a specific forum topic (thread).
	SendMessage(ctx context.Context, threadID int64, text string) (int, error)

	// SendPhoto uploads a photo to a topic.
	// Returns (telegram message_id, file_id of the largest photo, error).
	SendPhoto(ctx context.Context, threadID int64, data []byte, fileName, caption string) (msgID int, fileID string, err error)

	// SendDocument uploads a document to a topic.
	// Returns (telegram message_id, file_id of the document, error).
	SendDocument(ctx context.Context, threadID int64, data []byte, fileName, caption string) (msgID int, fileID string, err error)

	// GetFileURL resolves a Telegram file_id to a public download URL.
	GetFileURL(ctx context.Context, fileID string) (string, error)

	// SetWebhook registers the bot webhook URL with Telegram.
	SetWebhook(ctx context.Context, webhookURL string) error

	// Reconfigure updates bot token, group ID, and webhook secret at runtime.
	// Empty / zero values are ignored so callers can do partial updates.
	Reconfigure(botToken string, groupID int64, webhookSecret string)

	// GetWebhookSecret returns the current webhook verification secret.
	GetWebhookSecret() string
}
