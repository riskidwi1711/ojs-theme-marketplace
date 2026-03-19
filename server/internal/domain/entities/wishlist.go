package entities

import (
	"time"
)

type Wishlist struct {
	UserEmail string         `json:"user_email" bson:"user_email"`
	Items     []WishlistItem `json:"items" bson:"items"`
	UpdatedAt time.Time      `json:"updated_at" bson:"updated_at"`
}

type WishlistItem struct {
	ID        string `json:"id" bson:"id"`
	Name      string `json:"name" bson:"name"`
	PriceText string `json:"price_text" bson:"price_text"`
	Image     string `json:"image" bson:"image"`
}
