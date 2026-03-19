package handler

import (
	"net/http"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/pkg/utils"
	"ojs-server/internal/usecase/wishlist"

	"github.com/labstack/echo/v4"
)

type wishlistHandler struct{ svc wishlist.Service }

func NewWishlistHandler(svc wishlist.Service) *wishlistHandler { return &wishlistHandler{svc: svc} }

func (h *wishlistHandler) Get(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	w, err := h.svc.GetWishlist(c.Request().Context(), prof.Email)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"items": w.Items})
}

func (h *wishlistHandler) Add(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	var it entities.WishlistItem
	if err := c.Bind(&it); err != nil {
		return err
	}
	if err := h.svc.AddItem(c.Request().Context(), prof.Email, it); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

func (h *wishlistHandler) Remove(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	id := c.Param("id")
	if err := h.svc.RemoveItem(c.Request().Context(), prof.Email, id); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

func (h *wishlistHandler) Check(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusOK, map[string]interface{}{"in_wishlist": false})
	}
	id := c.Param("id")
	inWishlist, err := h.svc.CheckItem(c.Request().Context(), prof.Email, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"in_wishlist": inWishlist})
}
