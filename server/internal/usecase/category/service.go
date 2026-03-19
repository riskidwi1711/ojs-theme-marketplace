package category

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    List(ctx context.Context) ([]entities.Category, error)
    Create(ctx context.Context, c *entities.Category) error
    UpdateBySlug(ctx context.Context, slug string, c *entities.Category) (*entities.Category, error)
    DeleteBySlug(ctx context.Context, slug string) error
}

type service struct{ repo repositories.CategoryRepo }

func NewService(repo repositories.CategoryRepo) Service { return &service{repo: repo} }

func (s *service) List(ctx context.Context) ([]entities.Category, error)                    { return s.repo.List(ctx) }
func (s *service) Create(ctx context.Context, c *entities.Category) error                  { return s.repo.Create(ctx, c) }
func (s *service) UpdateBySlug(ctx context.Context, slug string, c *entities.Category) (*entities.Category, error) {
    return s.repo.UpdateBySlug(ctx, slug, c)
}
func (s *service) DeleteBySlug(ctx context.Context, slug string) error { return s.repo.DeleteBySlug(ctx, slug) }

