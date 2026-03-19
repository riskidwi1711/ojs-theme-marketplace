package handler

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/pkg/utils"
	"ojs-server/internal/usecase/voucher"
)

type voucherHandler struct {
	svc voucher.Service
}

func NewVoucherHandler(svc voucher.Service) *voucherHandler {
	return &voucherHandler{svc: svc}
}

// POST /api/v1/vouchers/validate
// Body: { "code": "PROMO20", "totalIDR": 500000 }
func (h *voucherHandler) Validate(c echo.Context) error {
	var body struct {
		Code     string `json:"code"`
		TotalIDR int    `json:"totalIDR"`
	}
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
	}
	body.Code = strings.ToUpper(strings.TrimSpace(body.Code))
	if body.Code == "" {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "code is required"})
	}

	profile := utils.GetProfile(c.Request().Context())
	res, err := h.svc.Validate(c.Request().Context(), body.Code, body.TotalIDR, profile.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": res})
}

// ── Admin handlers ────────────────────────────────────────────────────────────

// GET /api/v1/admin/vouchers
func (h *voucherHandler) AdminList(c echo.Context) error {
	list, err := h.svc.List(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": list})
}

// POST /api/v1/admin/vouchers
func (h *voucherHandler) AdminCreate(c echo.Context) error {
	var v entities.Voucher
	if err := c.Bind(&v); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
	}
	created, err := h.svc.Create(c.Request().Context(), v)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": created})
}

// PUT /api/v1/admin/vouchers/:id
func (h *voucherHandler) AdminUpdate(c echo.Context) error {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid id"})
	}
	var v entities.Voucher
	if err := c.Bind(&v); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid request"})
	}
	updated, err := h.svc.Update(c.Request().Context(), id, v)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": updated})
}

// DELETE /api/v1/admin/vouchers/:id
func (h *voucherHandler) AdminDelete(c echo.Context) error {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]any{"status": "error", "message": "invalid id"})
	}
	if err := h.svc.Delete(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]any{"status": "error", "message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}
