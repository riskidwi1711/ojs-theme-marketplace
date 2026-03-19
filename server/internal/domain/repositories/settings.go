package repositories

import (
    "context"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "ojs-server/internal/domain/entities"
)

type SettingsRepo interface {
    GetSite(ctx context.Context) (*entities.Settings, error)
    UpsertSite(ctx context.Context, s *entities.Settings) error
}

type settingsRepo struct{ col *mongo.Collection }

func NewSettings(db *mongo.Database) SettingsRepo { return &settingsRepo{ col: db.Collection("settings") } }

func (r *settingsRepo) GetSite(ctx context.Context) (*entities.Settings, error) {
    var s entities.Settings
    err := r.col.FindOne(ctx, bson.M{"_id": "site"}).Decode(&s)
    if err != nil { return &entities.Settings{ID: "site"}, nil }
    return &s, nil
}

func (r *settingsRepo) UpsertSite(ctx context.Context, s *entities.Settings) error {
    if s.ID == "" { s.ID = "site" }
    opts := options.Update().SetUpsert(true)
    _, err := r.col.UpdateOne(ctx, bson.M{"_id": s.ID}, bson.M{"$set": s}, opts)
    return err
}
