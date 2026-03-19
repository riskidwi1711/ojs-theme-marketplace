package xendit

type InvoiceRequest struct {
	ExternalID         string            `json:"external_id"`
	Amount             int               `json:"amount"`
	PayerEmail         string            `json:"payer_email,omitempty"`
	Description        string            `json:"description,omitempty"`
	SuccessRedirectURL string            `json:"success_redirect_url,omitempty"`
	FailureRedirectURL string            `json:"failure_redirect_url,omitempty"`
	Currency           string            `json:"currency,omitempty"`
	Customer           map[string]any    `json:"customer,omitempty"`
	Metadata           map[string]string `json:"metadata,omitempty"`
}

type InvoiceResponse struct {
	ID         string `json:"id"`
	ExternalID string `json:"external_id"`
	Status     string `json:"status"`
	InvoiceURL string `json:"invoice_url"`
}

type PaymentChannel struct {
	BusinessID      string `json:"business_id"`
	IsLivemode      bool   `json:"is_livemode"`
	ChannelCode     string `json:"channel_code"`
	Name            string `json:"name"`
	Currency        string `json:"currency"`
	ChannelCategory string `json:"channel_category"`
	IsEnabled       bool   `json:"is_enabled"`
}

type PaymentRequest struct {
	ID            string         `json:"id"`
	ReferenceID   string         `json:"reference_id"`
	Amount        int            `json:"amount"`
	Currency      string         `json:"currency"`
	Status        string         `json:"status"`
	CaptureMethod string         `json:"capture_method"`
	ChannelCode   string         `json:"channel_code"`
	Actions       map[string]any `json:"actions"`
}

type CreatePaymentRequest struct {
	ReferenceID     string         `json:"reference_id"`
	Amount          int            `json:"amount"`
	Currency        string         `json:"currency,omitempty"`
	PaymentMethod   map[string]any `json:"payment_method,omitempty"`
	PaymentMethodID string         `json:"payment_method_id,omitempty"`
	PaymentTokenID  string         `json:"payment_token_id,omitempty"`
	Description     string         `json:"description,omitempty"`
	Customer        map[string]any `json:"customer,omitempty"`
	Metadata        map[string]any `json:"metadata,omitempty"`
}
