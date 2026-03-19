package wishlist

import (
	"context"
	"errors"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

type Service interface {
	GetWishlist(ctx context.Context, email string) (*entities.Wishlist, error)
	AddItem(ctx context.Context, email string, item entities.WishlistItem) error
	RemoveItem(ctx context.Context, email string, id string) error
	CheckItem(ctx context.Context, email string, id string) (bool, error)
}

type service struct{ repo repositories.WishlistRepo }

func NewService(repo repositories.WishlistRepo) Service { return &service{repo: repo} }

func (s *service) GetWishlist(ctx context.Context, email string) (*entities.Wishlist, error) {
	if email == "" {
		return nil, errors.New("missing email")
	}
	return s.repo.GetByUser(ctx, email)
}

func (s *service) AddItem(ctx context.Context, email string, item entities.WishlistItem) error {
	if email == "" || item.ID == "" || item.Name == "" {
		return errors.New("invalid payload")
	}
	return s.repo.AddItem(ctx, email, item)
}

func (s *service) RemoveItem(ctx context.Context, email string, id string) error {
	if email == "" || id == "" {
		return errors.New("invalid payload")
	}
	return s.repo.RemoveItem(ctx, email, id)
}

func (s *service) CheckItem(ctx context.Context, email string, id string) (bool, error) {
	if email == "" || id == "" {
		return false, nil
	}
	return s.repo.CheckItem(ctx, email, id)
}
