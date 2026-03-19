package xendit

import "context"

type Wrapper interface {
    CreateInvoice(ctx context.Context, req InvoiceRequest) (*InvoiceResponse, error)
    ListPaymentChannels(ctx context.Context) ([]PaymentChannel, error)
    CreatePaymentReq(ctx context.Context, pr CreatePaymentRequest) (*PaymentRequest, error)
    GetPaymentReq(ctx context.Context, id string) (*PaymentRequest, error)
}
