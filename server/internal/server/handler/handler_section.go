package handler

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "ojs-server/internal/usecase/section"
)

type sectionHandler struct{ svc section.Service }

func NewSectionHandler(svc section.Service) *sectionHandler { return &sectionHandler{svc: svc} }

// GET /api/v1/sections (active only for public)
func (h *sectionHandler) List(c echo.Context) error {
    items, err := h.svc.ListActive(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

