package handler

import (
    "net/http"

    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/repositories"
)

type adminStatsHandler struct{
    orders repositories.OrderRepo
    products repositories.ProductRepo
    accounts repositories.AccountRepo
}

func NewAdminStatsHandler(o repositories.OrderRepo, p repositories.ProductRepo, a repositories.AccountRepo) *adminStatsHandler {
    return &adminStatsHandler{ orders: o, products: p, accounts: a }
}

// GET /api/v1/admin/stats
func (h *adminStatsHandler) Get(c echo.Context) error {
    // Revenue: sum totalIDR for PAID orders
    paid, _ := h.orders.ListAll(c.Request().Context(), "", "PAID")
    revenue := 0
    for _, o := range paid { revenue += o.TotalIDR }

    // Counts
    ordersAll, _ := h.orders.ListAll(c.Request().Context(), "", "")
    products := h.products.GetAll()
    userCount, _ := h.accounts.Count(c.Request().Context())

    out := map[string]any{
        "revenueIDR": revenue,
        "orderCount": len(ordersAll),
        "productCount": len(products),
        "userCount": userCount,
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": out})
}

