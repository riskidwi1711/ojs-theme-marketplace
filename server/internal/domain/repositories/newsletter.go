package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type NewsletterRepo interface {
	Subscribe(ctx context.Context, email string) error
}

type newsletterRepo struct{ col *mongo.Collection }

func NewNewsletter(db *mongo.Database) NewsletterRepo {
	col := db.Collection("newsletters")
	_ = ensureNewsletterIndexes(context.Background(), col)
	return &newsletterRepo{col: col}
}

func ensureNewsletterIndexes(ctx context.Context, col *mongo.Collection) error {
	mdl := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true).SetName("uniq_newsletter_email"),
	}
	_, err := col.Indexes().CreateOne(ctx, mdl)
	return err
}

func (r *newsletterRepo) Subscribe(ctx context.Context, email string) error {
	doc := entities.Newsletter{Email: email, CreatedAt: time.Now().UTC()}
	_, err := r.col.InsertOne(ctx, doc)
	// ignore duplicate key error — idempotent subscribe
	if mongo.IsDuplicateKeyError(err) {
		return nil
	}
	return err
}
