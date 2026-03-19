package callback

import (
	"context"
	"errors"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/infrastructure/brevo"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	OrderRepo    repositories.OrderRepo
	BrevoWrapper brevo.Wrapper
}

func NewService(orderRepository repositories.OrderRepo, brevoWrapper brevo.Wrapper) Service {
	return &service{
		OrderRepo:    orderRepository,
		BrevoWrapper: brevoWrapper,
	}
}

var xenditStatusMap = map[string]string{
	"PAID":    "PAID",
	"EXPIRED": "EXPIRED",
	"FAILED":  "FAILED",
}

func (s *service) CallbackXendit(ctx context.Context, payload XenditCallbackRequest) error {
	if payload.ExternalID == "" {
		return errors.New("missing external_id")
	}

	orderStatus, ok := xenditStatusMap[payload.Status]
	if !ok {
		// status tidak dikenal, abaikan
		return nil
	}

	oid, err := primitive.ObjectIDFromHex(payload.ExternalID)
	if err != nil {
		return errors.New("invalid external_id: " + err.Error())
	}

	if err := s.OrderRepo.UpdateStatus(ctx, oid, orderStatus); err != nil {
		return err
	}

	// Send payment success email (best-effort, non-blocking)
	if orderStatus == "PAID" && s.BrevoWrapper != nil {
		ord, fetchErr := s.OrderRepo.GetByID(ctx, oid)
		if fetchErr == nil && ord != nil {
			go s.BrevoWrapper.SendPaymentSuccess(context.Background(), ord) //nolint:errcheck
		}
	}

	return nil
}
