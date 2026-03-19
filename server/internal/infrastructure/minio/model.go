package minio

import (
	"context"
	"fmt"

	"ojs-server/internal/config"
)

type MinIOClient struct {
	Wrapper Wrapper
	Config  config.MinIO
}

func NewMinIOClient(cfg config.MinIO) *MinIOClient {
	wrapper := New(cfg)
	return &MinIOClient{
		Wrapper: wrapper,
		Config:  cfg,
	}
}

func (m *MinIOClient) Initialize(ctx context.Context) error {
	bucket := m.Config.BucketName
	if err := m.Wrapper.MakeBucket(ctx, bucket); err != nil {
		return fmt.Errorf("failed to initialize bucket %s: %w", bucket, err)
	}
	// Bucket stays private — images served via /api/v1/media/* proxy
	return nil
}
