package handler

import (
	"fmt"
	"mime"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	miniopkg "ojs-server/internal/infrastructure/minio"
)

type adminUploadHandler struct {
	minio  miniopkg.Wrapper
	bucket string
}

func NewAdminUploadHandler(minio miniopkg.Wrapper, bucket string) *adminUploadHandler {
	return &adminUploadHandler{minio: minio, bucket: bucket}
}

// POST /api/v1/admin/uploads
// Form field: file
// Query param: folder (optional, default "images") — used as object key prefix
func (h *adminUploadHandler) Upload(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "file is required"})
	}
	if file.Size > 200*1024*1024 { // 200 MB limit
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "file too large (max 200 MB)"})
	}

	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	folder := strings.Trim(c.QueryParam("folder"), "/")
	if folder == "" {
		folder = "images"
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext == "" {
		ext = ".bin"
	}
	baseName := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
	baseName = sanitizeName(baseName)
	if baseName == "" {
		baseName = "upload"
	}

	objectKey := fmt.Sprintf("%s/%s-%d%s", folder, baseName, time.Now().UnixNano(), ext)
	contentType := mime.TypeByExtension(ext)
	if contentType == "" {
		contentType = "application/octet-stream"
	}

	resp, err := h.minio.UploadFile(c.Request().Context(), h.bucket, objectKey, src, contentType)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]any{
		"status":   "success",
		"key":      resp.Key,
		"url":      resp.URL,
		"filename": filepath.Base(objectKey),
	})
}

func sanitizeName(s string) string {
	var b strings.Builder
	for _, r := range s {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9', r == '-', r == '_':
			b.WriteRune(r)
		case r == ' ':
			b.WriteRune('-')
		}
	}
	return b.String()
}
