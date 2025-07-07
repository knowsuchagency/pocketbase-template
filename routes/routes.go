package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func Register(se *core.ServeEvent) error {
	// Register health route
	RegisterHealth(se)

	// Register static file route
	RegisterStatic(se)

	return se.Next()
}