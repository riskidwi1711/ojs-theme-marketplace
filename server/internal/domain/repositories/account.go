package repositories

import (
    "context"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type AccountRepo interface {
    Create(ctx context.Context, a *entities.Account) error
    FindByEmail(ctx context.Context, email string) (*entities.Account, error)
    List(ctx context.Context, q, role, status string, limit, page int) (docs []entities.Account, total uint, err error)
    UpdateRole(ctx context.Context, email, role string) error
    UpdateStatus(ctx context.Context, email, status string) error
    Update(ctx context.Context, a *entities.Account) error
    Count(ctx context.Context) (uint, error)
}

type accountRepo struct{ col *mongo.Collection }

func NewAccount(db *mongo.Database) AccountRepo {
    col := db.Collection("accounts")
    // Ensure unique index on email
    _ = ensureAccountIndexes(context.Background(), col)
    return &accountRepo{ col: col }
}

func ensureAccountIndexes(ctx context.Context, col *mongo.Collection) error {
    mdl := mongo.IndexModel{
        Keys:    bson.D{{Key: "email", Value: 1}},
        Options: options.Index().SetUnique(true).SetBackground(true).SetName("uniq_email"),
    }
    _, err := col.Indexes().CreateOne(ctx, mdl)
    return err
}

func (r *accountRepo) Create(ctx context.Context, a *entities.Account) error {
    a.CreatedAt = time.Now().UTC()
    a.UpdatedAt = a.CreatedAt
    if a.Role == "" { a.Role = "user" }
    if a.Status == "" { a.Status = "active" }
    _, err := r.col.InsertOne(ctx, a)
    return err
}

func (r *accountRepo) FindByEmail(ctx context.Context, email string) (*entities.Account, error) {
    var acc entities.Account
    err := r.col.FindOne(ctx, bson.M{"email": email}).Decode(&acc)
    if err != nil {
        return nil, err
    }
    return &acc, nil
}

func (r *accountRepo) List(ctx context.Context, q, role, status string, limit, page int) (docs []entities.Account, total uint, err error) {
    filter := bson.M{}
    if role != "" { filter["role"] = role }
    if status != "" { filter["status"] = status }
    if q != "" {
        filter["$or"] = []bson.M{
            {"email": bson.M{"$regex": q, "$options": "i"}},
            {"name": bson.M{"$regex": q, "$options": "i"}},
        }
    }
    if limit <= 0 { limit = 20 }
    if page <= 0 { page = 1 }
    skip := int64((page - 1) * limit)
    lmt := int64(limit)
    opts := options.Find().SetSkip(skip).SetLimit(lmt).SetSort(bson.D{{Key: "created_at", Value: -1}})

    cur, e := r.col.Find(ctx, filter, opts)
    if e != nil { err = e; return }
    defer cur.Close(ctx)
    for cur.Next(ctx) {
        var a entities.Account
        if e = cur.Decode(&a); e != nil { err = e; return }
        docs = append(docs, a)
    }
    cnt, e := r.col.CountDocuments(ctx, filter)
    if e != nil { err = e; return }
    total = uint(cnt)
    if docs == nil { docs = []entities.Account{} }
    return
}

func (r *accountRepo) UpdateRole(ctx context.Context, email, role string) error {
    _, err := r.col.UpdateOne(ctx, bson.M{"email": email}, bson.M{"$set": bson.M{"role": role, "updated_at": time.Now().UTC()}})
    return err
}

func (r *accountRepo) UpdateStatus(ctx context.Context, email, status string) error {
    _, err := r.col.UpdateOne(ctx, bson.M{"email": email}, bson.M{"$set": bson.M{"status": status, "updated_at": time.Now().UTC()}})
    return err
}

func (r *accountRepo) Update(ctx context.Context, a *entities.Account) error {
    a.UpdatedAt = time.Now().UTC()
    _, err := r.col.UpdateOne(ctx, bson.M{"email": a.Email}, bson.M{"$set": bson.M{
        "name": a.Name,
        "role": a.Role,
        "status": a.Status,
        "password_hash": a.PasswordHash,
        "updated_at": a.UpdatedAt,
    }})
    return err
}

func (r *accountRepo) Count(ctx context.Context) (uint, error) {
    cnt, err := r.col.CountDocuments(ctx, bson.M{})
    if err != nil { return 0, err }
    return uint(cnt), nil
}
