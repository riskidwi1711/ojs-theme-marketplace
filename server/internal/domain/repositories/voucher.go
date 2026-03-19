package repositories

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"ojs-server/internal/domain/entities"
)

type VoucherRepo interface {
	GetByCode(ctx context.Context, code string) (*entities.Voucher, error)
	GetByID(ctx context.Context, id primitive.ObjectID) (*entities.Voucher, error)
	List(ctx context.Context) ([]entities.Voucher, error)
	Create(ctx context.Context, v entities.Voucher) (*entities.Voucher, error)
	Update(ctx context.Context, id primitive.ObjectID, v entities.Voucher) (*entities.Voucher, error)
	Delete(ctx context.Context, id primitive.ObjectID) error
	// IncrementUsed atomically increments used_count by 1
	IncrementUsed(ctx context.Context, id primitive.ObjectID) error
}
