package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Category struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Slug        string             `bson:"slug" json:"slug"`
    Name        string             `bson:"name" json:"name"`
    Description string             `bson:"description" json:"description,omitempty"`
    Color       string             `bson:"color" json:"color,omitempty"`
    Bg          string             `bson:"bg" json:"bg,omitempty"`
    CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
}

