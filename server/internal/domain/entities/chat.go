package entities

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ChatSession maps one user (by email) to their dedicated Telegram forum topic.
type ChatSession struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserEmail string             `bson:"user_email"    json:"userEmail"`
	UserName  string             `bson:"user_name"     json:"userName"`
	TopicID   int64              `bson:"topic_id"      json:"topicId"`
	TopicName string             `bson:"topic_name"    json:"topicName"`
	CreatedAt time.Time          `bson:"created_at"    json:"createdAt"`
	UpdatedAt time.Time          `bson:"updated_at"    json:"updatedAt"`
}

// ChatMessage stores a single message exchanged in a chat session.
type ChatMessage struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"        json:"id"`
	UserEmail string             `bson:"user_email"           json:"userEmail"`
	TopicID   int64              `bson:"topic_id"             json:"topicId"`
	Sender    string             `bson:"sender"               json:"sender"`   // "user" | "admin"
	Type      string             `bson:"type"                 json:"type"`     // "text" | "photo" | "document"
	Text      string             `bson:"text,omitempty"       json:"text,omitempty"`
	FileURL   string             `bson:"file_url,omitempty"   json:"fileUrl,omitempty"`
	FileName  string             `bson:"file_name,omitempty"  json:"fileName,omitempty"`
	FileMime  string             `bson:"file_mime,omitempty"  json:"fileMime,omitempty"`
	TgMsgID   int                `bson:"tg_msg_id,omitempty"  json:"tgMsgId,omitempty"`
	CreatedAt time.Time          `bson:"created_at"           json:"createdAt"`
}
