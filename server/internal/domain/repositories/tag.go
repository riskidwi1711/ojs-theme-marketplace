package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type TagRepo interface {
    List(ctx context.Context) ([]entities.Tag, error)
    Create(ctx context.Context, t *entities.Tag) error
    UpdateBySlug(ctx context.Context, slug string, t *entities.Tag) (*entities.Tag, error)
    DeleteBySlug(ctx context.Context, slug string) error
    GetBySlug(ctx context.Context, slug string) (*entities.Tag, error)
}

type tagRepo struct{ col *mongo.Collection }

func NewTag(db *mongo.Database) TagRepo {
    col := db.Collection("tags")
    _ = ensureTagIndexes(context.Background(), col)
    return &tagRepo{col: col}
}

func ensureTagIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{Keys: bson.D{{Key: "slug", Value: 1}}, Options: options.Index().SetUnique(true).SetBackground(true).SetName("uniq_slug")}
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *tagRepo) List(ctx context.Context) ([]entities.Tag, error) {
    cur, err := r.col.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "name", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Tag
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Tag{} }
    return out, nil
}

func (r *tagRepo) GetBySlug(ctx context.Context, slug string) (*entities.Tag, error) {
    var t entities.Tag
    if err := r.col.FindOne(ctx, bson.M{"slug": slug}).Decode(&t); err != nil { return nil, err }
    return &t, nil
}

func (r *tagRepo) Create(ctx context.Context, t *entities.Tag) error {
    if t.Slug == "" { t.Slug = slugify(t.Name) }
    t.CreatedAt = time.Now().UTC(); t.UpdatedAt = t.CreatedAt
    _, err := r.col.InsertOne(ctx, t)
    return err
}

func (r *tagRepo) UpdateBySlug(ctx context.Context, slug string, t *entities.Tag) (*entities.Tag, error) {
    t.UpdatedAt = time.Now().UTC()
    _, err := r.col.UpdateOne(ctx, bson.M{"slug": slug}, bson.M{"$set": bson.M{"name": t.Name, "color": t.Color, "updated_at": t.UpdatedAt}})
    if err != nil { return nil, err }
    return r.GetBySlug(ctx, slug)
}

func (r *tagRepo) DeleteBySlug(ctx context.Context, slug string) error {
    _, err := r.col.DeleteOne(ctx, bson.M{"slug": slug})
    return err
}

// slugify provided in repositories package
