package routes

import (
	"net/http"
	"testing"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestHealthRoute(t *testing.T) {
	scenarios := []tests.ApiScenario{
		{
			Name:           "health check endpoint",
			Method:         http.MethodGet,
			URL:            "/health",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"OK",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterHealth(e)
			},
		},
	}

	for _, scenario := range scenarios {
		t.Run(scenario.Name, func(t *testing.T) {
			scenario.Test(t)
		})
	}
}

func TestHealthHandler(t *testing.T) {
	scenario := tests.ApiScenario{
		Name:           "direct handler test",
		Method:         http.MethodGet,
		URL:            "/test-health",
		ExpectedStatus: 200,
		ExpectedContent: []string{
			"OK",
		},
		TestAppFactory: func(t testing.TB) *tests.TestApp {
			app, _ := tests.NewTestApp()
			return app
		},
		BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
			e.Router.GET("/test-health", healthHandler)
		},
	}

	scenario.Test(t)
}