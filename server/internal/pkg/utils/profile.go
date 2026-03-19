package utils

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type (
	Profile struct {
		ID     int64     `json:"id"`
		UUID   uuid.UUID `json:"uuid"`
		Name   string    `json:"name"`
		Role   string    `json:"role"`
		Email  string    `json:"email"`
		Status string    `json:"status"`
	}
)

func InjectProfile(c echo.Context) (ctx context.Context) {
	ctx = context.WithValue(c.Request().Context(), "profile", c.Request().Header.Get("X-Authenticated-Data"))
	ctx = context.WithValue(ctx, "platform", c.Request().Header.Get("platform"))
	return
}

func GetProfile(ctx context.Context) Profile {
	profileData, ok := ctx.Value("profile").(string)
    if !ok || profileData == "" {
        fmt.Println("Invalid or missing user data in context")
        return Profile{}
    }

    var wrapper struct {
        User Profile `json:"profile"`
    }

    err := json.Unmarshal([]byte(profileData), &wrapper)
    if err != nil {
        fmt.Printf("Failed to unmarshal user data: %v\n", err)
        return Profile{}
    }

    return wrapper.User
}
