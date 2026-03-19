package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Tag struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Slug      string             `bson:"slug" json:"slug"`
    Name      string             `bson:"name" json:"name"`
    Color     string             `bson:"color" json:"color,omitempty"`
    CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}

