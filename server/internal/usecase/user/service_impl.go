package user

import (
	"context"
	"strconv"
	"strings"
	"time"

	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/pkg/constants"
	"ojs-server/internal/pkg/log"
	"ojs-server/internal/pkg/utils"
)

type service struct {
	userRepo repositories.User
}

func NewService(
	userRepo repositories.User,
) *service {
	return &service{
		userRepo: userRepo,
	}
}

func (s *service) GetAllUser(ctx context.Context, req GetUsersReq) (res constants.DefaultResponse, err error) {
	profile := utils.GetProfile(ctx)
	if profile.Email == "" {
		res = constants.DefaultResponse{
			Status:  constants.STATUS_UNAUTHORIZED,
			Message: "Unauthorized",
			Data:    nil,
		}
		return res, nil
	}

	_, err = time.Parse(time.DateOnly, req.StartDate)
	if err != nil {
		log.Error(ctx, "error not a valid date %v", err)
		res = constants.DefaultResponse{
			Status:  constants.STATUS_INVALID_REQUEST_FORMAT,
			Message: "Invalid start date",
			Data:    nil,
		}

		return res, nil
	}
	_, err = time.Parse(time.DateOnly, req.EndDate)
	if err != nil {
		log.Error(ctx, "error not a valid date %v", err)
		res = constants.DefaultResponse{
			Status:  constants.STATUS_INVALID_REQUEST_FORMAT,
			Message: "Invalid end date",
			Data:    nil,
		}

		return res, nil
	}

	limit, err := strconv.Atoi(req.Limit)
	if err != nil {
		log.Error(ctx, "error not a integer value %v", err)
		res = constants.DefaultResponse{
			Status:  constants.STATUS_INVALID_REQUEST_FORMAT,
			Message: "Invalid value of limit parameter",
			Data:    nil,
		}

		return res, nil
	}
	page, err := strconv.Atoi(req.Page)
	if err != nil {
		log.Error(ctx, "error not a integer value %v", err)
		res = constants.DefaultResponse{
			Status:  constants.STATUS_INVALID_REQUEST_FORMAT,
			Message: "Invalid value of page parameter",
			Data:    nil,
		}

		return res, nil
	}

	if req.State != "" {
		validStates := map[string]bool{
			constants.USER_STATE_ACTIVE:   true,
			constants.USER_STATE_INACTIVE: true,
			constants.USER_STATE_BANNED:   true,
		}
		if !validStates[strings.ToLower(req.State)] {
			res = constants.DefaultResponse{
				Status:  constants.STATUS_INVALID_REQUEST_FORMAT,
				Message: "Invalid value of state parameter",
				Data:    nil,
			}
			return res, nil
		}
	}

	getUserReq := entities.GetUsersReq{
		Id:        req.Id,
		Status:    req.Status,
		IdType:    req.IdType,
		StartDate: req.StartDate,
		EndDate:   req.EndDate,
		Limit:     limit,
		Page:      page,
		Name:      req.Name,
		State:     req.State,
	}

	docs, count, err := s.userRepo.GetAllUser(ctx, getUserReq)
	if err != nil {
		log.Error(ctx, "can't get users : %v", err)
		res = constants.DefaultResponse{
			Status:  constants.STATUS_NO_DATA,
			Message: constants.MESSAGE_DATA_NOT_FOUND,
			Data:    make([]string, 0),
		}

		return res, nil
	}
	res = constants.DefaultResponse{
		Status:  constants.STATUS_SUCCESS,
		Message: constants.MESSAGE_SUCCESS,
		Data:    utils.GetPaginationResponse(docs, count, utils.PaginationParam{Page: uint(page), Limit: uint(limit)}),
	}
	return
}
