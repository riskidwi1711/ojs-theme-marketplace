package handler

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/usecase/checkout"
)

type adminOrderHandler struct{ svc checkout.Service }

func NewAdminOrderHandler(svc checkout.Service) *adminOrderHandler { return &adminOrderHandler{svc: svc} }

// GET /api/v1/admin/orders?email=&status=
func (h *adminOrderHandler) List(c echo.Context) error {
    email := c.QueryParam("email")
    status := c.QueryParam("status")
    items, err := h.svc.AdminList(c.Request().Context(), email, status)
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": items, "total": len(items)})
}

// GET /api/v1/admin/orders/:id
func (h *adminOrderHandler) Get(c echo.Context) error {
    id := c.Param("id")
    ord, err := h.svc.Get(c.Request().Context(), id)
    if err != nil { return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": ord})
}

type orderStatusReq struct { Status string `json:"status"` }

// PUT /api/v1/admin/orders/:id/status
func (h *adminOrderHandler) UpdateStatus(c echo.Context) error {
    id := c.Param("id")
    var req orderStatusReq
    if err := c.Bind(&req); err != nil { return err }
    if req.Status == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "status is required"}) }
    if err := h.svc.AdminUpdateStatus(c.Request().Context(), id, req.Status); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

