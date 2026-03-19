package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Banner struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Title       string             `bson:"title" json:"title"`
    Subtitle    string             `bson:"subtitle" json:"subtitle,omitempty"`
    Description string             `bson:"description" json:"description,omitempty"`
    Price       string             `bson:"price" json:"price,omitempty"`
    OriginalPrice string           `bson:"original_price" json:"originalPrice,omitempty"`
    Discount    string             `bson:"discount" json:"discount,omitempty"`
    Icon        string             `bson:"icon" json:"icon,omitempty"`
    Bg          string             `bson:"bg" json:"bg,omitempty"`
    TextColor   string             `bson:"text_color" json:"textColor,omitempty"`
    SubColor    string             `bson:"sub_color" json:"subColor,omitempty"`
    Href        string             `bson:"href" json:"href,omitempty"`
    Active      bool               `bson:"active" json:"active"`
    Order       int                `bson:"order" json:"order,omitempty"`
    CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
}
