package handler

import (
	"net/http"
	"ojs-server/internal/usecase/callback"

	"github.com/labstack/echo/v4"
)

type callbackHandler struct{ svc callback.Service }

func NewCallbackHandler(svc callback.Service) *callbackHandler { return &callbackHandler{svc: svc} }

func (h *callbackHandler) CallbackXendit(c echo.Context) error {
	ctx := c.Request().Context()
	req := callback.XenditCallbackRequest{}
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request"})
	}
	err := h.svc.CallbackXendit(ctx, req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"message": "success"})
}
