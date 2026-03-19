package user

import (
	"context"

	"ojs-server/internal/pkg/constants"
)

type Service interface {
	GetAllUser(ctx context.Context, req GetUsersReq) (res constants.DefaultResponse, err error)
}
