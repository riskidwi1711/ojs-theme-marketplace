package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type CartItem struct {
    ID       string `bson:"id" json:"id"`
    Name     string `bson:"name" json:"name"`
    PriceIDR int    `bson:"price_idr" json:"priceIDR"`
    Qty      int    `bson:"qty" json:"qty"`
    Image    string `bson:"image,omitempty" json:"image,omitempty"`
    Compat   string `bson:"compat,omitempty" json:"compat,omitempty"`
    Emoji    string `bson:"emoji,omitempty" json:"emoji,omitempty"`
    Bg       string `bson:"bg,omitempty" json:"bg,omitempty"`
}

type Cart struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserEmail string             `bson:"user_email" json:"userEmail"`
    Items     []CartItem         `bson:"items" json:"items"`
    UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}

