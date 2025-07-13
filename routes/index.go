package routes

import (
	"fmt"
	"net/url"
	"os"

	"github.com/pocketbase/pocketbase/core"
)

func RegisterIndex(se *core.ServeEvent) {
	se.Router.GET("/", func(re *core.RequestEvent) error {
		// Get the frontend URL from environment variable
		frontendURL := os.Getenv("FRONTEND_URL")
		
		// Validate frontend URL if set
		var validFrontendURL string
		if frontendURL != "" {
			if _, err := url.Parse(frontendURL); err == nil {
				validFrontendURL = frontendURL
			}
		} else {
			re.App.Logger().Warn("FRONTEND_URL environment variable is not set")
		}
		
		// Create HTML page with DaisyUI
		html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PocketBase Template</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script>
        // Apply theme based on system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        
        // Listen for changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        });
    </script>
</head>
<body class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-md mx-auto">
            <h1 class="text-4xl font-bold text-center mb-8">PocketBase Template</h1>
            
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h2 class="card-title">Available Links</h2>
                    
                    <div class="space-y-4">
                        <a href="/_/" class="btn btn-primary btn-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
                            </svg>
                            Admin Panel
                        </a>
                        
                        %s
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="text-sm text-base-content/60">
                        <p>PocketBase API Server</p>
                        <p class="mt-1">Ready to serve your requests</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`, func() string {
			if validFrontendURL != "" {
				return fmt.Sprintf(`<a href="%s" class="btn btn-secondary btn-block">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Frontend Application
                        </a>`, validFrontendURL)
			}
			return ""
		}())
		
		return re.HTML(200, html)
	})
}
