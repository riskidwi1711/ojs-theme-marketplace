package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type ReviewRepo interface {
	ListByProduct(ctx context.Context, productID string) ([]entities.Review, error)
	Create(ctx context.Context, r *entities.Review) error
	HasReviewed(ctx context.Context, productID, userEmail string) (bool, error)
}

type reviewMongoRepo struct{ col *mongo.Collection }

func NewReview(db *mongo.Database) ReviewRepo {
	col := db.Collection("reviews")
	_ = ensureReviewIndexes(context.Background(), col)
	return &reviewMongoRepo{col: col}
}

func ensureReviewIndexes(ctx context.Context, col *mongo.Collection) error {
	idx := mongo.IndexModel{
		Keys:    bson.D{{Key: "product_id", Value: 1}, {Key: "user_email", Value: 1}},
		Options: options.Index().SetUnique(true).SetBackground(true).SetName("uniq_product_user"),
	}
	_, err := col.Indexes().CreateOne(ctx, idx)
	return err
}

func (r *reviewMongoRepo) ListByProduct(ctx context.Context, productID string) ([]entities.Review, error) {
	cur, err := r.col.Find(ctx, bson.M{"product_id": productID}, options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}))
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var out []entities.Review
	if err := cur.All(ctx, &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = []entities.Review{}
	}
	return out, nil
}

func (r *reviewMongoRepo) Create(ctx context.Context, rev *entities.Review) error {
	rev.ID = primitive.NewObjectID()
	rev.CreatedAt = time.Now().UTC()
	_, err := r.col.InsertOne(ctx, rev)
	return err
}

func (r *reviewMongoRepo) HasReviewed(ctx context.Context, productID, userEmail string) (bool, error) {
	count, err := r.col.CountDocuments(ctx, bson.M{"product_id": productID, "user_email": userEmail})
	return count > 0, err
}
