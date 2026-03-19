package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/brevo"
)

type adminEmailTemplateHandler struct {
	repo     repositories.EmailTemplateRepo
	defaults map[string]entities.EmailTemplate
}

func NewAdminEmailTemplateHandler(repo repositories.EmailTemplateRepo) *adminEmailTemplateHandler {
	return &adminEmailTemplateHandler{
		repo:     repo,
		defaults: brevo.DefaultTemplates(),
	}
}

// GET /api/v1/admin/email-templates
func (h *adminEmailTemplateHandler) List(c echo.Context) error {
	ctx := c.Request().Context()

	// Build list: DB records merged with defaults for any missing keys
	dbList, err := h.repo.List(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	// Index DB records by key
	indexed := make(map[string]entities.EmailTemplate, len(dbList))
	for _, t := range dbList {
		indexed[t.Key] = t
	}

	// Fill in defaults for keys not yet saved in DB
	for key, def := range h.defaults {
		if _, ok := indexed[key]; !ok {
			indexed[key] = def
		}
	}

	// Flatten to slice
	out := make([]entities.EmailTemplate, 0, len(indexed))
	for _, t := range indexed {
		out = append(out, t)
	}
	return c.JSON(http.StatusOK, map[string]any{"templates": out})
}

// GET /api/v1/admin/email-templates/:key
func (h *adminEmailTemplateHandler) Get(c echo.Context) error {
	key := c.Param("key")
	ctx := c.Request().Context()

	tpl, err := h.repo.GetByKey(ctx, key)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	if tpl == nil {
		// Return built-in default so admin has something to start with
		def, ok := h.defaults[key]
		if !ok {
			return c.JSON(http.StatusNotFound, map[string]string{"message": "template not found"})
		}
		return c.JSON(http.StatusOK, map[string]any{"template": def})
	}
	// Merge variables from default (they are informational, not stored)
	if def, ok := h.defaults[tpl.Key]; ok {
		tpl.Variables = def.Variables
	}
	return c.JSON(http.StatusOK, map[string]any{"template": tpl})
}

type updateEmailTemplateReq struct {
	Name    string `json:"name"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

// PUT /api/v1/admin/email-templates/:key
func (h *adminEmailTemplateHandler) Update(c echo.Context) error {
	key := c.Param("key")

	// Only allow known keys
	def, ok := h.defaults[key]
	if !ok {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "template not found"})
	}

	var req updateEmailTemplateReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	if req.Subject == "" || req.Body == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "subject and body are required"})
	}

	name := req.Name
	if name == "" {
		name = def.Name
	}

	tpl := entities.EmailTemplate{
		Key:       key,
		Name:      name,
		Subject:   req.Subject,
		Body:      req.Body,
		Variables: def.Variables,
	}
	ctx := c.Request().Context()
	if err := h.repo.Save(ctx, tpl); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"template": tpl})
}

// DELETE /api/v1/admin/email-templates/:key  → resets to default
func (h *adminEmailTemplateHandler) Reset(c echo.Context) error {
	key := c.Param("key")
	def, ok := h.defaults[key]
	if !ok {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "template not found"})
	}

	ctx := c.Request().Context()
	if err := h.repo.Save(ctx, def); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"template": def, "message": "reset to default"})
}
