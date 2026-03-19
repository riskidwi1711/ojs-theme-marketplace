package handler

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/usecase/product"
)

type themeHandler struct {
	productService product.Service
}

func NewThemeHandler(productService product.Service) *themeHandler {
	return &themeHandler{productService: productService}
}

// GET /api/v1/themes?q=&section=&category=&tags=&limit=&page=
func (h *themeHandler) GetThemes(c echo.Context) error {
	query    := c.QueryParam("q")
	section  := c.QueryParam("section")
	category := c.QueryParam("category")
	tagsCSV  := c.QueryParam("tags")

	limitStr := c.QueryParam("limit")
	pageStr  := c.QueryParam("page")

	limit := 100
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	var tags []string
	if tagsCSV != "" {
		for _, t := range strings.Split(tagsCSV, ",") {
			if tt := strings.TrimSpace(t); tt != "" {
				tags = append(tags, tt)
			}
		}
	}

	filter := repositories.ProductFilter{
		Section:  section,
		Category: category,
		Tags:     tags,
		Query:    query,
		Limit:    limit,
		Page:     page,
	}

	items, total, err := h.productService.ListFilter(c.Request().Context(), filter)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	
	// Calculate totalPages
	totalPages := (total + limit - 1) / limit
	
	return c.JSON(http.StatusOK, map[string]any{
		"status":     "success",
		"data":       items,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": totalPages,
	})
}

// GET /api/v1/themes/:slug
func (h *themeHandler) GetTheme(c echo.Context) error {
	slug := c.Param("slug")
	p, err := h.productService.GetByID(c.Request().Context(), slug)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": p})
}
