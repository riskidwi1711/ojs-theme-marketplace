package handler

import (
    "context"
    "net/http"
    "os"

    "github.com/labstack/echo/v4"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "ojs-server/internal/domain/repositories"
    xapi "ojs-server/internal/infrastructure/xendit"
    "ojs-server/internal/pkg/utils"
    "ojs-server/internal/usecase/checkout"
)

type paymentHandler struct {
    w        xapi.Wrapper
    checkout checkout.Service
    orders   repositories.OrderRepo
}

func NewPaymentHandler(xenditWrapper xapi.Wrapper, chk checkout.Service, orders repositories.OrderRepo) *paymentHandler {
    return &paymentHandler{w: xenditWrapper, checkout: chk, orders: orders}
}

type createInvoiceReq struct {
	ExternalID         string `json:"external_id"`
	Amount             int    `json:"amount"`
	PayerEmail         string `json:"payer_email"`
	Description        string `json:"description"`
	SuccessRedirectURL string `json:"success_redirect_url"`
	FailureRedirectURL string `json:"failure_redirect_url"`
}

func (h *paymentHandler) CreateInvoice(c echo.Context) error {
	var req createInvoiceReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	inv, err := h.w.CreateInvoice(c.Request().Context(), xapi.InvoiceRequest{
		ExternalID:         req.ExternalID,
		Amount:             req.Amount,
		PayerEmail:         req.PayerEmail,
		Description:        req.Description,
		SuccessRedirectURL: req.SuccessRedirectURL,
		FailureRedirectURL: req.FailureRedirectURL,
		Currency:           "IDR",
	})
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	// Persist invoice URL to the order if external_id is a valid order ObjectID
	if inv.InvoiceURL != "" && h.orders != nil {
		if oid, parseErr := primitive.ObjectIDFromHex(req.ExternalID); parseErr == nil {
			go h.orders.UpdateInvoiceURL(context.Background(), oid, inv.InvoiceURL) //nolint:errcheck
		}
	}

	return c.JSON(http.StatusOK, inv)
}

// (removed old webhook implementation)

// CallbackXendit placeholder (invoice webhook)
func (h *paymentHandler) CallbackXendit(c echo.Context) error {
	expected := os.Getenv("XENDIT_CALLBACK_TOKEN")
	if expected != "" && c.Request().Header.Get("X-CALLBACK-TOKEN") != expected {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid callback token"})
	}
	var payload map[string]any
	if err := c.Bind(&payload); err != nil {
		return err
	}
	return c.JSON(http.StatusOK, map[string]any{"received": true})
}

type invoiceFromOrderReq struct {
    OrderID            string `json:"order_id"`
    SuccessRedirectURL string `json:"success_url"`
    FailureRedirectURL string `json:"failure_url"`
}

// POST /api/v1/payment/invoice/from-order (AuthRequired)
func (h *paymentHandler) CreateInvoiceFromOrder(c echo.Context) error {
    prof := utils.GetProfile(c.Request().Context())
    if prof.Email == "" { return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"}) }
    var req invoiceFromOrderReq
    if err := c.Bind(&req); err != nil { return err }
    if req.OrderID == "" { return c.JSON(http.StatusBadRequest, map[string]string{"message": "order_id is required"}) }
    ord, err := h.checkout.Get(c.Request().Context(), req.OrderID)
    if err != nil { return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()}) }
    if ord.UserEmail != prof.Email { return c.JSON(http.StatusForbidden, map[string]string{"message": "forbidden"}) }
    inv, err := h.w.CreateInvoice(c.Request().Context(), xapi.InvoiceRequest{
        ExternalID:         req.OrderID,
        Amount:             ord.TotalIDR,
        PayerEmail:         ord.UserEmail,
        Description:        "Invoice for order " + req.OrderID,
        SuccessRedirectURL: req.SuccessRedirectURL,
        FailureRedirectURL: req.FailureRedirectURL,
        Currency:           "IDR",
    })
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    // Persist invoice URL so it can be re-used if user hasn't paid yet
    if inv.InvoiceURL != "" && h.orders != nil {
        if oid, parseErr := primitive.ObjectIDFromHex(req.OrderID); parseErr == nil {
            go h.orders.UpdateInvoiceURL(context.Background(), oid, inv.InvoiceURL) //nolint:errcheck
        }
    }
    return c.JSON(http.StatusOK, inv)
}
