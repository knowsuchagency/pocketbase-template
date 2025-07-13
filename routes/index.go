package routes

import (
	"os"

	"github.com/pocketbase/pocketbase/core"
)

func RegisterIndex(se *core.ServeEvent) {
	se.Router.GET("/", func(re *core.RequestEvent) error {
		// Get the frontend URL from environment variable
		frontendURL := os.Getenv("FRONTEND_URL")
		
		// If FRONTEND_URL is not set, return 404
		if frontendURL == "" {
			return re.String(404, "Not Found")
		}
		
		// Always redirect to frontend URL when it's set
		return re.Redirect(302, frontendURL)
	})
}