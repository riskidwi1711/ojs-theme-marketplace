package section

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    List(ctx context.Context) ([]entities.Section, error)
    ListActive(ctx context.Context) ([]entities.Section, error)
    Create(ctx context.Context, s *entities.Section) error
    UpdateBySlug(ctx context.Context, slug string, s *entities.Section) (*entities.Section, error)
    DeleteBySlug(ctx context.Context, slug string) error
}

type service struct{ repo repositories.SectionRepo }

func NewService(repo repositories.SectionRepo) Service { return &service{repo: repo} }

func (s *service) List(ctx context.Context) ([]entities.Section, error) { return s.repo.List(ctx) }
func (s *service) ListActive(ctx context.Context) ([]entities.Section, error) { return s.repo.ListActive(ctx) }
func (s *service) Create(ctx context.Context, sec *entities.Section) error { return s.repo.Create(ctx, sec) }
func (s *service) UpdateBySlug(ctx context.Context, slug string, sec *entities.Section) (*entities.Section, error) {
    return s.repo.UpdateBySlug(ctx, slug, sec)
}
func (s *service) DeleteBySlug(ctx context.Context, slug string) error { return s.repo.DeleteBySlug(ctx, slug) }

