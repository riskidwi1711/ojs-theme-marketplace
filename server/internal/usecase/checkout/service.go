package checkout

import (
	"context"
	"errors"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/xendit"
	"ojs-server/internal/usecase/voucher"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service interface {
	Place(ctx context.Context, email string, voucherCode string, shipping map[string]any, payment map[string]any) (*entities.Order, error)
	Get(ctx context.Context, id string) (*entities.Order, error)
	GetByUser(ctx context.Context, email string) ([]entities.Order, error)
	AdminList(ctx context.Context, email, status string) ([]entities.Order, error)
	AdminUpdateStatus(ctx context.Context, id string, status string) error
}

type service struct {
	carts    repositories.CartRepo
	orders   repositories.OrderRepo
	xendit   xendit.Wrapper
	vouchers voucher.Service
}

func NewService(carts repositories.CartRepo, orders repositories.OrderRepo, xendit xendit.Wrapper, vouchers voucher.Service) Service {
	return &service{carts: carts, orders: orders, xendit: xendit, vouchers: vouchers}
}

func (s *service) Place(ctx context.Context, email, voucherCode string, shipping, payment map[string]any) (*entities.Order, error) {
	if email == "" {
		return nil, errors.New("missing email")
	}
	cart, err := s.carts.GetByUser(ctx, email)
	if err != nil {
		return nil, err
	}
	if len(cart.Items) == 0 {
		return nil, errors.New("cart empty")
	}

	subtotal := 0
	for _, it := range cart.Items {
		subtotal += it.PriceIDR * it.Qty
	}

	// Server-side voucher validation — never trust client-sent discount
	discountIDR := 0
	var voucherID primitive.ObjectID
	if voucherCode != "" {
		discountIDR, voucherID, err = s.vouchers.Apply(ctx, voucherCode, subtotal, email)
		if err != nil {
			return nil, errors.New("voucher tidak valid: " + err.Error())
		}
	}

	total := subtotal - discountIDR
	if total < 0 {
		total = 0
	}

	ord := &entities.Order{
		UserEmail:   email,
		Items:       cart.Items,
		SubtotalIDR: subtotal,
		DiscountIDR: discountIDR,
		TotalIDR:    total,
		VoucherCode: voucherCode,
		Shipping:    shipping,
		Payment:     payment,
		Status:      "PLACED",
	}
	id, err := s.orders.Create(ctx, ord)
	if err != nil {
		return nil, err
	}
	_ = s.carts.Clear(ctx, email)

	// Increment voucher usage after successful order creation
	if !voucherID.IsZero() {
		_ = s.vouchers.IncrementUsed(ctx, voucherID)
	}

	ord.ID = id
	return ord, nil
}

func (s *service) Get(ctx context.Context, id string) (*entities.Order, error) {
	if id == "" {
		return nil, errors.New("missing id")
	}
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	return s.orders.GetByID(ctx, oid)
}

func (s *service) GetByUser(ctx context.Context, email string) ([]entities.Order, error) {
	if email == "" {
		return nil, errors.New("missing email")
	}
	return s.orders.GetByUser(ctx, email)
}

func (s *service) AdminList(ctx context.Context, email, status string) ([]entities.Order, error) {
	return s.orders.ListAll(ctx, email, status)
}

func (s *service) AdminUpdateStatus(ctx context.Context, id string, status string) error {
	if id == "" {
		return errors.New("missing id")
	}
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return s.orders.UpdateStatus(ctx, oid, status)
}
