package http

import (
	"context"
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"ojs-server/internal/config"
	"ojs-server/internal/infrastructure/container"
	"ojs-server/internal/pkg/constants"
	helper "ojs-server/internal/pkg/helpers"
	"ojs-server/internal/pkg/log"
	utility "ojs-server/internal/pkg/utils"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func SetupMiddleware(server *echo.Echo, container *container.Container) {
	server.Use(
		middleware.Recover(),
		SetLoggerMiddleware(),
	)
	server.Use(LoggerMiddleware())

	server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PUT, echo.PATCH, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderAuthorization, echo.HeaderAccessControlAllowOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderContentLength, echo.HeaderAcceptEncoding, echo.HeaderXCSRFToken},
		ExposeHeaders:    []string{echo.HeaderContentLength, echo.HeaderAccessControlAllowOrigin, echo.HeaderContentDisposition},
		AllowCredentials: false,
	}))

	server.HTTPErrorHandler = errorHandler
	v := validator.New()
	v.RegisterValidation("ISO8601Date", utility.IsISO8601Date)
	server.Validator = &DataValidator{ValidatorData: v}
}

func SetLoggerMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Skip Logging
			if isLoggingSkip(c) {
				return next(c)
			}

			threadId := c.Request().Header.Get(constants.HEADER_XID)
			if len(threadId) == 0 {
				threadId = uuid.New().String()
			}

			// Create context with thread ID for logging
			ctx := context.WithValue(c.Request().Context(), "threadId", threadId)
			ctx = context.WithValue(ctx, "serviceName", config.GetString("appName"))
			ctx = context.WithValue(ctx, "method", c.Request().Method)
			ctx = context.WithValue(ctx, "uri", c.Request().URL.String())

			request := c.Request()
			ctx = log.SetContextFromEchoRequest(c)
			c.SetRequest(request.WithContext(ctx))

			return next(c)
		}
	}
}

func LoggerMiddleware() echo.MiddlewareFunc {
	return middleware.BodyDump(func(c echo.Context, reqBody, resBody []byte) {
		ctx := c.Request().Context()
		req := c.Request()
		res := c.Response()

		path := req.URL.Path
		method := req.Method
		status := res.Status

		// Skip full logging
		if isLoggingSkip(c) {
			return
		}

		// Request-only logging
		if isLoggingRequestOnly(c) {
			log.Info(ctx, method, "path", path, "req", helper.Sanitize(string(reqBody)), "res", "")
			return
		}

		// Limit body size (biar aman)
		reqStr := helper.Truncate(reqBody, 2048)
		resStr := helper.Truncate(resBody, 2048)

		query := req.URL.RawQuery
		log.Info(
			ctx,
			method,
			"path", path,
			"query", query,
			"status", status,
			"req", helper.Sanitize(reqStr),
			"res", helper.Sanitize(resStr),
		)
	})
}

func isLoggingSkip(c echo.Context) bool {
	requestPath := c.Request().URL.String()
	skipPath := map[string]bool{
		"/": true,
	}

	return skipPath[requestPath]
}

func isLoggingRequestOnly(c echo.Context) bool {
	requestPath := c.Request().URL.String()
	return strings.Contains(requestPath, "/download")
}

func errorHandler(err error, c echo.Context) {
	// Need this, because if default error handler use with echo body dump
	// It will be print response error twice
	if c.Get("error-handled") != nil {
		return
	}

	c.Set("error-handled", true)

	resp := constants.DefaultResponse{
		Status:  constants.STATUS_UNKNOWN_ERROR,
		Message: constants.MESSAGE_UNKNOWN_ERROR,
		Data:    struct{}{},
		Errors:  make([]constants.DefaultResponseError, 0),
	}

	if c.Get("unauthorized") != nil {
		resp.Status = constants.STATUS_UNAUTHORIZED
		resp.Message = constants.MESSAGE_UNAUTHORIZED
	} else if c.Get("forbidden") != nil {
		resp.Status = constants.STATUS_FORBIDDEN
		resp.Message = constants.MESSAGE_FORBIDDEN
	} else if c.Get("invalid-format") != nil || strings.Contains(err.Error(), "Error:Field validation for") || strings.Contains(err.Error(), "violates foreign key constraint") {
		resp.Status = constants.STATUS_INVALID_REQUEST_FORMAT
		resp.Message = constants.MESSAGE_INVALID_REQUEST_FORMAT
		resp.Errors = formatValidationErrors(err, c.Get("req"))
	} else if strings.Contains(err.Error(), "Error 1062") || strings.Contains(err.Error(), "SQLSTATE 23505") {
		resp.Status = constants.STATUS_CONFLICT
		resp.Message = constants.MESSAGE_CONFLICT
	} else if strings.Contains(err.Error(), "Not Found") {
		resp.Status = constants.STATUS_NO_DATA
		resp.Message = constants.MESSAGE_ROUTE_NOT_FOUND
	} else if strings.Contains(err.Error(), ":") && strings.Contains(err.Error(), ";") {
		for _, e := range strings.Split(err.Error(), ";") {
			errData := strings.SplitN(e, ":", 3)
			if len(errData) != 3 {
				continue
			}
			resp.Errors = append(resp.Errors, constants.DefaultResponseError{
				Code:    errData[0],
				Title:   errData[1],
				Message: errData[2],
			})
		}
	} else if strings.Contains(err.Error(), "return http status") {
		resp.Status = constants.STATUS_SERVER_ERROR
		resp.Message = constants.MESSAGE_SERVER_ERROR
	}

	if !isLoggingSkip(c) {
		request := c.Request()

		ctx := log.SetErrorMessageFromEchoContext(c, err.Error())
		c.SetRequest(request.WithContext(ctx))

		log.Error(ctx, err.Error())
	}

	c.JSON(http.StatusOK, resp)
}

// Convert validation errors to DefaultResponseError format
func formatValidationErrors(err error, obj interface{}) []constants.DefaultResponseError {
	var errors []constants.DefaultResponseError
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldError := range validationErrors {
			jsonField := getJSONFieldName(obj, fieldError.StructField())
			errors = append(errors, constants.DefaultResponseError{
				Code:    constants.STATUS_INVALID_REQUEST_FORMAT,
				Title:   fmt.Sprintf("Invalid field: %s", jsonField),
				Message: getValidationMessage(jsonField, fieldError),
			})
		}
	}
	return errors
}

// Get JSON tag name instead of struct field name
func getJSONFieldName(obj interface{}, fieldName string) string {
	if obj == nil {
		return fieldName // Fallback if obj is nil
	}
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}
	if field, found := t.FieldByName(fieldName); found {
		jsonTag := field.Tag.Get("json")
		if jsonTag != "" {
			return jsonTag
		}
	}
	return fieldName // Fallback to field name if no JSON tag found
}

// Generate readable validation messages using JSON field name
func getValidationMessage(jsonField string, fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return fmt.Sprintf("The field '%s' is required", jsonField)
	case "oneof":
		return fmt.Sprintf("The field '%s' must be one of [%s]", jsonField, fe.Param())
	default:
		return fmt.Sprintf("Invalid value for field '%s'", jsonField)
	}
}

type DataValidator struct {
	ValidatorData *validator.Validate
}

func (cv *DataValidator) Validate(i interface{}) error {
	return cv.ValidatorData.Struct(i)
}
