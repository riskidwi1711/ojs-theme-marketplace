package handler

import (
	"net/http"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/usecase/promo"

	"github.com/labstack/echo/v4"
)

type promoHandler struct {
	promoService promo.Service
}

func NewPromoHandler(promoService promo.Service) *promoHandler {
	return &promoHandler{promoService: promoService}
}

// GET /api/v1/promos
func (h *promoHandler) GetPromos(c echo.Context) error {
	promos, err := h.promoService.GetActivePromos(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{
			"status":  "error",
			"message": err.Error(),
		})
	}
	return c.JSON(http.StatusOK, map[string]any{
		"status": "success",
		"data":   promos,
		"total":  len(promos),
	})
}

// ── Admin handlers ────────────────────────────────────────────────────────────

// GET /api/v1/admin/promos
func (h *promoHandler) AdminList(c echo.Context) error {
	list, err := h.promoService.GetActivePromos(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": list})
}

// POST /api/v1/admin/promos
func (h *promoHandler) AdminCreate(c echo.Context) error {
	var p entities.Promo
	if err := c.Bind(&p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
	}
	created, err := h.promoService.CreatePromo(c.Request().Context(), p)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": created})
}

// PUT /api/v1/admin/promos/:id
func (h *promoHandler) AdminUpdate(c echo.Context) error {
	id := c.Param("id")
	var p entities.Promo
	if err := c.Bind(&p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
	}
	updated, err := h.promoService.UpdatePromo(c.Request().Context(), id, p)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": updated})
}

// DELETE /api/v1/admin/promos/:id
func (h *promoHandler) AdminDelete(c echo.Context) error {
	id := c.Param("id")
	if err := h.promoService.DeletePromo(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}
