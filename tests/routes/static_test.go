package routes_test

import (
	"net/http"
	"os"
	"path/filepath"
	"testing"

	"app/routes"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestStaticRoute(t *testing.T) {
	// Create a temporary test directory for static files
	tempDir := t.TempDir()
	testPublicPath := filepath.Join(tempDir, "frontend", "build", "client")
	err := os.MkdirAll(testPublicPath, 0755)
	if err != nil {
		t.Fatal(err)
	}

	// Create a test index.html file
	indexContent := `<!DOCTYPE html><html><body>Test Index</body></html>`
	err = os.WriteFile(filepath.Join(testPublicPath, "index.html"), []byte(indexContent), 0644)
	if err != nil {
		t.Fatal(err)
	}

	// Change to temp directory for the test
	originalWd, _ := os.Getwd()
	os.Chdir(tempDir)
	defer os.Chdir(originalWd)

	// Test serving index.html
	scenario := tests.ApiScenario{
		Name:           "serve index.html",
		Method:         http.MethodGet,
		URL:            "/",
		ExpectedStatus: 200,
		ExpectedContent: []string{
			"Test Index",
		},
		TestAppFactory: func(t testing.TB) *tests.TestApp {
			app, _ := tests.NewTestApp()
			return app
		},
		BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
			routes.RegisterStatic(e)
		},
	}

	scenario.Test(t)
}

func TestStaticRouteWithMissingDirectory(t *testing.T) {
	// Change to a directory without frontend/build/client
	tempDir := t.TempDir()
	originalWd, _ := os.Getwd()
	os.Chdir(tempDir)
	defer os.Chdir(originalWd)

	// The route should not be registered when directory is missing
	// So we expect a 404 with the default PocketBase error response
	scenario := tests.ApiScenario{
		Name:           "missing directory",
		Method:         http.MethodGet,
		URL:            "/",
		ExpectedStatus: 404,
		ExpectedContent: []string{
			"The requested resource wasn't found",
		},
		TestAppFactory: func(t testing.TB) *tests.TestApp {
			app, _ := tests.NewTestApp()
			return app
		},
		BeforeTestFunc: func(t testing.TB, app *tests.TestApp, e *core.ServeEvent) {
			routes.RegisterStatic(e)
		},
	}

	scenario.Test(t)
}