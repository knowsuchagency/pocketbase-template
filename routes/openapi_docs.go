package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/pocketbase/pocketbase/core"
)

const stoplightHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>PocketBase Project API Documentation</title>
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css" />
    <script defer>
      const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.dataset.theme = darkMode ? "dark" : "light";
      document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
    </script>
    <style>
      @media (prefers-color-scheme: dark) {
        .sl-code-viewer {
          background: #fafafa;
          color: black;
          filter: invert(1);
        }
      }
    </style>
  </head>
  <body>
    <elements-api
      apiDescriptionUrl="/api/openapi.json"
      router="hash"
      layout="sidebar"
    />
  </body>
</html>`

func RegisterOpenAPIDocs(se *core.ServeEvent) {
	// Serve the Stoplight Elements documentation UI
	se.Router.GET("/api/docs", func(re *core.RequestEvent) error {
		re.Response.Header().Set("Content-Type", "text/html; charset=utf-8")
		return re.String(http.StatusOK, stoplightHTML)
	})

	// Serve the OpenAPI JSON spec
	se.Router.GET("/api/openapi.json", func(re *core.RequestEvent) error {
		// Generate spec with dynamic server URL
		spec := GenerateOpenAPISpec()
		
		// Dynamically set the server URL based on the request
		scheme := "http"
		if re.Request.TLS != nil || re.Request.Header.Get("X-Forwarded-Proto") == "https" {
			scheme = "https"
		}
		
		host := re.Request.Host
		if host == "" {
			host = "localhost:8090"
		}
		
		spec.Servers = []*openapi3.Server{
			{
				URL:         fmt.Sprintf("%s://%s", scheme, host),
				Description: "API Server",
			},
		}
		
		// Convert to JSON
		jsonSpec, err := json.MarshalIndent(spec, "", "  ")
		if err != nil {
			return re.JSON(http.StatusInternalServerError, map[string]string{
				"error": fmt.Sprintf("Failed to generate OpenAPI spec: %v", err),
			})
		}

		re.Response.Header().Set("Content-Type", "application/json")
		return re.String(http.StatusOK, string(jsonSpec))
	})
}
