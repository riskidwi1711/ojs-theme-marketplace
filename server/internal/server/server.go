package server

import (
	"ojs-server/internal/infrastructure/container"
	"ojs-server/internal/server/http"
)

func StartService(container *container.Container) {
	http.StartH2CServer(container)
}
