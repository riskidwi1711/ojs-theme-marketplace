package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Type: "percent" discounts by percentage, "fixed" discounts by flat IDR amount.
type Voucher struct {
	ID             primitive.ObjectID `bson:"_id,omitempty"  json:"id"`
	Code           string             `bson:"code"           json:"code"`            // Uppercase, unique
	Type           string             `bson:"type"           json:"type"`            // "percent" | "fixed"
	Value          float64            `bson:"value"          json:"value"`           // % (0-100) or flat IDR
	MinOrderIDR    int                `bson:"min_order_idr"  json:"minOrderIDR"`     // 0 = no minimum
	MaxDiscountIDR int                `bson:"max_discount_idr" json:"maxDiscountIDR"` // cap for percent type; 0 = no cap
	UsageLimit     int                `bson:"usage_limit"    json:"usageLimit"`      // 0 = unlimited
	UsedCount      int                `bson:"used_count"     json:"usedCount"`
	ExpiresAt      *time.Time         `bson:"expires_at,omitempty" json:"expiresAt,omitempty"`
	Active         bool               `bson:"active"         json:"active"`
	NewUsersOnly   bool               `bson:"new_users_only" json:"newUsersOnly"` // if true, only users with no prior PAID orders
	CreatedAt      time.Time          `bson:"created_at"     json:"createdAt"`
}
