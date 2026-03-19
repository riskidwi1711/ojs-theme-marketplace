package repositories

import (
    "context"
    "ojs-server/internal/domain/entities"
)

type BannerRepo interface {
    List(ctx context.Context) ([]entities.Banner, error)
    ListActive(ctx context.Context) ([]entities.Banner, error)
    Create(ctx context.Context, b *entities.Banner) error
    UpdateBySlug(ctx context.Context, id string, b *entities.Banner) (*entities.Banner, error)
    DeleteBySlug(ctx context.Context, id string) error
    GetByID(ctx context.Context, id string) (*entities.Banner, error)
}
