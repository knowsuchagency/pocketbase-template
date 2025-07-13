package routes_test

import (
	"net/http"
	"testing"

	"app/routes"
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
				routes.RegisterHealth(e)
			},
		},
	}

	for _, scenario := range scenarios {
		t.Run(scenario.Name, func(t *testing.T) {
			scenario.Test(t)
		})
	}
}

