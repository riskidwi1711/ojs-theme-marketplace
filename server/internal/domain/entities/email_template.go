package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EmailTemplate struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Key       string             `bson:"key"           json:"key"`
	Name      string             `bson:"name"          json:"name"`
	Subject   string             `bson:"subject"       json:"subject"`
	Body      string             `bson:"body"          json:"body"` // inner HTML; supports Go template vars e.g. {{.OrderID}}
	Variables []TemplateVariable `bson:"variables"     json:"variables"`
	UpdatedAt time.Time          `bson:"updatedAt"     json:"updatedAt"`
}

// TemplateVariable documents a variable available in a template body/subject.
type TemplateVariable struct {
	Key         string `bson:"key"         json:"key"`
	Description string `bson:"description" json:"description"`
	Example     string `bson:"example"     json:"example"`
}
