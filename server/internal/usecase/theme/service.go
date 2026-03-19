package theme

import (
	"context"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

type Service interface {
	GetThemes(ctx context.Context, query string) ([]entities.Theme, error)
	GetBySlug(ctx context.Context, slug string) (*entities.Theme, error)
	ListFilter(ctx context.Context, f repositories.ThemeFilter) ([]entities.Theme, int, error)
}

type serviceImpl struct {
	themeRepo repositories.Theme
}

func NewService(themeRepo repositories.Theme) Service {
	return &serviceImpl{themeRepo: themeRepo}
}

func (s *serviceImpl) GetThemes(ctx context.Context, query string) ([]entities.Theme, error) {
	if query != "" {
		return s.themeRepo.Search(query)
	}
	return s.themeRepo.GetAll()
}

func (s *serviceImpl) GetBySlug(_ context.Context, slug string) (*entities.Theme, error) {
	return s.themeRepo.GetBySlug(slug)
}

func (s *serviceImpl) ListFilter(ctx context.Context, f repositories.ThemeFilter) ([]entities.Theme, int, error) {
	themes, err := s.themeRepo.GetAll()
	if err != nil {
		return nil, 0, err
	}

	// Filter by query search
	if f.Query != "" {
		var filtered []entities.Theme
		for _, t := range themes {
			if containsIgnoreCase(t.Title, f.Query) || containsIgnoreCase(t.Slug, f.Query) {
				filtered = append(filtered, t)
			}
		}
		themes = filtered
	}

	total := len(themes)

	// Pagination
	limit := f.Limit
	if limit <= 0 {
		limit = 20
	}
	page := f.Page
	if page <= 0 {
		page = 1
	}
	start := (page - 1) * limit
	if start > total {
		start = total
	}
	end := start + limit
	if end > total {
		end = total
	}

	return themes[start:end], total, nil
}

func containsIgnoreCase(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(substr) == 0 || containsLower(s, substr))
}

func containsLower(s, substr string) bool {
	s = toLower(s)
	substr = toLower(substr)
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

func toLower(s string) string {
	var result []byte
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c >= 'A' && c <= 'Z' {
			c = c + ('a' - 'A')
		}
		result = append(result, c)
	}
	return string(result)
}
