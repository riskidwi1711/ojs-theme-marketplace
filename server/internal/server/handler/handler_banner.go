package handler

import (
    "net/http"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/usecase/banner"

    "github.com/labstack/echo/v4"
)

type bannerHandler struct{ svc banner.Service }

func NewBannerHandler(svc banner.Service) *bannerHandler { return &bannerHandler{svc: svc} }

// GET /api/v1/banners (active only for public)
func (h *bannerHandler) GetBanners(c echo.Context) error {
    items, err := h.svc.ListActive(c.Request().Context())
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "data":   items,
        "total":  len(items),
    })
}

// ── Admin handlers ────────────────────────────────────────────────────────────

// GET /api/v1/admin/banners
func (h *bannerHandler) AdminList(c echo.Context) error {
    list, err := h.svc.List(c.Request().Context())
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": list})
}

// POST /api/v1/admin/banners
func (h *bannerHandler) AdminCreate(c echo.Context) error {
    var b entities.Banner
    if err := c.Bind(&b); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
    }
    if err := h.svc.Create(c.Request().Context(), &b); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": b})
}

// PUT /api/v1/admin/banners/:id
func (h *bannerHandler) AdminUpdate(c echo.Context) error {
    id := c.Param("id")
    var b entities.Banner
    if err := c.Bind(&b); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
    }
    updated, err := h.svc.Update(c.Request().Context(), id, &b)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": updated})
}

// DELETE /api/v1/admin/banners/:id
func (h *bannerHandler) AdminDelete(c echo.Context) error {
    id := c.Param("id")
    if err := h.svc.Delete(c.Request().Context(), id); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}
