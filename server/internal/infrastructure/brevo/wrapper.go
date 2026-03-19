package brevo

import (
	"context"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

// Wrapper defines the Brevo email operations used by this application.
type Wrapper interface {
	// SendEmail sends a raw transactional email.
	SendEmail(ctx context.Context, req SendEmailRequest) (*SendEmailResponse, error)

	// SendOrderConfirmation sends the order-placed email to the customer.
	SendOrderConfirmation(ctx context.Context, order *entities.Order) error

	// SendPaymentSuccess sends the payment-received / download-ready email.
	SendPaymentSuccess(ctx context.Context, order *entities.Order) error

	// SendNewsletterWelcome sends the welcome email with a discount code.
	SendNewsletterWelcome(ctx context.Context, email string) error

	// SetTemplateRepo injects the email template repository for DB-driven templates.
	SetTemplateRepo(repo repositories.EmailTemplateRepo)

	// SetSettingsRepo injects the settings repository so templates can use {{.SiteURL}} etc.
	SetSettingsRepo(repo repositories.SettingsRepo)
}
