package routes

import (
	"github.com/pocketbase/pocketbase/core"
)

func Register(se *core.ServeEvent) error {
	// Configure CORS for external frontend
	RegisterCORS(se)

	// Register health route
	RegisterHealth(se)

	// Note: Frontend is now deployed separately to Cloudflare Workers
	// Static file serving has been removed

	return se.Next()
}