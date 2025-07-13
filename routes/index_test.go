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
			Name:           "index route without FRONTEND_URL",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"<!DOCTYPE html>",
				"PocketBase Template",
				"Admin Panel",
				"/_/",
				// Should not contain Frontend Application link
			},
			NotExpectedContent: []string{
				"Frontend Application",
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
			Name:           "index route with valid FRONTEND_URL",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"<!DOCTYPE html>",
				"PocketBase Template",
				"Admin Panel",
				"/_/",
				"Frontend Application",
				"https://example.com",
			},
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
				// Clean up
				os.Unsetenv("FRONTEND_URL")
			},
		},
		{
			Name:           "index route with invalid FRONTEND_URL",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"<!DOCTYPE html>",
				"PocketBase Template",
				"Admin Panel",
				"/_/",
			},
			NotExpectedContent: []string{
				"Frontend Application",
				"://invalid-url",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				// Set invalid FRONTEND_URL
				os.Setenv("FRONTEND_URL", "://invalid-url")
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
			AfterTestFunc: func(t testing.TB, app *tests.TestApp, res *http.Response) {
				// Clean up
				os.Unsetenv("FRONTEND_URL")
			},
		},
		{
			Name:           "index route contains dark mode script",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"prefers-color-scheme: dark",
				"data-theme",
				"matchMedia",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
		},
		{
			Name:           "index route with DaisyUI CDN",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"https://cdn.jsdelivr.net/npm/daisyui",
				"https://cdn.tailwindcss.com",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
		},
		{
			Name:           "index route HTML structure",
			Method:         http.MethodGet,
			URL:            "/",
			ExpectedStatus: 200,
			ExpectedContent: []string{
				"<!DOCTYPE html>",
				"<html lang=\"en\">",
				"viewport",
			},
			TestAppFactory: func(t testing.TB) *tests.TestApp {
				app, _ := tests.NewTestApp()
				return app
			},
			BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
				RegisterIndex(e)
			},
		},
	}

	for _, scenario := range scenarios {
		t.Run(scenario.Name, func(t *testing.T) {
			scenario.Test(t)
		})
	}
}