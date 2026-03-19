package repositories

import (
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"strings"

	"ojs-server/internal/domain/entities"
)

type Theme interface {
	GetAll() ([]entities.Theme, error)
	Search(query string) ([]entities.Theme, error)
	GetBySlug(slug string) (*entities.Theme, error)
	Create(t entities.Theme) (*entities.Theme, error)
	Update(slug string, t entities.Theme) (*entities.Theme, error)
	Delete(slug string) error
}

type themeRepository struct {
	filePath string
}

func NewTheme() Theme {
	return &themeRepository{
		filePath: "../src/data/ojs-themes.json",
	}
}

func (r *themeRepository) GetAll() ([]entities.Theme, error) {
	absPath, _ := filepath.Abs(r.filePath)
	data, err := os.ReadFile(absPath)
	if err != nil {
		return nil, err
	}

	var result struct {
		Items []entities.Theme `json:"items"`
	}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}
	return result.Items, nil
}

func (r *themeRepository) Search(query string) ([]entities.Theme, error) {
	themes, err := r.GetAll()
	if err != nil {
		return nil, err
	}
	if query == "" {
		return themes, nil
	}
	q := strings.ToLower(query)
	var filtered []entities.Theme
	for _, t := range themes {
		if strings.Contains(strings.ToLower(t.Title), q) {
			filtered = append(filtered, t)
		}
	}
	return filtered, nil
}

func (r *themeRepository) GetBySlug(slug string) (*entities.Theme, error) {
	themes, err := r.GetAll()
	if err != nil {
		return nil, err
	}
	for _, t := range themes {
		if t.Slug == slug {
			cp := t
			return &cp, nil
		}
	}
	return nil, errors.New("theme not found")
}

func (r *themeRepository) Create(t entities.Theme) (*entities.Theme, error) {
	return nil, errors.New("not implemented for JSON repository")
}

func (r *themeRepository) Update(slug string, t entities.Theme) (*entities.Theme, error) {
	return nil, errors.New("not implemented for JSON repository")
}

func (r *themeRepository) Delete(slug string) error {
	return errors.New("not implemented for JSON repository")
}

// ThemeFilter for pagination and filtering
type ThemeFilter struct {
	Query string
	Limit int
	Page  int
}
