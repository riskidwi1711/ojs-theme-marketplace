package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
    ID             primitive.ObjectID `bson:"_id,omitempty"      json:"id"`
    UserEmail      string             `bson:"user_email"         json:"userEmail"`
    Items          []CartItem         `bson:"items"              json:"items"`
    SubtotalIDR    int                `bson:"subtotal_idr"       json:"subtotalIDR"`
    DiscountIDR    int                `bson:"discount_idr"       json:"discountIDR"`
    TotalIDR       int                `bson:"total_idr"          json:"totalIDR"`
    VoucherCode    string             `bson:"voucher_code,omitempty" json:"voucherCode,omitempty"`
    Shipping       map[string]any     `bson:"shipping"           json:"shipping"`
    Payment        map[string]any     `bson:"payment"            json:"payment"`
    Status             string             `bson:"status"              json:"status"`
    XenditInvoiceURL   string             `bson:"xendit_invoice_url,omitempty" json:"xenditInvoiceUrl,omitempty"`
    CreatedAt          time.Time          `bson:"created_at"          json:"createdAt"`
}

