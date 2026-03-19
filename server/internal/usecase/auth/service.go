package auth

import (
	"context"
	"errors"
	"time"

	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	h "ojs-server/internal/pkg/helpers"
	"ojs-server/internal/pkg/utils"

	"ojs-server/internal/pkg/log"

	"github.com/golang-jwt/jwt"
)

type Service interface {
	Register(ctx context.Context, email, password, name string) (token string, profile map[string]interface{}, err error)
	Login(ctx context.Context, email, password string) (token string, profile map[string]interface{}, err error)
	LoginAdmin(ctx context.Context, email, password string) (token string, profile map[string]interface{}, err error)
	Me(ctx context.Context, token string) (profile map[string]interface{}, err error)
	Refresh(ctx context.Context, token string) (newToken string, profile map[string]interface{}, err error)
	ChangePassword(ctx context.Context, email, currentPassword, newPassword string) error
}

type service struct{ repo repositories.AccountRepo }

func NewService(repo repositories.AccountRepo) Service { return &service{repo: repo} }

func (s *service) Register(ctx context.Context, email, password, name string) (string, map[string]interface{}, error) {
	if email == "" || password == "" {
		return "", nil, errors.New("email and password required")
	}
	// check exists
	if _, err := s.repo.FindByEmail(ctx, email); err == nil {
		return "", nil, errors.New("email already registered")
	}
	hash, err := utils.HashPassword(password)
	if err != nil {
		return "", nil, err
	}
	acc := &entities.Account{Email: email, Name: name, Role: "customer", Status: "active", PasswordHash: hash}
	if err := s.repo.Create(ctx, acc); err != nil {
		return "", nil, err
	}
	return s.issue(acc)
}

func (s *service) Login(ctx context.Context, email, password string) (string, map[string]interface{}, error) {
	acc, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}
	if !utils.CheckPasswordHash(acc.PasswordHash, password) {
		return "", nil, errors.New("invalid credentials")
	}
	if acc.Status != "active" {
		return "", nil, errors.New("account is not active")
	}
	return s.issue(acc)
}

func (s *service) LoginAdmin(ctx context.Context, email, password string) (string, map[string]interface{}, error) {
	acc, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		log.Info(ctx, "error finding account for admin login", err.Error())
		return "", nil, errors.New("invalid credentials")
	}
	if !utils.CheckPasswordHash(acc.PasswordHash, password) {
		log.Info(ctx, "error checking password", email)
		return "", nil, errors.New("invalid credentials")
	}
	if acc.Role != "admin" {
		return "", nil, errors.New("forbidden: not an admin")
	}
	if acc.Status != "active" {
		return "", nil, errors.New("account is not active")
	}
	return s.issue(acc)
}

func (s *service) Me(ctx context.Context, token string) (map[string]interface{}, error) {
	tkn, err := h.VerifyJWT(ctx, token)
	if err != nil || !tkn.Valid {
		return nil, errors.New("invalid token")
	}
	if claims, ok := tkn.Claims.(jwt.MapClaims); ok {
		if p, ok2 := claims["profile"].(map[string]interface{}); ok2 {
			return p, nil
		}
	}
	return nil, errors.New("invalid token claims")
}

func (s *service) issue(acc *entities.Account) (string, map[string]interface{}, error) {
	profile := map[string]interface{}{"email": acc.Email, "name": acc.Name, "role": acc.Role}
	exp := time.Now().Add(7 * 24 * time.Hour).Unix()
	token, err := h.GenerateJWT(map[string]interface{}{"sessionID": acc.Email, "exp": exp, "profile": profile})
	if err != nil {
		return "", nil, err
	}
	return token, profile, nil
}

func (s *service) Refresh(ctx context.Context, token string) (string, map[string]interface{}, error) {
	tkn, err := h.VerifyJWT(ctx, token)
	if err != nil || !tkn.Valid {
		return "", nil, errors.New("invalid token")
	}
	claims, ok := tkn.Claims.(jwt.MapClaims)
	if !ok {
		return "", nil, errors.New("invalid token claims")
	}
	prof, _ := claims["profile"].(map[string]interface{})
	session := ""
	if sid, ok := claims["sessionID"].(string); ok {
		session = sid
	}
	if session == "" {
		if email, ok := prof["email"].(string); ok {
			session = email
		}
	}
	exp := time.Now().Add(7 * 24 * time.Hour).Unix()
	newTok, err := h.GenerateJWT(map[string]interface{}{"sessionID": session, "exp": exp, "profile": prof})
	if err != nil {
		return "", nil, err
	}
	return newTok, prof, nil
}

func (s *service) ChangePassword(ctx context.Context, email, currentPassword, newPassword string) error {
	if email == "" || currentPassword == "" || newPassword == "" {
		return errors.New("all fields are required")
	}
	if len(newPassword) < 8 {
		return errors.New("new password must be at least 8 characters")
	}
	acc, err := s.repo.FindByEmail(ctx, email)
	if err != nil {
		return errors.New("account not found")
	}
	if !utils.CheckPasswordHash(acc.PasswordHash, currentPassword) {
		return errors.New("current password is incorrect")
	}
	hash, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}
	acc.PasswordHash = hash
	return s.repo.Update(ctx, acc)
}
