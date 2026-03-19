package handler

import (
	"io"
	"net/http"
	"path"
	"strings"

	"github.com/labstack/echo/v4"
	miniopkg "ojs-server/internal/infrastructure/minio"
)

type mediaHandler struct {
	minio  miniopkg.Wrapper
	bucket string
}

func NewMediaHandler(minio miniopkg.Wrapper, bucket string) *mediaHandler {
	return &mediaHandler{minio: minio, bucket: bucket}
}

var allowedPrefixes = []string{"images/", "banners/", "uploads/"}

// GET /api/v1/media/*
func (h *mediaHandler) Serve(c echo.Context) error {
	key := strings.TrimPrefix(c.Param("*"), "/")
	if key == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "missing key"})
	}

	// Only allow specific prefixes — prevent traversal to sensitive objects (e.g. themes/*.zip)
	allowed := false
	for _, p := range allowedPrefixes {
		if strings.HasPrefix(key, p) {
			allowed = true
			break
		}
	}
	if !allowed {
		return c.JSON(http.StatusForbidden, map[string]string{"message": "forbidden"})
	}

	reader, err := h.minio.DownloadFile(c.Request().Context(), h.bucket, key)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"message": "not found"})
	}
	defer reader.Close()

	ext := strings.ToLower(path.Ext(key))
	contentType := "application/octet-stream"
	switch ext {
	case ".jpg", ".jpeg":
		contentType = "image/jpeg"
	case ".png":
		contentType = "image/png"
	case ".webp":
		contentType = "image/webp"
	case ".gif":
		contentType = "image/gif"
	case ".svg":
		contentType = "image/svg+xml"
	}

	c.Response().Header().Set("Content-Type", contentType)
	c.Response().Header().Set("Cache-Control", "public, max-age=86400") // 1 hari
	c.Response().WriteHeader(http.StatusOK)
	io.Copy(c.Response().Writer, reader) //nolint:errcheck
	return nil
}
