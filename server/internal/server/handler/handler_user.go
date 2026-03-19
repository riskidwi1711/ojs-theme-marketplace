package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/pkg/utils"
	"ojs-server/internal/usecase/user"
)

type userHandler struct {
	usersvc user.Service
}

func NewUserHandler(
	usersvc user.Service,
) *userHandler {
	return &userHandler{
		usersvc: usersvc,
	}
}

func (h *userHandler) GetAllUser(c echo.Context) (err error) {
	ctx := utils.InjectProfile(c)

	var req user.GetUsersReq
	if err = c.Bind(&req); err != nil {
		return
	}

	res, err := h.usersvc.GetAllUser(ctx, req)
	if err != nil {
		return
	}
	return c.JSON(http.StatusOK, res)
}
