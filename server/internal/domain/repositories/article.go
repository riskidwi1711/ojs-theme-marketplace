package repositories

import (
    "context"
    "ojs-server/internal/domain/entities"
)

type ArticleRepo interface {
    List(ctx context.Context) ([]entities.Article, error)
    ListActive(ctx context.Context, limit int) ([]entities.Article, error)
    GetBySlug(ctx context.Context, slug string) (*entities.Article, error)
    Create(ctx context.Context, a *entities.Article) error
    UpdateBySlug(ctx context.Context, slug string, a *entities.Article) (*entities.Article, error)
    DeleteBySlug(ctx context.Context, slug string) error
}
