package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func Register(se *core.ServeEvent) error {
	// Register health route
	RegisterHealth(se)

	// Register OpenAPI documentation
	RegisterOpenAPIDocs(se)

	// Register static file serving for frontend
	RegisterStatic(se)

	return se.Next()
}
