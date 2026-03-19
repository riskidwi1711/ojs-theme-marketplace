package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type CartRepo interface {
    GetByUser(ctx context.Context, email string) (*entities.Cart, error)
    UpsertItem(ctx context.Context, email string, item entities.CartItem) error
    RemoveItem(ctx context.Context, email string, id string) error
    Clear(ctx context.Context, email string) error
}

type cartRepo struct{ col *mongo.Collection }

func NewCart(db *mongo.Database) CartRepo { return &cartRepo{ col: db.Collection("carts") } }

func (r *cartRepo) GetByUser(ctx context.Context, email string) (*entities.Cart, error) {
    var c entities.Cart
    err := r.col.FindOne(ctx, bson.M{"user_email": email}).Decode(&c)
    if err == mongo.ErrNoDocuments {
        return &entities.Cart{ UserEmail: email, Items: []entities.CartItem{}, UpdatedAt: time.Now().UTC() }, nil
    }
    return &c, err
}

func (r *cartRepo) UpsertItem(ctx context.Context, email string, item entities.CartItem) error {
    // Digital products: qty is always 1, no increment — idempotent add
    count, err := r.col.CountDocuments(ctx, bson.M{"user_email": email, "items.id": item.ID})
    if err != nil { return err }
    if count > 0 { return nil } // already in cart, skip
    item.Qty = 1
    _, err = r.col.UpdateOne(ctx,
        bson.M{"user_email": email},
        bson.M{"$push": bson.M{"items": item}, "$set": bson.M{"updated_at": time.Now().UTC()}},
        options.Update().SetUpsert(true),
    )
    return err
}

func (r *cartRepo) RemoveItem(ctx context.Context, email, id string) error {
    _, err := r.col.UpdateOne(ctx,
        bson.M{"user_email": email},
        bson.M{"$pull": bson.M{"items": bson.M{"id": id}}, "$set": bson.M{"updated_at": time.Now().UTC()}},
    )
    return err
}

func (r *cartRepo) Clear(ctx context.Context, email string) error {
    _, err := r.col.UpdateOne(ctx,
        bson.M{"user_email": email},
        bson.M{"$set": bson.M{"items": []entities.CartItem{}, "updated_at": time.Now().UTC()}},
        options.Update().SetUpsert(true),
    )
    return err
}

