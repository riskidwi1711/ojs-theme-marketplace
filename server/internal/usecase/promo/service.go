package promo

import (
	"context"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

type Service interface {
	GetActivePromos(ctx context.Context) ([]entities.Promo, error)
	GetPromoByID(ctx context.Context, id string) (*entities.Promo, error)
	CreatePromo(ctx context.Context, p entities.Promo) (*entities.Promo, error)
	UpdatePromo(ctx context.Context, id string, p entities.Promo) (*entities.Promo, error)
	DeletePromo(ctx context.Context, id string) error
}

type serviceImpl struct {
	promoRepo repositories.PromoRepo
}

func NewService(promoRepo repositories.PromoRepo) Service {
	return &serviceImpl{promoRepo: promoRepo}
}

func (s *serviceImpl) GetActivePromos(ctx context.Context) ([]entities.Promo, error) {
	return s.promoRepo.GetActive(ctx)
}

func (s *serviceImpl) GetPromoByID(ctx context.Context, id string) (*entities.Promo, error) {
	return s.promoRepo.GetByID(ctx, id)
}

func (s *serviceImpl) CreatePromo(ctx context.Context, p entities.Promo) (*entities.Promo, error) {
	return s.promoRepo.Create(ctx, p)
}

func (s *serviceImpl) UpdatePromo(ctx context.Context, id string, p entities.Promo) (*entities.Promo, error) {
	return s.promoRepo.Update(ctx, id, p)
}

func (s *serviceImpl) DeletePromo(ctx context.Context, id string) error {
	return s.promoRepo.Delete(ctx, id)
}
