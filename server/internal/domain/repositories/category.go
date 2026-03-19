package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type CategoryRepo interface {
    List(ctx context.Context) ([]entities.Category, error)
    GetBySlug(ctx context.Context, slug string) (*entities.Category, error)
    Create(ctx context.Context, c *entities.Category) error
    UpdateBySlug(ctx context.Context, slug string, c *entities.Category) (*entities.Category, error)
    DeleteBySlug(ctx context.Context, slug string) error
}

type categoryRepo struct{ col *mongo.Collection }

func NewCategory(db *mongo.Database) CategoryRepo {
    col := db.Collection("categories")
    _ = ensureCategoryIndexes(context.Background(), col)
    return &categoryRepo{col: col}
}

func ensureCategoryIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{Keys: bson.D{{Key: "slug", Value: 1}}, Options: options.Index().SetUnique(true).SetName("uniq_slug").SetBackground(true)}
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *categoryRepo) List(ctx context.Context) ([]entities.Category, error) {
    cur, err := r.col.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "name", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Category
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Category{} }
    return out, nil
}

func (r *categoryRepo) GetBySlug(ctx context.Context, slug string) (*entities.Category, error) {
    var c entities.Category
    if err := r.col.FindOne(ctx, bson.M{"slug": slug}).Decode(&c); err != nil { return nil, err }
    return &c, nil
}

func (r *categoryRepo) Create(ctx context.Context, c *entities.Category) error {
    if c.Slug == "" { c.Slug = slugify(c.Name) }
    c.CreatedAt = time.Now().UTC(); c.UpdatedAt = c.CreatedAt
    _, err := r.col.InsertOne(ctx, c)
    return err
}

func (r *categoryRepo) UpdateBySlug(ctx context.Context, slug string, c *entities.Category) (*entities.Category, error) {
    c.UpdatedAt = time.Now().UTC()
    _, err := r.col.UpdateOne(ctx, bson.M{"slug": slug}, bson.M{"$set": bson.M{
        "name": c.Name, "description": c.Description, "color": c.Color, "bg": c.Bg, "updated_at": c.UpdatedAt,
    }})
    if err != nil { return nil, err }
    return r.GetBySlug(ctx, slug)
}

func (r *categoryRepo) DeleteBySlug(ctx context.Context, slug string) error {
    _, err := r.col.DeleteOne(ctx, bson.M{"slug": slug})
    return err
}

// slugify is provided in this package (repositories) by product repo file
