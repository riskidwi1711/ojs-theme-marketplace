package article

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    List(ctx context.Context) ([]entities.Article, error)
    ListActive(ctx context.Context, limit int) ([]entities.Article, error)
    GetBySlug(ctx context.Context, slug string) (*entities.Article, error)
    Create(ctx context.Context, a *entities.Article) error
    Update(ctx context.Context, slug string, a *entities.Article) (*entities.Article, error)
    Delete(ctx context.Context, slug string) error
}

type service struct{ repo repositories.ArticleRepo }

func NewService(repo repositories.ArticleRepo) Service { return &service{repo: repo} }

func (s *service) List(ctx context.Context) ([]entities.Article, error) { return s.repo.List(ctx) }
func (s *service) ListActive(ctx context.Context, limit int) ([]entities.Article, error) { return s.repo.ListActive(ctx, limit) }
func (s *service) GetBySlug(ctx context.Context, slug string) (*entities.Article, error) { return s.repo.GetBySlug(ctx, slug) }
func (s *service) Create(ctx context.Context, a *entities.Article) error { return s.repo.Create(ctx, a) }
func (s *service) Update(ctx context.Context, slug string, a *entities.Article) (*entities.Article, error) {
    return s.repo.UpdateBySlug(ctx, slug, a)
}
func (s *service) Delete(ctx context.Context, slug string) error { return s.repo.DeleteBySlug(ctx, slug) }
