package minio

import (
	"context"
	"io"
)

type FileObject struct {
	Key          string
	ContentType  string
	Size         int64
	LastModified string
	URL          string
}

type UploadResponse struct {
	Key  string `json:"key"`
	URL  string `json:"url"`
	ETag string `json:"etag"`
}

type Wrapper interface {
	// Bucket operations
	MakeBucket(ctx context.Context, bucketName string) error
	BucketExists(ctx context.Context, bucketName string) (bool, error)
	RemoveBucket(ctx context.Context, bucketName string) error
	ListBuckets(ctx context.Context) ([]string, error)
	SetBucketPolicy(ctx context.Context, bucketName, policy string) error

	// File operations
	UploadFile(ctx context.Context, bucketName, objectName string, reader io.Reader, contentType string) (*UploadResponse, error)
	DownloadFile(ctx context.Context, bucketName, objectName string) (io.ReadCloser, error)
	GetFile(ctx context.Context, bucketName, objectName string) (*FileObject, error)
	RemoveFile(ctx context.Context, bucketName, objectName string) error
	ListFiles(ctx context.Context, bucketName, prefix string) ([]FileObject, error)
	FileExists(ctx context.Context, bucketName, objectName string) (bool, error)

	// Presigned URL
	GetPresignedURL(ctx context.Context, bucketName, objectName string, expirySeconds int64) (string, error)
}
