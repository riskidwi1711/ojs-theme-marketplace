package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type SectionRepo interface {
    List(ctx context.Context) ([]entities.Section, error)
    ListActive(ctx context.Context) ([]entities.Section, error)
    Create(ctx context.Context, s *entities.Section) error
    UpdateBySlug(ctx context.Context, slug string, s *entities.Section) (*entities.Section, error)
    DeleteBySlug(ctx context.Context, slug string) error
    GetBySlug(ctx context.Context, slug string) (*entities.Section, error)
}

type sectionRepo struct{ col *mongo.Collection }

func NewSection(db *mongo.Database) SectionRepo {
    col := db.Collection("sections")
    _ = ensureSectionIndexes(context.Background(), col)
    return &sectionRepo{col: col}
}

func ensureSectionIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{Keys: bson.D{{Key: "slug", Value: 1}}, Options: options.Index().SetUnique(true).SetBackground(true).SetName("uniq_slug")}
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *sectionRepo) List(ctx context.Context) ([]entities.Section, error) {
    cur, err := r.col.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "order", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Section
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Section{} }
    return out, nil
}

func (r *sectionRepo) ListActive(ctx context.Context) ([]entities.Section, error) {
    cur, err := r.col.Find(ctx, bson.M{"active": true}, options.Find().SetSort(bson.D{{Key: "order", Value: 1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Section
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Section{} }
    return out, nil
}

func (r *sectionRepo) GetBySlug(ctx context.Context, slug string) (*entities.Section, error) {
    var s entities.Section
    if err := r.col.FindOne(ctx, bson.M{"slug": slug}).Decode(&s); err != nil { return nil, err }
    return &s, nil
}

func (r *sectionRepo) Create(ctx context.Context, s *entities.Section) error {
    if s.Slug == "" { s.Slug = slugify(s.Name) }
    s.CreatedAt = time.Now().UTC(); s.UpdatedAt = s.CreatedAt
    _, err := r.col.InsertOne(ctx, s)
    return err
}

func (r *sectionRepo) UpdateBySlug(ctx context.Context, slug string, s *entities.Section) (*entities.Section, error) {
    s.UpdatedAt = time.Now().UTC()
    update := bson.M{
        "name":         s.Name,
        "description":  s.Description,
        "sub":          s.Sub,
        "icon":         s.Icon,
        "icon_color":   s.IconColor,
        "bg":           s.Bg,
        "text_color":   s.TextColor,
        "sub_color":    s.SubColor,
        "tag":          s.Tag,
        "tag_bg":       s.TagBg,
        "href":         s.Href,
        "active":       s.Active,
        "order":        s.Order,
        "updated_at":   s.UpdatedAt,
    }
    _, err := r.col.UpdateOne(ctx, bson.M{"slug": slug}, bson.M{"$set": update})
    if err != nil { return nil, err }
    return r.GetBySlug(ctx, slug)
}

func (r *sectionRepo) DeleteBySlug(ctx context.Context, slug string) error {
    _, err := r.col.DeleteOne(ctx, bson.M{"slug": slug})
    return err
}

// slugify provided in repositories package
