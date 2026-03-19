package minio

import (
	"context"
	"fmt"
	"io"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"ojs-server/internal/config"
)

type minioWrapper struct {
	client     *minio.Client
	config     config.MinIO
	bucketName string
}

func New(cfg config.MinIO) Wrapper {
	return &minioWrapper{
		config:     cfg,
		bucketName: cfg.BucketName,
	}
}

func (m *minioWrapper) initClient() error {
	if m.client != nil {
		return nil
	}

	client, err := minio.New(m.config.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(m.config.AccessKeyID, m.config.SecretAccessKey, ""),
		Secure: m.config.UseSSL,
		Region: m.config.Region,
	})
	if err != nil {
		return fmt.Errorf("failed to create minio client: %w", err)
	}

	m.client = client
	return nil
}

func (m *minioWrapper) SetBucketPolicy(ctx context.Context, bucketName, policy string) error {
	if err := m.initClient(); err != nil {
		return err
	}
	return m.client.SetBucketPolicy(ctx, bucketName, policy)
}

func (m *minioWrapper) MakeBucket(ctx context.Context, bucketName string) error {
	if err := m.initClient(); err != nil {
		return err
	}

	exists, err := m.client.BucketExists(ctx, bucketName)
	if err != nil {
		return fmt.Errorf("failed to check bucket existence: %w", err)
	}

	if !exists {
		err = m.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{Region: m.config.Region})
		if err != nil {
			return fmt.Errorf("failed to create bucket: %w", err)
		}
	}

	return nil
}

func (m *minioWrapper) BucketExists(ctx context.Context, bucketName string) (bool, error) {
	if err := m.initClient(); err != nil {
		return false, err
	}

	exists, err := m.client.BucketExists(ctx, bucketName)
	if err != nil {
		return false, fmt.Errorf("failed to check bucket existence: %w", err)
	}

	return exists, nil
}

func (m *minioWrapper) RemoveBucket(ctx context.Context, bucketName string) error {
	if err := m.initClient(); err != nil {
		return err
	}

	err := m.client.RemoveBucket(ctx, bucketName)
	if err != nil {
		return fmt.Errorf("failed to remove bucket: %w", err)
	}

	return nil
}

func (m *minioWrapper) ListBuckets(ctx context.Context) ([]string, error) {
	if err := m.initClient(); err != nil {
		return nil, err
	}

	buckets, err := m.client.ListBuckets(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list buckets: %w", err)
	}

	bucketNames := make([]string, len(buckets))
	for i, bucket := range buckets {
		bucketNames[i] = bucket.Name
	}

	return bucketNames, nil
}

func (m *minioWrapper) UploadFile(ctx context.Context, bucketName, objectName string, reader io.Reader, contentType string) (*UploadResponse, error) {
	if err := m.initClient(); err != nil {
		return nil, err
	}

	if contentType == "" {
		contentType = "application/octet-stream"
	}

	uploadInfo, err := m.client.PutObject(ctx, bucketName, objectName, reader, -1, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload file: %w", err)
	}

	url := fmt.Sprintf("http://%s/%s/%s", m.config.Endpoint, bucketName, objectName)

	return &UploadResponse{
		Key:  objectName,
		URL:  url,
		ETag: uploadInfo.ETag,
	}, nil
}

func (m *minioWrapper) DownloadFile(ctx context.Context, bucketName, objectName string) (io.ReadCloser, error) {
	if err := m.initClient(); err != nil {
		return nil, err
	}

	obj, err := m.client.GetObject(ctx, bucketName, objectName, minio.GetObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to download file: %w", err)
	}

	return obj, nil
}

func (m *minioWrapper) GetFile(ctx context.Context, bucketName, objectName string) (*FileObject, error) {
	if err := m.initClient(); err != nil {
		return nil, err
	}

	objInfo, err := m.client.StatObject(ctx, bucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get file info: %w", err)
	}

	url := fmt.Sprintf("http://%s/%s/%s", m.config.Endpoint, bucketName, objectName)

	return &FileObject{
		Key:          objInfo.Key,
		ContentType:  objInfo.ContentType,
		Size:         objInfo.Size,
		LastModified: objInfo.LastModified.Format(time.RFC3339),
		URL:          url,
	}, nil
}

func (m *minioWrapper) RemoveFile(ctx context.Context, bucketName, objectName string) error {
	if err := m.initClient(); err != nil {
		return err
	}

	err := m.client.RemoveObject(ctx, bucketName, objectName, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to remove file: %w", err)
	}

	return nil
}

func (m *minioWrapper) ListFiles(ctx context.Context, bucketName, prefix string) ([]FileObject, error) {
	if err := m.initClient(); err != nil {
		return nil, err
	}

	ch := m.client.ListObjects(ctx, bucketName, minio.ListObjectsOptions{
		Prefix:    prefix,
		Recursive: true,
	})

	var files []FileObject
	for objInfo := range ch {
		if objInfo.Err != nil {
			return nil, fmt.Errorf("failed to list objects: %w", objInfo.Err)
		}

		url := fmt.Sprintf("http://%s/%s/%s", m.config.Endpoint, bucketName, objInfo.Key)

		files = append(files, FileObject{
			Key:          objInfo.Key,
			ContentType:  objInfo.ContentType,
			Size:         objInfo.Size,
			LastModified: objInfo.LastModified.Format(time.RFC3339),
			URL:          url,
		})
	}

	return files, nil
}

func (m *minioWrapper) FileExists(ctx context.Context, bucketName, objectName string) (bool, error) {
	if err := m.initClient(); err != nil {
		return false, err
	}

	_, err := m.client.StatObject(ctx, bucketName, objectName, minio.StatObjectOptions{})
	if err != nil {
		errResp := minio.ToErrorResponse(err)
		if errResp.Code == "NoSuchKey" {
			return false, nil
		}
		return false, fmt.Errorf("failed to check file existence: %w", err)
	}

	return true, nil
}

func (m *minioWrapper) GetPresignedURL(ctx context.Context, bucketName, objectName string, expirySeconds int64) (string, error) {
	if err := m.initClient(); err != nil {
		return "", err
	}

	expiry := time.Duration(expirySeconds) * time.Second
	url, err := m.client.PresignedGetObject(ctx, bucketName, objectName, expiry, nil)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return url.String(), nil
}
