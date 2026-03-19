package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Review struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ProductID string             `bson:"product_id"    json:"productId"`
	UserEmail string             `bson:"user_email"    json:"userEmail"`
	Name      string             `bson:"name"          json:"name"`
	Rating    int                `bson:"rating"        json:"rating"`
	Body      string             `bson:"body"          json:"body"`
	CreatedAt time.Time          `bson:"created_at"    json:"createdAt"`
}
