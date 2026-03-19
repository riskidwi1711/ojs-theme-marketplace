package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type WishlistRepo interface {
	GetByUser(ctx context.Context, email string) (*entities.Wishlist, error)
	AddItem(ctx context.Context, email string, item entities.WishlistItem) error
	RemoveItem(ctx context.Context, email, id string) error
	CheckItem(ctx context.Context, email, id string) (bool, error)
}

type wishlistRepo struct{ col *mongo.Collection }

func NewWishlist(db *mongo.Database) WishlistRepo { return &wishlistRepo{col: db.Collection("wishlists")} }

func (r *wishlistRepo) GetByUser(ctx context.Context, email string) (*entities.Wishlist, error) {
	var w entities.Wishlist
	err := r.col.FindOne(ctx, bson.M{"user_email": email}).Decode(&w)
	if err == mongo.ErrNoDocuments {
		return &entities.Wishlist{UserEmail: email, Items: []entities.WishlistItem{}, UpdatedAt: time.Now().UTC()}, nil
	}
	return &w, err
}

func (r *wishlistRepo) AddItem(ctx context.Context, email string, item entities.WishlistItem) error {
	_, err := r.col.UpdateOne(ctx,
		bson.M{"user_email": email},
		bson.M{"$addToSet": bson.M{"items": item}, "$set": bson.M{"updated_at": time.Now().UTC()}},
		options.Update().SetUpsert(true),
	)
	return err
}

func (r *wishlistRepo) RemoveItem(ctx context.Context, email, id string) error {
	_, err := r.col.UpdateOne(ctx,
		bson.M{"user_email": email},
		bson.M{"$pull": bson.M{"items": bson.M{"id": id}}, "$set": bson.M{"updated_at": time.Now().UTC()}},
	)
	return err
}

func (r *wishlistRepo) CheckItem(ctx context.Context, email, id string) (bool, error) {
	count, err := r.col.CountDocuments(ctx, bson.M{"user_email": email, "items.id": id})
	return count > 0, err
}
