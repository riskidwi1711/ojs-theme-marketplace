package repositories

import (
	"context"
	"errors"
	"sort"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type promoMongoRepo struct {
	col *mongo.Collection
}

func NewPromoMongo(db *mongo.Database) PromoRepo {
	col := db.Collection("promos")
	_ = ensurePromoIndexes(context.Background(), col)
	return &promoMongoRepo{col: col}
}

func ensurePromoIndexes(ctx context.Context, col *mongo.Collection) error {
	// Index for active promos with ordering
	mdl := mongo.IndexModel{
		Keys:    bson.D{{Key: "active", Value: 1}, {Key: "order", Value: 1}},
		Options: options.Index().SetName("idx_active_order"),
	}
	_, err := col.Indexes().CreateOne(ctx, mdl)
	return err
}

func (r *promoMongoRepo) GetActive(ctx context.Context) ([]entities.Promo, error) {
	filter := bson.M{"active": true}
	opts := options.Find().SetSort(bson.D{{Key: "order", Value: 1}})
	
	cur, err := r.col.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	
	var promos []entities.Promo
	if err := cur.All(ctx, &promos); err != nil {
		return nil, err
	}
	
	if promos == nil {
		promos = []entities.Promo{}
	}
	
	return promos, nil
}

func (r *promoMongoRepo) GetByID(ctx context.Context, id string) (*entities.Promo, error) {
	var promo entities.Promo
	err := r.col.FindOne(ctx, bson.M{"id": id}).Decode(&promo)
	if err == mongo.ErrNoDocuments {
		return nil, errors.New("promo not found")
	} else if err != nil {
		return nil, err
	}
	return &promo, nil
}

func (r *promoMongoRepo) Create(ctx context.Context, p entities.Promo) (*entities.Promo, error) {
	_, err := r.col.InsertOne(ctx, p)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *promoMongoRepo) Update(ctx context.Context, id string, p entities.Promo) (*entities.Promo, error) {
	cur, err := r.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	
	// Preserve ID if not provided
	if p.ID == "" {
		p.ID = cur.ID
	}
	
	_, err = r.col.UpdateOne(ctx, bson.M{"id": cur.ID}, bson.M{"$set": p})
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *promoMongoRepo) Delete(ctx context.Context, id string) error {
	_, err := r.col.DeleteOne(ctx, bson.M{"id": id})
	return err
}

// Helper to sort promos by order
func SortPromosByOrder(promos []entities.Promo) {
	sort.Slice(promos, func(i, j int) bool {
		return promos[i].Order < promos[j].Order
	})
}
