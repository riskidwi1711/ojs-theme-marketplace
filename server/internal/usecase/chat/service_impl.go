package chat

import (
	"context"
	"fmt"
	"strings"
	"time"

	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/telegram"
)

type service struct {
	repo repositories.ChatRepo
	tg   telegram.Wrapper
}

func NewService(repo repositories.ChatRepo, tg telegram.Wrapper) Service {
	return &service{repo: repo, tg: tg}
}

func (s *service) SendMessage(ctx context.Context, email, name, text string) (*SendMessageResp, error) {
	if text == "" {
		return nil, fmt.Errorf("message text is required")
	}

	// Retrieve or create the session for this user.
	sess, err := s.repo.GetSessionByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if sess == nil {
		// First message: create a dedicated Telegram forum topic.
		topicName := fmt.Sprintf("%s (%s)", name, email)
		topicID, err := s.tg.CreateTopic(ctx, topicName)
		if err != nil {
			return nil, fmt.Errorf("failed to create Telegram topic: %w", err)
		}
		sess = &entities.ChatSession{
			UserEmail: email,
			UserName:  name,
			TopicID:   topicID,
			TopicName: topicName,
		}
		if err := s.repo.CreateSession(ctx, sess); err != nil {
			return nil, err
		}
	}

	// Format and forward to Telegram.
	formatted := fmt.Sprintf("<b>%s</b>\n%s", name, text)
	tgMsgID, err := s.tg.SendMessage(ctx, sess.TopicID, formatted)
	if err != nil {
		return nil, fmt.Errorf("failed to send to Telegram: %w", err)
	}

	// Persist locally.
	msg := &entities.ChatMessage{
		UserEmail: email,
		TopicID:   sess.TopicID,
		Sender:    "user",
		Type:      "text",
		Text:      text,
		TgMsgID:   tgMsgID,
	}
	if err := s.repo.SaveMessage(ctx, msg); err != nil {
		return nil, err
	}

	return &SendMessageResp{
		OK:        true,
		MessageID: msg.ID.Hex(),
		CreatedAt: msg.CreatedAt,
	}, nil
}

func (s *service) SendFile(ctx context.Context, email, name string, data []byte, fileName, mimeType string) (*SendMessageResp, error) {
	// Retrieve or create session.
	sess, err := s.repo.GetSessionByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if sess == nil {
		topicName := fmt.Sprintf("%s (%s)", name, email)
		topicID, err := s.tg.CreateTopic(ctx, topicName)
		if err != nil {
			return nil, fmt.Errorf("failed to create Telegram topic: %w", err)
		}
		sess = &entities.ChatSession{
			UserEmail: email,
			UserName:  name,
			TopicID:   topicID,
			TopicName: topicName,
		}
		if err := s.repo.CreateSession(ctx, sess); err != nil {
			return nil, err
		}
	}

	caption := fmt.Sprintf("<b>%s</b>", name)
	msgType := "document"
	var tgMsgID int
	var fileID string

	if strings.HasPrefix(mimeType, "image/") {
		msgType = "photo"
		tgMsgID, fileID, err = s.tg.SendPhoto(ctx, sess.TopicID, data, fileName, caption)
	} else {
		tgMsgID, fileID, err = s.tg.SendDocument(ctx, sess.TopicID, data, fileName, caption)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to send file to Telegram: %w", err)
	}

	// Resolve the Telegram file_id to a public URL so we can store and return it.
	fileURL := ""
	if fileID != "" {
		if u, err2 := s.tg.GetFileURL(ctx, fileID); err2 == nil {
			fileURL = u
		}
	}

	msg := &entities.ChatMessage{
		UserEmail: email,
		TopicID:   sess.TopicID,
		Sender:    "user",
		Type:      msgType,
		FileName:  fileName,
		FileMime:  mimeType,
		FileURL:   fileURL,
		TgMsgID:   tgMsgID,
	}
	if err := s.repo.SaveMessage(ctx, msg); err != nil {
		return nil, err
	}

	return &SendMessageResp{
		OK:        true,
		MessageID: msg.ID.Hex(),
		CreatedAt: msg.CreatedAt,
		FileURL:   fileURL,
		FileName:  fileName,
	}, nil
}

func (s *service) GetMessages(ctx context.Context, email string, after time.Time) (*MessagesResp, error) {
	msgs, err := s.repo.GetMessages(ctx, email, after)
	if err != nil {
		return nil, err
	}
	if msgs == nil {
		msgs = []entities.ChatMessage{}
	}
	resp := &MessagesResp{Messages: msgs}

	// Include session creation time so the client can display "conversation started at".
	sess, _ := s.repo.GetSessionByEmail(ctx, email)
	if sess != nil {
		resp.SessionCreatedAt = &sess.CreatedAt
	}
	return resp, nil
}

func (s *service) ReceiveWebhook(ctx context.Context, upd WebhookUpdate) error {
	// Ignore bots and non-topic messages.
	if upd.IsBot || upd.MessageThreadID == 0 {
		return nil
	}
	// Must have at least text, a photo file_id, or a document file_id.
	if upd.Text == "" && upd.PhotoFileID == "" && upd.DocumentFileID == "" {
		return nil
	}

	sess, err := s.repo.GetSessionByTopicID(ctx, upd.MessageThreadID)
	if err != nil {
		return err
	}
	if sess == nil {
		return nil
	}

	msg := &entities.ChatMessage{
		UserEmail: sess.UserEmail,
		TopicID:   upd.MessageThreadID,
		Sender:    "admin",
		TgMsgID:   upd.MessageID,
	}

	switch {
	case upd.PhotoFileID != "":
		msg.Type = "photo"
		msg.Text = upd.Caption
		if url, err := s.tg.GetFileURL(ctx, upd.PhotoFileID); err == nil {
			msg.FileURL = url
		}
	case upd.DocumentFileID != "":
		msg.Type = "document"
		msg.Text = upd.Caption
		msg.FileName = upd.DocumentFileName
		msg.FileMime = upd.DocumentMime
		if url, err := s.tg.GetFileURL(ctx, upd.DocumentFileID); err == nil {
			msg.FileURL = url
		}
	default:
		msg.Type = "text"
		msg.Text = upd.Text
	}

	return s.repo.SaveMessage(ctx, msg)
}

func (s *service) ListSessions(ctx context.Context) (*SessionsResp, error) {
	sessions, err := s.repo.ListSessions(ctx)
	if err != nil {
		return nil, err
	}
	if sessions == nil {
		sessions = []entities.ChatSession{}
	}
	return &SessionsResp{Sessions: sessions}, nil
}
