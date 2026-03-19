package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Section struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Slug        string             `bson:"slug" json:"slug"`
    Name        string             `bson:"name" json:"name"`
    Description string             `bson:"description" json:"description,omitempty"`
    Sub         string             `bson:"sub" json:"sub,omitempty"`
    Icon        string             `bson:"icon" json:"icon,omitempty"`
    IconColor   string             `bson:"iconColor" json:"iconColor,omitempty"`
    Bg          string             `bson:"bg" json:"bg,omitempty"`
    TextColor   string             `bson:"textColor" json:"textColor,omitempty"`
    SubColor    string             `bson:"subColor" json:"subColor,omitempty"`
    Tag         string             `bson:"tag" json:"tag,omitempty"`
    TagBg       string             `bson:"tagBg" json:"tagBg,omitempty"`
    Href        string             `bson:"href" json:"href,omitempty"`
    Active      bool               `bson:"active" json:"active"`
    Order       int                `bson:"order" json:"order,omitempty"`
    CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
}

