package handler

import (
    "context"
    "encoding/json"
    "net/http"
    "strings"

    "github.com/golang-jwt/jwt"
    "github.com/labstack/echo/v4"
    h "ojs-server/internal/pkg/helpers"
)

// AuthOptional extracts JWT if present and injects X-Authenticated-Data header
func AuthOptional() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            authz := c.Request().Header.Get("Authorization")
            if strings.HasPrefix(authz, "Bearer ") {
                token := strings.TrimPrefix(authz, "Bearer ")
                tkn, err := h.VerifyJWT(c.Request().Context(), token)
                if err == nil && tkn.Valid {
                    if claims, ok := tkn.Claims.(jwt.MapClaims); ok {
                        if prof, ok2 := claims["profile"]; ok2 {
                            wrapper := map[string]interface{}{"profile": prof}
                            if b, err := json.Marshal(wrapper); err == nil {
                                // inject header for backward-compat
                                c.Request().Header.Set("X-Authenticated-Data", string(b))
                                // also inject into context so utils.GetProfile can read it without InjectProfile()
                                ctx := context.WithValue(c.Request().Context(), "profile", string(b))
                                c.SetRequest(c.Request().WithContext(ctx))
                            }
                        }
                    }
                }
            }
            return next(c)
        }
    }
}

// AuthRequired enforces JWT presence
func AuthRequired() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            authz := c.Request().Header.Get("Authorization")
            if !strings.HasPrefix(authz, "Bearer ") {
                return c.JSON(http.StatusUnauthorized, map[string]string{"message": "missing token"})
            }
            token := strings.TrimPrefix(authz, "Bearer ")
            tkn, err := h.VerifyJWT(c.Request().Context(), token)
            if err != nil || !tkn.Valid {
                return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid token"})
            }
            if claims, ok := tkn.Claims.(jwt.MapClaims); ok {
                if prof, ok2 := claims["profile"]; ok2 {
                    wrapper := map[string]interface{}{"profile": prof}
                    if b, err := json.Marshal(wrapper); err == nil {
                        c.Request().Header.Set("X-Authenticated-Data", string(b))
                        ctx := context.WithValue(c.Request().Context(), "profile", string(b))
                        c.SetRequest(c.Request().WithContext(ctx))
                    }
                }
            }
            return next(c)
        }
    }
}

// AdminRequired enforces JWT presence and role=admin
func AdminRequired() echo.MiddlewareFunc {
    return func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            authz := c.Request().Header.Get("Authorization")
            if !strings.HasPrefix(authz, "Bearer ") {
                return c.JSON(http.StatusUnauthorized, map[string]string{"message": "missing token"})
            }
            token := strings.TrimPrefix(authz, "Bearer ")
            tkn, err := h.VerifyJWT(c.Request().Context(), token)
            if err != nil || !tkn.Valid {
                return c.JSON(http.StatusUnauthorized, map[string]string{"message": "invalid token"})
            }
            var role string
            if claims, ok := tkn.Claims.(jwt.MapClaims); ok {
                if prof, ok2 := claims["profile"].(map[string]interface{}); ok2 {
                    if r, ok3 := prof["role"].(string); ok3 { role = r }
                    wrapper := map[string]interface{}{"profile": prof}
                    if b, err := json.Marshal(wrapper); err == nil {
                        c.Request().Header.Set("X-Authenticated-Data", string(b))
                        ctx := context.WithValue(c.Request().Context(), "profile", string(b))
                        c.SetRequest(c.Request().WithContext(ctx))
                    }
                }
            }
            if role != "admin" {
                return c.JSON(http.StatusForbidden, map[string]string{"message": "forbidden"})
            }
            return next(c)
        }
    }
}
