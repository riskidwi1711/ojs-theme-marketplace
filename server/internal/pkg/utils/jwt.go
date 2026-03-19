package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
	"ojs-server/internal/config"
)

type Claims struct {
	ID    string
	Email string
	jwt.StandardClaims
}

func JwtSign(id string, email string) (token string, exp int64, err error) {
	secret := []byte(config.GetString("jwt.key"))
	exp = time.Now().Add(7 * 24 * time.Hour).Unix()
	claims := &Claims{
		id,
		email,
		jwt.StandardClaims{
			Issuer:    "ACTIONPAY",
			ExpiresAt: exp, // * 7 days
		},
	}
	token, err = jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(secret)
	return
}

func JwtVerify(token string) (claims *Claims, err error) {
	secret := []byte(config.GetString("jwt"))
	claims = &Claims{}
	_, err = jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (interface{}, error) {
		return secret, nil
	})

	return
}
