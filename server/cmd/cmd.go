package cmd

import (
	"ojs-server/internal/infrastructure/container"
	"ojs-server/internal/server"
)

func Run() {
	server.StartService(container.New())
}
