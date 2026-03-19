package repositories

import (
    "context"
    "errors"
    "strings"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type productMongoRepo struct { col *mongo.Collection }

func NewProductMongo(db *mongo.Database) ProductRepo {
    col := db.Collection("products")
    _ = ensureProductIndexes(context.Background(), col)
    return &productMongoRepo{ col: col }
}

func ensureProductIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{ Keys: bson.D{{Key: "slug", Value: 1}}, Options: options.Index().SetUnique(true).SetName("uniq_slug").SetBackground(true) }
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *productMongoRepo) GetAll() []entities.Product {
    cur, err := r.col.Find(context.Background(), bson.M{}, options.Find().SetSort(bson.D{{Key: "name", Value: 1}}))
    if err != nil { return []entities.Product{} }
    defer cur.Close(context.Background())
    var out []entities.Product
    if err := cur.All(context.Background(), &out); err != nil { return []entities.Product{} }
    if out == nil { out = []entities.Product{} }
    return out
}

func (r *productMongoRepo) GetBySection(section string) []entities.Product {
    if section == "" { return r.GetAll() }
    cur, err := r.col.Find(context.Background(), bson.M{"section": section})
    if err != nil { return []entities.Product{} }
    defer cur.Close(context.Background())
    var out []entities.Product
    _ = cur.All(context.Background(), &out)
    if out == nil { out = []entities.Product{} }
    return out
}

func (r *productMongoRepo) GetByCategory(category string) []entities.Product {
    if category == "" { return r.GetAll() }
    cur, err := r.col.Find(context.Background(), bson.M{"category": category})
    if err != nil { return []entities.Product{} }
    defer cur.Close(context.Background())
    var out []entities.Product
    _ = cur.All(context.Background(), &out)
    if out == nil { out = []entities.Product{} }
    return out
}

func (r *productMongoRepo) GetByID(id string) (*entities.Product, error) {
    var p entities.Product
    // search by slug or id
    err := r.col.FindOne(context.Background(), bson.M{"slug": id}).Decode(&p)
    if err == mongo.ErrNoDocuments {
        if err2 := r.col.FindOne(context.Background(), bson.M{"id": id}).Decode(&p); err2 != nil {
            return nil, errors.New("product not found")
        }
    } else if err != nil {
        return nil, err
    }
    return &p, nil
}

func (r *productMongoRepo) Create(p entities.Product) (*entities.Product, error) {
    if p.Slug == "" { p.Slug = slugify(p.Name) }
    if p.ID == "" { p.ID = p.Slug }
    _, err := r.col.InsertOne(context.Background(), p)
    if err != nil { return nil, err }
    cp := p
    return &cp, nil
}

func (r *productMongoRepo) Update(id string, p entities.Product) (*entities.Product, error) {
    // merge with existing
    cur, err := r.GetByID(id)
    if err != nil { return nil, err }
    // preserve existing fields if zero values
    if p.ID == "" { p.ID = cur.ID }
    if p.Slug == "" { p.Slug = cur.Slug }
    if p.Name == "" { p.Name = cur.Name }
    if p.Price == 0 { p.Price = cur.Price }
    if p.Original == 0 { p.Original = cur.Original }
    if p.Rating == 0 { p.Rating = cur.Rating }
    if p.Reviews == 0 { p.Reviews = cur.Reviews }
    if p.Compat == "" { p.Compat = cur.Compat }
    if p.Category == "" { p.Category = cur.Category }
    if p.Section == "" { p.Section = cur.Section }
    if p.Emoji == "" { p.Emoji = cur.Emoji }
    if p.Bg == "" { p.Bg = cur.Bg }
    if p.Badge == "" { p.Badge = cur.Badge }
    if p.BadgeColor == "" { p.BadgeColor = cur.BadgeColor }
    if p.Description == "" { p.Description = cur.Description }
    if len(p.Features) == 0 { p.Features = cur.Features }
    if p.Image == "" { p.Image = cur.Image }
    if len(p.Gallery) == 0 { p.Gallery = cur.Gallery }
    if p.DemoUrl == "" { p.DemoUrl = cur.DemoUrl }
    if p.LivePreviewURL == "" { p.LivePreviewURL = cur.LivePreviewURL }
    if p.PriceText == "" { p.PriceText = cur.PriceText }
    if p.OjsVersion == "" { p.OjsVersion = cur.OjsVersion }
    if p.Framework == "" { p.Framework = cur.Framework }
    if p.BrowserSupport == "" { p.BrowserSupport = cur.BrowserSupport }
    if p.License == "" { p.License = cur.License }
    if p.UpdateDuration == "" { p.UpdateDuration = cur.UpdateDuration }
    if p.SupportDuration == "" { p.SupportDuration = cur.SupportDuration }
    if len(p.Tags) == 0 { p.Tags = cur.Tags }
    if len(p.Changelog) == 0 { p.Changelog = cur.Changelog }

    _, err = r.col.UpdateOne(context.Background(), bson.M{"slug": cur.Slug}, bson.M{"$set": p})
    if err != nil { return nil, err }
    return &p, nil
}

func (r *productMongoRepo) Delete(id string) error {
    _, err := r.col.DeleteOne(context.Background(), bson.M{"$or": []bson.M{{"slug": id}, {"id": id}}})
    return err
}

// reuse slugify logic
// slugify provided in repositories package

// ListFilter performs server-side filtering and pagination using Mongo
func (r *productMongoRepo) ListFilter(ctx context.Context, f ProductFilter) ([]entities.Product, int, error) {
    filter := bson.M{}
    if f.Section != "" { filter["section"] = f.Section }
    if f.Category != "" { filter["category"] = f.Category }
    if len(f.Tags) > 0 {
        filter["tags"] = bson.M{"$in": f.Tags}
    }
    // Query search on name and slug
    if f.Query != "" {
        filter["$or"] = []bson.M{
            {"name": bson.M{"$regex": f.Query, "$options": "i"}},
            {"slug": bson.M{"$regex": f.Query, "$options": "i"}},
        }
    }
    limit := int64(f.Limit); if limit <= 0 { limit = 20 }
    page := int64(f.Page); if page <= 0 { page = 1 }
    skip := (page-1)*limit
    opts := options.Find().SetSkip(skip).SetLimit(limit)
    // basic sort support (e.g., name, -price)
    if f.Sort != "" {
        dir := 1; field := f.Sort
        if strings.HasPrefix(field, "-") { dir = -1; field = strings.TrimPrefix(field, "-") }
        opts.SetSort(bson.D{{Key: field, Value: dir}})
    }
    cur, err := r.col.Find(ctx, filter, opts)
    if err != nil { return nil, 0, err }
    defer cur.Close(ctx)
    var out []entities.Product
    if err := cur.All(ctx, &out); err != nil { return nil, 0, err }
    cnt, err := r.col.CountDocuments(ctx, filter)
    if err != nil { return nil, 0, err }
    if out == nil { out = []entities.Product{} }
    return out, int(cnt), nil
}
