package handler

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "ojs-server/internal/usecase/category"
)

type categoryHandler struct{ svc category.Service }

func NewCategoryHandler(svc category.Service) *categoryHandler { return &categoryHandler{svc: svc} }

// GET /api/v1/categories (dynamic from DB)
func (h *categoryHandler) List(c echo.Context) error {
    items, err := h.svc.List(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

