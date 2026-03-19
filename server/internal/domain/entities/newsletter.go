package entities

import "time"

type Newsletter struct {
	Email     string    `bson:"email" json:"email"`
	CreatedAt time.Time `bson:"created_at" json:"createdAt"`
}
