package http

import (
	"context"
	"fmt"
	"net/http"

	"github.com/facebookgo/grace/gracehttp"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/color"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	"ojs-server/internal/infrastructure/container"
	"ojs-server/internal/pkg/log"
	"ojs-server/internal/server/handler"
)

func StartH2CServer(container *container.Container) {
    e := echo.New()

    SetupMiddleware(e, container)
    // Allow optional auth context on all routes
    e.Use(handler.AuthOptional())
    // Serve static uploads via /static
    e.Static("/static", "uploads")
    handler.SetupRouter(e, container)

	e.Server.Addr = fmt.Sprintf("%s:%s", container.Config.Apps.Address, container.Config.Apps.HttpPort)

	color.Println(color.Green(fmt.Sprintf("⇨ h2c server started on port: %s\n", container.Config.Apps.HttpPort)))
	log.Info(context.Background(), "h2c server started on port: "+container.Config.Apps.HttpPort)

	// * HTTP/2 Cleartext Server (HTTP2 over HTTP)
	gracehttp.Serve(&http.Server{Addr: e.Server.Addr, Handler: h2c.NewHandler(e, &http2.Server{MaxConcurrentStreams: 500, MaxReadFrameSize: 1048576})})
}
