package handler

import (
    "net/http"
    "strconv"

    "ojs-server/internal/domain/repositories"
    "ojs-server/internal/pkg/constants"
    "ojs-server/internal/pkg/utils"
    "ojs-server/internal/domain/entities"

    "github.com/labstack/echo/v4"
)

type adminAccountHandler struct{ repo repositories.AccountRepo }

func NewAdminAccountHandler(repo repositories.AccountRepo) *adminAccountHandler {
	return &adminAccountHandler{repo: repo}
}

// GET /api/v1/admin/accounts?q=&role=&status=&limit=&page=
func (h *adminAccountHandler) List(c echo.Context) error {
	q := c.QueryParam("q")
	role := c.QueryParam("role")
	status := c.QueryParam("status")
	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	page, _ := strconv.Atoi(c.QueryParam("page"))
	docs, total, err := h.repo.List(c.Request().Context(), q, role, status, limit, page)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	// shape to pagination response
	resp := utils.GetPaginationResponse(docs, total, utils.PaginationParam{Page: uint(max1(page)), Limit: uint(max1(limit))})
	return c.JSON(http.StatusOK, constants.DefaultResponse{Status: constants.STATUS_SUCCESS, Message: constants.MESSAGE_SUCCESS, Data: resp})
}

type createAccountReq struct {
    Email    string `json:"email"`
    Password string `json:"password"`
    Name     string `json:"name"`
    Role     string `json:"role"`
    Status   string `json:"status"`
}

// POST /api/v1/admin/accounts
func (h *adminAccountHandler) Create(c echo.Context) error {
    var req createAccountReq
    if err := c.Bind(&req); err != nil { return err }
    if req.Email == "" || req.Password == "" || req.Name == "" {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": "email, password, and name are required"})
    }
    if _, err := h.repo.FindByEmail(c.Request().Context(), req.Email); err == nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": "email already registered"})
    }
    if req.Role == "" { req.Role = "user" }
    if req.Status == "" { req.Status = "active" }
    hash, err := utils.HashPassword(req.Password)
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    acc := &entities.Account{ Email: req.Email, Name: req.Name, Role: req.Role, Status: req.Status, PasswordHash: hash }
    if err := h.repo.Create(c.Request().Context(), acc); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": map[string]any{
        "email": acc.Email, "name": acc.Name, "role": acc.Role, "status": acc.Status,
    }})
}

type roleReq struct {
	Role string `json:"role"`
}
type statusReq struct {
	Status string `json:"status"`
}

// PUT /api/v1/admin/accounts/:email/role
func (h *adminAccountHandler) SetRole(c echo.Context) error {
	email := c.Param("email")
	var req roleReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	if req.Role != "admin" && req.Role != "user" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid role"})
	}
	if err := h.repo.UpdateRole(c.Request().Context(), email, req.Role); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

// PUT /api/v1/admin/accounts/:email/status
func (h *adminAccountHandler) SetStatus(c echo.Context) error {
	email := c.Param("email")
	var req statusReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	if req.Status != "active" && req.Status != "inactive" && req.Status != "banned" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid status"})
	}
	if err := h.repo.UpdateStatus(c.Request().Context(), email, req.Status); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

func max1(v int) int {
	if v <= 0 {
		return 1
	}
	return v
}
