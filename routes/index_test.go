package routes

import (
	"net/http"
	"os"
	"testing"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestIndexRoute(t *testing.T) {
	scenarios := []tests.ApiScenario{
		{
			Name:           "index route without FRONTEND_URL - API client",
			Method:         http.MethodGet,
			URL:            "/",
			Headers: map[string]string{
				"Accept": "application/json",
			},
			ExpectedStatus: 404,
			ExpectedContent: []string{
				"Not Found",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Ensure FRONTEND_URL is not set
				os.Unsetenv("FRONTEND_URL")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
		},
		{
			Name:           "index route without FRONTEND_URL - browser",
			Method:         http.MethodGet,
			URL:            "/",
			Headers: map[string]string{
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			},
			ExpectedStatus: 404,
			ExpectedContent: []string{
				"Not Found",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Ensure FRONTEND_URL is not set
				os.Unsetenv("FRONTEND_URL")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
		},
		{
			Name:           "index route with FRONTEND_URL - API client redirect",
			Method:         http.MethodGet,
			URL:            "/",
			Headers: map[string]string{
				"Accept": "application/json",
			},
			ExpectedStatus: 302,
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Set FRONTEND_URL
				os.Setenv("FRONTEND_URL", "https://example.com")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				// Check redirect location
				location := res.Header.Get("Location")
				if location != "https://example.com" {
					t.Errorf("Expected Location header to be 'https://example.com', got '%s'", location)
				}
				// Clean up
				os.Unsetenv("FRONTEND_URL")
			},
		},
		{
			Name:           "index route with FRONTEND_URL - browser redirect",
			Method:         http.MethodGet,
			URL:            "/",
			Headers: map[string]string{
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			},
			ExpectedStatus: 302,
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Set FRONTEND_URL
				os.Setenv("FRONTEND_URL", "https://example.com")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				// Check redirect location
				location := res.Header.Get("Location")
				if location != "https://example.com" {
					t.Errorf("Expected Location header to be 'https://example.com', got '%s'", location)
				}
				// Clean up
				os.Unsetenv("FRONTEND_URL")
			},
		},
		{
			Name:           "index route with FRONTEND_URL - curl user agent redirect",
			Method:         http.MethodGet,
			URL:            "/",
			Headers: map[string]string{
				"User-Agent": "curl/7.64.1",
			},
			ExpectedStatus: 302,
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Set FRONTEND_URL
				os.Setenv("FRONTEND_URL", "https://example.com")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				// Check redirect location
				location := res.Header.Get("Location")
				if location != "https://example.com" {
					t.Errorf("Expected Location header to be 'https://example.com', got '%s'", location)
				}
				// Clean up
				os.Unsetenv("FRONTEND_URL")
			},
		},
	}

	for _, scenario := range scenarios {
		t.Run(scenario.Name, func(t *testing.T) {
			scenario.Test(t)
		})
	}
}