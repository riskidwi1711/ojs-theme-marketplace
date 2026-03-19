package cart

import (
    "context"
    "errors"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    GetCart(ctx context.Context, email string) (*entities.Cart, error)
    AddItem(ctx context.Context, email string, item entities.CartItem) error
    RemoveItem(ctx context.Context, email string, id string) error
}

type service struct{ repo repositories.CartRepo }

func NewService(repo repositories.CartRepo) Service { return &service{ repo: repo } }

func (s *service) GetCart(ctx context.Context, email string) (*entities.Cart, error) {
    if email == "" { return nil, errors.New("missing email") }
    return s.repo.GetByUser(ctx, email)
}

func (s *service) AddItem(ctx context.Context, email string, item entities.CartItem) error {
    if email == "" || item.ID == "" || item.Name == "" || item.PriceIDR <= 0 { return errors.New("invalid payload") }
    if item.Qty <= 0 { item.Qty = 1 }
    return s.repo.UpsertItem(ctx, email, item)
}

func (s *service) RemoveItem(ctx context.Context, email string, id string) error {
    if email == "" || id == "" { return errors.New("invalid payload") }
    return s.repo.RemoveItem(ctx, email, id)
}

