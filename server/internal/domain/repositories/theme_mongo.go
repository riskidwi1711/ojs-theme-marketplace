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

type themeMongoRepo struct {
	col *mongo.Collection
}

func NewThemeMongo(db *mongo.Database) Theme {
	col := db.Collection("themes")
	_ = ensureThemeIndexes(context.Background(), col)
	return &themeMongoRepo{col: col}
}

func ensureThemeIndexes(ctx context.Context, col *mongo.Collection) error {
	mdl := mongo.IndexModel{
		Keys:    bson.D{{Key: "slug", Value: 1}},
		Options: options.Index().SetUnique(true).SetName("uniq_slug").SetBackground(true),
	}
	_, err := col.Indexes().CreateOne(ctx, mdl)
	return err
}

func (r *themeMongoRepo) GetAll() ([]entities.Theme, error) {
	cur, err := r.col.Find(context.Background(), bson.M{}, options.Find().SetSort(bson.D{{Key: "title", Value: 1}}))
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())
	var out []entities.Theme
	if err := cur.All(context.Background(), &out); err != nil {
		return nil, err
	}
	if out == nil {
		out = []entities.Theme{}
	}
	return out, nil
}

func (r *themeMongoRepo) Search(query string) ([]entities.Theme, error) {
	themes, err := r.GetAll()
	if err != nil {
		return nil, err
	}
	if query == "" {
		return themes, nil
	}
	q := strings.ToLower(query)
	var filtered []entities.Theme
	for _, t := range themes {
		if strings.Contains(strings.ToLower(t.Title), q) ||
			strings.Contains(strings.ToLower(t.Slug), q) {
			filtered = append(filtered, t)
		}
	}
	return filtered, nil
}

func (r *themeMongoRepo) GetBySlug(slug string) (*entities.Theme, error) {
	var t entities.Theme
	err := r.col.FindOne(context.Background(), bson.M{"slug": slug}).Decode(&t)
	if err == mongo.ErrNoDocuments {
		return nil, errors.New("theme not found")
	} else if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *themeMongoRepo) Create(t entities.Theme) (*entities.Theme, error) {
	if t.Slug == "" {
		t.Slug = slugify(t.Title)
	}
	if t.ID == "" {
		t.ID = t.Slug
	}
	_, err := r.col.InsertOne(context.Background(), t)
	if err != nil {
		return nil, err
	}
	cp := t
	return &cp, nil
}

func (r *themeMongoRepo) Update(slug string, t entities.Theme) (*entities.Theme, error) {
	cur, err := r.GetBySlug(slug)
	if err != nil {
		return nil, err
	}
	// preserve existing fields if zero values
	if t.ID == "" {
		t.ID = cur.ID
	}
	if t.Slug == "" {
		t.Slug = cur.Slug
	}
	if t.Title == "" {
		t.Title = cur.Title
	}
	if t.URL == "" {
		t.URL = cur.URL
	}
	if t.Image == "" {
		t.Image = cur.Image
	}
	if t.LocalImage == "" {
		t.LocalImage = cur.LocalImage
	}
	if t.PriceText == "" {
		t.PriceText = cur.PriceText
	}
	if t.Filename == "" {
		t.Filename = cur.Filename
	}

	_, err = r.col.UpdateOne(context.Background(), bson.M{"slug": cur.Slug}, bson.M{"$set": t})
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *themeMongoRepo) Delete(slug string) error {
	_, err := r.col.DeleteOne(context.Background(), bson.M{"slug": slug})
	return err
}
