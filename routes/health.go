package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func RegisterHealth(se *core.ServeEvent) {
	se.Router.GET("/health", healthHandler)
}

func healthHandler(re *core.RequestEvent) error {
	return re.String(200, "OK")
}