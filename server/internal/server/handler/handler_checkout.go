package handler

import (
	"bytes"
	"fmt"
	"net/http"
	"strings"

	"ojs-server/internal/config"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/brevo"
	miniopkg "ojs-server/internal/infrastructure/minio"
	xapi "ojs-server/internal/infrastructure/xendit"
	"ojs-server/internal/pkg/utils"
	"ojs-server/internal/usecase/checkout"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type checkoutHandler struct {
	svc    checkout.Service
	brevo  brevo.Wrapper
	minio  miniopkg.Wrapper
	bucket string
	xendit xapi.Wrapper
	orders repositories.OrderRepo
}

func NewCheckoutHandler(svc checkout.Service, brevoWrapper brevo.Wrapper, minioWrapper miniopkg.Wrapper, minioBucket string, xenditWrapper xapi.Wrapper, orderRepo repositories.OrderRepo) *checkoutHandler {
	return &checkoutHandler{svc: svc, brevo: brevoWrapper, minio: minioWrapper, bucket: minioBucket, xendit: xenditWrapper, orders: orderRepo}
}

type checkoutReq struct {
	VoucherCode string         `json:"voucherCode"`
	Shipping    map[string]any `json:"shipping"`
	Payment     map[string]any `json:"payment"`
	SuccessURL  string         `json:"success_url"`
	FailureURL  string         `json:"failure_url"`
}

// POST /api/v1/checkout
func (h *checkoutHandler) Place(c echo.Context) error {
	ctx := c.Request().Context()
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	var req checkoutReq
	if err := c.Bind(&req); err != nil {
		return err
	}
	ord, err := h.svc.Place(ctx, prof.Email, req.VoucherCode, req.Shipping, req.Payment)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
	}

	// Create Xendit invoice and persist URL immediately
	if h.xendit != nil && ord != nil {
		ordIDStr := ord.ID.Hex()
		successURL := config.GetString("xendit.api.successRedirectURL")
		failureURL := config.GetString("xendit.api.failureRedirectURL")
		successURL = strings.ReplaceAll(successURL, ":orderId", ordIDStr)
		failureURL = strings.ReplaceAll(failureURL, ":orderId", ordIDStr)
		createInvoiceReq := xapi.InvoiceRequest{
			ExternalID:         ordIDStr,
			Amount:             ord.TotalIDR,
			PayerEmail:         ord.UserEmail,
			Description:        "Invoice for order " + ordIDStr,
			SuccessRedirectURL: successURL,
			FailureRedirectURL: failureURL,
			Currency:           "IDR",
		}
		inv, invErr := h.xendit.CreateInvoice(ctx, createInvoiceReq)
		if invErr == nil && inv.InvoiceURL != "" {
			ord.XenditInvoiceURL = inv.InvoiceURL
			if h.orders != nil {
				if oid, parseErr := primitive.ObjectIDFromHex(ordIDStr); parseErr == nil {
					h.orders.UpdateInvoiceURL(ctx, oid, inv.InvoiceURL)
				}
			}
		}
	}

	h.brevo.SendOrderConfirmation(ctx, ord)
	return c.JSON(http.StatusOK, map[string]any{"order": ord})
}

// GET /api/v1/orders/:id
func (h *checkoutHandler) GetOrder(c echo.Context) error {
	ctx := c.Request().Context()
	prof := utils.GetProfile(ctx)
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	id := c.Param("id")
	ord, err := h.svc.Get(ctx, id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"order": ord})
}

// GET /api/v1/orders
func (h *checkoutHandler) ListOrders(c echo.Context) error {
	ctx := c.Request().Context()
	prof := utils.GetProfile(ctx)
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	orders, err := h.svc.GetByUser(ctx, prof.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]any{"orders": orders, "total": len(orders)})
}

// GET /api/v1/orders/:id/invoice - Download invoice PDF
func (h *checkoutHandler) DownloadInvoice(c echo.Context) error {
	ctx := c.Request().Context()
	prof := utils.GetProfile(ctx)
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	orderID := c.Param("id")

	// Get order details
	ord, err := h.svc.Get(ctx, orderID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Order not found"})
	}

	// Verify ownership
	if ord.UserEmail != prof.Email {
		return c.JSON(http.StatusForbidden, map[string]string{"message": "Access denied"})
	}

	// Generate simple PDF invoice
	pdfContent := generateInvoicePDF(ord)

	c.Response().Header().Set("Content-Type", "application/pdf")
	c.Response().Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"invoice-%s.pdf\"", orderID[len(orderID)-8:]))
	return c.Blob(http.StatusOK, "application/pdf", pdfContent)
}

// GET /api/v1/orders/:id/download?item={productId}
// Streams the purchased theme zip from MinIO.
// If the order has multiple items, caller must specify ?item=productId.
// Defaults to the first item when the param is omitted.
func (h *checkoutHandler) DownloadTheme(c echo.Context) error {
	ctx := c.Request().Context()
	prof := utils.GetProfile(ctx)
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	orderID := c.Param("id")

	ord, err := h.svc.Get(ctx, orderID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Order not found"})
	}
	if ord.UserEmail != prof.Email {
		return c.JSON(http.StatusForbidden, map[string]string{"message": "Access denied"})
	}
	if ord.Status != "PAID" {
		return c.JSON(http.StatusPaymentRequired, map[string]string{"message": "Order belum dibayar"})
	}
	if h.minio == nil || len(ord.Items) == 0 {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "File unduhan belum tersedia. Hubungi support@openthemes.id"})
	}

	// Pick which item to serve
	wantID := c.QueryParam("item")
	var target *entities.CartItem
	for i := range ord.Items {
		if wantID == "" || ord.Items[i].ID == wantID {
			target = &ord.Items[i]
			break
		}
	}
	if target == nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Item tidak ditemukan dalam pesanan"})
	}

	objectKey := fmt.Sprintf("themes/%s.zip", target.ID)

	exists, err := h.minio.FileExists(ctx, h.bucket, objectKey)
	if err != nil || !exists {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "File unduhan belum tersedia. Hubungi support@openthemes.id"})
	}

	reader, err := h.minio.DownloadFile(ctx, h.bucket, objectKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Gagal mengunduh file"})
	}
	defer reader.Close()

	filename := fmt.Sprintf("%s.zip", strings.ToLower(strings.ReplaceAll(target.Name, " ", "-")))
	c.Response().Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, filename))
	return c.Stream(http.StatusOK, "application/zip", reader)
}

// GET /api/v1/orders/:id/invoice-url - Get Xendit invoice URL
func (h *checkoutHandler) GetInvoiceURL(c echo.Context) error {
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}
	orderID := c.Param("id")

	// Get order details
	ord, err := h.svc.Get(c.Request().Context(), orderID)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Order not found"})
	}

	// Verify ownership
	if ord.UserEmail != prof.Email {
		return c.JSON(http.StatusForbidden, map[string]string{"message": "Access denied"})
	}

	return c.JSON(http.StatusOK, map[string]string{"invoiceUrl": ord.XenditInvoiceURL})
}

// pdfEscape escapes special characters for PDF string literals
func pdfEscape(s string) string {
	s = strings.ReplaceAll(s, "\\", "\\\\")
	s = strings.ReplaceAll(s, "(", "\\(")
	s = strings.ReplaceAll(s, ")", "\\)")
	return s
}

// fmtIDR formats integer as Indonesian Rupiah string
func fmtIDR(n int) string {
	str := fmt.Sprintf("%d", n)
	var result []byte
	for i, c := range str {
		if i > 0 && (len(str)-i)%3 == 0 {
			result = append(result, '.')
		}
		result = append(result, byte(c))
	}
	return "Rp" + string(result)
}

// generateInvoicePDF builds a real PDF invoice from the order data (no external library)
func generateInvoicePDF(ord *entities.Order) []byte {
	var stream strings.Builder

	// Helpers to write text and shapes
	text := func(x, y, size float64, bold bool, s string) {
		font := "F1"
		if bold {
			font = "F2"
		}
		stream.WriteString(fmt.Sprintf("BT /%s %.1f Tf 1 0 0 1 %.1f %.1f Tm (%s) Tj ET\n",
			font, size, x, y, pdfEscape(s)))
	}
	hline := func(x1, y, x2 float64) {
		stream.WriteString(fmt.Sprintf("0.7 0.7 0.7 RG 0.5 w %.1f %.1f m %.1f %.1f l S 0 G\n", x1, y, x2, y))
	}
	fillRect := func(x, y, w, h float64, r, g, b float64) {
		stream.WriteString(fmt.Sprintf("%.2f %.2f %.2f rg %.1f %.1f %.1f %.1f re f 0 g\n", r, g, b, x, y, w, h))
	}

	// — Header band —
	fillRect(50, 718, 512, 56, 0.95, 0.97, 1.0)
	text(60, 750, 18, true, "OpenThemes")
	text(60, 733, 9, false, "Marketplace Tema OJS Indonesia")

	orderShort := strings.ToUpper(ord.ID.Hex())
	if len(orderShort) > 8 {
		orderShort = "#" + orderShort[len(orderShort)-8:]
	}
	text(400, 750, 16, true, "INVOICE")
	text(400, 733, 9.5, false, orderShort)

	hline(50, 715, 562)

	// — Meta section —
	date := ord.CreatedAt.Format("02 January 2006")
	text(60, 700, 9, true, "Tanggal:")
	text(145, 700, 9, false, date)
	text(60, 686, 9, true, "Customer:")
	text(145, 686, 9, false, ord.UserEmail)
	text(60, 672, 9, true, "Status:")
	text(145, 672, 9, false, "LUNAS")

	// — Items header band —
	fillRect(50, 636, 512, 20, 0.11, 0.23, 0.43)
	stream.WriteString("1 1 1 rg\n")
	text(58, 641, 9, true, "ITEM")
	text(390, 641, 9, true, "QTY")
	text(450, 641, 9, true, "HARGA")
	stream.WriteString("0 g\n")

	y := 622.0
	for i, item := range ord.Items {
		if i%2 == 1 {
			fillRect(50, y-4, 512, 18, 0.97, 0.97, 0.97)
		}
		name := item.Name
		if len(name) > 55 {
			name = name[:55] + "..."
		}
		text(58, y, 9, false, name)
		text(390, y, 9, false, fmt.Sprintf("%d", item.Qty))
		text(450, y, 9, false, fmtIDR(item.PriceIDR))
		y -= 18
	}

	// — Totals —
	if ord.DiscountIDR > 0 {
		hline(320, y-4, 562)
		y -= 16
		text(330, y, 9, false, "Subtotal")
		text(450, y, 9, false, fmtIDR(ord.SubtotalIDR))
		y -= 16
		text(330, y, 9, false, "Diskon")
		text(450, y, 9, false, "-"+fmtIDR(ord.DiscountIDR))
		if ord.VoucherCode != "" {
			text(390, y, 8, false, "("+ord.VoucherCode+")")
		}
		y -= 4
	}
	hline(320, y-4, 562)
	y -= 18
	fillRect(320, y-4, 242, 20, 0.11, 0.23, 0.43)
	stream.WriteString("1 1 1 rg\n")
	text(330, y, 10, true, "TOTAL")
	text(450, y, 10, true, fmtIDR(ord.TotalIDR))
	stream.WriteString("0 g\n")

	// — Footer —
	hline(50, 68, 562)
	text(58, 56, 8, false, "Terima kasih telah berbelanja di OpenThemes.")
	text(58, 44, 8, false, "Dokumen ini dibuat otomatis dan sah tanpa tanda tangan. Hubungi support@openthemes.id")

	content := stream.String()

	// — Assemble PDF bytes —
	var buf bytes.Buffer
	buf.WriteString("%PDF-1.4\n")

	offsets := make([]int, 8)

	offsets[1] = buf.Len()
	buf.WriteString("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")

	offsets[2] = buf.Len()
	buf.WriteString("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")

	offsets[3] = buf.Len()
	buf.WriteString("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]\n" +
		"  /Contents 4 0 R\n" +
		"  /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n")

	offsets[4] = buf.Len()
	buf.WriteString(fmt.Sprintf("4 0 obj\n<< /Length %d >>\nstream\n%sendstream\nendobj\n", len(content), content))

	offsets[5] = buf.Len()
	buf.WriteString("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n")

	offsets[6] = buf.Len()
	buf.WriteString("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n")

	xrefOffset := buf.Len()
	buf.WriteString("xref\n0 7\n")
	buf.WriteString("0000000000 65535 f \n")
	for i := 1; i <= 6; i++ {
		buf.WriteString(fmt.Sprintf("%010d 00000 n \n", offsets[i]))
	}
	buf.WriteString(fmt.Sprintf("trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n", xrefOffset))

	return buf.Bytes()
}
