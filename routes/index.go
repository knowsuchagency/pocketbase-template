package routes

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
)

func RegisterIndex(se *core.ServeEvent) {
	se.Router.GET("/", func(re *core.RequestEvent) error {
		// Get the frontend URL from environment variable
		frontendURL := os.Getenv("FRONTEND_URL")
		
		// If FRONTEND_URL is not set, return a simple JSON response
		if frontendURL == "" {
			return re.JSON(200, map[string]interface{}{
				"name": "PocketBase API",
				"health": "/health",
				"admin": "/_/",
			})
		}
		
		// Always redirect to frontend URL when it's set
		return re.Redirect(302, frontendURL)
	})
}