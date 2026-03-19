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

type bannerMongoRepo struct{ col *mongo.Collection }

func NewBanner(db *mongo.Database) BannerRepo {
    col := db.Collection("banners")
    _ = ensureBannerIndexes(context.Background(), col)
    return &bannerMongoRepo{col: col}
}

func ensureBannerIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{Keys: bson.D{{Key: "order", Value: 1}}, Options: options.Index().SetBackground(true).SetName("idx_order")}
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *bannerMongoRepo) List(ctx context.Context) ([]entities.Banner, error) {
    cur, err := r.col.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "order", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Banner
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Banner{} }
    return out, nil
}

func (r *bannerMongoRepo) ListActive(ctx context.Context) ([]entities.Banner, error) {
    cur, err := r.col.Find(ctx, bson.M{"active": true}, options.Find().SetSort(bson.D{{Key: "order", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Banner
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Banner{} }
    return out, nil
}

func (r *bannerMongoRepo) GetByID(ctx context.Context, id string) (*entities.Banner, error) {
    var b entities.Banner
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return nil, err }
    if err := r.col.FindOne(ctx, bson.M{"_id": oid}).Decode(&b); err != nil { return nil, err }
    return &b, nil
}

func (r *bannerMongoRepo) Create(ctx context.Context, b *entities.Banner) error {
    b.CreatedAt = time.Now().UTC()
    b.UpdatedAt = b.CreatedAt
    _, err := r.col.InsertOne(ctx, b)
    return err
}

func (r *bannerMongoRepo) UpdateBySlug(ctx context.Context, id string, b *entities.Banner) (*entities.Banner, error) {
    b.UpdatedAt = time.Now().UTC()
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return nil, err }
    update := bson.M{
        "title":        b.Title,
        "subtitle":     b.Subtitle,
        "description":  b.Description,
        "price":        b.Price,
        "original_price": b.OriginalPrice,
        "discount":     b.Discount,
        "icon":         b.Icon,
        "bg":           b.Bg,
        "text_color":   b.TextColor,
        "sub_color":    b.SubColor,
        "href":         b.Href,
        "active":       b.Active,
        "order":        b.Order,
        "updated_at":   b.UpdatedAt,
    }
    _, err = r.col.UpdateOne(ctx, bson.M{"_id": oid}, bson.M{"$set": update})
    if err != nil { return nil, err }
    return r.GetByID(ctx, id)
}

func (r *bannerMongoRepo) DeleteBySlug(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil { return err }
    _, err = r.col.DeleteOne(ctx, bson.M{"_id": oid})
    return err
}
