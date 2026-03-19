package handler

import (
	"context"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/brevo"
)

type newsletterHandler struct {
	repo  repositories.NewsletterRepo
	brevo brevo.Wrapper
}

func NewNewsletterHandler(repo repositories.NewsletterRepo, brevoWrapper brevo.Wrapper) *newsletterHandler {
	return &newsletterHandler{repo: repo, brevo: brevoWrapper}
}

type subscribeReq struct {
	Email string `json:"email"`
}

// POST /api/v1/newsletter
func (h *newsletterHandler) Subscribe(c echo.Context) error {
	var req subscribeReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	email := strings.TrimSpace(strings.ToLower(req.Email))
	if email == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "email is required"})
	}
	if err := h.repo.Subscribe(c.Request().Context(), email); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Send welcome email (best-effort, non-blocking)
	if h.brevo != nil {
		go h.brevo.SendNewsletterWelcome(context.Background(), email) //nolint:errcheck
	}

	return c.JSON(http.StatusOK, map[string]any{"status": "success", "message": "subscribed"})
}
