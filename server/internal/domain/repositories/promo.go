package repositories

import (
	"context"
	"ojs-server/internal/domain/entities"
)

type PromoRepo interface {
	GetActive(ctx context.Context) ([]entities.Promo, error)
	GetByID(ctx context.Context, id string) (*entities.Promo, error)
	Create(ctx context.Context, p entities.Promo) (*entities.Promo, error)
	Update(ctx context.Context, id string, p entities.Promo) (*entities.Promo, error)
	Delete(ctx context.Context, id string) error
}
