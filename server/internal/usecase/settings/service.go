package settings

import (
    "context"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
)

type Service interface {
    GetSite(ctx context.Context) (*entities.Settings, error)
    SaveSite(ctx context.Context, s *entities.Settings) error
}

type service struct{ repo repositories.SettingsRepo }

func NewService(repo repositories.SettingsRepo) Service { return &service{repo: repo} }

func (s *service) GetSite(ctx context.Context) (*entities.Settings, error) { return s.repo.GetSite(ctx) }
func (s *service) SaveSite(ctx context.Context, st *entities.Settings) error { return s.repo.UpsertSite(ctx, st) }

