package banner

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    List(ctx context.Context) ([]entities.Banner, error)
    ListActive(ctx context.Context) ([]entities.Banner, error)
    Create(ctx context.Context, b *entities.Banner) error
    Update(ctx context.Context, id string, b *entities.Banner) (*entities.Banner, error)
    Delete(ctx context.Context, id string) error
}

type service struct{ repo repositories.BannerRepo }

func NewService(repo repositories.BannerRepo) Service { return &service{repo: repo} }

func (s *service) List(ctx context.Context) ([]entities.Banner, error) { return s.repo.List(ctx) }
func (s *service) ListActive(ctx context.Context) ([]entities.Banner, error) { return s.repo.ListActive(ctx) }
func (s *service) Create(ctx context.Context, b *entities.Banner) error { return s.repo.Create(ctx, b) }
func (s *service) Update(ctx context.Context, id string, b *entities.Banner) (*entities.Banner, error) {
    return s.repo.UpdateBySlug(ctx, id, b)
}
func (s *service) Delete(ctx context.Context, id string) error { return s.repo.DeleteBySlug(ctx, id) }
