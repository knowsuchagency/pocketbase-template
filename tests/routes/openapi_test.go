package routes_test

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"testing"

	"app/routes"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestOpenAPIRoutes(t *testing.T) {
	scenarios := []tests.ApiScenario{
		{
			Name:            "OpenAPI JSON endpoint",
			Method:          http.MethodGet,
			URL:             "/api/openapi.json",
			ExpectedStatus:  200,
			ExpectedContent: []string{"openapi", "3.0.3"}, // Minimal check to avoid "empty body" error
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				routes.RegisterOpenAPIDocs(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				contentType := res.Header.Get("Content-Type")
				if contentType != "application/json" {
					t.Fatalf("Expected Content-Type application/json, got %s", contentType)
				}

				// Read response body
				body := []byte{}
				if res.Body != nil {
					defer res.Body.Close()
					body, _ = io.ReadAll(res.Body)
				}

				// Parse response body as JSON
				var spec openapi3.T
				if err := json.Unmarshal(body, &spec); err != nil {
					t.Fatalf("Failed to parse OpenAPI spec: %v\nBody: %s", err, string(body))
				}

				// Verify OpenAPI version
				if spec.OpenAPI != "3.0.3" {
					t.Errorf("Expected OpenAPI version 3.0.3, got %s", spec.OpenAPI)
				}

				// Verify API info
				if spec.Info == nil {
					t.Fatal("OpenAPI spec missing info section")
				}
				if spec.Info.Title == "" {
					t.Error("OpenAPI spec title should not be empty")
				}
				if spec.Info.Version != "1.0.0" {
					t.Errorf("Expected version 1.0.0, got %s", spec.Info.Version)
				}

				// Verify servers are set
				if len(spec.Servers) == 0 {
					t.Fatal("OpenAPI spec missing servers")
				}
				if !strings.Contains(spec.Servers[0].URL, "://") {
					t.Errorf("Server URL should be fully qualified, got %s", spec.Servers[0].URL)
				}

				// Verify paths exist
				if spec.Paths == nil || spec.Paths.Len() == 0 {
					t.Fatal("OpenAPI spec missing paths")
				}

				// Verify health endpoint exists
				healthPath := spec.Paths.Find("/health")
				if healthPath == nil {
					t.Fatal("OpenAPI spec missing /health path")
				}
				if healthPath.Get == nil {
					t.Fatal("OpenAPI spec /health missing GET operation")
				}
			},
		},
		{
			Name:           "OpenAPI documentation UI",
			Method:         http.MethodGet,
			URL:            "/api/docs",
			ExpectedStatus: 200,
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				routes.RegisterOpenAPIDocs(e)
			},
			ExpectedContent: []string{
				"/api/openapi.json", // Should reference the OpenAPI spec endpoint
			},
		},
		{
			Name:   "OpenAPI spec with HTTPS header",
			Method: http.MethodGet,
			URL:    "/api/openapi.json",
			Headers: map[string]string{
				"X-Forwarded-Proto": "https",
			},
			ExpectedStatus:  200,
			ExpectedContent: []string{"openapi", "3.0.3"}, // Minimal check to avoid "empty body" error
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				routes.RegisterOpenAPIDocs(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				// Read response body
				body := []byte{}
				if res.Body != nil {
					defer res.Body.Close()
					body, _ = io.ReadAll(res.Body)
				}

				var spec openapi3.T
				if err := json.Unmarshal(body, &spec); err != nil {
					t.Fatalf("Failed to parse OpenAPI spec: %v", err)
				}

				// Verify server URL uses HTTPS
				if len(spec.Servers) > 0 && !strings.HasPrefix(spec.Servers[0].URL, "https://") {
					t.Errorf("Expected HTTPS server URL when X-Forwarded-Proto is set, got %s", spec.Servers[0].URL)
				}
			},
		},
	}

	for _, scenario := range scenarios {
		t.Run(scenario.Name, func(t *testing.T) {
			scenario.Test(t)
		})
	}
}

func TestGenerateOpenAPISpec(t *testing.T) {
	spec := routes.GenerateOpenAPISpec()

	if spec == nil {
		t.Fatal("GenerateOpenAPISpec returned nil")
	}

	// Test OpenAPI version
	if spec.OpenAPI != "3.0.3" {
		t.Errorf("Expected OpenAPI 3.0.3, got %s", spec.OpenAPI)
	}

	// Test Info section
	if spec.Info == nil {
		t.Fatal("Missing Info section")
	}
	if spec.Info.Title == "" {
		t.Error("OpenAPI spec title should not be empty")
	}

	// Test Paths
	if spec.Paths == nil {
		t.Fatal("Missing Paths section")
	}

	// Test health endpoint
	healthPath := spec.Paths.Find("/health")
	if healthPath == nil {
		t.Fatal("Missing /health endpoint")
	}
	if healthPath.Get == nil {
		t.Fatal("Missing GET operation for /health")
	}
	if healthPath.Get.OperationID != "healthCheck" {
		t.Errorf("Expected operationId 'healthCheck', got %s", healthPath.Get.OperationID)
	}

	// Test response
	responses := healthPath.Get.Responses
	if responses == nil {
		t.Fatal("Missing responses for /health GET")
	}

	resp200 := responses.Status(200)
	if resp200 == nil || resp200.Value == nil {
		t.Fatal("Missing 200 response for /health GET")
	}

	if resp200.Value.Content == nil {
		t.Fatal("Missing content for 200 response")
	}

	textContent, ok := resp200.Value.Content["text/plain"]
	if !ok || textContent == nil {
		t.Fatal("Missing text/plain content type")
	}
}
