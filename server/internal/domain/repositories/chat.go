package repositories

import (
	"context"
	"time"

	"ojs-server/internal/domain/entities"
)

type ChatRepo interface {
	// GetSessionByEmail returns the existing chat session for a user, or nil if none.
	GetSessionByEmail(ctx context.Context, email string) (*entities.ChatSession, error)

	// GetSessionByTopicID returns the chat session associated with a Telegram topic ID.
	GetSessionByTopicID(ctx context.Context, topicID int64) (*entities.ChatSession, error)

	// CreateSession persists a new chat session.
	CreateSession(ctx context.Context, session *entities.ChatSession) error

	// ListSessions returns all chat sessions ordered by most recently active.
	ListSessions(ctx context.Context) ([]entities.ChatSession, error)

	// SaveMessage persists a chat message and bumps the session updated_at.
	SaveMessage(ctx context.Context, msg *entities.ChatMessage) error

	// GetMessages returns messages for a user, optionally filtered to those after `after`.
	// Pass zero time to get all messages.
	GetMessages(ctx context.Context, email string, after time.Time) ([]entities.ChatMessage, error)
}
