package voucher

import (
	"context"
	"errors"
	"math"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
)

type ValidateResult struct {
	Valid          bool    `json:"valid"`
	Code           string  `json:"code"`
	Type           string  `json:"type"`
	Value          float64 `json:"value"`
	DiscountIDR    int     `json:"discountIDR"`
	FinalIDR       int     `json:"finalIDR"`
	Message        string  `json:"message"`
}

type Service interface {
	Validate(ctx context.Context, code string, totalIDR int, userEmail string) (*ValidateResult, error)
	// Returns the discount IDR for a validated code (used internally by checkout)
	Apply(ctx context.Context, code string, totalIDR int, userEmail string) (discountIDR int, voucherID primitive.ObjectID, err error)
	IncrementUsed(ctx context.Context, id primitive.ObjectID) error
	// Admin
	List(ctx context.Context) ([]entities.Voucher, error)
	Create(ctx context.Context, v entities.Voucher) (*entities.Voucher, error)
	Update(ctx context.Context, id primitive.ObjectID, v entities.Voucher) (*entities.Voucher, error)
	Delete(ctx context.Context, id primitive.ObjectID) error
}

type service struct {
	repo   repositories.VoucherRepo
	orders repositories.OrderRepo
}

func NewService(repo repositories.VoucherRepo, orders repositories.OrderRepo) Service {
	return &service{repo: repo, orders: orders}
}

func (s *service) Validate(ctx context.Context, code string, totalIDR int, userEmail string) (*ValidateResult, error) {
	code = strings.ToUpper(strings.TrimSpace(code))
	if code == "" {
		return &ValidateResult{Valid: false, Message: "Kode voucher tidak boleh kosong"}, nil
	}

	v, err := s.repo.GetByCode(ctx, code)
	if err != nil {
		return &ValidateResult{Valid: false, Message: "Kode voucher tidak ditemukan"}, nil
	}

	if !v.Active {
		return &ValidateResult{Valid: false, Message: "Voucher tidak aktif"}, nil
	}
	if v.ExpiresAt != nil && time.Now().After(*v.ExpiresAt) {
		return &ValidateResult{Valid: false, Message: "Voucher sudah kadaluarsa"}, nil
	}
	if v.UsageLimit > 0 && v.UsedCount >= v.UsageLimit {
		return &ValidateResult{Valid: false, Message: "Kuota voucher sudah habis"}, nil
	}
	if v.MinOrderIDR > 0 && totalIDR < v.MinOrderIDR {
		return &ValidateResult{Valid: false, Message: "Minimum pembelian tidak terpenuhi untuk voucher ini"}, nil
	}

	// New-users-only check: reject if user already has a PAID order
	if v.NewUsersOnly && userEmail != "" {
		hasPaid, err := s.orders.HasPaidOrders(ctx, userEmail)
		if err == nil && hasPaid {
			return &ValidateResult{Valid: false, Message: "Voucher ini hanya untuk member baru yang belum pernah melakukan pembelian"}, nil
		}
	}

	discount := calcDiscount(v, totalIDR)
	final := totalIDR - discount
	if final < 0 {
		final = 0
	}

	return &ValidateResult{
		Valid:       true,
		Code:        v.Code,
		Type:        v.Type,
		Value:       v.Value,
		DiscountIDR: discount,
		FinalIDR:    final,
		Message:     "Voucher berhasil diterapkan",
	}, nil
}

func (s *service) Apply(ctx context.Context, code string, totalIDR int, userEmail string) (int, primitive.ObjectID, error) {
	if code == "" {
		return 0, primitive.NilObjectID, nil
	}
	res, err := s.Validate(ctx, code, totalIDR, userEmail)
	if err != nil {
		return 0, primitive.NilObjectID, err
	}
	if !res.Valid {
		return 0, primitive.NilObjectID, errors.New(res.Message)
	}
	v, err := s.repo.GetByCode(ctx, code)
	if err != nil {
		return 0, primitive.NilObjectID, err
	}
	return res.DiscountIDR, v.ID, nil
}

func (s *service) IncrementUsed(ctx context.Context, id primitive.ObjectID) error {
	return s.repo.IncrementUsed(ctx, id)
}

func (s *service) List(ctx context.Context) ([]entities.Voucher, error) {
	return s.repo.List(ctx)
}

func (s *service) Create(ctx context.Context, v entities.Voucher) (*entities.Voucher, error) {
	if v.Code == "" {
		return nil, errors.New("code is required")
	}
	if v.Type != "percent" && v.Type != "fixed" {
		return nil, errors.New("type must be 'percent' or 'fixed'")
	}
	if v.Value <= 0 {
		return nil, errors.New("value must be positive")
	}
	if v.Type == "percent" && v.Value > 100 {
		return nil, errors.New("percent value cannot exceed 100")
	}
	return s.repo.Create(ctx, v)
}

func (s *service) Update(ctx context.Context, id primitive.ObjectID, v entities.Voucher) (*entities.Voucher, error) {
	return s.repo.Update(ctx, id, v)
}

func (s *service) Delete(ctx context.Context, id primitive.ObjectID) error {
	return s.repo.Delete(ctx, id)
}

func calcDiscount(v *entities.Voucher, totalIDR int) int {
	var discount int
	switch v.Type {
	case "percent":
		discount = int(math.Round(float64(totalIDR) * v.Value / 100))
		if v.MaxDiscountIDR > 0 && discount > v.MaxDiscountIDR {
			discount = v.MaxDiscountIDR
		}
	case "fixed":
		discount = int(v.Value)
	}
	if discount > totalIDR {
		discount = totalIDR
	}
	return discount
}
