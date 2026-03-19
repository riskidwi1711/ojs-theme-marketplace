package tag

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    List(ctx context.Context) ([]entities.Tag, error)
    Create(ctx context.Context, t *entities.Tag) error
    UpdateBySlug(ctx context.Context, slug string, t *entities.Tag) (*entities.Tag, error)
    DeleteBySlug(ctx context.Context, slug string) error
}

type service struct{ repo repositories.TagRepo }

func NewService(repo repositories.TagRepo) Service { return &service{repo: repo} }

func (s *service) List(ctx context.Context) ([]entities.Tag, error) { return s.repo.List(ctx) }
func (s *service) Create(ctx context.Context, t *entities.Tag) error { return s.repo.Create(ctx, t) }
func (s *service) UpdateBySlug(ctx context.Context, slug string, t *entities.Tag) (*entities.Tag, error) {
    return s.repo.UpdateBySlug(ctx, slug, t)
}
func (s *service) DeleteBySlug(ctx context.Context, slug string) error { return s.repo.DeleteBySlug(ctx, slug) }

