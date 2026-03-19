package brevo

// SendEmailRequest is the payload for POST /v3/smtp/email
type SendEmailRequest struct {
	Sender      Contact   `json:"sender"`
	To          []Contact `json:"to"`
	Subject     string    `json:"subject"`
	HTMLContent string    `json:"htmlContent"`
}

// Contact represents an email address with optional display name
type Contact struct {
	Name  string `json:"name,omitempty"`
	Email string `json:"email"`
}

// SendEmailResponse is returned by Brevo on success
type SendEmailResponse struct {
	MessageID string `json:"messageId"`
}
