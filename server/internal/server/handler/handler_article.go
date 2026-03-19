package handler

import (
    "net/http"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/usecase/article"
    "strconv"

    "github.com/labstack/echo/v4"
)

type articleHandler struct{ svc article.Service }

func NewArticleHandler(svc article.Service) *articleHandler { return &articleHandler{svc: svc} }

// GET /api/v1/articles?limit=3 (active only for public)
func (h *articleHandler) GetArticles(c echo.Context) error {
    limit, _ := strconv.Atoi(c.QueryParam("limit"))
    items, err := h.svc.ListActive(c.Request().Context(), limit)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "data":   items,
        "total":  len(items),
    })
}

// GET /api/v1/articles/:slug
func (h *articleHandler) GetArticle(c echo.Context) error {
    slug := c.Param("slug")
    item, err := h.svc.GetBySlug(c.Request().Context(), slug)
    if err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": "Article not found"})
    }
    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "data":   item,
    })
}

// ── Admin handlers ────────────────────────────────────────────────────────────

// GET /api/v1/admin/articles
func (h *articleHandler) AdminList(c echo.Context) error {
    list, err := h.svc.List(c.Request().Context())
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": list})
}

// POST /api/v1/admin/articles
func (h *articleHandler) AdminCreate(c echo.Context) error {
    var a entities.Article
    if err := c.Bind(&a); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
    }
    if err := h.svc.Create(c.Request().Context(), &a); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": a})
}

// PUT /api/v1/admin/articles/:slug
func (h *articleHandler) AdminUpdate(c echo.Context) error {
    slug := c.Param("slug")
    var a entities.Article
    if err := c.Bind(&a); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
    }
    updated, err := h.svc.Update(c.Request().Context(), slug, &a)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": updated})
}

// DELETE /api/v1/admin/articles/:slug
func (h *articleHandler) AdminDelete(c echo.Context) error {
    slug := c.Param("slug")
    if err := h.svc.Delete(c.Request().Context(), slug); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}
