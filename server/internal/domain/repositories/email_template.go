package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type EmailTemplateRepo interface {
	GetByKey(ctx context.Context, key string) (*entities.EmailTemplate, error)
	Save(ctx context.Context, tpl entities.EmailTemplate) error
	List(ctx context.Context) ([]entities.EmailTemplate, error)
}

type emailTemplateRepo struct{ col *mongo.Collection }

func NewEmailTemplate(db *mongo.Database) EmailTemplateRepo {
	return &emailTemplateRepo{col: db.Collection("email_templates")}
}

func (r *emailTemplateRepo) GetByKey(ctx context.Context, key string) (*entities.EmailTemplate, error) {
	var tpl entities.EmailTemplate
	err := r.col.FindOne(ctx, bson.M{"key": key}).Decode(&tpl)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &tpl, err
}

func (r *emailTemplateRepo) Save(ctx context.Context, tpl entities.EmailTemplate) error {
	tpl.UpdatedAt = time.Now()
	_, err := r.col.UpdateOne(
		ctx,
		bson.M{"key": tpl.Key},
		bson.M{"$set": tpl},
		options.Update().SetUpsert(true),
	)
	return err
}

func (r *emailTemplateRepo) List(ctx context.Context) ([]entities.EmailTemplate, error) {
	cur, err := r.col.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var out []entities.EmailTemplate
	return out, cur.All(ctx, &out)
}
