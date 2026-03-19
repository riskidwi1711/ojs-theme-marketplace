package handler

import (
    "net/http"
    "strconv"
    "strings"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/repositories"
    "ojs-server/internal/usecase/product"
)

type productHandler struct{ svc product.Service }

func NewProductHandler(svc product.Service) *productHandler { return &productHandler{svc: svc} }

// GET /api/v1/products?section=bestsellers|new|essential&category=
func (h *productHandler) List(c echo.Context) error {
    section := c.QueryParam("section")
    category := c.QueryParam("category")
    tagsCSV := c.QueryParam("tags")
    limit, _ := strconv.Atoi(c.QueryParam("limit"))
    page, _ := strconv.Atoi(c.QueryParam("page"))
    var tags []string
    if tagsCSV != "" { for _, t := range strings.Split(tagsCSV, ",") { if tt := strings.TrimSpace(t); tt != "" { tags = append(tags, tt) } } }
    items, total, err := h.svc.ListFilter(c.Request().Context(), repositories.ProductFilter{ Section: section, Category: category, Tags: tags, Limit: limit, Page: page })
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    
    // Calculate totalPages safely
    totalPages := 0
    if limit > 0 {
        totalPages = (total + limit - 1) / limit
    }
    
    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "data":   items,
        "total":  total,
        "page":   page,
        "limit":  limit,
        "totalPages": totalPages,
    })
}

// GET /api/v1/products/:id
func (h *productHandler) Get(c echo.Context) error {
	id := c.Param("id")
	p, err := h.svc.GetByID(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": p})
}
