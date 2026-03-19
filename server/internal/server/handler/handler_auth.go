package handler

import (
	"net/http"
	"strings"

	"ojs-server/internal/pkg/log"
	"ojs-server/internal/pkg/utils"
	"ojs-server/internal/usecase/auth"

	"github.com/labstack/echo/v4"
)

type authHandler struct{ svc auth.Service }

func NewAuthHandler(svc auth.Service) *authHandler { return &authHandler{svc: svc} }

type registerReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}
type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
type adminLoginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *authHandler) Register(c echo.Context) error {
	ctx := utils.InjectProfile(c)
	var req registerReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	token, profile, err := h.svc.Register(ctx, strings.TrimSpace(req.Email), req.Password, req.Name)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"token": token, "profile": profile})
}

func (h *authHandler) Login(c echo.Context) error {
	ctx := utils.InjectProfile(c)
	var req loginReq
	if err := c.Bind(&req); err != nil {
		return err
	}

	log.Info(ctx, "Attempting user login", "email", req.Email)
	token, profile, err := h.svc.Login(ctx, strings.TrimSpace(req.Email), req.Password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"token": token, "profile": profile})
}

// POST /api/v1/auth/admin/login
func (h *authHandler) AdminLogin(c echo.Context) error {
	ctx := utils.InjectProfile(c)
	var req adminLoginReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	token, profile, err := h.svc.LoginAdmin(ctx, strings.TrimSpace(req.Email), req.Password)
	if err != nil {
		log.Info(ctx, "error occurred while admin login", err.Error())
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid credentials"})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"token": token, "profile": profile})
}

func (h *authHandler) Me(c echo.Context) error {
	token := c.Request().Header.Get("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")
	prof, err := h.svc.Me(c.Request().Context(), token)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"profile": prof})
}

func (h *authHandler) Logout(c echo.Context) error {
	// stateless JWT: client should drop token
	return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

func (h *authHandler) Refresh(c echo.Context) error {
	token := c.Request().Header.Get("Authorization")
	token = strings.TrimPrefix(token, "Bearer ")
	newTok, prof, err := h.svc.Refresh(c.Request().Context(), token)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"token": newTok, "profile": prof})
}

type changePasswordReq struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

func (h *authHandler) ChangePassword(c echo.Context) error {
	ctx := utils.InjectProfile(c)
	email := c.Get("userEmail").(string)
	var req changePasswordReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request"})
	}
	if err := h.svc.ChangePassword(ctx, email, req.CurrentPassword, req.NewPassword); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "Password changed successfully"})
}
