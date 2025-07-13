package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func Register(se *core.ServeEvent) error {
	// Register health route
	RegisterHealth(se)

	// Note: Frontend is now deployed separately to Cloudflare Workers
	// PocketBase handles CORS automatically (allows all origins by default)

	return se.Next()
}