package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type articleMongoRepo struct{ col *mongo.Collection }

func NewArticle(db *mongo.Database) ArticleRepo {
    col := db.Collection("articles")
    _ = ensureArticleIndexes(context.Background(), col)
    return &articleMongoRepo{col: col}
}

func ensureArticleIndexes(ctx context.Context, col *mongo.Collection) error {
    // Unique slug index
    slugIdx := mongo.IndexModel{Keys: bson.D{{Key: "slug", Value: 1}}, Options: options.Index().SetUnique(true).SetBackground(true).SetName("uniq_slug")}
    _, err := col.Indexes().CreateOne(ctx, slugIdx)
    return err
}

func (r *articleMongoRepo) List(ctx context.Context) ([]entities.Article, error) {
    cur, err := r.col.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "order", Value: 1}, {Key: "published_at", Value: -1}}))
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Article
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Article{} }
    return out, nil
}

func (r *articleMongoRepo) ListActive(ctx context.Context, limit int) ([]entities.Article, error) {
    filter := bson.M{"active": true}
    opts := options.Find().SetSort(bson.D{{Key: "published_at", Value: -1}})
    if limit > 0 {
        opts.SetLimit(int64(limit))
    }
    cur, err := r.col.Find(ctx, filter, opts)
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var out []entities.Article
    if err := cur.All(ctx, &out); err != nil { return nil, err }
    if out == nil { out = []entities.Article{} }
    return out, nil
}

func (r *articleMongoRepo) GetBySlug(ctx context.Context, slug string) (*entities.Article, error) {
    var a entities.Article
    if err := r.col.FindOne(ctx, bson.M{"slug": slug}).Decode(&a); err != nil { return nil, err }
    return &a, nil
}

func (r *articleMongoRepo) Create(ctx context.Context, a *entities.Article) error {
    if a.Slug == "" {
        a.Slug = slugify(a.Title)
    }
    a.CreatedAt = time.Now().UTC()
    a.UpdatedAt = a.CreatedAt
    _, err := r.col.InsertOne(ctx, a)
    return err
}

func (r *articleMongoRepo) UpdateBySlug(ctx context.Context, slug string, a *entities.Article) (*entities.Article, error) {
    a.UpdatedAt = time.Now().UTC()
    update := bson.M{
        "title":         a.Title,
        "excerpt":       a.Excerpt,
        "content":       a.Content,
        "author":        a.Author,
        "author_email":  a.AuthorEmail,
        "category":      a.Category,
        "tags":          a.Tags,
        "icon":          a.Icon,
        "icon_color":    a.IconColor,
        "bg":            a.Bg,
        "tag":           a.Tag,
        "tag_color":     a.TagColor,
        "published_at":  a.PublishedAt,
        "active":        a.Active,
        "order":         a.Order,
        "updated_at":    a.UpdatedAt,
    }
    _, err := r.col.UpdateOne(ctx, bson.M{"slug": slug}, bson.M{"$set": update})
    if err != nil { return nil, err }
    return r.GetBySlug(ctx, slug)
}

func (r *articleMongoRepo) DeleteBySlug(ctx context.Context, slug string) error {
    _, err := r.col.DeleteOne(ctx, bson.M{"slug": slug})
    return err
}
