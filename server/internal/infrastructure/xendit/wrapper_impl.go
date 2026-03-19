package xendit

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"ojs-server/internal/config"
	"ojs-server/internal/pkg/log"
	"time"
)

func New(cfg config.Xendit) Wrapper {
    return &xenditWrapper{
        Host:                    cfg.APIHost,
        KeyToken:                cfg.KeyToken,
        PathCreateInvoice:       "/v2/invoices",
        PathListPaymentChannels: "/payment_channels",
        // Use v3 Payment Requests endpoints per Unified API docs
        PathCreatePaymentReq:    "/v3/payment_requests",
        PathGetPaymentReq:       "/v3/payment_requests/%s",
    }
}

type xenditWrapper struct {
	Host                    string
	KeyToken                string
	PathCreateInvoice       string
	PathListPaymentChannels string
	PathCreatePaymentReq    string
	PathGetPaymentReq       string
}

func (w *xenditWrapper) CreateInvoice(ctx context.Context, req InvoiceRequest) (*InvoiceResponse, error) {
	secret := w.KeyToken
	if secret == "" {
		return nil, fmt.Errorf("missing XENDIT_SECRET_KEY")
	}
	body, _ := json.Marshal(req)
	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, w.Host+w.PathCreateInvoice, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	// HTTP Basic: secret_key:
	token := base64.StdEncoding.EncodeToString([]byte(secret + ":"))
	httpReq.Header.Set("Authorization", "Basic "+token)
	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	if config.GetBool("xendit.debug") {
		log.TDR(ctx, body, raw)
	}
	if resp.StatusCode >= 300 {
		var m map[string]any
		_ = json.Unmarshal(raw, &m)
		return nil, fmt.Errorf("xendit error: %v", m)
	}
	var out InvoiceResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (w *xenditWrapper) ListPaymentChannels(ctx context.Context) ([]PaymentChannel, error) {
	secret := w.KeyToken
	if secret == "" {
		return nil, fmt.Errorf("missing XENDIT_SECRET_KEY")
	}
	r, _ := http.NewRequestWithContext(ctx, http.MethodGet, w.Host+w.PathListPaymentChannels, nil)
	token := base64.StdEncoding.EncodeToString([]byte(secret + ":"))
	r.Header.Set("Authorization", "Basic "+token)
	c := &http.Client{Timeout: 15 * time.Second}
	resp, err := c.Do(r)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	rawStr := string(raw)
	log.Info(ctx, "response from xendit", rawStr)
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("xendit get payment request error: %s", resp.Status)
	}
	var out []PaymentChannel
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return out, nil
}

func (w *xenditWrapper) CreatePaymentReq(ctx context.Context, pr CreatePaymentRequest) (*PaymentRequest, error) {
	secret := w.KeyToken
	if secret == "" {
		return nil, fmt.Errorf("missing XENDIT_SECRET_KEY")
	}
	body, _ := json.Marshal(pr)
	r, _ := http.NewRequestWithContext(ctx, http.MethodPost, w.Host+w.PathCreatePaymentReq, bytes.NewReader(body))
	r.Header.Set("Content-Type", "application/json")
	token := base64.StdEncoding.EncodeToString([]byte(secret + ":"))
	r.Header.Set("Authorization", "Basic "+token)
	r.Header.Set("api-version", "2024-11-11")
	c := &http.Client{Timeout: 20 * time.Second}
	resp, err := c.Do(r)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	log.Info(ctx, "response from xendit", string(raw))
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("xendit create payment request error: %s", resp.Status)
	}
	var out PaymentRequest
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return &out, nil
}

func (w *xenditWrapper) GetPaymentReq(ctx context.Context, id string) (*PaymentRequest, error) {
	secret := w.KeyToken
	if secret == "" {
		return nil, fmt.Errorf("missing XENDIT_SECRET_KEY")
	}
	url := fmt.Sprintf("%s%s/%s", w.Host, w.PathGetPaymentReq, id)
	r, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	token := base64.StdEncoding.EncodeToString([]byte(secret + ":"))
	r.Header.Set("Authorization", "Basic "+token)
	c := &http.Client{Timeout: 15 * time.Second}
	resp, err := c.Do(r)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(resp.Body)
	log.Info(ctx, "response from xendit", string(raw))
	if resp.StatusCode >= 300 {
		return nil, fmt.Errorf("xendit get payment request error: %s", resp.Status)
	}
	var out PaymentRequest
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, err
	}
	return &out, nil
}
