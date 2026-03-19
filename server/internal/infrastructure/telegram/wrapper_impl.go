package telegram

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"ojs-server/internal/config"
	"sync/atomic"
	"time"
)

const apiBase = "https://api.telegram.org/bot%s/%s"

// tgConfig holds the mutable telegram credentials.
// It is replaced atomically via atomic.Pointer so callers never see a partial update.
type tgConfig struct {
	botToken      string
	groupID       int64
	webhookSecret string
}

type telegramWrapper struct {
	cfg    atomic.Pointer[tgConfig]
	client *http.Client
}

// New constructs a Telegram Wrapper from config.
func New(cfg config.Telegram) Wrapper {
	w := &telegramWrapper{
		client: &http.Client{Timeout: 10 * time.Second},
	}
	w.cfg.Store(&tgConfig{
		botToken:      cfg.BotToken,
		groupID:       cfg.GroupID,
		webhookSecret: cfg.WebhookSecret,
	})
	return w
}

func (w *telegramWrapper) c() *tgConfig { return w.cfg.Load() }

func (w *telegramWrapper) Reconfigure(botToken string, groupID int64, webhookSecret string) {
	old := w.c()
	n := *old // copy
	if botToken != "" {
		n.botToken = botToken
	}
	if groupID != 0 {
		n.groupID = groupID
	}
	if webhookSecret != "" {
		n.webhookSecret = webhookSecret
	}
	w.cfg.Store(&n)
}

func (w *telegramWrapper) GetWebhookSecret() string { return w.c().webhookSecret }

func endpoint(token, method string) string {
	return fmt.Sprintf(apiBase, token, method)
}

// post sends a POST JSON request to the Telegram Bot API and decodes the response.
func (w *telegramWrapper) post(ctx context.Context, token, method string, payload, out any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint(token, method), bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := w.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("telegram %s: HTTP %d – %s", method, resp.StatusCode, string(raw))
	}
	return json.Unmarshal(raw, out)
}

// postMultipart sends a multipart/form-data request to the Telegram Bot API.
func (w *telegramWrapper) postMultipart(ctx context.Context, token, method string, fields map[string]string, fileField, fileName string, fileData []byte, out any) error {
	var buf bytes.Buffer
	mw := multipart.NewWriter(&buf)

	for k, v := range fields {
		if err := mw.WriteField(k, v); err != nil {
			return err
		}
	}

	fw, err := mw.CreateFormFile(fileField, fileName)
	if err != nil {
		return err
	}
	if _, err = fw.Write(fileData); err != nil {
		return err
	}
	mw.Close()

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint(token, method), &buf)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", mw.FormDataContentType())

	resp, err := w.client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	raw, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 300 {
		return fmt.Errorf("telegram %s: HTTP %d – %s", method, resp.StatusCode, string(raw))
	}
	return json.Unmarshal(raw, out)
}

func (w *telegramWrapper) CreateTopic(ctx context.Context, topicName string) (int64, error) {
	cfg := w.c()
	if cfg.botToken == "" {
		return 0, fmt.Errorf("telegram: bot token not configured")
	}
	payload := CreateForumTopicRequest{ChatID: cfg.groupID, Name: topicName}
	var resp CreateForumTopicResponse
	if err := w.post(ctx, cfg.botToken, "createForumTopic", payload, &resp); err != nil {
		return 0, err
	}
	if !resp.OK {
		return 0, fmt.Errorf("telegram: createForumTopic returned ok=false")
	}
	return resp.Result.MessageThreadID, nil
}

func (w *telegramWrapper) SendMessage(ctx context.Context, threadID int64, text string) (int, error) {
	cfg := w.c()
	if cfg.botToken == "" {
		return 0, fmt.Errorf("telegram: bot token not configured")
	}
	payload := SendMessageRequest{
		ChatID:          cfg.groupID,
		Text:            text,
		MessageThreadID: threadID,
		ParseMode:       "HTML",
	}
	var resp SendMessageResponse
	if err := w.post(ctx, cfg.botToken, "sendMessage", payload, &resp); err != nil {
		return 0, err
	}
	if !resp.OK {
		return 0, fmt.Errorf("telegram: sendMessage returned ok=false")
	}
	return resp.Result.MessageID, nil
}

func (w *telegramWrapper) SendPhoto(ctx context.Context, threadID int64, data []byte, fileName, caption string) (int, string, error) {
	cfg := w.c()
	if cfg.botToken == "" {
		return 0, "", fmt.Errorf("telegram: bot token not configured")
	}
	fields := map[string]string{
		"chat_id":           fmt.Sprintf("%d", cfg.groupID),
		"message_thread_id": fmt.Sprintf("%d", threadID),
		"caption":           caption,
		"parse_mode":        "HTML",
	}
	var resp SendFileResponse
	if err := w.postMultipart(ctx, cfg.botToken, "sendPhoto", fields, "photo", fileName, data, &resp); err != nil {
		return 0, "", err
	}
	if !resp.OK {
		return 0, "", fmt.Errorf("telegram: sendPhoto returned ok=false")
	}
	// Pick the largest photo (last element has highest resolution).
	fileID := ""
	if n := len(resp.Result.Photo); n > 0 {
		fileID = resp.Result.Photo[n-1].FileID
	}
	return resp.Result.MessageID, fileID, nil
}

func (w *telegramWrapper) SendDocument(ctx context.Context, threadID int64, data []byte, fileName, caption string) (int, string, error) {
	cfg := w.c()
	if cfg.botToken == "" {
		return 0, "", fmt.Errorf("telegram: bot token not configured")
	}
	fields := map[string]string{
		"chat_id":           fmt.Sprintf("%d", cfg.groupID),
		"message_thread_id": fmt.Sprintf("%d", threadID),
		"caption":           caption,
		"parse_mode":        "HTML",
	}
	var resp SendFileResponse
	if err := w.postMultipart(ctx, cfg.botToken, "sendDocument", fields, "document", fileName, data, &resp); err != nil {
		return 0, "", err
	}
	if !resp.OK {
		return 0, "", fmt.Errorf("telegram: sendDocument returned ok=false")
	}
	fileID := ""
	if resp.Result.Document != nil {
		fileID = resp.Result.Document.FileID
	}
	return resp.Result.MessageID, fileID, nil
}

func (w *telegramWrapper) GetFileURL(ctx context.Context, fileID string) (string, error) {
	cfg := w.c()
	if cfg.botToken == "" {
		return "", fmt.Errorf("telegram: bot token not configured")
	}
	payload := map[string]string{"file_id": fileID}
	var resp GetFileResponse
	if err := w.post(ctx, cfg.botToken, "getFile", payload, &resp); err != nil {
		return "", err
	}
	if !resp.OK || resp.Result.FilePath == "" {
		return "", fmt.Errorf("telegram: getFile failed for %s", fileID)
	}
	return fmt.Sprintf("https://api.telegram.org/file/bot%s/%s", cfg.botToken, resp.Result.FilePath), nil
}

func (w *telegramWrapper) SetWebhook(ctx context.Context, webhookURL string) error {
	cfg := w.c()
	if cfg.botToken == "" {
		return fmt.Errorf("telegram: bot token not configured")
	}
	payload := SetWebhookRequest{URL: webhookURL, SecretToken: cfg.webhookSecret}
	var result map[string]any
	return w.post(ctx, cfg.botToken, "setWebhook", payload, &result)
}
