package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Account struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Email        string             `bson:"email" json:"email"`
    Name         string             `bson:"name" json:"name"`
    Role         string             `bson:"role" json:"role"`
    Status       string             `bson:"status" json:"status"`
    PasswordHash string             `bson:"password_hash" json:"-"`
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}
