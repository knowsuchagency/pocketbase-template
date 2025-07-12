package routes

import (
	"log"
	"os"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func RegisterCORS(se *core.ServeEvent) {
	// Get allowed origins from environment variable
	allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		// Default to localhost for development
		allowedOrigins = "http://localhost:5173,http://localhost:5174"
	}

	origins := strings.Split(allowedOrigins, ",")
	for i, origin := range origins {
		origins[i] = strings.TrimSpace(origin)
	}

	log.Printf("CORS: Allowed origins: %v", origins)

	// Add global CORS handler
	se.Router.BindFunc(func(re *core.RequestEvent) error {
		origin := re.Request.Header.Get("Origin")
		
		// Check if the origin is allowed
		allowed := false
		for _, allowedOrigin := range origins {
			if allowedOrigin == "*" || origin == allowedOrigin {
				allowed = true
				break
			}
		}

		if allowed && origin != "" {
			re.Response.Header().Set("Access-Control-Allow-Origin", origin)
			re.Response.Header().Set("Access-Control-Allow-Credentials", "true")
			re.Response.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
			re.Response.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
			re.Response.Header().Set("Access-Control-Max-Age", "86400")
		}

		// Handle preflight requests
		if re.Request.Method == "OPTIONS" {
			re.Response.WriteHeader(200)
			return nil
		}

		return re.Next()
	})
}