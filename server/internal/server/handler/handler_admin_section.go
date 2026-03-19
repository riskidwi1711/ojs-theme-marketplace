package handler

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/usecase/section"
)

type adminSectionHandler struct{ svc section.Service }

func NewAdminSectionHandler(svc section.Service) *adminSectionHandler { return &adminSectionHandler{svc: svc} }

// GET /api/v1/admin/sections
func (h *adminSectionHandler) List(c echo.Context) error {
    items, err := h.svc.List(c.Request().Context())
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

type secReq struct { Slug string `json:"slug"`; Name string `json:"name"`; Order int `json:"order"` }

func (h *adminSectionHandler) Create(c echo.Context) error {
    var req secReq
    if err := c.Bind(&req); err != nil { return err }
    in := &entities.Section{Slug: req.Slug, Name: req.Name, Order: req.Order}
    if in.Name == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "name is required"}) }
    if err := h.svc.Create(c.Request().Context(), in); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": in})
}

func (h *adminSectionHandler) Update(c echo.Context) error {
    slug := c.Param("slug")
    var req secReq
    if err := c.Bind(&req); err != nil { return err }
    out, err := h.svc.UpdateBySlug(c.Request().Context(), slug, &entities.Section{Name: req.Name, Order: req.Order})
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": out})
}

func (h *adminSectionHandler) Delete(c echo.Context) error {
    slug := c.Param("slug")
    if slug == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "slug is required"}) }
    if err := h.svc.DeleteBySlug(c.Request().Context(), slug); err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

