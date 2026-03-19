package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"ojs-server/internal/domain/entities"
	"ojs-server/internal/domain/repositories"
	"ojs-server/internal/pkg/utils"
)

type reviewHandler struct {
	repo repositories.ReviewRepo
}

func NewReviewHandler(repo repositories.ReviewRepo) *reviewHandler {
	return &reviewHandler{repo: repo}
}

// GET /api/v1/products/:id/reviews
func (h *reviewHandler) List(c echo.Context) error {
	productID := c.Param("id")
	reviews, err := h.repo.ListByProduct(c.Request().Context(), productID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	avg := 0.0
	dist := map[int]int{1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
	if len(reviews) > 0 {
		sum := 0
		for _, r := range reviews {
			sum += r.Rating
			if r.Rating >= 1 && r.Rating <= 5 {
				dist[r.Rating]++
			}
		}
		avg = float64(sum) / float64(len(reviews))
	}

	return c.JSON(http.StatusOK, map[string]any{
		"status":  "success",
		"reviews": reviews,
		"total":   len(reviews),
		"avg":     avg,
		"dist":    dist,
	})
}

// POST /api/v1/products/:id/reviews (AuthRequired)
func (h *reviewHandler) Create(c echo.Context) error {
	productID := c.Param("id")
	prof := utils.GetProfile(c.Request().Context())
	if prof.Email == "" {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
	}

	var body struct {
		Rating int    `json:"rating"`
		Body   string `json:"body"`
	}
	if err := c.Bind(&body); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid body"})
	}
	if body.Rating < 1 || body.Rating > 5 {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "rating must be 1-5"})
	}
	if body.Body == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "body is required"})
	}

	already, _ := h.repo.HasReviewed(c.Request().Context(), productID, prof.Email)
	if already {
		return c.JSON(http.StatusConflict, map[string]string{"message": "already reviewed"})
	}

	rev := &entities.Review{
		ProductID: productID,
		UserEmail: prof.Email,
		Name:      prof.Name,
		Rating:    body.Rating,
		Body:      body.Body,
	}
	if err := h.repo.Create(c.Request().Context(), rev); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}
	return c.JSON(http.StatusCreated, map[string]any{"status": "created", "review": rev})
}
