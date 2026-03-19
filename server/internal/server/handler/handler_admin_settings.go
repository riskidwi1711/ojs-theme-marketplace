package handler

import (
    "context"
    "net/http"
    "strings"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/infrastructure/telegram"
    "ojs-server/internal/usecase/settings"
)

type adminSettingsHandler struct {
    svc settings.Service
    tg  telegram.Wrapper
}

func NewAdminSettingsHandler(svc settings.Service, tg telegram.Wrapper) *adminSettingsHandler {
    return &adminSettingsHandler{svc: svc, tg: tg}
}

// GET /api/v1/admin/settings
func (h *adminSettingsHandler) Get(c echo.Context) error {
    s, err := h.svc.GetSite(c.Request().Context())
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    // Mask sensitive fields
    if s.XenditKey != "" {
        s.XenditKey = maskSecret(s.XenditKey)
    }
    if s.TgBotToken != "" {
        s.TgBotToken = maskSecret(s.TgBotToken)
    }
    if s.TgWebhookSecret != "" {
        s.TgWebhookSecret = maskSecret(s.TgWebhookSecret)
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": s})
}

// PUT /api/v1/admin/settings
func (h *adminSettingsHandler) Put(c echo.Context) error {
    var req entities.Settings
    if err := c.Bind(&req); err != nil {
        return err
    }

    existing, _ := h.svc.GetSite(c.Request().Context())

    // Preserve masked values — don't overwrite with the masked placeholder
    if strings.HasPrefix(req.XenditKey, "****") {
        req.XenditKey = existing.XenditKey
    }
    if strings.HasPrefix(req.TgBotToken, "****") {
        req.TgBotToken = existing.TgBotToken
    }
    if strings.HasPrefix(req.TgWebhookSecret, "****") {
        req.TgWebhookSecret = existing.TgWebhookSecret
    }

    if req.ID == "" {
        req.ID = "site"
    }
    if err := h.svc.SaveSite(c.Request().Context(), &req); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
    }

    // Apply Telegram config changes at runtime.
    if h.tg != nil {
        h.tg.Reconfigure(req.TgBotToken, req.TgGroupID, req.TgWebhookSecret)
        if req.TgWebhookURL != "" {
            // Fire-and-forget; error is non-fatal for the save response.
            go func() {
                _ = h.tg.SetWebhook(context.Background(), req.TgWebhookURL)
            }()
        }
    }

    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

func maskSecret(s string) string {
    if len(s) <= 8 {
        return "****"
    }
    return "****" + s[len(s)-4:]
}

