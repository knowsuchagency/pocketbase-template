package routes

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func RegisterStatic(se *core.ServeEvent) {
	publicPath := "frontend/build"

	// Check if frontend build directory exists
	if _, err := os.Stat(publicPath); os.IsNotExist(err) {
		log.Printf("Warning: Frontend build directory not found at %s", publicPath)
		return
	}

	// Use PocketBase's apis.Static() to serve the entire build directory
	// This will handle all static files including assets, favicon.ico, robots.txt, and SPA routing
	// The 'true' parameter enables index.html fallback for SPA routing
	se.Router.GET("/{path...}", apis.Static(os.DirFS(publicPath), true))
	log.Printf("Serving static files from %s", publicPath)
}