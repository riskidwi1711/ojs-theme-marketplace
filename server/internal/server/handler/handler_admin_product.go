package handler

import (
    "bytes"
    "context"
    "encoding/base64"
    "fmt"
    "net/http"
    "strconv"
    "strings"

    "github.com/google/uuid"
    "github.com/labstack/echo/v4"
    "ojs-server/internal/config"
    "ojs-server/internal/domain/entities"
    "ojs-server/internal/domain/repositories"
    miniopkg "ojs-server/internal/infrastructure/minio"
    "ojs-server/internal/usecase/category"
    "ojs-server/internal/usecase/product"
    "ojs-server/internal/usecase/section"
    "ojs-server/internal/usecase/tag"
)

type adminProductHandler struct {
    svc    product.Service
    cats   category.Service
    secs   section.Service
    tags   tag.Service
    minio  miniopkg.Wrapper
    bucket string
}

func NewAdminProductHandler(svc product.Service, cats category.Service, secs section.Service, tags tag.Service, minioWrapper miniopkg.Wrapper, minioBucket string) *adminProductHandler {
    return &adminProductHandler{svc: svc, cats: cats, secs: secs, tags: tags, minio: minioWrapper, bucket: minioBucket}
}

// GET /api/v1/admin/products
func (h *adminProductHandler) List(c echo.Context) error {
    sectionSlug := c.QueryParam("section")
    category := c.QueryParam("category")
    tagsCSV := c.QueryParam("tags")
    limit, _ := strconv.Atoi(c.QueryParam("limit"))
    page, _ := strconv.Atoi(c.QueryParam("page"))
    var tags []string
    if tagsCSV != "" { for _, t := range strings.Split(tagsCSV, ",") { if tt := strings.TrimSpace(t); tt != "" { tags = append(tags, tt) } } }
    items, total, err := h.svc.ListFilter(c.Request().Context(), repositories.ProductFilter{ Section: sectionSlug, Category: category, Tags: tags, Limit: limit, Page: page })
    if err != nil { return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()}) }
    if limit <= 0 { limit = 20 }
    if page <= 0 { page = 1 }
    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "data": items,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) / limit,
    })
}

// GET /api/v1/admin/products/:id
func (h *adminProductHandler) Get(c echo.Context) error {
    id := c.Param("id")
    p, err := h.svc.GetByID(c.Request().Context(), id)
    if err != nil { return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": p})
}

type productReq struct {
    Name       string  `json:"name"`
    Slug       string  `json:"slug"`
    Price      float64 `json:"price"`
    Original   float64 `json:"original"`
    Rating     float64 `json:"rating"`
    Reviews    int     `json:"reviews"`
    Compat     string  `json:"compat"`
    Category   string  `json:"category"`
    Section    string  `json:"section"`
    Emoji      string  `json:"emoji"`
    Bg         string  `json:"bg"`
    Badge      string  `json:"badge"`
    BadgeColor      string   `json:"badgeColor"`
    Description     string   `json:"description"`
    Features        []string `json:"features"`
    Image           string   `json:"image"`
    Gallery         []string `json:"gallery"`
    Screenshots     []string `json:"screenshots"` // alias for gallery from frontend
    DemoUrl         string   `json:"demoUrl"`
    LivePreviewURL  string   `json:"livePreviewUrl"`
    PriceText       string   `json:"priceText"`
    OjsVersion      string   `json:"ojsVersion"`
    Framework       string   `json:"framework"`
    BrowserSupport  string   `json:"browserSupport"`
    License         string   `json:"license"`
    UpdateDuration  string   `json:"updateDuration"`
    SupportDuration string                    `json:"supportDuration"`
    Tags            []string                  `json:"tags"`
    Changelog       []entities.ChangelogEntry `json:"changelog"`
}

// uploadDataURIIfNeeded uploads a base64 data URI to MinIO and returns its URL.
// If the value is already a URL or empty, it is returned unchanged.
func (h *adminProductHandler) uploadDataURIIfNeeded(ctx context.Context, data, objectKey string) (string, error) {
    if h.minio == nil || !strings.HasPrefix(data, "data:") {
        return data, nil
    }
    commaIdx := strings.Index(data, ",")
    if commaIdx < 0 {
        return data, nil
    }
    meta := data[5:commaIdx] // e.g. "image/png;base64"
    encoded := data[commaIdx+1:]

    contentType := strings.SplitN(meta, ";", 2)[0]
    ext := "bin"
    switch contentType {
    case "image/png":
        ext = "png"
    case "image/jpeg", "image/jpg":
        ext = "jpg"
    case "image/webp":
        ext = "webp"
    case "image/gif":
        ext = "gif"
    }

    decoded, err := base64.StdEncoding.DecodeString(encoded)
    if err != nil {
        return "", fmt.Errorf("invalid base64 image: %w", err)
    }

    key := fmt.Sprintf("%s-%s.%s", objectKey, uuid.New().String()[:8], ext)
    _, err = h.minio.UploadFile(ctx, h.bucket, key, bytes.NewReader(decoded), contentType)
    if err != nil {
        return "", fmt.Errorf("failed to upload image: %w", err)
    }
    // Return proxy URL — bucket stays private, MinIO URL never exposed to client
    baseURL := config.GetString("app.baseUrl")
    return fmt.Sprintf("%s/api/v1/media/%s", baseURL, key), nil
}

// uploadImages handles base64 → MinIO for image and gallery/screenshots fields.
func (h *adminProductHandler) uploadImages(ctx context.Context, slug string, req *productReq) error {
    // thumbnail
    url, err := h.uploadDataURIIfNeeded(ctx, req.Image, fmt.Sprintf("images/products/%s/thumb", slug))
    if err != nil {
        return err
    }
    req.Image = url

    // merge screenshots into gallery (frontend sends screenshots, backend stores gallery)
    if len(req.Screenshots) > 0 && len(req.Gallery) == 0 {
        req.Gallery = req.Screenshots
    }

    for i, g := range req.Gallery {
        url, err := h.uploadDataURIIfNeeded(ctx, g, fmt.Sprintf("images/products/%s/gallery-%d", slug, i))
        if err != nil {
            return err
        }
        req.Gallery[i] = url
    }
    return nil
}

func reqToEntity(req productReq) entities.Product {
    gallery := req.Gallery
    if len(gallery) == 0 {
        gallery = req.Screenshots
    }
    return entities.Product{
        Name: req.Name, Slug: req.Slug,
        Price: req.Price, Original: req.Original,
        Rating: req.Rating, Reviews: req.Reviews,
        Compat: req.Compat, Category: req.Category, Section: req.Section,
        Emoji: req.Emoji, Bg: req.Bg, Badge: req.Badge, BadgeColor: req.BadgeColor,
        Description: req.Description, Features: req.Features,
        Image: req.Image, Gallery: gallery,
        DemoUrl: req.DemoUrl, LivePreviewURL: req.LivePreviewURL, PriceText: req.PriceText,
        OjsVersion: req.OjsVersion, Framework: req.Framework, BrowserSupport: req.BrowserSupport,
        License: req.License, UpdateDuration: req.UpdateDuration, SupportDuration: req.SupportDuration,
        Tags: req.Tags, Changelog: req.Changelog,
    }
}

// POST /api/v1/admin/products
func (h *adminProductHandler) Create(c echo.Context) error {
    var req productReq
    if err := c.Bind(&req); err != nil { return err }
    if err := h.uploadImages(c.Request().Context(), req.Slug, &req); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    in := reqToEntity(req)
    if in.Category != "" {
        cats, _ := h.cats.List(c.Request().Context())
        ok := false
        for _, cc := range cats { if cc.Slug == in.Category { ok = true; break } }
        if !ok { return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid category"}) }
    }
    if in.Section != "" {
        secs, _ := h.secs.List(c.Request().Context())
        ok := false
        for _, s := range secs { if s.Slug == in.Section { ok = true; break } }
        if !ok { return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid section"}) }
    }
    // Validate tags
    if len(in.Tags) > 0 {
        tm, _ := h.tags.List(c.Request().Context())
        allowed := map[string]bool{}
        for _, t := range tm { allowed[t.Slug] = true }
        for _, t := range in.Tags {
            if !allowed[t] { return c.JSON(http.StatusBadRequest, map[string]string{"message": fmt.Sprintf("invalid tag: %s", t)}) }
        }
    }
    p, err := h.svc.Create(c.Request().Context(), in)
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusCreated, map[string]any{"status": "success", "data": p})
}

// PUT /api/v1/admin/products/:id
func (h *adminProductHandler) Update(c echo.Context) error {
    id := c.Param("id")
    var req productReq
    if err := c.Bind(&req); err != nil { return err }
    if err := h.uploadImages(c.Request().Context(), req.Slug, &req); err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }
    // Merge is handled in repo Update by preserving empty fields
    in := reqToEntity(req)
    // Validate category if provided
    if in.Category != "" {
        // naive existence check by listing and matching slug
        cats, _ := h.cats.List(c.Request().Context())
        ok := false
        for _, cc := range cats { if cc.Slug == in.Category { ok = true; break } }
        if !ok { return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid category"}) }
    }
    if in.Section != "" {
        secs, _ := h.secs.List(c.Request().Context())
        ok := false
        for _, s := range secs { if s.Slug == in.Section { ok = true; break } }
        if !ok { return c.JSON(http.StatusBadRequest, map[string]string{"message": "invalid section"}) }
    }
    // Validate tags if provided
    if len(in.Tags) > 0 {
        tm, _ := h.tags.List(c.Request().Context())
        allowed := map[string]bool{}
        for _, t := range tm { allowed[t.Slug] = true }
        for _, t := range in.Tags {
            if !allowed[t] { return c.JSON(http.StatusBadRequest, map[string]string{"message": fmt.Sprintf("invalid tag: %s", t)}) }
        }
    }
    p, err := h.svc.Update(c.Request().Context(), id, in)
    if err != nil { return c.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()}) }
    return c.JSON(http.StatusOK, map[string]any{"status": "success", "data": p})
}

// DELETE /api/v1/admin/products/:id
func (h *adminProductHandler) Delete(c echo.Context) error {
    id := c.Param("id")
    if err := h.svc.Delete(c.Request().Context(), id); err != nil {
        return c.JSON(http.StatusNotFound, map[string]string{"message": err.Error()})
    }
    return c.JSON(http.StatusOK, map[string]any{"status": "success"})
}

// POST /api/v1/admin/products/:id/file
// Upload the downloadable theme zip for a product.
// The file is stored in MinIO as themes/{productId}.zip
func (h *adminProductHandler) UploadFile(c echo.Context) error {
    id := c.Param("id")
    if h.minio == nil {
        return c.JSON(http.StatusServiceUnavailable, map[string]string{"message": "storage not configured"})
    }

    file, err := c.FormFile("file")
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": "file is required"})
    }
    if file.Size > 500*1024*1024 { // 500 MB limit for theme zips
        return c.JSON(http.StatusBadRequest, map[string]string{"message": "file too large (max 500 MB)"})
    }

    src, err := file.Open()
    if err != nil {
        return err
    }
    defer src.Close()

    objectKey := fmt.Sprintf("themes/%s.zip", id)
    resp, err := h.minio.UploadFile(c.Request().Context(), h.bucket, objectKey, src, "application/zip")
    if err != nil {
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": err.Error()})
    }

    return c.JSON(http.StatusOK, map[string]any{
        "status": "success",
        "key":    resp.Key,
        "url":    resp.URL,
    })
}
