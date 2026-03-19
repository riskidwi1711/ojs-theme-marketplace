package brevo

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"text/template"
	"time"

	"ojs-server/internal/config"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/pkg/log"
)

type brevoWrapper struct {
	senderName   string
	senderEmail  string
	baseUrl      string
	apiKey       string
	client       *http.Client
	templateRepo repositories.EmailTemplateRepo
	settingsRepo repositories.SettingsRepo
}

func New(apiKey string) Wrapper {
	return &brevoWrapper{
		senderName:  config.GetString("brevo.email.senderName"),
		senderEmail: config.GetString("brevo.email.sender"),
		baseUrl:     config.GetString("brevo.api.host"),
		apiKey:      apiKey,
		client:      &http.Client{Timeout: 15 * time.Second},
	}
}

func (w *brevoWrapper) SetTemplateRepo(repo repositories.EmailTemplateRepo) {
	w.templateRepo = repo
}

func (w *brevoWrapper) SetSettingsRepo(repo repositories.SettingsRepo) {
	w.settingsRepo = repo
}

// renderTpl fetches a template from DB (falls back to built-in default) and renders it.
// Site-level variables (SiteURL, SiteName, SupportEmail) are injected automatically.
func (w *brevoWrapper) renderTpl(ctx context.Context, key string, data any) (subject, body string, err error) {
	defaults := DefaultTemplates()
	def := defaults[key]

	var tplSubject, tplBody string
	if w.templateRepo != nil {
		if dbTpl, fetchErr := w.templateRepo.GetByKey(ctx, key); fetchErr == nil && dbTpl != nil {
			tplSubject = dbTpl.Subject
			tplBody = dbTpl.Body
		}
	}
	if tplSubject == "" {
		tplSubject = def.Subject
	}
	if tplBody == "" {
		tplBody = def.Body
	}

	// Merge site-level variables into data map
	merged := mergeSiteVars(ctx, w.settingsRepo, data)

	renderedSubject, err := execTemplate(tplSubject, merged)
	if err != nil {
		return "", "", fmt.Errorf("brevo: render subject: %w", err)
	}
	renderedBody, err := execTemplate(tplBody, merged)
	if err != nil {
		return "", "", fmt.Errorf("brevo: render body: %w", err)
	}
	return renderedSubject, renderedBody, nil
}

// mergeSiteVars injects SiteURL, SiteName, SupportEmail from settings into the data map.
func mergeSiteVars(ctx context.Context, repo repositories.SettingsRepo, data any) map[string]any {
	out := map[string]any{
		"SiteURL":      "https://openthemes.id",
		"SiteName":     "OpenThemes",
		"SupportEmail": "support@openthemes.id",
	}
	if repo != nil {
		if s, err := repo.GetSite(ctx); err == nil && s != nil {
			if s.SiteURL != "" {
				out["SiteURL"] = s.SiteURL
			}
			if s.SiteName != "" {
				out["SiteName"] = s.SiteName
			}
			if s.SupportEmail != "" {
				out["SupportEmail"] = s.SupportEmail
			}
		}
	}
	// Copy caller's data on top (caller fields take precedence)
	if m, ok := data.(map[string]any); ok {
		for k, v := range m {
			out[k] = v
		}
	}
	return out
}

func execTemplate(src string, data any) (string, error) {
	t, err := template.New("").Parse(src)
	if err != nil {
		return src, nil // non-parseable template — return raw string
	}
	var buf bytes.Buffer
	if err := t.Execute(&buf, data); err != nil {
		return src, nil // render error — return raw string
	}
	return buf.String(), nil
}

// SendEmail calls POST /v3/smtp/email
func (w *brevoWrapper) SendEmail(ctx context.Context, req SendEmailRequest) (*SendEmailResponse, error) {
	if w.apiKey == "" {
		return nil, fmt.Errorf("brevo: api key not configured")
	}
	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, w.baseUrl+"/smtp/email", bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("accept", "application/json")
	httpReq.Header.Set("api-key", w.apiKey)

	resp, err := w.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 300 {
		log.Error(ctx, fmt.Sprintf("brevo error %d: %s", resp.StatusCode, string(raw)))
		return nil, fmt.Errorf("brevo error %d: %s", resp.StatusCode, string(raw))
	}
	var out SendEmailResponse
	_ = json.Unmarshal(raw, &out)
	log.Info(ctx, "email sent", "to", req.To[0].Email, "subject", req.Subject, "messageId", out.MessageID)
	return &out, nil
}

type orderItem struct {
	Name  string
	Price string
}

func (w *brevoWrapper) SendOrderConfirmation(ctx context.Context, order *entities.Order) error {
	orderID := strings.ToUpper(order.ID.Hex())
	if len(orderID) > 8 {
		orderID = orderID[len(orderID)-8:]
	}
	items := make([]orderItem, len(order.Items))
	for i, it := range order.Items {
		items[i] = orderItem{Name: it.Name, Price: fmtIDR(it.PriceIDR)}
	}
	data := map[string]any{
		"OrderID":    orderID,
		"Date":       order.CreatedAt.Format("02 January 2006"),
		"Items":      items,
		"Total":      fmtIDR(order.TotalIDR),
		"InvoiceURL": order.XenditInvoiceURL,
	}
	subject, body, err := w.renderTpl(ctx, "order_confirmation", data)
	if err != nil {
		return err
	}
	_, err = w.SendEmail(ctx, SendEmailRequest{
		Sender:      Contact{Name: w.senderName, Email: w.senderEmail},
		To:          []Contact{{Email: order.UserEmail}},
		Subject:     subject,
		HTMLContent: emailLayout("Pesanan Kamu Sudah Diterima!", body),
	})
	return err
}

type paymentItem struct{ Name string }

func (w *brevoWrapper) SendPaymentSuccess(ctx context.Context, order *entities.Order) error {
	orderID := strings.ToUpper(order.ID.Hex())
	if len(orderID) > 8 {
		orderID = orderID[len(orderID)-8:]
	}
	items := make([]paymentItem, len(order.Items))
	for i, it := range order.Items {
		items[i] = paymentItem{Name: it.Name}
	}
	data := map[string]any{
		"OrderID": orderID,
		"Items":   items,
	}
	subject, body, err := w.renderTpl(ctx, "payment_success", data)
	if err != nil {
		return err
	}
	_, err = w.SendEmail(ctx, SendEmailRequest{
		Sender:      Contact{Name: w.senderName, Email: w.senderEmail},
		To:          []Contact{{Email: order.UserEmail}},
		Subject:     subject,
		HTMLContent: emailLayout("Pembayaran Berhasil! 🎉", body),
	})
	return err
}

func (w *brevoWrapper) SendNewsletterWelcome(ctx context.Context, email string) error {
	data := map[string]any{"Email": email}
	subject, body, err := w.renderTpl(ctx, "newsletter_welcome", data)
	if err != nil {
		return err
	}
	_, err = w.SendEmail(ctx, SendEmailRequest{
		Sender:      Contact{Name: w.senderName, Email: w.senderEmail},
		To:          []Contact{{Email: email}},
		Subject:     subject,
		HTMLContent: emailLayout("Selamat Datang di OpenThemes! 🎁", body),
	})
	return err
}

func emailLayout(title, content string) string {
	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
	<table width="100%%" cellpadding="0" cellspacing="0">
		<tr><td align="center" style="padding:40px 16px;">
			<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;">
				<!-- Header -->
				<tr>
					<td style="background:linear-gradient(135deg,#1c3b6d 0%%,#0d2a52 60%%,#0a3d1a 100%%);border-radius:16px 16px 0 0;padding:28px 32px;">
						<p style="margin:0;font-size:22px;font-weight:900;color:#fff;">Open<span style="color:#4ade80;">Themes</span></p>
						<p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,.5);letter-spacing:.06em;text-transform:uppercase;">Marketplace Tema OJS Indonesia</p>
					</td>
				</tr>
				<!-- Body -->
				<tr>
					<td style="background:#fff;padding:32px;">
						<h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#1a1a2e;">%s</h2>
						%s
					</td>
				</tr>
				<!-- Footer -->
				<tr>
					<td style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;">
						<p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">© 2025 OpenThemes · Marketplace Tema OJS Indonesia</p>
						<p style="margin:0;font-size:12px;color:#9ca3af;">
							<a href="https://openthemes.id" style="color:#1c3b6d;text-decoration:none;">openthemes.id</a>
							&nbsp;·&nbsp;
							<a href="mailto:support@openthemes.id" style="color:#1c3b6d;text-decoration:none;">support@openthemes.id</a>
						</p>
					</td>
				</tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`, title, title, content)
}

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
