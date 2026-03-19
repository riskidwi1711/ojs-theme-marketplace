package handler

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/pkg/utils"
    "ojs-server/internal/usecase/cart"
)

type cartHandler struct{ svc cart.Service }

func NewCartHandler(svc cart.Service) *cartHandler { return &cartHandler{ svc: svc } }

func (h *cartHandler) Get(c echo.Context) error {
    prof := utils.GetProfile(c.Request().Context())
    if prof.Email == "" { return c.JSON(http.StatusUnauthorized, map[string]string{"message":"unauthorized"}) }
    crt, err := h.svc.GetCart(c.Request().Context(), prof.Email)
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]interface{}{"items": crt.Items})
}

func (h *cartHandler) Add(c echo.Context) error {
    prof := utils.GetProfile(c.Request().Context())
    if prof.Email == "" { return c.JSON(http.StatusUnauthorized, map[string]string{"message":"unauthorized"}) }
    var it entities.CartItem
    if err := c.Bind(&it); err != nil { return err }
    if err := h.svc.AddItem(c.Request().Context(), prof.Email, it); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

func (h *cartHandler) Remove(c echo.Context) error {
    prof := utils.GetProfile(c.Request().Context())
    if prof.Email == "" { return c.JSON(http.StatusUnauthorized, map[string]string{"message":"unauthorized"}) }
    id := c.Param("id")
    if err := h.svc.RemoveItem(c.Request().Context(), prof.Email, id); err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

