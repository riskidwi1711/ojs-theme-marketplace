package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ojs-server/internal/domain/entities"
)

type OrderRepo interface {
    Create(ctx context.Context, o *entities.Order) (primitive.ObjectID, error)
    GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Order, error)
    GetByUser(ctx context.Context, email string) ([]entities.Order, error)
    UpdateStatus(ctx context.Context, id primitive.ObjectID, status string) error
    UpdateInvoiceURL(ctx context.Context, id primitive.ObjectID, invoiceURL string) error
    ListAll(ctx context.Context, email, status string) ([]entities.Order, error)
    HasPaidOrders(ctx context.Context, email string) (bool, error)
}

type orderRepo struct{ col *mongo.Collection }

func NewOrder(db *mongo.Database) OrderRepo { return &orderRepo{col: db.Collection("orders")} }

func (r *orderRepo) Create(ctx context.Context, o *entities.Order) (primitive.ObjectID, error) {
	o.CreatedAt = time.Now().UTC()
	res, err := r.col.InsertOne(ctx, o)
	if err != nil {
		return primitive.NilObjectID, err
	}
	id := res.InsertedID.(primitive.ObjectID)
	return id, nil
}

func (r *orderRepo) GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Order, error) {
	var ord entities.Order
	err := r.col.FindOne(ctx, bson.M{"_id": id}).Decode(&ord)
	if err != nil {
		return nil, err
	}
	return &ord, nil
}

func (r *orderRepo) UpdateStatus(ctx context.Context, id primitive.ObjectID, status string) error {
	_, err := r.col.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"status": status}},
	)
	return err
}

func (r *orderRepo) UpdateInvoiceURL(ctx context.Context, id primitive.ObjectID, invoiceURL string) error {
	_, err := r.col.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"xendit_invoice_url": invoiceURL}},
	)
	return err
}

func (r *orderRepo) GetByUser(ctx context.Context, email string) ([]entities.Order, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cur, err := r.col.Find(ctx, bson.M{"user_email": email}, opts)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)
	var orders []entities.Order
	if err := cur.All(ctx, &orders); err != nil {
		return nil, err
	}
	if orders == nil {
		orders = []entities.Order{}
	}
	return orders, nil
}

func (r *orderRepo) HasPaidOrders(ctx context.Context, email string) (bool, error) {
    n, err := r.col.CountDocuments(ctx, bson.M{"user_email": email, "status": "PAID"})
    if err != nil {
        return false, err
    }
    return n > 0, nil
}

func (r *orderRepo) ListAll(ctx context.Context, email, status string) ([]entities.Order, error) {
    filter := bson.M{}
    if email != "" {
        filter["user_email"] = email
    }
    if status != "" {
        filter["status"] = status
    }
    opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
    cur, err := r.col.Find(ctx, filter, opts)
    if err != nil { return nil, err }
    defer cur.Close(ctx)
    var orders []entities.Order
    if err := cur.All(ctx, &orders); err != nil { return nil, err }
    if orders == nil { orders = []entities.Order{} }
    return orders, nil
}
