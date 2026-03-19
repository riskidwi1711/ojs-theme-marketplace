package repositories

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type chatMongoRepo struct {
	sessions *mongo.Collection
	messages *mongo.Collection
}

func NewChat(db *mongo.Database) ChatRepo {
	sessions := db.Collection("chat_sessions")
	messages := db.Collection("chat_messages")

	ctx := context.Background()
	// chat_sessions: unique on user_email, index on topic_id
	sessions.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{
			Keys:    bson.D{{Key: "user_email", Value: 1}},
			Options: options.Index().SetUnique(true),
		},
		{Keys: bson.D{{Key: "topic_id", Value: 1}}},
		{Keys: bson.D{{Key: "updated_at", Value: -1}}},
	})
	// chat_messages: compound on user_email+created_at (for polling), index on topic_id
	messages.Indexes().CreateMany(ctx, []mongo.IndexModel{
		{Keys: bson.D{{Key: "user_email", Value: 1}, {Key: "created_at", Value: 1}}},
		{Keys: bson.D{{Key: "topic_id", Value: 1}}},
	})

	return &chatMongoRepo{sessions: sessions, messages: messages}
}

func (r *chatMongoRepo) GetSessionByEmail(ctx context.Context, email string) (*entities.ChatSession, error) {
	var s entities.ChatSession
	err := r.sessions.FindOne(ctx, bson.M{"user_email": email}).Decode(&s)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, nil
	}
	return &s, err
}

func (r *chatMongoRepo) GetSessionByTopicID(ctx context.Context, topicID int64) (*entities.ChatSession, error) {
	var s entities.ChatSession
	err := r.sessions.FindOne(ctx, bson.M{"topic_id": topicID}).Decode(&s)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, nil
	}
	return &s, err
}

func (r *chatMongoRepo) CreateSession(ctx context.Context, session *entities.ChatSession) error {
	session.ID = primitive.NewObjectID()
	now := time.Now()
	session.CreatedAt = now
	session.UpdatedAt = now
	_, err := r.sessions.InsertOne(ctx, session)
	return err
}

func (r *chatMongoRepo) ListSessions(ctx context.Context) ([]entities.ChatSession, error) {
	opts := options.Find().SetSort(bson.D{{Key: "updated_at", Value: -1}})
	cur, err := r.sessions.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var out []entities.ChatSession
	return out, cur.All(ctx, &out)
}

func (r *chatMongoRepo) SaveMessage(ctx context.Context, msg *entities.ChatMessage) error {
	msg.ID = primitive.NewObjectID()
	msg.CreatedAt = time.Now()
	if _, err := r.messages.InsertOne(ctx, msg); err != nil {
		return err
	}
	// Bump session updated_at so ListSessions shows most recent activity first.
	_, _ = r.sessions.UpdateOne(ctx,
		bson.M{"topic_id": msg.TopicID},
		bson.M{"$set": bson.M{"updated_at": msg.CreatedAt}},
	)
	return nil
}

func (r *chatMongoRepo) GetMessages(ctx context.Context, email string, after time.Time) ([]entities.ChatMessage, error) {
	filter := bson.M{"user_email": email}
	if !after.IsZero() {
		filter["created_at"] = bson.M{"$gt": after}
	}
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: 1}})
	cur, err := r.messages.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var out []entities.ChatMessage
	return out, cur.All(ctx, &out)
}
