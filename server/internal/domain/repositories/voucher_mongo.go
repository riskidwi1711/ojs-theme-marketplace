package repositories

import (
	"context"
	"errors"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type voucherMongoRepo struct {
	col *mongo.Collection
}

func NewVoucherMongo(db *mongo.Database) VoucherRepo {
	col := db.Collection("vouchers")
	_ = ensureVoucherIndexes(context.Background(), col)
	return &voucherMongoRepo{col: col}
}

func ensureVoucherIndexes(ctx context.Context, col *mongo.Collection) error {
	_, err := col.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "code", Value: 1}},
		Options: options.Index().SetName("idx_code").SetUnique(true),
	})
	return err
}

func (r *voucherMongoRepo) GetByCode(ctx context.Context, code string) (*entities.Voucher, error) {
	var v entities.Voucher
	err := r.col.FindOne(ctx, bson.M{"code": strings.ToUpper(code)}).Decode(&v)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("voucher not found")
	}
	return &v, err
}

func (r *voucherMongoRepo) GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Voucher, error) {
	var v entities.Voucher
	err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&v)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("voucher not found")
	}
	return &v, err
}

func (r *voucherMongoRepo) List(ctx context.Context) ([]entities.Voucher, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cur, err := r.col.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var list []entities.Voucher
	if err := cur.All(ctx, &list); err != nil {
		return nil, err
	}
	if list == nil {
		list = []entities.Voucher{}
	}
	return list, nil
}

func (r *voucherMongoRepo) Create(ctx context.Context, v entities.Voucher) (*entities.Voucher, error) {
	v.Code = strings.ToUpper(v.Code)
	v.CreatedAt = time.Now()
	res, err := r.col.InsertOne(ctx, v)
	if err != nil {
		return nil, err
	}
	v.ID = res.InsertedID.(primitive.ObjectID)
	return &v, nil
}

func (r *voucherMongoRepo) Update(ctx context.Context, id primitive.ObjectID, v entities.Voucher) (*entities.Voucher, error) {
	v.Code = strings.ToUpper(v.Code)
	_, err := r.col.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": v})
	if err != nil {
		return nil, err
	}
	v.ID = id
	return &v, nil
}

func (r *voucherMongoRepo) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.col.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *voucherMongoRepo) IncrementUsed(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.col.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$inc": bson.M{"used_count": 1}},
	)
	return err
}
