package handler

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/usecase/category"
)

type adminCategoryHandler struct{ svc category.Service }

func NewAdminCategoryHandler(svc category.Service) *adminCategoryHandler { return &adminCategoryHandler{svc: svc} }

// GET /api/v1/admin/categories
func (h *adminCategoryHandler) List(c echo.Context) error {
    items, err := h.svc.List(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

type catReq struct {
    Slug        string `json:"slug"`
    Name        string `json:"name"`
    Description string `json:"description"`
    Color       string `json:"color"`
    Bg          string `json:"bg"`
}

// POST /api/v1/admin/categories
func (h *adminCategoryHandler) Create(c echo.Context) error {
    var req catReq
    if err := c.Bind(&req); err != nil { return err }
    in := &entities.Category{Slug: req.Slug, Name: req.Name, Description: req.Description, Color: req.Color, Bg: req.Bg}
    if in.Name == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "name is required"}) }
    if err := h.svc.Create(c.Request().Context(), in); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": in})
}

// PUT /api/v1/admin/categories/:slug
func (h *adminCategoryHandler) Update(c echo.Context) error {
    slug := c.Param("slug")
    var req catReq
    if err := c.Bind(&req); err != nil { return err }
    in := &entities.Category{Name: req.Name, Description: req.Description, Color: req.Color, Bg: req.Bg}
    out, err := h.svc.UpdateBySlug(c.Request().Context(), slug, in)
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": out})
}

// DELETE /api/v1/admin/categories/:slug
func (h *adminCategoryHandler) Delete(c echo.Context) error {
    slug := c.Param("slug")
    if slug == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "slug is required"}) }
    if err := h.svc.DeleteBySlug(c.Request().Context(), slug); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

