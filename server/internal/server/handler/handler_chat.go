package handler

import (
	"io"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/infrastructure/telegram"
	"ojs-server/internal/pkg/utils"
	chatuc "ojs-server/internal/usecase/chat"
)

type chatHandler struct {
	svc chatuc.Service
	tg  telegram.Wrapper
}

func NewChatHandler(svc chatuc.Service, tg telegram.Wrapper) *chatHandler {
	return &chatHandler{svc: svc, tg: tg}
}

// POST /api/v1/chat/message  (AuthRequired)
func (h *chatHandler) Send(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}

	var req chatuc.SendMessageReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request"})
	}
	if req.Text == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "text is required"})
	}

	name := prof.Name
	if name == "" {
		name = prof.Email
	}

	resp, err := h.svc.SendMessage(c.Request().Context(), prof.Email, name, req.Text)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, resp)
}

// POST /api/v1/chat/upload  (AuthRequired) — multipart form: field "file"
func (h *chatHandler) Upload(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "file is required"})
	}
	if file.Size > 20<<20 { // 20 MB limit
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "file too large (max 20 MB)"})
	}

	src, err := file.Open()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "cannot read file"})
	}
	defer src.Close()

	data, err := io.ReadAll(src)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "cannot read file"})
	}

	mimeType := file.Header.Get("Content-Type")
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	name := prof.Name
	if name == "" {
		name = prof.Email
	}

	resp, err := h.svc.SendFile(c.Request().Context(), prof.Email, name, data, file.Filename, mimeType)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, resp)
}

// GET /api/v1/chat/messages?after=<RFC3339>  (AuthRequired)
func (h *chatHandler) Messages(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}

	var after time.Time
	if raw := c.QueryParam("after"); raw != "" {
		if t, err := time.Parse(time.RFC3339, raw); err == nil {
			after = t
		}
	}

	resp, err := h.svc.GetMessages(c.Request().Context(), prof.Email, after)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, resp)
}

// POST /api/v1/chat/webhook  (public — authenticated via X-Telegram-Bot-Api-Secret-Token)
func (h *chatHandler) Webhook(c echo.Context) error {
	if secret := h.tg.GetWebhookSecret(); secret != "" {
		if c.Request().Header.Get("X-Telegram-Bot-Api-Secret-Token") != secret {
			return c.JSON(http.StatusUnauthorized, nil)
		}
	}

	var upd telegram.Update
	if err := c.Bind(&upd); err != nil || upd.Message == nil {
		return c.JSON(http.StatusOK, nil)
	}

	wu := chatuc.WebhookUpdate{
		MessageID:       upd.Message.MessageID,
		MessageThreadID: upd.Message.MessageThreadID,
		Text:            upd.Message.Text,
		Caption:         upd.Message.Caption,
		Date:            upd.Message.Date,
	}
	if upd.Message.From != nil {
		wu.FromUsername = upd.Message.From.Username
		wu.IsBot = upd.Message.From.IsBot
	}
	// Largest photo = last element in the array.
	if len(upd.Message.Photo) > 0 {
		wu.PhotoFileID = upd.Message.Photo[len(upd.Message.Photo)-1].FileID
	}
	if upd.Message.Document != nil {
		wu.DocumentFileID = upd.Message.Document.FileID
		wu.DocumentFileName = upd.Message.Document.FileName
		wu.DocumentMime = upd.Message.Document.MimeType
	}

	_ = h.svc.ReceiveWebhook(c.Request().Context(), wu)
	return c.JSON(http.StatusOK, nil)
}

// GET /api/v1/admin/chat/sessions  (AdminRequired)
func (h *chatHandler) AdminSessions(c echo.Context) error {
	resp, err := h.svc.ListSessions(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, resp)
}

// GET /api/v1/admin/chat/messages?email=<email>  (AdminRequired)
func (h *chatHandler) AdminMessages(c echo.Context) error {
	email := c.QueryParam("email")
	if email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "email is required"})
	}
	resp, err := h.svc.GetMessages(c.Request().Context(), email, time.Time{})
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, resp)
}
