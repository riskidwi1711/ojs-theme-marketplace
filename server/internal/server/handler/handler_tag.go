package handler

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "ojs-server/internal/usecase/tag"
)

type tagHandler struct{ svc tag.Service }

func NewTagHandler(svc tag.Service) *tagHandler { return &tagHandler{svc: svc} }

// GET /api/v1/tags
func (h *tagHandler) List(c echo.Context) error {
    items, err := h.svc.List(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}
