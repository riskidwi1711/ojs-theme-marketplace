package entities

import (
    "time"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type Article struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Slug        string             `bson:"slug" json:"slug"`
    Title       string             `bson:"title" json:"title"`
    Excerpt     string             `bson:"excerpt" json:"excerpt,omitempty"`
    Content     string             `bson:"content" json:"content,omitempty"`
    Author      string             `bson:"author" json:"author"`
    AuthorEmail string             `bson:"author_email" json:"authorEmail,omitempty"`
    Category    string             `bson:"category" json:"category,omitempty"`
    Tags        []string           `bson:"tags" json:"tags,omitempty"`
    Icon        string             `bson:"icon" json:"icon,omitempty"`
    IconColor   string             `bson:"icon_color" json:"iconColor,omitempty"`
    Bg          string             `bson:"bg" json:"bg,omitempty"`
    Tag         string             `bson:"tag" json:"tag,omitempty"`
    TagColor    string             `bson:"tag_color" json:"tagColor,omitempty"`
    PublishedAt time.Time          `bson:"published_at" json:"publishedAt"`
    CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
    Active      bool               `bson:"active" json:"active"`
    Order       int                `bson:"order" json:"order,omitempty"`
}
