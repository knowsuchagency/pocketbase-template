package routes

import (
	"os"
	"strings"

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
		
		// Check if the request is from a browser by looking at the Accept header
		acceptHeader := re.Request.Header.Get("Accept")
		isBrowser := strings.Contains(acceptHeader, "text/html")
		
		// If it's a browser request, redirect to the frontend
		if isBrowser {
			return re.Redirect(302, frontendURL)
		}
		
		// For API clients, return JSON
		return re.JSON(200, map[string]interface{}{
			"name": "PocketBase API",
			"health": "/health",
			"admin": "/_/",
			"frontend": frontendURL,
		})
	})
}