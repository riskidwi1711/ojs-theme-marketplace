package handler

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/usecase/tag"
)

type adminTagHandler struct{ svc tag.Service }

func NewAdminTagHandler(svc tag.Service) *adminTagHandler { return &adminTagHandler{svc: svc} }

// GET /api/v1/admin/tags
func (h *adminTagHandler) List(c echo.Context) error {
    items, err := h.svc.List(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

type tagReq struct { Slug string `json:"slug"`; Name string `json:"name"`; Color string `json:"color"` }

// POST /api/v1/admin/tags
func (h *adminTagHandler) Create(c echo.Context) error {
    var req tagReq
    if err := c.Bind(&req); err != nil { return err }
    in := &entities.Tag{Slug: req.Slug, Name: req.Name, Color: req.Color}
    if in.Name == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "name is required"}) }
    if err := h.svc.Create(c.Request().Context(), in); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": in})
}

// PUT /api/v1/admin/tags/:slug
func (h *adminTagHandler) Update(c echo.Context) error {
    slug := c.Param("slug")
    var req tagReq
    if err := c.Bind(&req); err != nil { return err }
    out, err := h.svc.UpdateBySlug(c.Request().Context(), slug, &entities.Tag{Name: req.Name, Color: req.Color})
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": out})
}

// DELETE /api/v1/admin/tags/:slug
func (h *adminTagHandler) Delete(c echo.Context) error {
    slug := c.Param("slug")
    if slug == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "slug is required"}) }
    if err := h.svc.DeleteBySlug(c.Request().Context(), slug); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

