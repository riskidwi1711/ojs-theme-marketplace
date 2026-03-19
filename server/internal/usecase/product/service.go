package product

import (
	"context"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

type Service interface {
	GetAll(ctx context.Context, section, category string) ([]entities.Product, error)
	GetByID(ctx context.Context, id string) (*entities.Product, error)
	Create(ctx context.Context, p entities.Product) (*entities.Product, error)
	Update(ctx context.Context, id string, p entities.Product) (*entities.Product, error)
	Delete(ctx context.Context, id string) error
	ListFilter(ctx context.Context, f repositories.ProductFilter) (items []entities.Product, total int, err error)
}

type service struct {
	repo       repositories.ProductRepo
	reviewRepo repositories.ReviewRepo
}

func NewService(repo repositories.ProductRepo, reviewRepo repositories.ReviewRepo) Service {
	return &service{repo: repo, reviewRepo: reviewRepo}
}

func (s *service) GetAll(_ context.Context, section, category string) ([]entities.Product, error) {
	if section != "" {
		return s.repo.GetBySection(section), nil
	}
	if category != "" {
		return s.repo.GetByCategory(category), nil
	}
	return s.repo.GetAll(), nil
}

func (s *service) GetByID(_ context.Context, id string) (*entities.Product, error) {
	product, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	// cari rating untuk produk
	reviews, _ := s.reviewRepo.ListByProduct(context.Background(), id)
	if len(reviews) > 0 {
		sumRating := 0
		for _, r := range reviews {
			sumRating += r.Rating
		}
		product.Rating = float64(sumRating) / float64(len(reviews))
	} else {
		product.Rating = 0
	}
	product.Reviews = len(reviews)

	return product, nil
}

func (s *service) ListFilter(ctx context.Context, f repositories.ProductFilter) ([]entities.Product, int, error) {
	products, total, err := s.repo.ListFilter(ctx, f)
	if len(products) > 0 {
		// cari rating untuk setiap produk
		for i, p := range products {
			reviews, _ := s.reviewRepo.ListByProduct(ctx, p.ID)
			// hitung rating rata-rata
			if len(reviews) > 0 {
				sumRating := 0
				for _, r := range reviews {
					sumRating += r.Rating
				}
				products[i].Rating = float64(sumRating) / float64(len(reviews))
			} else {
				products[i].Rating = 0
			}
			products[i].Reviews = len(reviews)
		}
	}
	return products, total, err
}

func (s *service) Create(_ context.Context, p entities.Product) (*entities.Product, error) {
	return s.repo.Create(p)
}

func (s *service) Update(_ context.Context, id string, p entities.Product) (*entities.Product, error) {
	return s.repo.Update(id, p)
}

func (s *service) Delete(_ context.Context, id string) error {
	return s.repo.Delete(id)
}
